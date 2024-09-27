import Joi from 'joi'
import { responseString } from '@/backend/helpers/serverResponseString'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'
import { mainBucketName, minioClient } from '@/minio/config'

import User from '@/backend/models/user'
import Content from '@/backend/models/content'
import UsersFollows from '@/backend/models/usersfollows'

// ** Feeds > Creator > Read One
export async function GET(request, response) {
  const { creatorId } = response.params
  let res = {}

  // * Cek user ada
  const { user, error } = await getUserFromServerSession(request, response)
  if (!!error) {
    res = { message: error.message }
    return Response.json(res, { status: error.code })
  }

  const joiValidate = Joi.object({
    creatorId: Joi.string().required()
  }).validate({ creatorId }, { abortEarly: false })

  if (!joiValidate.error) {
    const currCreator = await User.findOne({
      where: { cUsername: creatorId, role: 'creator' },
      attributes: [
        'id',
        'cUsername',
        'email',
        'role',
        'banStatus',
        'joinDate',
        'displayName',
        'profilePicture',
        'socials',
        'bio',
        'about',
        'banner',
        'themeColor'
      ]
    })
    if (!currCreator) {
      res = { message: responseString.CREATOR.NOT_FOUND }
      return Response.json(res, { status: 404 })
    }

    // * Get Image URL
    let profilePictureUrl = null
    if (!!currCreator.profilePicture) {
      await minioClient
        .presignedGetObject(mainBucketName, currCreator.profilePicture)
        .then(url => {
          profilePictureUrl = url
        })
        .catch(error => {
          console.error('minio ERROR: presignedGetObject', error)
        })
    }
    let bannerUrl = null
    if (!!currCreator.banner) {
      await minioClient
        .presignedGetObject(mainBucketName, currCreator.banner)
        .then(url => {
          bannerUrl = url
        })
        .catch(error => {
          console.error('minio ERROR: presignedGetObject', error)
        })
    }

    // * Get Content Counts
    const contentCounts = await Content.count({ where: { creatorRef: currCreator.id, status: 'published' } })

    // * Get Followed or Not
    const followed = await UsersFollows.findOne({ where: { followerRef: user.id, followedRef: currCreator.id } })

    return Response.json(
      { ...currCreator.dataValues, profilePictureUrl, bannerUrl, contentCounts, followed },
      { status: 200 }
    )
  } else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details }
    return Response.json(res, { status: 400 })
  }
}
