import Joi from 'joi'

import { responseString } from '@/backend/helpers/serverResponseString'
import User from '@/backend/models/user'

// Admin > User > Read All
export async function GET() {
  let users = []
  return await User.findAll({ order: [['joinDate', 'DESC']] })
    .then((resp = []) => {
      resp?.map(datum =>
        users.push({
          ...datum?.dataValues,
          saldo: undefined,
          socials: undefined,
          bio: undefined,
          about: undefined,
          banner: undefined,
          password: undefined
        })
      )

      return Response.json(users, { status: 200 })
    })
    .catch(err => {
      return Response.json({ message: responseString.SERVER.SERVER_ERROR }, { status: 500 })
    })
}

// Admin > User > Create
export async function POST(request) {
  let req = {}
  try {
    req = await request.json()
  } catch (e) {}
  let res = {}

  // TODO:: Validasi input
  const joiValidate = Joi.object({
    role: Joi.valid('normal', 'creator', 'admin').optional(),
    email: Joi.string().email().required(),
    password: Joi.string().min(3).max(15).required(),
    confirmPassword: Joi.any().equal(Joi.ref('password')).required(),
    // .label('confirmPassword').message({ 'any.only': '{{#label}} does not match' }),
    displayName: Joi.string().required()
    // static_time_start: Joi.any().optional(),
    // id : Joi.string().optional(),
    // dynamic_start: Joi.date().timestamp("javascript").optional(),
    // emergency_block: Joi.boolean().optional(),
  }).validate(req, { abortEarly: false })

  if (!joiValidate.error) {
    let newUser = User.build({ ...req })

    // TODO:: Cek user terdaftar di database
    let userSnapshot = await User.findOne({ where: { email: newUser.email } })

    if (!!userSnapshot) {
      res = { error: { email: responseString.USER.EMAIL_USED } }
      return Response.json(res, { status: 400 })
    }

    // TODO:: Daftarkan user ke database
    return await newUser
      .save()
      .then(async resp => {
        await newUser.reload()
        res = {
          message: responseString.GLOBAL.SUCCESS,
          created: {
            ...newUser.dataValues
            // joinDate: undefined,
          }
        }
        return Response.json(res, { status: 200 })
      })
      .catch(error => {
        res = { error: { message: responseString.USER.ADD_FAILED }, details: error }
        // throw new Error(res)
        return Response.json(res, { status: 400 })
      })
  } else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details }
    return Response.json(res, { status: 400 })
  }
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
