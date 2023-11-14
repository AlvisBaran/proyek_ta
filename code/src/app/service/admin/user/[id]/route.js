import Joi from "joi"

import { responseString } from "@/backend/helpers/serverResponseString"
import User from "@/backend/models/user";


// Admin > User > Read One
export async function GET(request, { params }) {
  const { id } = params;
  let res = {};

  const joiValidate = Joi.object({
    id: Joi.number().required(),
  }).validate(params, {abortEarly: false});

  if (!joiValidate.error) {
    let currUser = await User.findByPk(id);
    if (!currUser) {
      res = { message: responseString.USER.NOT_FOUND };
      return Response.json(res, { status: 404 });
    }
  
    return Response.json({
      ...currUser.dataValues,
      saldo: undefined,
      socials: undefined,
      bio: undefined,
      about: undefined,
      banner: undefined,
      password: undefined,
    }, { status: 200 });
  }
  else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details };
    return Response.json(res, { status: 400 });
  }
}

// Admin > User > Update
export async function PUT(request, { params }) {
  const { id } = params;
  let req = {};
  try { req = await request.json(); } catch (e) {}
  let res = {};

  const joiValidate = Joi.object({
    displayName: Joi.string().allow(null).optional(),
    cUsername: Joi.string().allow(null).optional(),
    bio: Joi.string().allow(null).optional(),
    about: Joi.string().allow(null).optional(),
  }).validate(req, {abortEarly: false});

  if (!joiValidate.error) {
    let currUser = await User.findByPk(id);
    if (!currUser) {
      res = { message: responseString.USER.NOT_FOUND };
      return Response.json(res, { status: 404 });
    }

    let changingAttributes = [];
    
    if (req.cUsername !== undefined) {
      currUser.cUsername = req.cUsername;
      changingAttributes.push('cUsername');
    }
    if (req.bio !== undefined) {
      currUser.bio = req.bio;
      changingAttributes.push('bio');
    }
    if (req.about !== undefined) {
      currUser.about = req.about;
      changingAttributes.push('about');
    }
    if (req.displayName !== undefined) {
      currUser.displayName = req.displayName;
      changingAttributes.push('displayName');
    }

    if (changingAttributes.length <= 0) {
      res = { message: responseString.VALIDATION.NOTHING_CHANGE_ON_UPDATE };
      return Response.json(res, { status: 400 });
    }

    return await currUser.save({ fields: [...changingAttributes] })
    .then((resp) => {
      res = {
        message: responseString.GLOBAL.SUCCESS,
        newValues: {
          ...currUser.dataValues,
          saldo: undefined,
          socials: undefined,
          banner: undefined,
          password: undefined,
        },
        previousValues: {
          ...currUser._previousDataValues,
          saldo: undefined,
          socials: undefined,
          banner: undefined,
          password: undefined,
        }
      }
      return Response.json(res, { status: 200 });
    })
    .catch(error => {
      res = { error: { message: responseString.USER.UPDATE_FAILED }, details: error };
      // throw new Error(res)
      return Response.json(res, { status: 400 });
    })
  }
  else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details };
    return Response.json(res, { status: 400 });
  }
}

// Admin > User > Delete
export async function DELETE(request, { params }) {
  const { id } = params;
  let req = {};
  try { req = await request.json(); } catch (e) {}
  let res = {};

  let currUser = await User.findByPk(id);
  if (!currUser) {
    res = { message: responseString.USER.NOT_FOUND };
    return Response.json(res, { status: 404 });
  }
  else {
    return await currUser.destroy()
    .then((resp) => {
      res = { message: responseString.GLOBAL.SUCCESS, }
      return Response.json(res, { status: 200 });
    })
    .catch(error => {
      res = { error: { message: responseString.USER.DELETE_FAILED }, details: error };
      return Response.json(res, { status: 400 });
    })
  }
  // return Response.json({ error: responseString.GLOBAL.UNFINISHED_SERVICE }, { status: 403 });
}