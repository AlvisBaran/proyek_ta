import { Op } from 'sequelize'
import { responseString } from '@/backend/helpers/serverResponseString'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'

import Membership from '@/backend/models/membership'
import UserMembershipPurchase from '@/backend/models/usermembershippurchase'
import UsersFollows from '@/backend/models/usersfollows'
import User from '@/backend/models/user'

export const dynamic = 'force-dynamic'

export async function GET(request, response) {
  const creatorId = Number(response.params.creatorId)
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

  // * Get current creator
  const currCreator = await User.findOne({ where: { id: creatorId, role: 'creator' }, attributes: ['id', 'role'] })
  if (!currCreator) {
    res = { message: responseString.USER.NOT_FOUND }
    return Response.json(res, { status: 404 })
  }

  // * Ambil semua membership milik creator
  const membershipIds = (await Membership.findAll({ where: { userRef: currCreator.id }, attributes: ['id'] })).map(
    item => item.id
  )
  // * Ambil User yang active membership
  const activeMemberships = await UserMembershipPurchase.findAll({
    where: {
      membershipRef: membershipIds,
      expiredAt: { [Op.gt]: new Date() }
    },
    attributes: ['id', 'userRef']
  })
  const activeMembershipCount = activeMemberships.length
  const activeMembershipIds = activeMemberships.map(item => item.userRef)

  // * Ambil Jumlah Follower
  const followersCount = await UsersFollows.count({
    where: { followedRef: currCreator.id, followerRef: { [Op.not]: activeMembershipIds } }
  })

  return Response.json({ followersCount, activeMembershipCount }, { status: 200 })
}
