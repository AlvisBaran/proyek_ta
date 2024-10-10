import { Op } from 'sequelize'
import { responseString } from '@/backend/helpers/serverResponseString'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'

import User from '@/backend/models/user'
import Membership from '@/backend/models/membership'
import UserMembershipPurchase from '@/backend/models/usermembershippurchase'

import '@/backend/models/association'

export async function GET(request, response) {
  const searchParams = request.nextUrl.searchParams
  const keyword = searchParams.get('keyword') ?? null
  const membershipId = searchParams.get('membershipId') ?? null
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

  let where = { '$Membership.userRef$': user.id }

  if (!!keyword)
    where = {
      ...where,
      [Op.or]: [
        { '$Membership.name$': { [Op.iLike]: `%${keyword}%` } },
        { '$Membership.slug$': { [Op.iLike]: `%${keyword}%` } },
        { '$User.displayName$': { [Op.iLike]: `%${keyword}%` } },
        { '$User.cUsername$': { [Op.iLike]: `%${keyword}%` } }
      ]
    }
  if (!!membershipId) where = { ...where, membershipRef: membershipId }

  const results = await UserMembershipPurchase.findAll({
    where,
    include: [
      { model: Membership, attributes: ['id', 'name', 'slug'] },
      { model: User, attributes: ['id', 'cUsername', 'displayName', 'role', 'email'] }
    ],
    order: [['createdAt', 'DESC']]
  })

  return Response.json(results, { status: 200 })
}
