import { Op } from 'sequelize'
import { responseString } from '@/backend/helpers/serverResponseString'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'

import User from '@/backend/models/user'
import ContentRequest from '@/backend/models/contentrequest'
import ContentRequestPayment from '@/backend/models/contentrequestpayment'

import '@/backend/models/association'

export async function GET(request, response) {
  const searchParams = request.nextUrl.searchParams
  const keyword = searchParams.get('keyword') ?? null
  let res = {}

  // * Cek user ada
  const { user, error } = await getUserFromServerSession(request, response)
  if (!!error) {
    res = { message: error.message }
    return Response.json(res, { status: error.code })
  }

  // * Cek user adalah creator
  if (user.role !== 'creator') {
    res = { message: responseString.USER.NOT_CREATOR }
    return Response.json(res, { status: 403 })
  }

  let where = { '$ContentRequest.creatorRef$': user.id }

  if (!!keyword)
    where = {
      ...where,
      [Op.or]: [
        { '$User.displayName$': { [Op.like]: `%${keyword}%` } },
        { '$User.cUsername$': { [Op.like]: `%${keyword}%` } }
      ]
    }

  const results = await ContentRequestPayment.findAll({
    where,
    include: [
      { model: ContentRequest, attributes: ['id', 'creatorRef', 'status', 'requestNote'] },
      { model: User, attributes: ['id', 'cUsername', 'displayName', 'role', 'email'] }
    ],
    order: [['createdAt', 'DESC']]
  })

  return Response.json(results, { status: 200 })
}
