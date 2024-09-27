import { responseString } from '@/backend/helpers/serverResponseString'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'
import { mainBucketName, minioClient } from '@/minio/config'

import User from '@/backend/models/user'
import Comment from '@/backend/models/comment'
import Reply from '@/backend/models/reply'

import '@/backend/models/association'

// ** Creator > Content > Comment > Read All
export async function GET(request, response) {
  const { id } = response.params
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

  const results = await Comment.findAll({
    where: { contentRef: id },
    include: [
      { model: User, attributes: ['id', 'cUsername', 'role', 'banStatus', 'displayName', 'email', 'profilePicture'] },
      {
        model: Reply,
        include: {
          model: User,
          attributes: ['id', 'cUsername', 'role', 'banStatus', 'displayName', 'email', 'profilePicture']
        }
      }
    ],
    order: [
      ['createdAt', 'DESC'],
      [Reply, 'createdAt', 'DESC']
    ]
  })

  const fetchedUserProfilePicturesUrl = []
  const comments = []

  for (let i = 0; i < results.length; i++) {
    const tempData = results[i]
    let profilePictureUrl = null
    if (!!tempData.User && !!tempData.User.profilePicture) {
      const existing = fetchedUserProfilePicturesUrl.find(item => item.id === tempData.User.id)
      if (!!existing) profilePictureUrl = existing.profilePictureUrl
      else {
        // * Get image url dari minio
        await minioClient
          .presignedGetObject(mainBucketName, tempData.User.profilePicture)
          .then(url => {
            profilePictureUrl = url
            fetchedUserProfilePicturesUrl.push({ id: tempData.User.id, profilePictureUrl: url })
          })
          .catch(error => {
            console.error('minio ERROR: presignedGetObject', error)
          })
      }
    }

    const replies = []
    for (let j = 0; j < tempData.Replies.length; j++) {
      const tempData2 = tempData.Replies[j]
      let profilePictureUrl2 = null
      if (!!tempData2.User && !!tempData2.User.profilePicture) {
        const existing2 = fetchedUserProfilePicturesUrl.find(item => item.id === tempData2.User.id)
        if (!!existing2) profilePictureUrl = existing2.profilePictureUrl
        else {
          // * Get image url dari minio
          await minioClient
            .presignedGetObject(mainBucketName, tempData2.User.profilePicture)
            .then(url => {
              profilePictureUrl2 = url
              fetchedUserProfilePicturesUrl.push({ id: tempData2.User.id, profilePictureUrl: url })
            })
            .catch(error => {
              console.error('minio ERROR: presignedGetObject', error)
            })
        }
      }

      replies.push({
        ...tempData2.dataValues,
        User: { ...tempData2.User.dataValues, profilePictureUrl: profilePictureUrl2 }
      })
    }

    comments.push({
      ...tempData.dataValues,
      User: { ...tempData.User.dataValues, profilePictureUrl },
      Replies: replies
    })
  }

  return Response.json(comments, { status: 200 })
}
