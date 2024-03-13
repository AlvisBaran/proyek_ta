import { responseString } from "@/backend/helpers/serverResponseString";
import User from "@/backend/models/user";
import { Op } from 'sequelize';

// Creator > Search
export async function GET(request) {
  const searchParams = request.nextUrl.searchParams
  const keyword = searchParams.get('keyword')

  let users = [];
  return await User.findAll({
    where: {
      role: "creator",
      // banStatus: {
      //   [Op.ne]: "banned"
      // },
      cUsername: {
        [Op.like]: `%${keyword}%`
      }
    },
    order: [['joinDate', 'DESC']],
    attributes: ["id", "cUsername", "role", "banStatus", "displayName", "email", "profilePicture"]
  })
  .then((resp = []) => {
    resp?.map((datum) => users.push({...datum?.dataValues}));

    return Response.json(users, { status: 200 });
  })
  .catch(err => {
    return Response.json({ message: responseString.SERVER.SERVER_ERROR }, { status: 500 })
  });
}