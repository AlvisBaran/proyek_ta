import Joi from 'joi'
import { responseString } from '@/backend/helpers/serverResponseString'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'
import { mainBucketName, minioClient } from '@/minio/config'

import User from '@/backend/models/user'
import Membership from '@/backend/models/membership'

// ** Feeds > Creator > Membership > Read All
export async function GET(request, response) {
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
    // * Cek Creator Ada
    const currCreator = await User.findOne({
      where: { cUsername: creatorId, role: 'creator' },
      attributes: ['id', 'cUsername', 'role', 'displayName']
    })
    if (!currCreator) {
      res = { message: responseString.CREATOR.NOT_FOUND }
      return Response.json(res, { status: 404 })
    }

    const results = await Membership.findAll({
      where: { userRef: currCreator.id },
      order: [['createdAt', 'DESC']]
    })

    const memberships = []
    for (let i = 0; i < results.length; i++) {
      const tempData = results[i]
      let bannerUrl = null
      if (!!tempData.banner) {
        // ** Mengambil setiap url dari object yang bersangkutan menggunakan object_name
        await minioClient
          .presignedGetObject(mainBucketName, tempData.banner)
          .then(url => {
            bannerUrl = url
          })
          .catch(error => {
            console.error('minio ERROR: presignedGetObject', error)
          })
      }

      memberships.push({ ...tempData.dataValues, bannerUrl })
    }

    return Response.json(memberships, { status: 200 })
  } else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details }
    return Response.json(res, { status: 400 })
  }
}
