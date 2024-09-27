import Joi from 'joi'
import { responseString } from '@/backend/helpers/serverResponseString'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'

import User from '@/backend/models/user'
import ContentRequest from '@/backend/models/contentrequest'
import ContentRequestMember from '@/backend/models/contentrequestmember'

import '@/backend/models/association'
import { mainBucketName, minioClient } from '@/minio/config'

// ** User > Content Request > Member > Read All
export async function GET(request, response) {
  const { id } = response.params
  let res = {}

  // * Cek user ada
  const { user, error } = await getUserFromServerSession(request, response)
  if (!!error) {
    res = { message: error.message }
    return Response.json(res, { status: error.code })
  }

  // * Check Content Request Ada
  const currContentRequest = await ContentRequest.findOne({
    where: { id },
    include: {
      model: ContentRequestMember,
      include: {
        model: User,
        attributes: ['id', 'cUsername', 'role', 'banStatus', 'displayName', 'email', 'profilePicture']
      }
    },
    attributes: ['id', 'creatorRef', 'applicantRef', 'contentRef', 'status', 'createdAt', 'updatedAt']
  })

  if (!currContentRequest) {
    res = { message: responseString.GLOBAL.NOT_FOUND }
    return Response.json(res, { status: 404 })
  } else {
    const members = []

    for (let i = 0; i < currContentRequest?.ContentRequestMembers?.length; i++) {
      const tempData = currContentRequest?.ContentRequestMembers[i]
      // * Get Image URL
      let profilePictureUrl = null
      if (!!tempData.User && !!tempData.User.profilePicture) {
        await minioClient
          .presignedGetObject(mainBucketName, tempData.User.profilePicture)
          .then(url => {
            profilePictureUrl = url
          })
          .catch(error => {
            console.error('minio ERROR: presignedGetObject', error)
          })
      }
      members.push({
        ...tempData.dataValues,
        User: {
          ...tempData.User.dataValues,
          profilePictureUrl
        }
      })
    }

    return Response.json(members, { status: 200 })
  }
}

// ** User > Content Request > Member > Add Member
export async function POST(request, response) {
  const { id } = response.params
  let req = {}
  try {
    req = await request.json()
  } catch (e) {}
  let res = {}

  // * Cek user ada
  const { user, error } = await getUserFromServerSession(request, response)
  if (!!error) {
    res = { message: error.message }
    return Response.json(res, { status: error.code })
  }

  const joiValidate = Joi.object({
    userId: Joi.number().required()
  }).validate(req, { abortEarly: false })

  if (!joiValidate.error) {
    // * Cek User as Member ada
    const newUserAsMember = await User.findByPk(req.userId)
    if (!newUserAsMember) {
      res = { message: responseString.USER.NOT_FOUND }
      return Response.json(res, { status: 404 })
    }

    // * Cek Content Request Ada
    const currContentRequest = await ContentRequest.findOne({
      where: { id, applicantRef: user.id },
      attributes: ['id', 'creatorRef', 'applicantRef', 'contentRef', 'status', 'createdAt', 'updatedAt']
    })
    if (!currContentRequest) {
      res = { message: responseString.CONTENT_REQUEST.NOT_FOUND }
      return Response.json(res, { status: 404 })
    }

    // * Cek User sudah member atau belum
    const existingMember = await ContentRequestMember.findOne({
      where: {
        contentRequestRef: Number(id),
        userRef: newUserAsMember.id
      }
    })
    if (!!existingMember) {
      res = { message: 'User ini sudah masuk sebagai anggota!' }
      return Response.json(res, { status: 400 })
    }

    // ** Build Data
    const newMember = ContentRequestMember.build({
      contentRequestRef: Number(id),
      userRef: newUserAsMember.id
    })

    // ** Insert DB
    return await newMember
      .save()
      .then(async () => {
        await newMember.reload()
        return Response.json(
          {
            ...newMember.dataValues
          },
          { status: 200 }
        )
      })
      .catch(err => {
        res = { message: responseString.GLOBAL.FAILED, error: err }
        return Response.json(res, { status: 400 })
      })
  } else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details }
    return Response.json(res, { status: 400 })
  }
}
