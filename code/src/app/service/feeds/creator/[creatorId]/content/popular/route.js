import Joi from 'joi'
import { responseString } from '@/backend/helpers/serverResponseString'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'
import { mainBucketName, minioClient } from '@/minio/config'

import User from '@/backend/models/user'
import Content from '@/backend/models/content'
import ContentGallery from '@/backend/models/contentgallery'

import '@/backend/models/association'

// ** Feeds > Creator > Get Creator's Contents > Popular
export async function GET(request, response) {
  const searchParams = request.nextUrl.searchParams
  let page = searchParams.get('page') ?? 1
  let perPage = searchParams.get('perPage') ?? 12
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
    page = Number(page)
    perPage = Number(perPage)

    // * Cek Creator Ada
    const currCreator = await User.findOne({
      where: { cUsername: creatorId, role: 'creator' },
      attributes: ['id', 'cUsername', 'role', 'displayName']
    })
    if (!currCreator) {
      res = { message: responseString.CREATOR.NOT_FOUND }
      return Response.json(res, { status: 404 })
    }

    const results = await Content.findAndCountAll({
      where: { creatorRef: currCreator.id, status: 'published', contentRequestRef: null },
      order: [['likeCounter', 'ASC']],
      limit: perPage,
      offset: (page - 1) * perPage,
      include: [
        {
          model: User,
          as: 'Creator',
          attributes: ['id', 'cUsername', 'displayName', 'email', 'joinDate', 'profilePicture']
        },
        {
          model: ContentGallery,
          as: 'Gallery',
          limit: 4
          // order: [['createdAt', 'DESC']],
        }
      ]
    })

    const contents = []
    for (let i = 0; i < results.rows.length; i++) {
      const tempData = results.rows[i]
      let profilePictureUrl = null
      if (!!tempData.Creator && !!tempData.Creator.profilePicture) {
        // ** Mengambil setiap url dari object yang bersangkutan menggunakan object_name
        await minioClient
          .presignedGetObject(mainBucketName, tempData.Creator.profilePicture)
          .then(url => {
            profilePictureUrl = url
          })
          .catch(error => {
            console.error('minio ERROR: presignedGetObject', error)
          })
      }

      let tempGalleries = []
      for (let j = 0; j < tempData.Gallery.length; j++) {
        const tempDataGal = tempData.Gallery[j]
        let galUrl = null
        if (!!tempDataGal.minio_object_name) {
          // ** Mengambil setiap url dari object yang bersangkutan menggunakan object_name
          await minioClient
            .presignedGetObject(mainBucketName, tempDataGal.minio_object_name)
            .then(url => {
              galUrl = url
            })
            .catch(error => {
              console.error('minio ERROR: presignedGetObject', error)
            })
        }
        tempGalleries.push({
          ...tempDataGal.dataValues,
          url: galUrl
        })
      }

      contents.push({
        ...tempData.dataValues,
        Creator: { ...tempData.Creator.dataValues, profilePictureUrl },
        Gallery: tempGalleries
      })
    }

    return Response.json(
      {
        rows: contents,
        page,
        perPage,
        total: results.count,
        totalPage: Math.ceil((results.count ?? 0) / perPage)
      },
      { status: 200 }
    )
  } else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details }
    return Response.json(res, { status: 400 })
  }
}
