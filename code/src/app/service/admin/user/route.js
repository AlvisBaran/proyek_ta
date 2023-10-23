// import {
//   addDoc,
//   deleteDoc,
//   getDoc,
//   getDocs,
//   doc,
//   updateDoc,
//   query,
//   where,
//   OrderByDirection,
//   Timestamp,
//   QueryConstraint,
//   orderBy,
//   serverTimestamp,
//   DocumentReference,
//   collection,
//   limit,
//   QueryDocumentSnapshot,
//   DocumentData,
// } from "firebase/firestore"
// import DB from "@/configs/firebase/backendService.js"
// const collectionRef = DB.createCollection("users")

import Joi from "joi"
import { FieldValue } from "firebase-admin/firestore"

import User from "@/backend/models/User"
import { configName, convertPath } from "@/backend/models/tableNames"
import { adminAuth, adminDB } from "@/configs/firebase-admin/adminApp"
import { responseString } from "@/backend/helpers/serverResponseString"
import { removeUndefined } from "@/backend/helpers/modelHelper"
import { getMessageByCode } from "@/backend/helpers/firebaseErrorHelper"

// Admin > User > Read All
export async function GET() {
  let users = [];
  return await adminDB.collection(convertPath(configName.USER))
  .orderBy("join_date", "desc").get()
  .then((snapshot) => {
    snapshot.forEach((user) => {
      users.push(new User({
        ...user.data(),
        _id: user.id,
        // saldo: undefined,
      }));
    })

    return Response.json(users, { status: 200 });
  })
  .catch(err => {
    return Response.json({ message: responseString.SERVER.SERVER_ERROR }, { status: 500 })
  });
}

// Admin > User > Create
export async function POST(request) {
  let req = {};
  try { req = await request.json(); } catch (e) {}
  let res = {};

  // TODO:: Validasi input
  const joiValidate = Joi.object({
    role: Joi.valid("normal", "creator", "admin").optional(),
    email: Joi.string().email().required(),
    password: Joi.string().min(3).max(15).required(),
    confirm_password: Joi.any().equal(Joi.ref('password')).required(),
      // .label('confirm_password').message({ 'any.only': '{{#label}} does not match' }),
    display_name: Joi.string().required(),
    // static_time_start: Joi.any().optional(),
    // id : Joi.string().optional(),
    // dynamic_start: Joi.date().timestamp("javascript").optional(),
    // emergency_block: Joi.boolean().optional(),
  }).validate(req, {abortEarly: false});

  if (!joiValidate.error) {
    let newUser = new User({...req});

    // TODO:: Cek user terdaftar di firebase auth
    let userAuth = await adminAuth.getUserByEmail(newUser.email)
      .then((userRecord) => userRecord ).catch(err => null);
    // TODO:: Cek user terdaftar di firebase firestore
    let userSnapshot = await adminDB.collection(convertPath(configName.USER))
    .where('email', "==", newUser.email).get();
  
    if (!!userAuth || !userSnapshot.empty) {
      res = { error: { "email": responseString.USER.EMAIL_USED } };
      return Response.json(res, { status: 400 })
    }
    
    // TODO:: Daftarkan user ke firebase auth
    return await adminAuth.createUser({
      email: newUser.email,
      emailVerified: true,
      displayName: newUser.display_name,
      password: newUser.password,
    })
    .then(async (userRecord) => {
      // TODO:: Daftarkan user ke firebase firestore
      // newUser._id = userRecord.uid;
      // console.info("userRecord", userRecord);
      // return Response.json(userRecord);
      let insertingUser = removeUndefined({ ...newUser, password: undefined, });
      insertingUser.join_date = FieldValue.serverTimestamp();
      return await adminDB.collection(convertPath(configName.USER))
      .doc(userRecord.uid)
      .set(insertingUser, { merge: true })
      .then(() => {
        res = {
          message: responseString.GLOBAL.SUCCESS,
          created: {
            ...insertingUser,
            _id: userRecord.uid,
          },
        }
        return Response.json(res, { status: 200 });
      })
      .catch(error => {
        res = { error: { message: responseString.USER.ADD_FAILED }, details: error };
        // throw new Error(res)
        return Response.json(res, { status: 400 });
      })
    })
    .catch((error) => {
      res = {
        error: { "auth": responseString.SERVER.AUTH_ERROR },
        details: { ...error },
      }
      return Response.json(res, { status: 500})
    });

  }
  else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details };
    return Response.json(res, { status: 400 });
  }
  return Response.json({ message: responseString.SERVER.SERVER_ERROR }, { status: 500 });
}

// export async function GET(request) {
//   const searchParams = request.nextUrl.searchParams;
//   const _id = searchParams.get('_id');
//   let res = {};

//   if (!!_id) {
//     // SECTION:: Single Read
//     let currUser = await adminDB.collection(convertPath(configName.USER)).doc(_id).get();
//     if (!currUser.exists) {
//       res = { message: responseString.USER.NOT_FOUND };
//       return Response.json(res, { status: 404 });
//     }

//     currUser = new User({ ...currUser.data(), _id: currUser.id });

//     return Response.json(currUser, { status: 200 });
//   }
//   else {
//     // SECTION:: All Read
//     let users = [];
  
//     return await adminDB.collection(convertPath(configName.USER)).orderBy("join_date", "desc").get()
//       .then((snapshot) => {
//         snapshot.forEach((user) => {
//           users.push(new User({ ...user.data(), _id: user.id }));
//         })
  
//         return Response.json(users, { status: 200 });
//       })
//       .catch(err => {
//         return Response.json({ message: responseString.SERVER.SERVER_ERROR }, { status: 500 })
//       });
//     }
//   // let fQuery = query(collectionRef, orderBy("join_date", "desc"))
//   // return await getDocs(fQuery)
//   //   .then(res => { return Response.json(res.docs.map(docR => new User({ ...docR.data(), _id: docR.id }))) })
//   //   .catch(error => { return Response.json({ error, message: "Gagal!" }) })
// }