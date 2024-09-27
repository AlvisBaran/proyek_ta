import Joi from 'joi'
import { responseString } from '@/backend/helpers/serverResponseString'
import Content from '@/backend/models/content'
import User from '@/backend/models/user'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'
import Membership from '@/backend/models/membership'

import '@/backend/models/association'

// ** Creator > Membership > Bind Content > Read All
export async function GET(request, response) {
  const { params } = response
  const { id } = params
  let req = {}
  try {
    req = await request.json()
  } catch (e) {}
  let res = {}

  // ** Cek user ada
  const { user, error } = await getUserFromServerSession(request, response)
  if (!!error) {
    res = { message: error.message }
    return Response.json(res, { status: error.code })
  }

  let currCreator = await User.findByPk(user.id)

  // Cek user adalah creator
  if (currCreator.role !== 'creator') {
    res = { message: 'Anda bukan seorang creator!' }
    return Response.json(res, { status: 403 })
  }

  // Cek membership ada dan milik user yang sedang merequest
  let currMembership = await Membership.findOne({
    where: {
      id,
      userRef: currCreator.id
    },
    attributes: ['id', 'userRef'],
    include: Content
  })
  if (!currMembership) {
    res = { message: responseString.GLOBAL.NOT_FOUND }
    return Response.json(res, { status: 404 })
  }

  return Response.json([...currMembership.dataValues.Contents], { status: 200 })
}

// ** Creator > Membership > Bind Content > Upsert
export async function PUT(request, response) {
  const { params } = response
  const { id } = params
  let req = {}
  try {
    req = await request.json()
  } catch (e) {}
  let res = {}

  // ** Cek user ada
  const { user, error } = await getUserFromServerSession(request, response)
  if (!!error) {
    res = { message: error.message }
    return Response.json(res, { status: error.code })
  }

  const joiValidate = Joi.object({
    contentIds: Joi.array().items(Joi.number()).required()
  }).validate({ ...req }, { abortEarly: false })

  if (!joiValidate.error) {
    let currCreator = await User.findByPk(user.id)

    // Cek user adalah creator
    if (currCreator.role !== 'creator') {
      res = { message: 'Anda bukan seorang creator!' }
      return Response.json(res, { status: 403 })
    }

    // Cek membership ada dan milik user yang sedang merequest
    let currMembership = await Membership.findOne({
      where: {
        id,
        userRef: currCreator.id
      }
    })
    if (!currMembership) {
      res = { message: responseString.GLOBAL.NOT_FOUND }
      return Response.json(res, { status: 404 })
    }

    return await currMembership
      .setContents(req.contentIds)
      .then(() => {
        res = { message: responseString.GLOBAL.SUCCESS }
        return Response.json(res, { status: 200 })
      })
      .catch(err => {
        res = { message: responseString.GLOBAL.FAILED, error: err }
        return Response.json(res, { status: 400 })
      })
  } else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details }
    return Response.json(res, { status: 400 })
  }
}
