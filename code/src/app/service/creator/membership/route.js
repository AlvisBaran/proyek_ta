import Joi from 'joi'
import { v4 as UUD4 } from 'uuid'
import { Op } from 'sequelize'
import { responseString } from '@/backend/helpers/serverResponseString'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'
import { mainBucketName, minioClient } from '@/minio/config'
import { buildSystemLog } from '@/utils/logHelper'

import Membership from '@/backend/models/membership'

const FILTERS = {
  order: ['create-date', 'name'],
  orderType: ['DESC', 'ASC']
}

// ** Creator > Membership > Read All
export async function GET(request, response) {
  const searchParams = request.nextUrl.searchParams
  const keyword = searchParams.get('keyword') ?? null
  let order = searchParams.get('order') ?? FILTERS.order[0]
  order = (order + '').toLowerCase()
  let orderType = searchParams.get('orderType') ?? FILTERS.orderType[0]
  orderType = (orderType + '').toUpperCase()
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
    order: Joi.valid(...FILTERS.order).required(),
    orderType: Joi.valid(...FILTERS.orderType).required()
  }).validate(
    {
      order,
      orderType
    },
    { abortEarly: false }
  )

  if (!joiValidate.error) {
    // * This is a function that instantly called and gets the result
    const orderFilter = (function () {
      if (order === 'create-date') return 'createdAt'
      else if (order === 'name') return 'name'
      else return 'createdAt'
    })()

    let whereAttributes = { userRef: user.id }
    if (!!keyword) {
      whereAttributes = {
        ...whereAttributes,
        [Op.or]: [
          { name: { [Op.iLike]: `%${keyword}%` } },
          { slug: { [Op.iLike]: `%${keyword}%` } },
          { description: { [Op.iLike]: `%${keyword}%` } }
        ]
      }
    }

    let memberships = []

    return await Membership.findAll({
      where: { ...whereAttributes },
      order: [[orderFilter, orderType]]
    })
      .then(async (res = []) => {
        for (let i = 0; i < res.length; i++) {
          const tempData = res[i]
          let bannerUrl = null
          if (!!tempData.banner) {
            await minioClient
              .presignedGetObject(mainBucketName, tempData.banner)
              .then(url => {
                bannerUrl = url
              })
              .catch(error => {
                console.error('minio ERROR: presignedGetObject', error)
              })
          }

          memberships.push({
            ...tempData?.dataValues,
            bannerUrl
          })
        }

        return Response.json(memberships, { status: 200 })
      })
      .catch(err => {
        return Response.json({ message: responseString.SERVER.SERVER_ERROR, error: err }, { status: 500 })
      })
  } else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details }
    return Response.json(res, { status: 400 })
  }
}

// ** Creator > Membership > Create
export async function POST(request, response) {
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
    name: Joi.string().required(),
    slug: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    interval: Joi.number().min(1).required()
  }).validate(req, { abortEarly: false })

  if (!joiValidate.error) {
    const { banner, name, slug, description, price, interval } = req

    // * Cek slug sudah digunakan oleh creator ini
    const existing = await Membership.findOne({ where: { userRef: user.id, slug } })
    if (!!existing) {
      res = { message: `Slug "${slug}" telah digunakan!` }
      return Response.json(res, { status: 400 })
    }

    // * Ambil cUsername atau email atau id untuk bucket prefix
    const prefix = user.cUsername ?? user.email ?? user.id
    if (!prefix) throw new Error(buildSystemLog('Error something wrong with prefix'))
    let bannerMinioObject = null
    if (!!banner) {
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
          bannerMinioObject = newMinioObjectName
        })
        .catch(error => {
          console.error('error min.io uploading process', error)
          throw new Error(buildSystemLog('Error something wrong with min.io uploading process'))
        })
    }

    let newMembership = Membership.build({
      userRef: user.id,
      name,
      slug,
      description,
      price,
      interval,
      banner: bannerMinioObject
    })

    // * Daftarkan Membership ke database
    return await newMembership
      .save()
      .then(async resp => {
        await newMembership.reload()
        res = {
          message: responseString.GLOBAL.SUCCESS,
          created: {
            ...newMembership.dataValues
          }
        }
        return Response.json(res, { status: 200 })
      })
      .catch(error => {
        res = { error: { message: responseString.GLOBAL.ADD_FAILED }, details: error }
        // throw new Error(res)
        return Response.json(res, { status: 400 })
      })
  } else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details }
    return Response.json(res, { status: 400 })
  }
}
