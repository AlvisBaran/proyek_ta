import { responseString } from '@/backend/helpers/serverResponseString'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'

import User from '@/backend/models/user'
import ContentRequest from '@/backend/models/contentrequest'
import Content from '@/backend/models/content'

import '@/backend/models/association'
import { mainBucketName, minioClient } from '@/minio/config'

// ** Creator > Content Request > Read One
export async function GET(request, response) {
  const { id } = response.params
  let res = {}

  // * Cek user ada
  const { user, error } = await getUserFromServerSession(request, response)
  if (!!error) {
    res = { message: error.message }
    return Response.json(res, { status: error.code })
  }

  return await ContentRequest.findOne({
    where: { id, creatorRef: user.id },
    include: [
      {
        model: User,
        as: 'ContentRequestor',
        attributes: ['id', 'cUsername', 'displayName', 'email', 'profilePicture']
      },
      {
        model: Content
      }
    ]
  })
    .then(async resp => {
      let profilePictureUrl = null
      if (!!resp.ContentRequestor && !!resp.ContentRequestor.profilePicture) {
        await minioClient
          .presignedGetObject(mainBucketName, resp.ContentRequestor.profilePicture)
          .then(url => {
            profilePictureUrl = url
          })
          .catch(error => {
            console.error('minio ERROR: presignedGetObject', error)
          })
      }
      return Response.json(
        { ...resp.dataValues, ContentRequestor: { ...resp.ContentRequestor.dataValues, profilePictureUrl } },
        { status: 200 }
      )
    })
    .catch(err => {
      res = { message: responseString.CONTENT_REQUEST.NOT_FOUND, err }
      return Response.json(res, { status: 404 })
    })
}
