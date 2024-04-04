import Joi from 'joi'

import { responseString } from '@/backend/helpers/serverResponseString'
import User from '@/backend/models/user'
import Notification from '@/backend/models/notification'
import sqlz from '@/backend/configs/db'

// Notification > Load All
export async function GET(request) {
  const searchParams = request.nextUrl.searchParams
  const userId = Number(searchParams.get('userId'))
  const statusOpen = searchParams.get('statusOpen')
  let res = {}

  const joiValidate = Joi.object({
    userId: Joi.number().required(),
    statusOpen: Joi.valid('not-opened-only', 'opened-only').allow(null).optional()
  }).validate({ userId, statusOpen }, { abortEarly: false })

  if (!joiValidate.error) {
    // Cek user ada
    let currUser = await User.findByPk(userId)
    if (!currUser) {
      res = { message: responseString.USER.NOT_FOUND }
      return Response.json(res, { status: 404 })
    }

    let whereAttributes = { userRef: userId }
    let notifications = []

    if (!!statusOpen) {
      if (statusOpen === 'not-opened-only') whereAttributes = { ...whereAttributes, readStatus: false }
      else if (statusOpen === 'opened-only') whereAttributes = { ...whereAttributes, readStatus: true }
    }

    return await Notification.findAll({
      where: whereAttributes,
      order: [['createdAt', 'DESC']]
    })
      .then((resp = []) => {
        resp?.map(datum =>
          notifications.push({
            ...datum?.dataValues
          })
        )

        return Response.json(notifications, { status: 200 })
      })
      .catch(err => {
        return Response.json({ message: responseString.SERVER.SERVER_ERROR, err }, { status: 500 })
      })
  } else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details }
    return Response.json(res, { status: 400 })
  }
}

// Notification > Read All
export async function PUT(request) {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get('userId')
  let req = {}
  try {
    req = await request.json()
  } catch (e) {}
  let res = {}

  const joiValidate = Joi.object({
    userId: Joi.number().required(),
    notificationIds: Joi.array().items(Joi.number())
  }).validate({ ...req, userId }, { abortEarly: false })

  if (!joiValidate.error) {
    const { notificationIds = [] } = req
    // Cek user ada
    let currUser = await User.findByPk(userId)
    if (!currUser) {
      res = { message: responseString.USER.NOT_FOUND }
      return Response.json(res, { status: 404 })
    }

    // * Strategi 1: update smua satu satu
    // const allUpdate = []
    // for (let i = 0; i < notificationIds.length; i++) {
    //   const currId = notificationIds[i];
    //   allUpdate.push(Notification.update({readStatus: true}, { where: { id: currId }}))
    // }
    // await Promise.all(allUpdate)

    // * Strategi 2: Pakai raw query
    let whereClauses = notificationIds.join(', ')
    return await sqlz
      .query(`UPDATE ${Notification.tableName} SET readStatus = 1 WHERE id IN (${whereClauses})`)
      .then(() => {
        res = { message: responseString.GLOBAL.SUCCESS }
        return Response.json(res, { status: 200 })
      })
      .catch(err => {
        return Response.json({ message: responseString.SERVER.SERVER_ERROR, err }, { status: 500 })
      })
  } else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details }
    return Response.json(res, { status: 400 })
  }
}

// Notification > Clear
export async function DELETE(request) {
  const searchParams = request.nextUrl.searchParams
  const userId = Number(searchParams.get('userId'))
  let res = {}

  const joiValidate = Joi.object({
    userId: Joi.number().required()
  }).validate({ userId }, { abortEarly: false })

  if (!joiValidate.error) {
    // Cek user ada
    let currUser = await User.findByPk(userId)
    if (!currUser) {
      res = { message: responseString.USER.NOT_FOUND }
      return Response.json(res, { status: 404 })
    }

    return await Notification.destroy({
      where: {
        userRef: currUser.id,
        readStatus: true
      }
    })
      .then(resp => {
        res = { message: responseString.GLOBAL.SUCCESS }
        return Response.json(res, { status: 200 })
      })
      .catch(error => {
        res = { error: { message: responseString.GLOBAL.DELETE_FAILED }, details: error }
        return Response.json(res, { status: 400 })
      })
  } else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details }
    return Response.json(res, { status: 400 })
  }
}
