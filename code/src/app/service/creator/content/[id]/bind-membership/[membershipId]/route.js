import { responseString } from '@/backend/helpers/serverResponseString'
import Content from '@/backend/models/content'
import MembershipsXContents from '@/backend/models/membershipsxcontents'
import User from '@/backend/models/user'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'
import Joi from 'joi'

import '@/backend/models/association'

// ** Creator > Content > Bind Membership > Delete
export async function DELETE(request, response) {
  const { params } = response
  const { id, membershipId } = params
  let res = {}

  // ** Cek user ada
  const { user, error } = await getUserFromServerSession(request, response)
  if (!!error) {
    res = { message: error.message }
    return Response.json(res, { status: error.code })
  }

  const joiValidate = Joi.object({
    id: Joi.number().required(),
    membershipId: Joi.number().required()
  }).validate({ id, membershipId }, { abortEarly: false })

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

    return await MembershipsXContents.destroy({
      where: {
        contentRef: currContent.id,
        membershipRef: Number(membershipId)
      }
    })
      .then(() => {
        res = { message: responseString.GLOBAL.SUCCESS }
        return Response.json(res, { status: 200 })
      })
      .catch(() => {
        res = { message: responseString.GLOBAL.FAILED }
        return Response.json(res, { status: 200 })
      })
  } else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details }
    return Response.json(res, { status: 400 })
  }
}
