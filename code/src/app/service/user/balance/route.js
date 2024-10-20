import { responseString } from '@/backend/helpers/serverResponseString'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'

import User from '@/backend/models/user'

export const dynamic = 'force-dynamic'

// ** User > Balance > Get Self
export async function GET(request, response) {
  let res = {}

  // * Cek user ada
  const { user, error } = await getUserFromServerSession(request, response)
  if (!!error) {
    res = { message: error.message }
    return Response.json(res, { status: error.code })
  }

  const result = await User.findOne({ where: { id: user.id }, attributes: ['saldo'] })

  if (!!result) {
    return Response.json(result.saldo, { status: 200 })
  } else {
    res = { message: responseString.USER.NOT_FOUND }
    return Response.json(res, { status: 404 })
  }
}
