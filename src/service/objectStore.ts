import { S3Client } from '@aws-sdk/client-s3'

export const minioClient = new S3Client({
    region: process.env.STORAGE_REGION,
    endpoint: process.env.STORAGE_ENDPOINT,
    logger: console,
    apiVersion: '2006-03-01',  
    credentials: {
        accessKeyId: process.env.STORAGE_ACCESS_KEY_ID,
        secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY
    },
    forcePathStyle: true, // Required for MinIO
    tls: true, // Disable SSL for local development
    // For production with proper certificates, remove the line above and use:
    // tls: true,
})