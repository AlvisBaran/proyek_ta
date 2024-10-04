import { headers } from 'next/headers'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'

export async function GET(request, response) {
  const headersList = headers()
  const referer = headersList.get('referer')
  const contentId = response.params.contentId
  let res = {}

  // * Cek user ada
  const { user, error } = await getUserFromServerSession(request, response)
  if (!!error) {
    res = { message: error.message }
    return Response.json(res, { status: error.code })
  }

  const [protocol, path] = referer.split('://')
  const [host] = path.split('/')

  return Response.json(`${protocol}://${host}/contents/${contentId}?sid=${user.id}`, { status: 200 })
}
