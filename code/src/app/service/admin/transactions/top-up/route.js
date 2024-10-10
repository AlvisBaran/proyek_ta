import { Op } from 'sequelize'
import { responseString } from '@/backend/helpers/serverResponseString'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'

import User from '@/backend/models/user'
import TransTopup from '@/backend/models/transtopup'

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

  // * Cek user adalah admin
  if (user.role !== 'admin') {
    res = { message: responseString.USER.NOT_ADMIN }
    return Response.json(res, { status: 403 })
  }

  let where = {}

  if (!!keyword)
    where = {
      ...where,
      [Op.or]: [
        { '$User.displayName$': { [Op.iLike]: `%${keyword}%` } },
        { '$User.cUsername$': { [Op.iLike]: `%${keyword}%` } }
      ]
    }

  const results = await TransTopup.findAll({
    where,
    include: [{ model: User, attributes: ['id', 'cUsername', 'displayName', 'role', 'email'] }],
    order: [['createdAt', 'DESC']],
    paranoid: false
  })

  return Response.json(results, { status: 200 })
}
