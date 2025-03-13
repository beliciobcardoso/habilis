import { NextRequest, NextResponse } from 'next/server';
import type { FileType } from '@/lib/types';
import { prisma } from '@/lib/db/prisma';

export async function GET(request: NextRequest) {
  try {
    // Simulate delay to mimic real-world API
    await new Promise(resolve => setTimeout(resolve, 300));

    const searchParams = request.nextUrl.searchParams;
    const folderKey = searchParams.get('folderKey');

    if (!folderKey) {
      return NextResponse.json(
        { error: 'Folder ID is required', success: false },
        { status: 400 }
      );
    }

    // Encontra todos os arquivos na pasta especificada
    const fileRecords = await prisma.file.findMany({
      where: {
        folderKey
      }
    });

    console.log('Registros de arquivos encontrados:', fileRecords);
  

    // Extrair os dados do campo fileData de cada registro
    // Se fileData for um array, use diretamente; se for um objeto, converta para array
    const filesData = fileRecords.map(record => {
      // console.log('Tipo de fileData:', record.fileData);
      if (record.fileData) {
        // Se for uma string, tente fazer o parse
        // console.log('Tipo de fileData:', typeof record.fileData);
       
        // Se for um objeto com uma propriedade que corresponde ao folderKey
        if (typeof record.fileData === 'object' && record.fileData && !Array.isArray(record.fileData)) {
          // Conversão segura para satisfazer o TypeScript
          const fileDataObject = record.fileData as Record<string, FileType[]>;
          return fileDataObject[folderKey] || [];
        }
        // Se já for um array
        else if (Array.isArray(record.fileData)) {
          return record.fileData;
        }
        // Se for um objeto que deve ser tratado como array, com verificação de tipo para evitar problemas com o TypeScript
        else if (typeof record.fileData === 'object' && record.fileData !== null) {
          // Primeiro convertemos para unknown para satisfazer o TypeScript
          const unknownData = record.fileData as unknown;
          // Depois para o tipo específico que esperamos
          const objectData = unknownData as Record<string, FileType[]>;
          return Object.values(objectData);
        }
      }
      return [];
    }).flat(); // Achata o array de arrays em um único array

    console.log('Arquivos encontrados:', filesData);

    return NextResponse.json({
      data: filesData,
      success: true,
      totalFiles: filesData.length
    });
  } catch (error) {
    console.error('Error in files API:', error);
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Extrai os dados do formulário
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folderKey = formData.get('folderKey') as string;

    console.log('Arquivo recebido:', file);
    console.log('Chave da pasta:', folderKey);

    // Verifica se o arquivo foi enviado
    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo foi enviado', success: false },
        { status: 400 }
      );
    }

    // Verifica se a pasta foi especificada
    if (!folderKey) {
      return NextResponse.json(
        { error: 'Chave da pasta é necessária', success: false },
        { status: 400 }
      );
    }

    // Verifica se a pasta existe
    const folder = await prisma.folder.findUnique({
      where: { key: folderKey }
    });

    if (!folder) {
      return NextResponse.json(
        { error: 'Pasta não encontrada', success: false },
        { status: 404 }
      );
    }

    // Cria os metadados do arquivo
    const fileType: FileType = {
      id: `${Date.now()}_${file.name.replace(/\s/g, '_')}`,
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: new Date(),
      path: `${folder.path}/${file.name}`,
    };

    // Salva os metadados e o conteúdo do arquivo no banco de dados
    // const fileRecord = await prisma.file.create({
    //   data: {
    //     fileData: {
    //       metadata: fileType,
    //       content: base64Data // Armazena o conteúdo do arquivo em base64
    //     },
    //     folderKey: folder.key,
    //     userId: userId,
    //   }
    // });

    return NextResponse.json({
      success: true,
      message: 'Arquivo enviado com sucesso',
      file: fileType
    });
  } catch (error) {
    console.error('Erro no upload do arquivo:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', success: false },
      { status: 500 }
    );
  }
}