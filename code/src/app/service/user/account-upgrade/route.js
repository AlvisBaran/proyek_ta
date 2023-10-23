import Joi from "joi";
import { adminDB } from "@/configs/firebase-admin/adminApp";
import AccountUpgradeRequest from "@/backend/models/AccountUpgradeRequest";
import { configName, convertPath } from "@/backend/models/tableNames";
import { responseString } from "@/backend/helpers/serverResponseString";
import { FieldValue } from "firebase-admin/firestore";
import { removeUndefined } from "@/backend/helpers/modelHelper";
import User from "@/backend/models/User";

// User > Account Upgrade > Request Become a Creator
export async function POST(request) {
  let req = {};
  try { req = await request.json(); } catch (e) {}
  let res = {};

  const joiValidate = Joi.object({
    id: Joi.string().required(),
    new_username: Joi.string().required(),
  }).validate(req, {abortEarly: false});

  if (!joiValidate.error) {
    const { id, new_username } = req;
  
    // Cek User Ada
    let currUser = await adminDB.collection(convertPath(configName.USER)).doc(id).get();
    if (!currUser.exists) {
      res = { message: responseString.USER.NOT_FOUND };
      return Response.json(res, { status: 404 });
    }

    // Cek Jika User bukan admin dan belum menjadi creator
    let currUserData = new User({...currUser.data(), _id: currUser.id});
    if (currUserData.role == 'admin' || currUserData.role == 'creator') {
      res = { message: "User adalah seorang admin atau sudah menjadi creator!" };
      return Response.json(res, { status: 400 });
    }

    // Cek User Sudah Pernah Request
    let existItem = await adminDB.collection(convertPath(configName.ACCOUNTUPGRADEREQUEST))
    .where("applicant_ref", "==", currUser.ref)
    // Awas ini perlu buat index baru (perhatikan terminal dan/atau console)
    .where("status", "==", "requested").get();
    if (!existItem.empty) {
      res = { message: responseString.GLOBAL.ALREADY_EXISTS };
      return Response.json(res, { status: 400 });
    }

    // Insert Data
    let newItem = new AccountUpgradeRequest({
      applicant_ref: currUser.ref,
      new_username: new_username,
      requested_at: FieldValue.serverTimestamp(),
    });
    
    return await adminDB.collection(convertPath(configName.ACCOUNTUPGRADEREQUEST))
    .add(removeUndefined({...newItem}))
    .then(async (docRef) => {
      let currItemRef = await docRef.get();
      let currItem = new AccountUpgradeRequest({
        ...currItemRef.data(),
        _id: docRef.id,
      })
      res = {
        message: responseString.GLOBAL.SUCCESS,
        created: {
          ...currItem,
          applicant_ref: currItem.applicant_ref.id,
        },
      }
      return Response.json(res, { status: 200 });
    })
    .catch(error => {
      res = { error: { message: responseString.GLOBAL.ADD_FAILED }, details: error };
      return Response.json(res, { status: 400 });
    });
  }
  else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details };
    return Response.json(res, { status: 400 });
  }
}