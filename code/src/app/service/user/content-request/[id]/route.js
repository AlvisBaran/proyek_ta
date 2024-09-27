import { mainBucketName, minioClient } from '@/minio/config'
import { responseString } from '@/backend/helpers/serverResponseString'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'

import User from '@/backend/models/user'
import ContentRequest from '@/backend/models/contentrequest'
import Content from '@/backend/models/content'
import ContentRequestMember from '@/backend/models/contentrequestmember'
import ContentRequestPayment from '@/backend/models/contentrequestpayment'

import '@/backend/models/association'

// ** User > Content Request > Read One
export async function GET(request, response) {
  const { id } = response.params
  let res = {}

  // * Cek user ada
  const { user, error } = await getUserFromServerSession(request, response)
  if (!!error) {
    res = { message: error.message }
    return Response.json(res, { status: error.code })
  }

  const result = await ContentRequest.findOne({
    where: { id },
    include: [
      {
        model: User,
        as: 'ContentCreator',
        attributes: ['id', 'cUsername', 'displayName', 'profilePicture']
      },
      {
        model: User,
        as: 'ContentRequestor',
        attributes: ['id', 'cUsername', 'displayName', 'profilePicture']
      },
      {
        model: Content
      },
      {
        model: ContentRequestMember,
        attributes: ['id', 'userRef']
        // include: { model: User, attributes: ['id', 'cUsername', 'displayName', 'profilePicture'] }
      },
      {
        model: ContentRequestPayment,
        attributes: ['id', 'userRef']
      }
    ]
  })

  // * Get Image URL
  let creatorProfilePictureUrl = null
  if (!!result.ContentCreator && !!result.ContentCreator.profilePicture) {
    await minioClient
      .presignedGetObject(mainBucketName, result.ContentCreator.profilePicture)
      .then(url => {
        creatorProfilePictureUrl = url
      })
      .catch(error => {
        console.error('minio ERROR: presignedGetObject', error)
      })
  }
  let requestorProfilePictureUrl = null
  if (!!result.ContentRequestor && !!result.ContentRequestor.profilePicture) {
    await minioClient
      .presignedGetObject(mainBucketName, result.ContentRequestor.profilePicture)
      .then(url => {
        requestorProfilePictureUrl = url
      })
      .catch(error => {
        console.error('minio ERROR: presignedGetObject', error)
      })
  }

  if (!!result) {
    const userRefs = result.ContentRequestMembers?.map(item => item.userRef) ?? []
    if (result.applicantRef === user.id || userRefs.includes(user.id))
      return Response.json(
        {
          ...result.dataValues,
          ContentCreator: {
            ...result.ContentCreator.dataValues,
            profilePictureUrl: creatorProfilePictureUrl
          },
          ContentRequestor: {
            ...result.ContentRequestor.dataValues,
            profilePictureUrl: requestorProfilePictureUrl
          }
        },
        { status: 200 }
      )
  }

  res = { message: responseString.CONTENT_REQUEST.NOT_FOUND }
  return Response.json(res, { status: 404 })
}

// ** User > Content Request > Set Confirmation
export async function PUT(request, response) {
  const { id } = response.params
  let res = {}

  // * Cek user ada
  const { user, error } = await getUserFromServerSession(request, response)
  if (!!error) {
    res = { message: error.message }
    return Response.json(res, { status: error.code })
  }

  // * Cek CR ada dan dibuat oleh user tsb dan status sudah dalam waiting requestor confirmation
  const currCR = await ContentRequest.findOne({
    where: { id, applicantRef: user.id }
  })

  if (!!currCR) {
    if (currCR.status === 'waiting-requestor-confirmation') {
      currCR.status = 'waiting-payment'

      return await currCR
        .save()
        .then(async () => {
          await currCR.reload({
            include: [
              {
                model: User,
                as: 'ContentCreator',
                attributes: ['id', 'cUsername', 'displayName']
              },
              {
                model: Content
              }
            ]
          })
          return Response.json(
            {
              ...currCR.dataValues
            },
            { status: 200 }
          )
        })
        .catch(err => {
          res = { message: responseString.GLOBAL.FAILED, err }
          return Response.json(res, { status: 404 })
        })
    } else {
      res = { message: responseString.CONTENT_REQUEST.NOT_WAITING_REQUESTOR_CONFIRMATION }
      return Response.json(res, { status: 400 })
    }
  } else {
    res = { message: responseString.CONTENT_REQUEST.NOT_FOUND }
    return Response.json(res, { status: 404 })
  }
}
