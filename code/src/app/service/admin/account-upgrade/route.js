import Joi from "joi";

import { adminDB } from "@/configs/firebase-admin/adminApp";
import AccountUpgradeRequest from "@/backend/models/AccountUpgradeRequest";
import { configName, convertPath } from "@/backend/models/tableNames";
import { responseString } from "@/backend/helpers/serverResponseString";
import { FieldValue } from "firebase-admin/firestore";
import { removeUndefined } from "@/backend/helpers/modelHelper";

// Admin > Account Upgrade > Read All
export async function GET(request) {
  const searchParams = request.nextUrl.searchParams
  const restriction = searchParams.get('restriction')


  let requests_list = [];
  return await adminDB.collection(convertPath(configName.ACCOUNTUPGRADEREQUEST))
  .orderBy("requested_at", "desc").get()
  .then(async (snapshot) => {
    for (let i = 0; i < snapshot.docs.length; i++) {
      const request_item = snapshot.docs[i];
      let tempItem = new AccountUpgradeRequest({
        ...request_item.data(),
        _id: request_item.id,
      });
      await tempItem.loadApplicant({ restrict: restriction });
      requests_list.push({
        ...tempItem,
        applicant_ref: undefined,
      });
    }
    return Response.json(requests_list, { status: 200 });
  })
  .catch(err => {
    return Response.json({ message: responseString.SERVER.SERVER_ERROR }, { status: 500 })
  });
}

// Admin > Account Upgrade > Send Response
export async function PUT(request) {
  let req = {};
  try { req = await request.json(); } catch (e) {}
  let res = {};

  const joiValidate = Joi.object({
    id_request: Joi.string().required(),
    action: Joi.valid("approve", "decline").required(),
    admin_note: Joi.string().allow("").allow(null).required(),
    specified_username: Joi.string().allow(null).optional(),
  }).validate(req, {abortEarly: false});

  if (!joiValidate.error) {
    const { id_request, action, admin_note, specified_username } = req;

    let currRequestRef = await adminDB
    .collection(convertPath(configName.ACCOUNTUPGRADEREQUEST))
    .doc(id_request).get();
    if (!currRequestRef.exists) {
      res = { message: responseString.GLOBAL.NOT_FOUND };
      return Response.json(res, { status: 404 });
    }

    let currRequest = new AccountUpgradeRequest({...currRequestRef.data(), _id: currRequestRef.id});

    if (currRequest.status !== "requested") {
      res = { error: { message: "Status request sudah diupdate!" } }
      return Response.json(res, { status: 400 }); 
    }
    
    const updateRequest = async () => {
      return await adminDB.collection(convertPath(configName.ACCOUNTUPGRADEREQUEST)).doc(id_request)
      .set(removeUndefined({
        ...currRequest,
        _id: undefined,
        applicant: undefined,
        admin_note: admin_note ?? null,
        modified_at: FieldValue.serverTimestamp(),
      }), { merge: true })
      .then(() => {
        res = {
          message: responseString.GLOBAL.SUCCESS,
          // updated: { ...currRequest, },
          status: currRequest.status,
        }
        return Response.json(res, { status: 200 });
      })
      .catch(error => {
        res = { error: { message: responseString.USER.UPDATE_FAILED }, details: error };
        return Response.json(res, { status: 400 });
      })
    }

    if (action === "approve") {
      currRequest.status = "approved";
      return await adminDB.collection(convertPath(configName.USER))
      .doc(currRequest.applicant_ref.id)
      .set(removeUndefined({
        role: "creator",
        c_username: !!specified_username ? specified_username : currRequest.new_username,
      }), { merge: true })
      .then(async () => {
        return await updateRequest();
      })
      .catch(error => {
        res = { error: { message: responseString.GLOBAL.UPDATE_FAILED }, details: error };
        return Response.json(res, { status: 400 });
      });
    }
    else if (action === "decline") {
      currRequest.status = "declined";
      return await updateRequest();
    }
  }
  else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details };
    return Response.json(res, { status: 400 });
  }
}