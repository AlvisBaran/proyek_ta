import Joi from 'joi'
import { responseString } from '@/backend/helpers/serverResponseString'
import Content from '@/backend/models/content'
import User from '@/backend/models/user'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'
import MembershipsXContents from '@/backend/models/membershipsxcontents'
import Membership from '@/backend/models/membership'

import '@/backend/models/association'

// ** Creator > Content > Bind Membership > Read All
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

  // Cek content ada dan milik user yang sedang merequest
  let currContent = await Content.findOne({
    where: {
      id,
      creatorRef: currCreator.id
    },
    attributes: ['id', 'creatorRef'],
    include: Membership
  })
  if (!currContent) {
    res = { message: responseString.GLOBAL.NOT_FOUND }
    return Response.json(res, { status: 404 })
  }

  return Response.json([...currContent.dataValues.Memberships], { status: 200 })
}

// ** Creator > Content > Bind Membership > Create
export async function POST(request, response) {
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
    membershipId: Joi.number().required()
  }).validate({ ...req }, { abortEarly: false })

  if (!joiValidate.error) {
    let currCreator = await User.findByPk(user.id)

    // Cek user adalah creator
    if (currCreator.role !== 'creator') {
      res = { message: 'Anda bukan seorang creator!' }
      return Response.json(res, { status: 403 })
    }

    // Cek content ada dan milik user yang sedang merequest
    let currContent = await Content.findOne({
      where: {
        id,
        creatorRef: currCreator.id
      }
    })
    if (!currContent) {
      res = { message: responseString.GLOBAL.NOT_FOUND }
      return Response.json(res, { status: 404 })
    }

    // Cek membership ada dan milik user yang sedang merequest
    let currMembership = await Membership.findOne({
      where: {
        id: req.membershipId ?? 0,
        userRef: currCreator.id
      }
    })
    if (!currMembership) {
      res = { message: responseString.GLOBAL.NOT_FOUND }
      return Response.json(res, { status: 404 })
    }

    // Cek sudah pernah di bind belum
    let currRelation = await MembershipsXContents.findOne({
      where: {
        contentRef: currContent.id,
        membershipRef: currMembership.id
      }
    })
    if (!currRelation) {
      // Bind The Membership to The Content
      const newRelation = MembershipsXContents.build({
        contentRef: currContent.id,
        membershipRef: currMembership.id
      })

      return await newRelation
        .save()
        .then(() => {
          res = { message: responseString.GLOBAL.SUCCESS }
          return Response.json(res, { status: 201 })
        })
        .catch(err => {
          res = { message: responseString.GLOBAL.FAILED, error: err }
          return Response.json(res, { status: 401 })
        })
    } else {
      res = { message: 'Membership ini sudah di-bind ke content ini.' }
      return Response.json(res, { status: 200 })
    }
  } else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details }
    return Response.json(res, { status: 400 })
  }
}

// ** Creator > Content > Bind Membership > Upsert
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
    membershipIds: Joi.array().items(Joi.number()).required()
  }).validate({ ...req }, { abortEarly: false })

  if (!joiValidate.error) {
    let currCreator = await User.findByPk(user.id)

    // Cek user adalah creator
    if (currCreator.role !== 'creator') {
      res = { message: 'Anda bukan seorang creator!' }
      return Response.json(res, { status: 403 })
    }

    // Cek content ada dan milik user yang sedang merequest
    let currContent = await Content.findOne({
      where: {
        id,
        creatorRef: currCreator.id
      }
    })
    if (!currContent) {
      res = { message: responseString.GLOBAL.NOT_FOUND }
      return Response.json(res, { status: 404 })
    }

    return await currContent
      .setMemberships(req.membershipIds)
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
