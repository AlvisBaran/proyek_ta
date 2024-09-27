import '@/backend/models/association'

import Joi from 'joi'
import { v4 as UUD4 } from 'uuid'
import { responseString } from '@/backend/helpers/serverResponseString'
import User from '@/backend/models/user'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'
import { mainBucketName, minioClient } from '@/minio/config'
import { buildSystemLog } from '@/utils/logHelper'

// ** User > Profile > Get Self
export async function GET(request, response) {
  let res = {}

  const { user, error } = await getUserFromServerSession(request, response)
  if (!!error) {
    res = { message: error.message }
    return Response.json(res, { status: error.code })
  }

  const result = await User.findOne({ where: { id: user.id } })

  if (!!result) {
    let profilePictureUrl = null
    if (!!result.profilePicture) {
      // ** Mengambil setiap url dari object yang bersangkutan
      await minioClient
        .presignedGetObject(mainBucketName, result.profilePicture)
        .then(url => {
          profilePictureUrl = url
        })
        .catch(error => {
          console.error('minio ERROR: presignedGetObject', error)
        })
    }

    let bannerUrl = null
    if (!!result.banner) {
      // ** Mengambil setiap url dari object yang bersangkutan
      await minioClient
        .presignedGetObject(mainBucketName, result.banner)
        .then(url => {
          bannerUrl = url
        })
        .catch(error => {
          console.error('minio ERROR: presignedGetObject', error)
        })
    }

    return Response.json({ ...result.dataValues, profilePictureUrl, bannerUrl }, { status: 200 })
  } else {
    res = { message: responseString.USER.NOT_FOUND }
    return Response.json(res, { status: 404 })
  }
}

// ** User > Profile > Update Self
export async function PUT(request, response) {
  let req = {}
  try {
    const formData = await request.formData()
    req.displayName = formData.get('displayName')
    req.profilePicture = formData.get('profilePicture')
    req.bio = formData.get('bio')
    req.about = formData.get('about')
    req.banner = formData.get('banner')
    req.themeColor = formData.get('themeColor')
  } catch (e) {}
  let res = {}

  const { user, error } = await getUserFromServerSession(request, response)
  if (!!error) {
    res = { message: error.message }
    return Response.json(res, { status: error.code })
  }

  const joiValidate = Joi.object({
    displayName: Joi.string().allow(null),
    profilePicture: Joi.object().allow(null),
    bio: Joi.string().allow(null),
    about: Joi.string().allow(null),
    banner: Joi.object().allow(null),
    themeColor: Joi.string().allow(null)
  }).validate({ ...req }, { abortEarly: false })

  if (!joiValidate.error) {
    // * Cek user ada
    const fetchAttributes = [
      'id',
      'cUsername',
      'role',
      'banStatus',
      'displayName',
      'email',
      'profilePicture',
      'banner',
      'bio',
      'about',
      'themeColor'
    ]
    let currUser = await User.findByPk(user.id, {
      attributes: fetchAttributes
    })
    if (!currUser) {
      res = { message: responseString.USER.NOT_FOUND }
      return Response.json(res, { status: 404 })
    }

    try {
      // * Masukkan data yang mau diupdate
      let changingAttributes = []
      let oldValues = {}
      let newDisplayName = String(req.displayName).trim()
      if (!!req.displayName && newDisplayName.length > 0) {
        oldValues.displayName = currUser.displayName
        currUser.displayName = newDisplayName
        changingAttributes.push('displayName')
      }
      if (!!req.bio) {
        oldValues.bio = currUser.bio
        currUser.bio = req.bio
        changingAttributes.push('bio')
      }
      if (!!req.about) {
        oldValues.about = currUser.about
        currUser.about = req.about
        changingAttributes.push('about')
      }
      if (!!req.themeColor) {
        oldValues.themeColor = currUser.themeColor
        currUser.themeColor = req.themeColor
        changingAttributes.push('themeColor')
      }

      // * Ambil cUsername atau email atau id untuk bucket prefix
      const prefix = currUser.cUsername ?? currUser.email ?? currUser.id
      if (!prefix) throw new Error(buildSystemLog('Error something wrong with prefix'))
      if (!!req.profilePicture) {
        oldValues.profilePicture = currUser.profilePicture
        changingAttributes.push('profilePicture')
        // * Generate UUID untuk gambarnya
        const newGalleryObjectId = UUD4()
        // ** Ambil extensionnya dari nama
        const extension = String(req.profilePicture.name).split('.').pop() ?? 'png'
        // * Build min.io object name nya
        const newMinioObjectName = `${prefix}/profile-picture/${newGalleryObjectId}-${new Date().getTime()}.${extension}`
        // * Mencoba masukkan ke minio
        const bytes = await req.profilePicture.arrayBuffer()
        const buffer = Buffer.from(bytes)
        await minioClient
          .putObject(mainBucketName, newMinioObjectName, buffer)
          .then(async objInfo => {
            console.log(`uploading min.io success [${newMinioObjectName}]`, objInfo)
            if (!!currUser.profilePicture) {
              await minioClient.removeObject(mainBucketName, currUser.profilePicture)
            }
            currUser.profilePicture = newMinioObjectName
          })
          .catch(error => {
            console.error('error min.io uploading process', error)
            throw new Error(buildSystemLog('Error something wrong with min.io uploading process'))
          })
      }
      if (!!req.banner) {
        oldValues.banner = currUser.banner
        changingAttributes.push('banner')
        // * Generate UUID untuk gambarnya
        const newGalleryObjectId = UUD4()
        // ** Ambil extensionnya dari nama
        const extension = String(req.banner.name).split('.').pop() ?? 'png'
        // * Build min.io object name nya
        const newMinioObjectName = `${prefix}/banner/${newGalleryObjectId}-${new Date().getTime()}.${extension}`
        // * Mencoba masukkan ke minio
        const bytes = await req.banner.arrayBuffer()
        const buffer = Buffer.from(bytes)
        await minioClient
          .putObject(mainBucketName, newMinioObjectName, buffer)
          .then(async objInfo => {
            console.log(`uploading min.io success [${newMinioObjectName}]`, objInfo)
            if (!!currUser.banner) {
              await minioClient.removeObject(mainBucketName, currUser.banner)
            }
            currUser.banner = newMinioObjectName
          })
          .catch(error => {
            console.error('error min.io uploading process', error)
            throw new Error(buildSystemLog('Error something wrong with min.io uploading process'))
          })
      }

      // * Update ke db
      return await currUser
        .save({ fields: [...changingAttributes] })
        .then(async resp => {
          await currUser.reload({
            attributes: fetchAttributes
          })
          // * Get Image URL
          let profilePictureUrl = null
          if (!!currUser.profilePicture) {
            await minioClient
              .presignedGetObject(mainBucketName, currUser.profilePicture)
              .then(url => {
                profilePictureUrl = url
              })
              .catch(error => {
                console.error('minio ERROR: presignedGetObject', error)
              })
          }
          let bannerUrl = null
          if (!!currUser.banner) {
            await minioClient
              .presignedGetObject(mainBucketName, currUser.banner)
              .then(url => {
                bannerUrl = url
              })
              .catch(error => {
                console.error('minio ERROR: presignedGetObject', error)
              })
          }
          res = {
            message: responseString.USER.UPDATE_SUCCESS,
            oldValues,
            newValues: {
              ...currUser.dataValues,
              profilePictureUrl,
              bannerUrl
            }
          }

          return Response.json(res, { status: 200 })
        })
        .catch(error => {
          res = { error: { message: responseString.GLOBAL.UPDATE_FAILED }, details: error }
          return Response.json(res, { status: 400 })
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
