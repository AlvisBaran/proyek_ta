import Joi from 'joi'
import { responseString } from '@/backend/helpers/serverResponseString'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'

import User from '@/backend/models/user'
import UsersFollows from '@/backend/models/usersfollows'

// ** User > Relationship > Follow / Unfollow Creator
export async function PUT(request, response) {
  const creatorId = response.params.id
  let res = {}

  const { user, error } = await getUserFromServerSession(request, response)
  if (!!error) {
    res = { message: error.message }
    return Response.json(res, { status: error.code })
  }

  const joiValidate = Joi.object({
    creatorId: Joi.number().required()
  }).validate({ creatorId }, { abortEarly: false })

  if (!joiValidate.error) {
    // * Cek Creator Ada
    let currCreator = await User.findByPk(creatorId)
    if (!currCreator) {
      res = { message: responseString.USER.NOT_FOUND }
      return Response.json(res, { status: 404 })
    }

    // * Cek Jika Target Creator bukan creator
    if (currCreator.role !== 'creator') {
      res = { message: 'Target user bukan seorang creator!' }
      return Response.json(res, { status: 400 })
    }

    // * Cek User Sudah Pernah Follow
    let existItem = await UsersFollows.findOne({
      where: { followerRef: user.id, followedRef: creatorId },
      paranoid: false
    })
    if (!!existItem) {
      // ** Logic untuk toggle follow status

      if (existItem.deletedAt === null || existItem.deletedAt === undefined) {
        return await existItem
          .destroy()
          .then(resp => {
            res = { message: responseString.GLOBAL.SUCCESS, method: 'DESTROY' }
            return Response.json(res, { status: 200 })
          })
          .catch(error => {
            res = { error: { message: responseString.GLOBAL.FAILED }, details: error }
            return Response.json(res, { status: 400 })
          })
      } else {
        return await existItem
          .restore()
          .then(resp => {
            res = { message: responseString.GLOBAL.SUCCESS, method: 'RESTORE' }
            return Response.json(res, { status: 200 })
          })
          .catch(error => {
            res = { error: { message: responseString.GLOBAL.FAILED }, details: error }
            return Response.json(res, { status: 400 })
          })
      }
    } else {
      // ** Logic untuk create new

      // Insert Data
      let newItem = UsersFollows.build({
        followerRef: user.id,
        followedRef: creatorId
      })

      return await newItem
        .save()
        .then(async resp => {
          await newItem.reload()
          res = {
            message: responseString.GLOBAL.SUCCESS,
            method: 'CREATE_NEW'
          }
          return Response.json(res, { status: 200 })
        })
        .catch(error => {
          res = { error: { message: responseString.GLOBAL.ADD_FAILED }, details: error }
          return Response.json(res, { status: 400 })
        })
    }
  } else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details }
    return Response.json(res, { status: 400 })
  }
}
