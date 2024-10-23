import { Op } from 'sequelize'
import { responseString } from '@/backend/helpers/serverResponseString'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'

import Membership from '@/backend/models/membership'
import UserMembershipPurchase from '@/backend/models/usermembershippurchase'
import UsersFollows from '@/backend/models/usersfollows'

export const dynamic = 'force-dynamic'

export async function GET(request, response) {
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

  // * Ambil semua membership milik creator
  const membershipIds = (await Membership.findAll({ where: { userRef: user.id }, attributes: ['id'] })).map(
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
    where: { followedRef: user.id, followerRef: { [Op.not]: activeMembershipIds } }
  })

  return Response.json({ followersCount, activeMembershipCount }, { status: 200 })
}
