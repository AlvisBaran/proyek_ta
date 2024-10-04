import Joi from 'joi'
import { responseString } from '@/backend/helpers/serverResponseString'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'
import { mainBucketName, minioClient } from '@/minio/config'

import Content from '@/backend/models/content'
import ContentGallery from '@/backend/models/contentgallery'

// ** Creator > Content > Gallery > Delete
export async function DELETE(request, response) {
  const { params } = response
  const { id: contentId, galleryId } = params
  let req = {}
  try {
    req = await request.json()
  } catch (e) {}
  let res = {}

  // ** Cek user ada
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

  const joiValidate = Joi.object({
    contentId: Joi.number().required()
  }).validate({ contentId }, { abortEarly: false })

  if (!joiValidate.error) {
    // * Cek content ada dan milik user yang sedang merequest
    let currContent = await Content.findOne({
      where: {
        id: contentId,
        creatorRef: user.id
      },
      attributes: ['id', 'creatorRef', 'title', 'createdAt', 'status']
    })
    if (!currContent) {
      res = { message: responseString.GLOBAL.NOT_FOUND }
      return Response.json(res, { status: 404 })
    }

    // * Cek gallery ada dan milik content
    let currGallery = await ContentGallery.findOne({
      where: {
        id: galleryId,
        contentRef: currContent.id
      },
      attributes: ['id', 'contentRef', 'type', 'minio_object_name', 'createdAt']
    })
    if (!currGallery) {
      res = { message: responseString.GLOBAL.NOT_FOUND }
      return Response.json(res, { status: 404 })
    }

    // * Hapus dari minio
    return minioClient
      .removeObject(mainBucketName, currGallery.minio_object_name)
      .then(async () => {
        // * Hapus dari database
        return await currGallery
          .destroy()
          .then(() => {
            res = { message: responseString.GLOBAL.SUCCESS }
            return Response.json(res, { status: 200 })
          })
          .catch(() => {
            res = { message: responseString.GLOBAL.FAILED }
            return Response.json(res, { status: 200 })
          })
      })
      .catch(error => {
        res = { message: 'minio error on deleteing object', error }
        return Response.json(res, { status: 500 })
      })
  } else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details }
    return Response.json(res, { status: 400 })
  }
}
