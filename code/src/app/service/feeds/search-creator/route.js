import Joi from 'joi'
import { Op } from 'sequelize'
import { responseString } from '@/backend/helpers/serverResponseString'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'

import User from '@/backend/models/user'
import { mainBucketName, minioClient } from '@/minio/config'

// ** Feeds > Search Creator
export async function GET(request, response) {
  const searchParams = request.nextUrl.searchParams
  let page = searchParams.get('page') ?? 1
  let perPage = searchParams.get('perPage') ?? 10
  const keyword = searchParams.get('keyword')
  let res = {}

  // * Cek user ada
  const { user, error } = await getUserFromServerSession(request, response)
  if (!!error) {
    res = { message: error.message }
    return Response.json(res, { status: error.code })
  }

  const joiValidate = Joi.object({
    page: Joi.number().min(1),
    perPage: Joi.number().min(2).max(100)
  }).validate({ page, perPage }, { abortEarly: false })

  if (!joiValidate.error) {
    page = Number(page)
    perPage = Number(perPage)

    let users = []
    const results = await User.findAndCountAll({
      where: {
        role: 'creator',
        // banStatus: {
        //   [Op.ne]: "banned"
        // },
        cUsername: {
          [Op.like]: `%${keyword}%`
        }
      },
      order: [['joinDate', 'DESC']],
      attributes: ['id', 'cUsername', 'role', 'banStatus', 'displayName', 'email', 'profilePicture', 'bio']
    })

    for (let i = 0; i < results.rows.length; i++) {
      const tempData = results.rows[i]
      let profilePictureUrl = null
      if (!!tempData.profilePicture) {
        // ** Mengambil setiap url dari object yang bersangkutan menggunakan object_name
        await minioClient
          .presignedGetObject(mainBucketName, tempData.profilePicture)
          .then(url => {
            profilePictureUrl = url
          })
          .catch(error => {
            console.error('minio ERROR: presignedGetObject', error)
          })
      }

      users.push({
        ...tempData.dataValues,
        profilePictureUrl
      })
    }

    return Response.json(
      {
        rows: users,
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
