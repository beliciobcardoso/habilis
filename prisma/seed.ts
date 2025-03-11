import { PrismaClient } from '@prisma/client';
import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(10);
const passwordHash = bcrypt.hashSync("12345678", salt);

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Criando usuário admin...');
    let userId = '';

    // Verifica se já existe um usuário admin
    const existingUser = await prisma.user.findFirst({
      where: {
        email: 'email@email.com',
      },
    });

    if (!existingUser) {
      const user = await prisma.user.create({
        data: {
          email: 'email@email.com',
          hashedPassword: passwordHash,
          name: 'Admin',
        },
      });
      userId = user.id;
      console.log('Usuário admin criado com sucesso!');
    }

    // Verifica se já existem pastas
    const existingFolders = await prisma.folder.findMany();

    if (existingFolders.length === 0) {
      console.log('Criando estrutura de pastas...');

      // Criar pastas root
      const root = await prisma.folder.create({
        data: {
          key: '0',
          name: 'ROOT',
          path: '/',
          userId: userId,
          parentKey: null,
        },
      });

      await prisma.file.create({
        data: {
          userId: userId,
          fileData: `{${root.key}: []}`,
          folderKey: root.key,
          createdAt: new Date(),
        },
      })
      console.log('Estrutura de pastas criada com sucesso!');
    } else {
      console.log('Pastas já existem, pulando criação.');
    }
  } catch (error) {
    console.error('Erro ao executar seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });