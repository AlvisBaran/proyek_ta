import Joi from 'joi'
import { v4 as UUD4 } from 'uuid'
import { responseString } from '@/backend/helpers/serverResponseString'
import Content from '@/backend/models/content'
import User from '@/backend/models/user'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'
import { mainBucketName, minioClient } from '@/minio/config'

import '@/backend/models/association'
import ContentGallery from '@/backend/models/contentgallery'
import { buildSystemLog } from '@/utils/logHelper'

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

  const joiValidate = Joi.object({
    contentId: Joi.number().required()
  }).validate({ contentId }, { abortEarly: false })

  if (!joiValidate.error) {
    let currCreator = await User.findByPk(user.id)

    // * Cek user adalah creator
    if (currCreator.role !== 'creator') {
      res = { message: 'Anda bukan seorang creator!' }
      return Response.json(res, { status: 403 })
    }

    // * Cek content ada dan milik user yang sedang merequest
    // * Skalian get all gallery
    let currContent = await Content.findOne({
      where: {
        id: contentId,
        creatorRef: currCreator.id
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
    req.title = formData.get('title')
    req.alt = formData.get('alt')
    req.image = formData.get('image')
  } catch (e) {}
  let res = {}

  // ** Cek user ada
  const { user, error } = await getUserFromServerSession(request, response)
  if (!!error) {
    res = { message: error.message }
    return Response.json(res, { status: error.code })
  }

  const joiValidate = Joi.object({
    contentId: Joi.number().required(),
    title: Joi.string().optional(),
    alt: Joi.string().optional(),
    image: Joi.any().required()
  }).validate({ ...req, contentId }, { abortEarly: false })

  if (!joiValidate.error) {
    let currCreator = await User.findByPk(user.id)

    // * Cek user adalah creator
    if (currCreator.role !== 'creator') {
      res = { message: 'Anda bukan seorang creator!' }
      return Response.json(res, { status: 403 })
    }

    // * Cek content ada dan milik user yang sedang merequest
    let currContent = await Content.findOne({
      where: {
        id: contentId,
        creatorRef: currCreator.id
      }
    })
    if (!currContent) {
      res = { message: responseString.GLOBAL.NOT_FOUND }
      return Response.json(res, { status: 404 })
    }

    try {
      // * Ambil cUsername atau email atau id untuk bucket prefix
      const prefix = currCreator.cUsername ?? currCreator.email ?? currCreator.id
      if (!prefix) throw new Error(buildSystemLog('Error something wrong with prefix'))
      // * Generate UUID untuk gambarnya
      const newGalleryObjectId = UUD4()
      // ** Ambil extensionnya dari nama
      const extension = String(req.image.name).split('.').pop() ?? 'png'
      // * Build min.io object name nya
      const newMinioObjectName = `${prefix}/${newGalleryObjectId}-${new Date().getTime()}.${extension}`
      // * Mencoba masukkan ke minio
      const bytes = await req.image.arrayBuffer()
      const buffer = Buffer.from(bytes)
      return minioClient
        .putObject(mainBucketName, newMinioObjectName, buffer)
        .then(async objInfo => {
          console.log(`uploading min.io success [${newMinioObjectName}]`, objInfo)
          // * Build data gallery yang akan diinsert ke database
          let newGallery = ContentGallery.build({
            contentRef: currContent.id,
            title: req.title,
            alt: String(req.alt).toLowerCase().replace(' ', '-').trim(),
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
      console.log('error nya disini', e)
      return Response.json(res, { status: 400 })
    }
  } else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details }
    return Response.json(res, { status: 400 })
  }
}
