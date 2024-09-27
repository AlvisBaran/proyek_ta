import { Op } from 'sequelize'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'
import { mainBucketName, minioClient } from '@/minio/config'

import User from '@/backend/models/user'

import '@/backend/models/association'

// ** User > Messaging > Users > Read All
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

  let where = { id: { [Op.not]: user.id }, role: { [Op.not]: 'admin' }, banStatus: { [Op.not]: 'banned' } }

  if (!!keyword)
    where = {
      ...where,
      [Op.or]: [{ displayName: { [Op.like]: `%${keyword}%` } }, { cUsername: { [Op.like]: `%${keyword}%` } }]
    }

  const users = []

  const results = await User.findAll({
    where,
    attributes: ['id', 'email', 'displayName', 'role', 'cUsername', 'banStatus', 'profilePicture'],
    order: [['displayName', 'ASC']]
  })

  for (let i = 0; i < results.length; i++) {
    const datum = results[i]
    let profilePictureUrl = null
    if (!!datum.profilePicture) {
      await minioClient
        .presignedGetObject(mainBucketName, datum.profilePicture)
        .then(url => {
          profilePictureUrl = url
        })
        .catch(error => {
          console.error('minio ERROR: presignedGetObject', error)
        })
    }

    users.push({
      ...datum.dataValues,
      profilePictureUrl
    })
  }

  return Response.json(users, { status: 200 })
}
