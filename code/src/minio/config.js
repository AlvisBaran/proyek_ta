import { Client } from 'minio'

export const minioClient = new Client({
  endpoint: process.env.NEXT_PUBLIC_MINIO_ENDPOINT ?? 'play.min.io',
  port: process.env.NEXT_PUBLIC_MINIO_PORT ?? 9000,
  useSSL: process.env.NODE_ENV === 'production',
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY
})
