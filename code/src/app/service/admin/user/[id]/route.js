import Joi from "joi"
import { FieldValue } from "firebase-admin/firestore"

import User from "@/backend/models/User"
import { configName, convertPath } from "@/backend/models/tableNames"
import { adminAuth, adminDB } from "@/configs/firebase-admin/adminApp"
import { responseString } from "@/backend/helpers/serverResponseString"
import { removeUndefined } from "@/backend/helpers/modelHelper"


// Admin > User > Read One
export async function GET(request, { params }) {
  const { id } = params;
  let res = {};
  
  let currUser = await adminDB.collection(convertPath(configName.USER)).doc(id).get();
  if (!currUser.exists) {
    res = { message: responseString.USER.NOT_FOUND };
    return Response.json(res, { status: 404 });
  }

  currUser = new User({ ...currUser.data(), _id: currUser.id });

  return Response.json(currUser, { status: 200 });
}

// Admin > User > Update
export async function PUT(request, { params }) {
  const { id } = params;
  let req = {};
  try { req = await request.json(); } catch (e) {}
  let res = {};

  const joiValidate = Joi.object({
    display_name: Joi.string().optional(),
    c_username: Joi.string().optional(),
    bio: Joi.string().optional(),
    about: Joi.string().optional(),
  }).validate(req, {abortEarly: false});

  if (!joiValidate.error) {
    let currUser = await adminDB.collection(convertPath(configName.USER)).doc(id).get();
    if (!currUser.exists) {
      res = { message: responseString.USER.NOT_FOUND };
      return Response.json(res, { status: 404 });
    }
    let updatingUser = new User({...currUser.data(), _id: currUser.id });
    
    if (!!req.c_username) updatingUser.c_username = req.c_username;
    if (!!req.bio) updatingUser.bio = req.bio;
    if (!!req.about) updatingUser.about = req.about;
    if (!!req.display_name) updatingUser.display_name = req.display_name;

    return await adminDB.collection(convertPath(configName.USER)).doc(id)
    .set(removeUndefined({
      ...updatingUser,
      _id: undefined,
    }), { merge: true })
    .then(() => {
      res = {
        message: responseString.GLOBAL.SUCCESS,
        updated: { ...updatingUser, },
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

  return Response.json({ error: responseString.GLOBAL.UNFINISHED_SERVICE }, { status: 403 });
}