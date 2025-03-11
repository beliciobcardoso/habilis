import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function logUserLogin(userId: string, credentialID: string, ipAddress?: string, deviceInfo?: string) {
    const counter = await prisma.authenticator.findMany({
        where: {
            userId: userId
        },
        select: {
            counter: true
        }
    })

    await prisma.authenticator.upsert({
        where: {
            userId: userId,
            credentialID: credentialID
        },
        update: {
            counter: counter.length > 0 ? counter[0].counter + 1 : 1
        },
        create: {
            userId: userId,
            credentialID: credentialID,
            counter: 1,
            ipAddress: ipAddress,
            deviceInfo: deviceInfo,
            loginTime: new Date(),
            providerAccountId: '',
            credentialPublicKey: '',
            credentialDeviceType: '',
            credentialBackedUp: false,
        }
    });
}

// Exportar a função para uso em outros lugares
export { logUserLogin };