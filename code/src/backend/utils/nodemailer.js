import { createTransport } from 'nodemailer'

export const nodemailerTransport = createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  // secure: process.env.NODE_ENV !== 'development',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD
  }
})
