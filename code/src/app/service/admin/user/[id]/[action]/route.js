import Joi from 'joi'

import { responseString } from '@/backend/helpers/serverResponseString'
import User from '@/backend/models/user'
import { literal } from 'sequelize'

// Admin > User > Action
export async function PUT(request, { params }) {
  const { id, action } = params
  let req = {}
  try {
    req = await request.json()
  } catch (e) {}
  let res = {}

  if (action === 'ban_status') {
    return await handleBanStatus(id, req)
  } else if (action === 'change_role') {
    return await handleChangeRole(id, req)
  } else if (action === 'change_email') {
    return await handleChangeEmail(id, req)
  } else {
    res = { error: responseString.SERVER.SERVER_ERROR }
    return Response.json(res, { status: 400 })
  }
}

// Admin > User > Ban or Unban
async function handleBanStatus(id, req) {
  let res = { message: 'handleBanStatus', id, req }

  let currUser = await User.findByPk(id)
  if (!currUser) {
    res = { message: responseString.USER.NOT_FOUND }
    return Response.json(res, { status: 404 })
  }

  let changingAttributes = []

  if (!!req.type) {
    if (req.type === 'ban') {
      if (currUser.banStatus === 'clean' || currUser.banStatus === 'unbanned') {
        currUser.banStatus = 'banned'
        currUser.bannedDate = literal('CURRENT_TIMESTAMP')
        changingAttributes = ['banStatus', 'bannedDate']
      } else {
        res = { warning: 'Tidak dapat ban user yang sudah di ban!' }
        return Response.json(res, { status: 200 })
      }
    } else if (req.type === 'unban') {
      if (currUser.banStatus === 'banned') {
        currUser.banStatus = 'unbanned'
        changingAttributes = ['banStatus']
      } else {
        res = { warning: 'Tidak dapat unban user yang tidak di ban!' }
        return Response.json(res, { status: 200 })
      }
    }

    return await currUser
      .save({ fields: [...changingAttributes] })
      .then(async resp => {
        await currUser.reload()
        res = {
          message: responseString.GLOBAL.SUCCESS,
          method: req.type,
          newValues: {
            ...currUser.dataValues,
            saldo: undefined,
            socials: undefined,
            bio: undefined,
            about: undefined,
            banner: undefined,
            password: undefined
          }
        }

        return Response.json(res, { status: 200 })
      })
      .catch(error => {
        res = { error: { message: responseString.USER.UPDATE_FAILED }, details: error }
        return Response.json(res, { status: 400 })
      })
  } else {
    res = {
      error: { type: 'Terdapat kesalahan pada field "type"!' }
    }
    return Response.json(res, { status: 400 })
  }
}

// Admin > User > Change Role
async function handleChangeRole(id, req) {
  let res = { message: 'handleChangeRole', id, req }

  let currUser = await User.findByPk(id)
  if (!currUser) {
    res = { message: responseString.USER.NOT_FOUND }
    return Response.json(res, { status: 404 })
  }

  if (!!req.to && (req.to === 'normal' || req.to === 'creator' || req.to === 'admin')) {
    if (req.to === currUser.role) {
      res = { warning: 'Role sudah dimiliki oleh user tersebut!' }
      return Response.json(res, { status: 400 })
    }

    let oldRole = currUser.role
    currUser.role = req.to

    return await currUser
      .save({ fields: ['role'] })
      .then(resp => {
        res = {
          message: responseString.GLOBAL.SUCCESS,
          oldRole,
          newValues: {
            ...currUser.dataValues,
            saldo: undefined,
            socials: undefined,
            bio: undefined,
            about: undefined,
            banner: undefined,
            password: undefined
          }
          // previcous nya ngebug dari sequelize
          // previousValues: {
          //   ...resp._previousDataValues,
          //   saldo: undefined,
          //   socials: undefined,
          //   bio: undefined,
          //   about: undefined,
          //   banner: undefined,
          //   password: undefined,
          // }
        }

        return Response.json(res, { status: 200 })
      })
      .catch(error => {
        res = { error: { message: responseString.USER.UPDATE_FAILED }, details: error }
        return Response.json(res, { status: 400 })
      })
  } else {
    res = {
      error: { to: 'Terdapat kesalahan pada field "to"!' }
    }
    return Response.json(res, { status: 400 })
  }
}

// Admin > User > Change Email
async function handleChangeEmail(id, req) {
  let res = { message: 'handleChangeEmail', id, req }

  const joiValidate = Joi.object({
    newEmail: Joi.string().email().required()
  }).validate(req, { abortEarly: false })

  if (!joiValidate.error) {
    let currUser = await User.findByPk(id)
    if (!currUser) {
      res = { message: responseString.USER.NOT_FOUND }
      return Response.json(res, { status: 404 })
    }

    let userWithSameEmail = await User.findOne({ where: { email: req.newEmail } })
    if (!!userWithSameEmail) {
      res = { message: responseString.USER.EMAIL_USED }
      return Response.json(res, { status: 400 })
    }

    let oldEmail = currUser.email
    currUser.email = req.newEmail

    return await currUser
      .save({ fields: ['email'] })
      .then(resp => {
        res = {
          message: responseString.GLOBAL.SUCCESS,
          oldEmail,
          newValues: {
            ...currUser.dataValues,
            saldo: undefined,
            socials: undefined,
            bio: undefined,
            about: undefined,
            banner: undefined,
            password: undefined
          }
        }

        return Response.json(res, { status: 200 })
      })
      .catch(error => {
        res = { error: { message: responseString.USER.UPDATE_FAILED }, details: error }
        return Response.json(res, { status: 400 })
      })
  } else {
    res = {
      error: { newEmail: 'Terdapat kesalahan pada field "newEmail"!' }
    }
    return Response.json(res, { status: 400 })
  }
}
