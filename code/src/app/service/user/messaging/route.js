import Joi from 'joi'
import { Op } from 'sequelize'
import { responseString } from '@/backend/helpers/serverResponseString'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'
import { mainBucketName, minioClient } from '@/minio/config'

import User from '@/backend/models/user'
import Message from '@/backend/models/message'
import Chat from '@/backend/models/chat'

import '@/backend/models/association'

// ** User > Message > Read All
export async function GET(request, response) {
  const searchParams = request.nextUrl.searchParams
  const keyword = searchParams.get('keyword') ?? null
  let res = {}

  // * Cek user ada
  const { user, error } = await getUserFromServerSession(request, response)
  if (!!error) {
    res = { message: error.message }
    return Response.json(res, { status: error.code })
  }

  let messages = []

  let orQueryArray = [{ user1Ref: user.id }, { user2Ref: user.id }]
  if (!!keyword)
    orQueryArray = [
      ...orQueryArray,
      { '$User1.displayName$': { [Op.iLike]: `%${keyword}%` } },
      { '$User1.cUsername$': { [Op.iLike]: `%${keyword}%` } },
      { '$User2.displayName$': { [Op.iLike]: `%${keyword}%` } },
      { '$User2.cUsername$': { [Op.iLike]: `%${keyword}%` } }
    ]

  const results = await Message.findAll({
    where: {
      [Op.or]: orQueryArray
    },
    include: [
      { model: User, as: 'User1', attributes: ['id', 'cUsername', 'email', 'profilePicture', 'role', 'displayName'] },
      { model: User, as: 'User2', attributes: ['id', 'cUsername', 'email', 'profilePicture', 'role', 'displayName'] },
      { model: Chat, limit: 1, order: [['createdAt', 'DESC']] }
    ],
    order: [['lastModified', 'DESC']]
  })

  for (let i = 0; i < results.length; i++) {
    const datum = results[i]
    const Partner = user.id === datum.user1Ref ? datum.User2 : datum.User1

    let profilePictureUrl = null
    if (!!Partner && !!Partner.profilePicture) {
      await minioClient
        .presignedGetObject(mainBucketName, Partner.profilePicture)
        .then(url => {
          profilePictureUrl = url
        })
        .catch(error => {
          console.error('minio ERROR: presignedGetObject', error)
        })
    }

    messages.push({
      ...datum.dataValues,
      Partner: { ...Partner.dataValues, profilePictureUrl },
      User1: undefined,
      User2: undefined
    })
  }

  return Response.json(messages, { status: 200 })
}

// ** User > Message > Create
export async function POST(request, response) {
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
    user2Id: Joi.number().required()
  }).validate({ ...req }, { abortEarly: false })

  if (!joiValidate.error) {
    const { user2Id } = req
    // * Cek user 2 ada
    let currUser2 = await User.findByPk(user2Id)
    if (!currUser2) {
      res = { message: responseString.USER.NOT_FOUND }
      return Response.json(res, { status: 404 })
    }

    // * Cek ke 2 user tersebut sudah pernah chat atau belum
    const existingRoom = await Message.findOne({
      where: {
        [Op.or]: [
          { user1Ref: user.id, user2Ref: currUser2.id },
          { user1Ref: currUser2.id, user2Ref: user.id }
        ]
      }
    })
    if (!!existingRoom) {
      res = {
        message: responseString.MESSAGING.ROOM_ALREADY_EXISTS,
        code: 'ROOM_ALREADY_EXISTS',
        roomData: { ...existingRoom.dataValues }
      }
      return Response.json(res, { status: 400 })
    }

    let newMessageRoom = Message.build({
      user1Ref: user.id,
      user2Ref: currUser2.id
    })

    // * Daftarkan message room ke database
    return await newMessageRoom
      .save()
      .then(async resp => {
        await newMessageRoom.reload()
        res = {
          message: responseString.GLOBAL.SUCCESS,
          newValues: {
            ...newMessageRoom.dataValues
          }
        }
        return Response.json(res, { status: 200 })
      })
      .catch(error => {
        res = { error: { message: responseString.MESSAGING.ROOM_ADD_FAILED }, details: error }
        // throw new Error(res)
        return Response.json(res, { status: 400 })
      })
  } else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details }
    return Response.json(res, { status: 400 })
  }
}
