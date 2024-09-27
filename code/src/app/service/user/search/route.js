import { Op } from 'sequelize'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'

import User from '@/backend/models/user'
import { mainBucketName, minioClient } from '@/minio/config'

// ** User > Search
export async function GET(request, response) {
  const searchParams = request.nextUrl.searchParams
  const keyword = searchParams.get('keyword')
  let res = {}

  // * Cek user ada
  const { user, error } = await getUserFromServerSession(request, response)
  if (!!error) {
    res = { message: error.message }
    return Response.json(res, { status: error.code })
  }

  const results = await User.findAll({
    where: {
      [Op.or]: [{ displayName: { [Op.like]: `%${keyword}%` } }, { cUsername: { [Op.like]: `%${keyword}%` } }],
      banStatus: { [Op.not]: 'banned' },
      role: { [Op.not]: 'admin' },
      id: { [Op.not]: user.id }
    },
    attributes: ['id', 'displayName', 'cUsername', 'profilePicture', 'bio', 'banStatus']
  })
    .then(resp => resp)
    .catch(err => [])

  const users = []
  for (let i = 0; i < results.length; i++) {
    const tempData = results[i]
    let profilePictureUrl = null
    if (!!tempData.profilePicture) {
      await minioClient
        .presignedGetObject(mainBucketName, tempData.profilePicture)
        .then(url => {
          profilePictureUrl = url
        })
        .catch(error => {
          console.error('minio ERROR: presignedGetObject', error)
        })
    }

    users.push({
      ...tempData.dataValues,
      profilePictureUrl
    })
  }

  return Response.json(users, { status: 200 })
}
