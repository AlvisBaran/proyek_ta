import Joi from 'joi'
import { responseString } from '@/backend/helpers/serverResponseString'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'

import User from '@/backend/models/user'
import Content from '@/backend/models/content'
import CategoriesXContents from '@/backend/models/categoriesxcontents'

import '@/backend/models/association'

// ** Creator > Content > Bind Category > Delete
export async function DELETE(request, response) {
  const { params } = response
  const { id, categoryId } = params
  let res = {}

  // ** Cek user ada
  const { user, error } = await getUserFromServerSession(request, response)
  if (!!error) {
    res = { message: error.message }
    return Response.json(res, { status: error.code })
  }

  const joiValidate = Joi.object({
    id: Joi.number().required(),
    categoryId: Joi.number().required()
  }).validate({ id, categoryId }, { abortEarly: false })

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

    return await CategoriesXContents.destroy({
      where: {
        contentRef: currContent.id,
        categoryRef: Number(categoryId)
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
