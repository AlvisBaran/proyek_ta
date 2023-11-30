import Joi from "joi"

import { responseString } from "@/backend/helpers/serverResponseString"
import User from "@/backend/models/user";
import Message from "@/backend/models/message";
import sqlz from "@/backend/configs/db";
import Notification from "@/backend/models/notification";

// Notification > Load All
export async function GET(request) {
  const searchParams = request.nextUrl.searchParams
  const userId = Number(searchParams.get('userId'))
  const statusOpen = searchParams.get('statusOpen');
  let res = {};

  const joiValidate = Joi.object({
    userId: Joi.number().required(),
    statusOpen: Joi.valid("not-opened-only", "opened-only").allow(null).optional(),
  }).validate({userId, statusOpen}, {abortEarly: false});

  if (!joiValidate.error) {
    // Cek user ada
    let currUser = await User.findByPk(userId);
    if (!currUser) {
      res = { message: responseString.USER.NOT_FOUND };
      return Response.json(res, { status: 404 });
    }

    let whereAttributes = { userRef: userId };
    let notifications = [];

    if (!!statusOpen) {
      if (statusOpen === "not-opened-only") whereAttributes = {...whereAttributes, readStatus: false};
      else if (statusOpen === "opened-only") whereAttributes = {...whereAttributes, readStatus: true};
    }

    return await Notification.findAll({
      where: whereAttributes,
      order: [['createdAt', 'DESC']]
    })
  .then((resp = []) => {
    resp?.map((datum) => notifications.push({
      ...datum?.dataValues,
    }));

    return Response.json(notifications, { status: 200 });
  })
    .catch(err => {
      return Response.json({ message: responseString.SERVER.SERVER_ERROR, err }, { status: 500 })
    });
  }
  else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details };
    return Response.json(res, { status: 400 });
  }
}

// Notification > Read All
export async function PUT(request) {
  let req = {};
  try { req = await request.json(); } catch (e) {}
  let res = {};

  const joiValidate = Joi.object({
    userId: Joi.number().required(),
    user2Id: Joi.number().required(),
  }).validate(req, {abortEarly: false});

  if (!joiValidate.error) {
    const { userId, user2Id } = req;
    // Cek user 1 ada
    let currUser = await User.findByPk(userId);
    if (!currUser) {
      res = { message: responseString.USER.NOT_FOUND };
      return Response.json(res, { status: 404 });
    }

    // Cek user 2 ada
    let currUser2 = await User.findByPk(user2Id);
    if (!currUser2) {
      res = { message: responseString.USER.NOT_FOUND };
      return Response.json(res, { status: 404 });
    }

    // Cek ke 2 user tersebut sudah pernah chat atau belum
    let roomExist = false;
    let currMessageRoom = await Message.findOne({ where: {
      user1Ref: userId,
      user2Ref: user2Id,
    } });
    if (!!currMessageRoom) {
      roomExist = true;
    }
    else {
      currMessageRoom = await Message.findOne({ where: {
        user1Ref: user2Id,
        user2Ref: userId,
      } });
      if (!!currMessageRoom) {
        roomExist = true;
      }
    }

    if (roomExist) {
      res = {
        message: responseString.MESSAGING.ROOM_ALREADY_EXISTS,
        roomData: {...currMessageRoom.dataValues},
      };
      return Response.json(res, { status: 404 });
    }
    else {
      let newMessageRoom = Message.build({
        user1Ref: currUser.id,
        user2Ref: currUser2.id,
      });

      // Daftarkan message room ke database
      return await newMessageRoom.save()
      .then(async (resp) => {
        await newMessageRoom.reload();
        res = {
          message: responseString.GLOBAL.SUCCESS,
          newValues: {
            ...newMessageRoom.dataValues,
          },
        }
        return Response.json(res, { status: 200 });
      })
      .catch(error => {
        res = { error: { message: responseString.MESSAGING.ROOM_ADD_FAILED }, details: error };
        // throw new Error(res)
        return Response.json(res, { status: 400 });
      })
    }
  }
  else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details };
    return Response.json(res, { status: 400 });
  }
}

// Notification > Clear
export async function DELETE(request) {
  const searchParams = request.nextUrl.searchParams
  const userId = Number(searchParams.get('userId'))
  let res = {};

  const joiValidate = Joi.object({
    userId: Joi.number().required(),
  }).validate({userId}, {abortEarly: false});

  if (!joiValidate.error) {
    // Cek user ada
    let currUser = await User.findByPk(userId);
    if (!currUser) {
      res = { message: responseString.USER.NOT_FOUND };
      return Response.json(res, { status: 404 });
    }

    return await Notification.destroy({
      where: {
        userRef: currUser.id,
        readStatus: true,
      },
    })
    .then((resp) => {
      res = { message: responseString.GLOBAL.SUCCESS, }
      return Response.json(res, { status: 200 });
    })
    .catch(error => {
      res = { error: { message: responseString.GLOBAL.DELETE_FAILED }, details: error };
      return Response.json(res, { status: 400 });
    })
  }
  else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details };
    return Response.json(res, { status: 400 });
  }
}