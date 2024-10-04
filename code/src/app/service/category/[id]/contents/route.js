import { getUserFromServerSession } from '@/backend/utils/sessionHandler'
import { mainBucketName, minioClient } from '@/minio/config'

import User from '@/backend/models/user'
import Category from '@/backend/models/category'
import Content from '@/backend/models/content'
import ContentGallery from '@/backend/models/contentgallery'

import '@/backend/models/association'

// ** Category > Read One > Get All Contents
export async function GET(request, response) {
  const { id } = response.params
  const searchParams = request.nextUrl.searchParams
  let page = searchParams.get('page') ?? 1
  let perPage = searchParams.get('perPage') ?? 10
  let res = {}

  // * Cek user ada
  const { user, error } = await getUserFromServerSession(request, response)
  if (!!error) {
    res = { message: error.message }
    return Response.json(res, { status: error.code })
  }

  page = Number(page)
  perPage = Number(perPage)

  const results = await Content.findAndCountAll({
    where: { status: 'published', contentRequestRef: null },
    order: [['publishedAt', 'DESC']],
    limit: perPage,
    offset: (page - 1) * perPage,
    include: [
      {
        model: Category,
        attributes: ['id'],
        where: { id }
      },
      {
        model: User,
        as: 'Creator',
        attributes: ['id', 'cUsername', 'displayName', 'email', 'joinDate', 'profilePicture']
      },
      {
        model: ContentGallery,
        as: 'Gallery',
        limit: 1
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
}
