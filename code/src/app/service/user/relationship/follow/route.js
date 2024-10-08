import { getUserFromServerSession } from '@/backend/utils/sessionHandler'
import { mainBucketName, minioClient } from '@/minio/config'

import User from '@/backend/models/user'
import UsersFollows from '@/backend/models/usersfollows'

import '@/backend/models/association'

export const dynamic = 'force-dynamic'

// ** User > Relationship > List Following
export async function GET(request, response) {
  const searchParams = request.nextUrl.searchParams
  let limit = searchParams.get('limit') ?? null
  let res = {}

  // * Cek user ada
  const { user, error } = await getUserFromServerSession(request, response)
  if (!!error) {
    res = { message: error.message }
    return Response.json(res, { status: error.code })
  }

  let otherAttr = {}
  if (!!limit) otherAttr = { ...otherAttr, limit: Number(limit) }

  const currFoll = await UsersFollows.findAll({
    where: { followerRef: user.id },
    include: {
      model: User,
      foreignKey: 'followedRef',
      attributes: ['id', 'cUsername', 'displayName', 'profilePicture', 'bio']
    },
    ...otherAttr
  })

  const following = []

  for (let i = 0; i < currFoll.length; i++) {
    const datum = currFoll[i]
    let profilePictureUrl = null
    if (!!datum.User && !!datum.User.profilePicture) {
      // ** Mengambil setiap url dari object yang bersangkutan
      await minioClient
        .presignedGetObject(mainBucketName, datum.User.profilePicture)
        .then(url => {
          profilePictureUrl = url
        })
        .catch(error => {
          console.error('minio ERROR: presignedGetObject', error)
        })
    }

    following.push({
      ...datum.dataValues,
      Followed: { ...datum.User.dataValues, profilePictureUrl },
      User: undefined
    })
  }

  return Response.json(following, { status: 200 })
}
