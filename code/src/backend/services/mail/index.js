import { nodemailerTransport } from '@/backend/utils/nodemailer'

export async function createMail({
  sender = {
    name: 'Panthreon',
    address: 'taalvisbaran@gmail.com'
  },
  recipients = [],
  subject = 'Panthreon Mail',
  content = '...'
}) {
  return nodemailerTransport.sendMail({
    from: sender,
    to: recipients,
    subject: subject,
    html: content,
    text: content
  })
}
