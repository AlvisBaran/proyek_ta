import { Op } from 'sequelize'
import { responseString } from '@/backend/helpers/serverResponseString'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'

import Membership from '@/backend/models/membership'
import UserMembershipPurchase from '@/backend/models/usermembershippurchase'
import UsersFollows from '@/backend/models/usersfollows'

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

  // * Ambil Jumlah Follower
  const followers = await UsersFollows.findAll({ where: { followedRef: user.id } })
  const followersCount = followers?.length ?? 0
  // const followerUserIds = followers.map(item => item.followerRef)

  // * Ambil Jumlah User yang active membership
  const membershipIds = (await Membership.findAll({ where: { userRef: user.id }, attributes: ['id'] })).map(
    item => item.id
  )
  const activeMembershipCount =
    (await UserMembershipPurchase.count({
      where: {
        membershipRef: membershipIds,
        expiredAt: { [Op.gt]: new Date() }
      }
    })) ?? 0

  return Response.json({ followersCount, activeMembershipCount }, { status: 200 })
}
