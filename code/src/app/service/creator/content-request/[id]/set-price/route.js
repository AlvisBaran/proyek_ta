import Joi from 'joi'
import { responseString } from '@/backend/helpers/serverResponseString'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'

import User from '@/backend/models/user'
import ContentRequest from '@/backend/models/contentrequest'
import Content from '@/backend/models/content'
import ContentRequestPayment from '@/backend/models/contentrequestpayment'

import '@/backend/models/association'

const MINIMUM_PRICE = 5000
const ALLOWED_STATUS = ['requested', 'on-progress', 'waiting-requestor-confirmation']

// ** Creator > Content Request > Set Price
export async function PUT(request, response) {
  const { id } = response.params
  let req = {}
  try {
    req = await request.json()
  } catch (e) {}
  let res = {}

  // * Cek user ada
  const { user, error } = await getUserFromServerSession(request, response)
  if (!!error) {
    res = { message: error.message }
    return Response.json(res, { status: error.code })
  }

  const joiValidate = Joi.object({
    price: Joi.number().min(MINIMUM_PRICE).required()
  }).validate(req, { abortEarly: false })

  if (!joiValidate.error) {
    // * Cek Content Request Ada
    const currCR = await ContentRequest.findOne({
      where: { id, creatorRef: user.id }
    })
    if (!currCR) {
      res = { message: responseString.CONTENT_REQUEST.NOT_FOUND }
      return Response.json(res, { status: 404 })
    }

    // * Cek Content Request status
    if (!ALLOWED_STATUS.includes(currCR.status)) {
      res = { message: responseString.CONTENT_REQUEST.STATUS_ERROR }
      return Response.json(res, { status: 400 })
    }

    // * Cek Content Request sudah ada payment atau belum
    const paymentCount = await ContentRequestPayment.count({
      where: { contentRequestRef: currCR.id }
    })
    if (paymentCount > 0) {
      res = { message: responseString.CONTENT_REQUEST.EXIST_PAYMENTS }
      return Response.json(res, { status: 400 })
    }

    currCR.price = req.price
    currCR.leftoverPrice = req.price

    return await currCR.save().then(async () => {
      await currCR.reload({
        include: [
          {
            model: User,
            as: 'ContentRequestor',
            attributes: ['id', 'cUsername', 'displayName', 'email']
          },
          {
            model: Content
          }
        ]
      })
      return Response.json({ ...currCR.dataValues }, { status: 200 })
    })
  } else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details }
    return Response.json(res, { status: 400 })
  }
}
