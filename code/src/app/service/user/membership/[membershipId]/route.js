import { getUserFromServerSession } from '@/backend/utils/sessionHandler'
import { mainBucketName, minioClient } from '@/minio/config'
import { responseString } from '@/backend/helpers/serverResponseString'

import Membership from '@/backend/models/membership'
import User from '@/backend/models/user'

import '@/backend/models/association'

// ** User > Membership > Read One
export async function GET(request, response) {
  let res = {}
  const { membershipId } = response.params

  // * Cek user ada
  const { user, error } = await getUserFromServerSession(request, response)
  if (!!error) {
    res = { message: error.message }
    return Response.json(res, { status: error.code })
  }

  return await Membership.findOne({
    where: { id: Number(membershipId) },
    include: [{ model: User, attributes: ['id', 'cUsername', 'displayName', 'profilePicture'] }]
  })
    .then(async resp => {
      let bannerUrl = null
      if (!!resp.banner) {
        // ** Mengambil setiap url dari object yang bersangkutan menggunakan object_name
        await minioClient
          .presignedGetObject(mainBucketName, resp.banner)
          .then(url => {
            bannerUrl = url
          })
          .catch(error => {
            console.error('minio ERROR: presignedGetObject', error)
          })
      }

      let profilePictureUrl = null
      if (!!resp.User && !!resp.User.profilePicture) {
        // ** Mengambil setiap url dari object yang bersangkutan menggunakan object_name
        await minioClient
          .presignedGetObject(mainBucketName, resp.User.profilePicture)
          .then(url => {
            profilePictureUrl = url
          })
          .catch(error => {
            console.error('minio ERROR: presignedGetObject', error)
          })
      }

      return Response.json(
        {
          ...resp.dataValues,
          bannerUrl,
          User: {
            ...resp.User.dataValues,
            profilePictureUrl
          }
        },
        { status: 200 }
      )
    })
    .catch(error => {
      res = { message: responseString.MEMBERSHIP.NOT_FOUND, error }
      return Response.json(res, { status: 404 })
    })
}
