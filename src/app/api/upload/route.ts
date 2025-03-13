import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { FileType } from '@/lib/types';
import { minioClient } from '@/service/objectStore';
import { CreateBucketCommand, HeadBucketCommand, PutObjectCommand } from '@aws-sdk/client-s3';

const BUCKET_NAME = process.env.STORAGE_BUCKET_NAME || 'files-manager';

// Verifica se o bucket existe, caso contrário, cria um novo
export async function ensureBucketExists() {
    try {
        const exists = await minioClient.send(new HeadBucketCommand({ Bucket: BUCKET_NAME }));
        console.log(`Bucket '${BUCKET_NAME}' já existe`);
        if (!exists) {
            await minioClient.send(new CreateBucketCommand({ Bucket: BUCKET_NAME }));
            console.log(`Bucket '${BUCKET_NAME}' criado com sucesso`);
        }
    } catch (error) {
        console.error('Erro ao verificar/criar bucket:', error);
        throw error;
    }
}


export async function POST(request: NextRequest) {
  try {
    // Verifica se o bucket existe
    await ensureBucketExists();

    // Extrai os dados do formulário
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folderKey = formData.get('folderKey') as string;
    const id = formData.get('folderId') as string

    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo foi enviado', success: false },
        { status: 400 }
      );
    }

    if (!folderKey) {
      return NextResponse.json(
        { error: 'Chave da pasta é necessária', success: false },
        { status: 400 }
      );
    }

    // Encontra a pasta no banco de dados
    const folder = await prisma.folder.findUnique({
      where: { key: folderKey }
    });

    if (!folder) {
      return NextResponse.json(
        { error: 'Pasta não encontrada', success: false },
        { status: 404 }
      );
    }


    // Converte o arquivo para um buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log('buffer', buffer);

    // Faz o upload do arquivo para o Minio
    const objectKey = `${folder.path.trim()}/${file.name}`.replace(/\\/g, '/').replace(/\/+/g, '/');

    console.log('objectKey', objectKey);

    // Upload do arquivo para o MinIO usando AWS SDK v3
    await minioClient.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: objectKey,
      Body: buffer,
      ContentType: file.type
    }));

    // Buscar a lista de arquivo da pasta no fileData
    const fileRecords = await prisma.file.findMany({
      where: {
        folderKey
      }
    });

    console.log('folderData', fileRecords);

    const filesData = fileRecords.map((record) => {
      const fileDataObject = record.fileData as Record<string, FileType[]>;
      return fileDataObject[folderKey] || [];
    }).flat();

    console.log('filesData', filesData);

    // numero incremental a partir do tamanha do array
    const fileIndex = filesData.length + 1;
    fileIndex.toString()
    const fileId = folderKey + fileIndex;

    // Atualizar o fileData da pasta
    const response = await prisma.file.update({
      where: { id: parseInt(id) },
      data: {
        fileData: {
          [folderKey]: [...filesData, {
            key: fileId,
            name: file.name,
            path: objectKey,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
          }]
        }
      }
    });

    console.log('response', response);


    return NextResponse.json({
      success: true,
      message: 'Arquivo enviado com sucesso',
      file: {
        key: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
      }
    });
  } catch (error) {
    console.error('Erro no upload do arquivo:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', success: false },
      { status: 500 }
    );
  }
}

// Rota para verificar o status do servidor de armazenamento
export async function GET() {
  try {
    await ensureBucketExists();
    return NextResponse.json({
      success: true,
      message: 'Servidor de armazenamento está operacional',
      bucket: BUCKET_NAME
    });
  } catch (error) {
    console.error('Erro ao verificar o servidor de armazenamento:', error);
    return NextResponse.json(
      { error: 'Servidor de armazenamento indisponível', success: false },
      { status: 500 }
    );
  }
}