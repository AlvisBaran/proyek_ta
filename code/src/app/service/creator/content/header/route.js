import Joi from 'joi'

import { responseString } from '@/backend/helpers/serverResponseString'
import User from '@/backend/models/user'
import Content from '@/backend/models/content'

// ** Creator > Content > Create > Header
export async function POST(request) {
  let req = {}
  try {
    req = await request.json()
  } catch (e) {}
  let res = {}

  const joiValidate = Joi.object({
    creatorId: Joi.number().optional(),
    type: Joi.valid('public', 'private').optional(),
    title: Joi.string().optional(),
    body: Joi.string().optional()
  }).validate(req, { abortEarly: false })

  if (!joiValidate.error) {
    const { creatorId, type, title, body } = req

    // Cek user ada
    let currCreator = await User.findByPk(creatorId)
    if (!currCreator) {
      res = { message: responseString.USER.NOT_FOUND }
      return Response.json(res, { status: 404 })
    }

    // Cek user adalah creator (sebenernya bisa bareng di atas, tapi ya sudah pisah aja)
    if (currCreator.role !== 'creator') {
      res = { message: 'Anda bukan seorang creator!' }
      return Response.json(res, { status: 403 })
    }

    let newContent = Content.build({
      creatorRef: creatorId,
      type: type ?? undefined,
      title: title ?? undefined,
      body: body ?? undefined
    })

    // Daftarkan content ke database
    return await newContent
      .save()
      .then(async resp => {
        await newContent.reload()
        res = {
          message: responseString.GLOBAL.SUCCESS,
          created: {
            ...newContent.dataValues
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
