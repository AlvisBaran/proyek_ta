import Joi from 'joi'
import { Op } from 'sequelize'
import { v4 as UUD4 } from 'uuid'
import { responseString } from '@/backend/helpers/serverResponseString'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'
import { mainBucketName, minioClient } from '@/minio/config'

import sqlz from '@/backend/configs/db'
import Membership from '@/backend/models/membership'
import { buildSystemLog } from '@/utils/logHelper'

// ** Creator > Membership > Read One
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

  const joiValidate = Joi.object({
    id: Joi.number().required()
  }).validate({ id }, { abortEarly: false })

  if (!joiValidate.error) {
    // * Cek Membership ada dan milik user yang sedang merequest
    let currContent = await Membership.findOne({
      where: {
        id,
        userRef: user.id
      }
    })
    if (!currContent) {
      res = { message: responseString.GLOBAL.NOT_FOUND }
      return Response.json(res, { status: 404 })
    }

    // ** Get image url
    let bannerUrl = null
    if (!!currContent.banner) {
      await minioClient
        .presignedGetObject(mainBucketName, currContent.banner)
        .then(url => {
          bannerUrl = url
        })
        .catch(error => {
          console.error('minio ERROR: presignedGetObject', error)
        })
    }

    return Response.json(
      {
        ...currContent.dataValues,
        bannerUrl
      },
      { status: 200 }
    )
  } else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details }
    return Response.json(res, { status: 400 })
  }
}

// ** Creator > Membership > Update
export async function PUT(request, response) {
  const { id } = response.params
  let req = {}
  try {
    const formData = await request.formData()
    req.banner = formData.get('banner')
    req.name = formData.get('name')
    req.slug = formData.get('slug')
    req.description = formData.get('description')
    req.price = formData.get('price')
    req.interval = formData.get('interval')
  } catch (e) {}
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

  const joiValidate = Joi.object({
    banner: Joi.object().allow(null),
    name: Joi.string().allow(null).optional(),
    slug: Joi.string().allow(null).optional(),
    description: Joi.string().allow(null).optional(),
    price: Joi.number().allow(null).optional(),
    interval: Joi.number().allow(null).optional()
  }).validate(req, { abortEarly: false })

  if (!joiValidate.error) {
    const { banner, name, slug, description, price, interval } = req

    // * Cek Membership ada dan milik user yang sedang merequest
    let currMembership = await Membership.findOne({
      where: {
        id,
        userRef: user.id
      }
    })
    if (!currMembership) {
      res = { message: responseString.GLOBAL.NOT_FOUND }
      return Response.json(res, { status: 404 })
    }

    // * Cek slug sudah digunakan oleh creator ini
    const existing = await Membership.findOne({ where: { id: { [Op.not]: id }, userRef: user.id, slug } })
    if (!!existing) {
      res = { message: `Slug "${slug}" telah digunakan!` }
      return Response.json(res, { status: 400 })
    }

    let oldDataValues = { ...currMembership.dataValues }
    let changingAttributes = []

    if (name !== undefined) {
      currMembership.name = name
      changingAttributes.push('name')
    }
    if (slug !== undefined) {
      currMembership.slug = slug
      changingAttributes.push('slug')
    }
    if (description !== undefined) {
      currMembership.description = description
      changingAttributes.push('description')
    }
    if (price !== undefined) {
      currMembership.price = price
      changingAttributes.push('price')
    }
    if (!!banner) {
      // * Ambil cUsername atau email atau id untuk bucket prefix
      const prefix = user.cUsername ?? user.email ?? user.id
      if (!prefix) throw new Error(buildSystemLog('Error something wrong with prefix'))
      // * Generate UUID untuk gambarnya
      const newGalleryObjectId = UUD4()
      // ** Ambil extensionnya dari nama
      const extension = String(banner.name).split('.').pop() ?? 'png'
      // * Build min.io object name nya
      const newMinioObjectName = `${prefix}/membership-banner/${newGalleryObjectId}-${new Date().getTime()}.${extension}`
      // * Mencoba masukkan ke minio
      const bytes = await banner.arrayBuffer()
      const buffer = Buffer.from(bytes)
      await minioClient
        .putObject(mainBucketName, newMinioObjectName, buffer)
        .then(async objInfo => {
          console.log(`uploading min.io success [${newMinioObjectName}]`, objInfo)
          const oldBannerObjectName = currMembership.banner
          currMembership.banner = newMinioObjectName
          if (!!oldBannerObjectName) {
            await minioClient.removeObject(mainBucketName, oldBannerObjectName)
          }
          changingAttributes.push('banner')
        })
        .catch(error => {
          console.error('error min.io uploading process', error)
          throw new Error(buildSystemLog('Error something wrong with min.io uploading process'))
        })
    }

    if (changingAttributes.length <= 0) {
      res = { message: responseString.VALIDATION.NOTHING_CHANGE_ON_UPDATE }
      return Response.json(res, { status: 400 })
    }

    return await currMembership
      .save({ fields: [...changingAttributes] })
      .then(async resp => {
        await currMembership.reload()
        res = {
          message: responseString.GLOBAL.SUCCESS,
          newValues: {
            ...currMembership.dataValues
          },
          previousValues: {
            ...oldDataValues
          }
        }
        return Response.json(res, { status: 200 })
      })
      .catch(error => {
        res = { error: { message: responseString.GLOBAL.UPDATE_FAILED }, details: error }
        // throw new Error(res)
        return Response.json(res, { status: 400 })
      })
  } else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details }
    return Response.json(res, { status: 400 })
  }
}

// ** Creator > Membership > Delete
export async function DELETE(request, response) {
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

  // * Cek Membership ada dan milik user yang sedang merequest
  let currContent = await Membership.findOne({
    where: {
      id,
      userRef: user.id
    }
  })
  if (!currContent) {
    res = { message: responseString.GLOBAL.NOT_FOUND }
    return Response.json(res, { status: 404 })
  }

  const t = await sqlz.transaction()
  try {
    const bannerMinioObject = currContent.banner
    currContent.slug = `${currContent.slug}-deleted-at-${new Date().getTime()}`
    await currContent.save({ transaction: t })

    await currContent.destroy({ transaction: t })

    if (!!bannerMinioObject) {
      await minioClient.removeObject(mainBucketName, bannerMinioObject)
    }

    await t.commit()

    res = { message: responseString.GLOBAL.SUCCESS }
    return Response.json(res, { status: 200 })
  } catch (error) {
    t.rollback()
    res = { error: { message: responseString.GLOBAL.DELETE_FAILED }, details: error }
    return Response.json(res, { status: 400 })
  }
}
