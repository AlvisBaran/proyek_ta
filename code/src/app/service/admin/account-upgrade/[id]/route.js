import Joi from 'joi'
import sqlz from '@/backend/configs/db'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'
import { responseString } from '@/backend/helpers/serverResponseString'

import User from '@/backend/models/user'
import AccountUpgradeRequests from '@/backend/models/accountupgraderequests'

import '@/backend/models/association'

// ** Admin > Account Upgrade > Read One
export async function GET(request, response) {
  const { id } = response.params
  let res = {}

  // * Cek user ada
  const { user, error } = await getUserFromServerSession(request, response)
  if (!!error) {
    res = { message: error.message }
    return Response.json(res, { status: error.code })
  }

  // * Cek User adalah admin
  if (user.role !== 'admin') {
    res = { message: responseString.USER.NOT_ADMIN }
    return Response.json(res, { status: 403 })
  }

  const joiValidate = Joi.object({
    id: Joi.number().required()
  }).validate(params, { abortEarly: false })

  if (!joiValidate.error) {
    let currItem = await AccountUpgradeRequests.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ['id', 'cUsername', 'displayName', 'email'],
          as: 'Applicant'
        },
        {
          model: User,
          attributes: ['id', 'cUsername', 'displayName', 'email'],
          as: 'Admin'
        }
      ]
    })
    if (!currItem) {
      res = { message: responseString.GLOBAL.NOT_FOUND }
      return Response.json(res, { status: 404 })
    }

    return Response.json(
      {
        ...currItem.dataValues
      },
      { status: 200 }
    )
  } else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details }
    return Response.json(res, { status: 400 })
  }
}

// ** Admin > Account Upgrade > Send Response
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

  // * Cek User adalah admin
  if (user.role !== 'admin') {
    res = { message: responseString.USER.NOT_ADMIN }
    return Response.json(res, { status: 403 })
  }

  const joiValidate = Joi.object({
    idRequest: Joi.number().required(),
    adminId: Joi.number().required(),
    action: Joi.valid('approve', 'decline').required(),
    adminNote: Joi.string().allow('').allow(null).required(),
    specifiedUsername: Joi.string().allow(null).optional()
  }).validate({ ...req, idRequest: id, adminId: user.id }, { abortEarly: false })

  if (!joiValidate.error) {
    const { action, adminNote, specifiedUsername } = req
    const adminId = user.id
    const idRequest = Number(id)

    let currRequest = await AccountUpgradeRequests.findByPk(idRequest)
    if (!currRequest) {
      res = { message: responseString.GLOBAL.NOT_FOUND }
      return Response.json(res, { status: 404 })
    }

    if (currRequest.status !== 'requested') {
      res = { error: { message: 'Status request sudah diupdate!' } }
      return Response.json(res, { status: 400 })
    }

    let currApplicant = await User.findByPk(currRequest.applicantRef)
    if (!currApplicant) {
      res = { message: responseString.USER.NOT_FOUND }
      return Response.json(res, { status: 404 })
    }

    let newUsername = currRequest.newUsername
    if (!!specifiedUsername) newUsername = specifiedUsername
    currRequest.newUsername = newUsername
    currRequest.adminRef = adminId
    if (!!adminNote) currRequest.adminNote = adminNote

    if (action === 'approve') {
      try {
        await sqlz.transaction(async t => {
          // Update User/Applicant
          currApplicant.role = 'creator'
          currApplicant.cUsername = newUsername
          await currApplicant.save({ fields: ['role', 'cUsername'] }).catch(error => {
            throw new Error({ message: responseString.GLOBAL.UPDATE_FAILED, details: error })
          })
          // Update Account Upgrade Request
          currRequest.status = 'approved'
          // Perlu dipisah dengan yang bawah karena yang ini ada dalam transaction
          await currRequest.save({ fields: ['status', 'newUsername', 'adminNote', 'adminRef'] }).catch(error => {
            throw new Error({ message: responseString.GLOBAL.UPDATE_FAILED, details: error })
          })
        })
      } catch (error) {
        res = { error: { message: responseString.GLOBAL.UPDATE_FAILED }, details: error }
        return Response.json(res, { status: 400 })
      }
    } else if (action === 'decline') {
      // Update Account Upgrade Request
      currRequest.status = 'declined'
      await currRequest.save({ fields: ['status', 'adminNote', 'adminRef'] }).catch(error => {
        res = { message: responseString.GLOBAL.UPDATE_FAILED, details: error }
        return Response.json(res, { status: 400 })
      })
    }

    await currRequest.reload()
    await currApplicant.reload()
    res = {
      message: responseString.GLOBAL.SUCCESS,
      upgradeRequest: { ...currRequest.dataValues },
      applicant: {
        ...currApplicant.dataValues,
        saldo: undefined,
        socials: undefined,
        bio: undefined,
        about: undefined,
        banner: undefined,
        password: undefined
      }
    }
    return Response.json(res, { status: 200 })
  } else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details }
    return Response.json(res, { status: 400 })
  }
}
