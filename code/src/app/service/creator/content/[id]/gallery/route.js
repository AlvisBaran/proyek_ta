import Joi from 'joi'
import { v4 as UUD4 } from 'uuid'
import { responseString } from '@/backend/helpers/serverResponseString'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'
import { mainBucketName, minioClient } from '@/minio/config'
import { buildSystemLog } from '@/utils/logHelper'

import Content from '@/backend/models/content'
import ContentGallery from '@/backend/models/contentgallery'

import '@/backend/models/association'

// ** Creator > Content > Gallery > Read All
export async function GET(request, response) {
  const { params } = response
  const { id: contentId } = params
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
    // * Skalian get all gallery
    let currContent = await Content.findOne({
      where: {
        id: contentId,
        creatorRef: user.id
      },
      attributes: ['id', 'creatorRef', 'title', 'createdAt', 'status'],
      include: { model: ContentGallery, as: 'Gallery' }
    })
    if (!currContent) {
      res = { message: responseString.GLOBAL.NOT_FOUND }
      return Response.json(res, { status: 404 })
    }

    const galleries = []
    for (let i = 0; i < currContent.Gallery.length; i++) {
      const currGallery = currContent.Gallery[i]
      // ** Mengambil setiap url dari object yang bersangkutan menggunakan object_name
      await minioClient
        .presignedGetObject(mainBucketName, currGallery.minio_object_name)
        .then(url => {
          galleries.push({
            ...currGallery.dataValues,
            url
          })
        })
        .catch(error => {
          console.error('minio ERROR: presignedGetObject', error)
        })
    }

    return Response.json(galleries, { status: 200 })
  } else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details }
    return Response.json(res, { status: 400 })
  }
}

// ** Creator > Content > Gallery > Create
export async function POST(request, response) {
  const { params } = response
  const { id: contentId } = params
  let req = {}
  try {
    const formData = await request.formData()
    req.name = formData.get('name')
    req.type = formData.get('type')
    req.file = formData.get('file')
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
    contentId: Joi.number().required(),
    name: Joi.string().optional(),
    type: Joi.valid('image', 'video'),
    file: Joi.any().required()
  }).validate({ ...req, contentId }, { abortEarly: false })

  if (!joiValidate.error) {
    // * Cek content ada dan milik user yang sedang merequest
    let currContent = await Content.findOne({
      where: {
        id: contentId,
        creatorRef: user.id
      }
    })
    if (!currContent) {
      res = { message: responseString.GLOBAL.NOT_FOUND }
      return Response.json(res, { status: 404 })
    }

    try {
      // * Ambil cUsername atau email atau id untuk bucket prefix
      const prefix = user.cUsername ?? user.email ?? user.id
      if (!prefix) throw new Error(buildSystemLog('Error something wrong with prefix'))
      // * Generate UUID untuk gambarnya
      const newGalleryObjectId = UUD4()
      // ** Ambil extensionnya dari nama
      const extension = String(req.file.name).split('.').pop() ?? 'png'
      // * Build min.io object name nya
      const newMinioObjectName = `${prefix}/content-gallery/${newGalleryObjectId}-${new Date().getTime()}.${extension}`
      // * Mencoba masukkan ke minio
      const bytes = await req.file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      return minioClient
        .putObject(mainBucketName, newMinioObjectName, buffer)
        .then(async objInfo => {
          console.log(`uploading min.io success [${newMinioObjectName}]`, objInfo)
          // * Build data gallery yang akan diinsert ke database
          let newGallery = ContentGallery.build({
            contentRef: currContent.id,
            name: req.name,
            type: req.type,
            minio_object_name: newMinioObjectName
          })
          // * Insert data gallery ke database
          return await newGallery
            .save()
            .then(async resp => {
              await newGallery.reload()
              res = {
                message: responseString.GLOBAL.SUCCESS,
                created: {
                  ...newGallery.dataValues
                }
              }
              return Response.json(res, { status: 200 })
            })
            .catch(error => {
              console.error('error sequelize saving process', error)
              throw new Error(responseString.GLOBAL.ADD_FAILED)
            })
        })
        .catch(error => {
          console.error('error min.io uploading process', error)
          throw new Error(buildSystemLog('Error something wrong with min.io uploading process'))
        })
    } catch (e) {
      res = { message: e }
      return Response.json(res, { status: 400 })
    }
  } else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details }
    return Response.json(res, { status: 400 })
  }
}
