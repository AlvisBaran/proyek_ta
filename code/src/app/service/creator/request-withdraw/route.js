import Joi from 'joi'
import { Op } from 'sequelize'
import { responseString } from '@/backend/helpers/serverResponseString'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'

import User from '@/backend/models/user'
import Bank from '@/backend/models/bank'
import TransWithdraw from '@/backend/models/transwithdraw'

import '@/backend/models/association'
import { WITHDRAW_LIMIT } from '@/utils/constants'

// ** Creator > Request Withdraw > Read All
export async function GET(request, response) {
  const searchParams = request.nextUrl.searchParams
  const keyword = searchParams.get('keyword') ?? null
  const filterStatus = searchParams.get('filterStatus') ?? null
  let res = {}

  const joiValidate = Joi.object({
    filterStatus: Joi.valid('on-hold', 'approved', 'declined').valid(null)
  }).validate({ filterStatus }, { abortEarly: false })

  if (!joiValidate.error) {
    // ** Cek user ada
    const { user, error } = await getUserFromServerSession(request, response)
    if (!!error) {
      res = { message: error.message }
      return Response.json(res, { status: error.code })
    }

    // * Cek user is creator
    if (user.role !== 'creator') {
      res = { message: responseString.USER.NOT_CREATOR }
      return Response.json(res, { status: 400 })
    }

    let where = {
      userRef: user.id
    }
    if (!!keyword)
      where = {
        ...where,
        [Op.or]: [
          // { nomorRekening: { [Op.iLike]: `%${keyword}%` } },
          { status: { [Op.iLike]: `%${keyword}%` } },
          { note: { [Op.iLike]: `%${keyword}%` } },
          { '$Bank.name$': { [Op.iLike]: `%${keyword}%` } },
          { '$Bank.alias$': { [Op.iLike]: `%${keyword}%` } },
          { '$Bank.swiftCode$': { [Op.iLike]: `%${keyword}%` } }
        ]
      }
    if (!!filterStatus) {
      where = { ...where, status: filterStatus }
    }

    const withdraws = await TransWithdraw.findAll({
      where,
      include: [{ model: Bank }],
      order: [['createdAt', 'DESC']]
    })

    return Response.json(
      withdraws.map(item => item.dataValues),
      { status: 200 }
    )
  } else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details }
    return Response.json(res, { status: 400 })
  }
}

// ** Creator > Request Withdraw > Create
export async function POST(request, response) {
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

  // * Cek user is creator
  if (user.role !== 'creator') {
    res = { message: responseString.USER.NOT_CREATOR }
    return Response.json(res, { status: 400 })
  }

  const joiValidate = Joi.object({
    nomorRekening: Joi.string()
      .regex(/^[0-9]*$/)
      .required(),
    bankRef: Joi.number().required(),
    nominal: Joi.number().min(WITHDRAW_LIMIT.MIN).max(WITHDRAW_LIMIT.MAX).required()
  }).validate(req, { abortEarly: false })

  if (!joiValidate.error) {
    // * Cek user saldo cukup
    const currUser = await User.findByPk(user.id)
    if (currUser.saldo < req.nominal) {
      res = { message: responseString.USER.INUFICENT_BALANCE }
      return Response.json(res, { status: 400 })
    }

    // * Build data
    const currWithdraw = TransWithdraw.build({
      userRef: user.id,
      nomorRekening: req.nomorRekening,
      bankRef: req.bankRef,
      nominal: req.nominal
    })

    // * Create DB
    return await currWithdraw
      .save()
      .then(async () => {
        await currWithdraw.reload({ include: [Bank] })
        return Response.json(currWithdraw.dataValues, { status: 200 })
      })
      .catch(error => {
        res = { message: responseString.GLOBAL.FAILED, error }
        return Response.json(res, { status: 400 })
      })
  } else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details }
    return Response.json(res, { status: 400 })
  }
}
