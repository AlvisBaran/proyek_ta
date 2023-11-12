import User from "@/backend/models/User";


export async function GET() {
  const users = await User.findAll();
  return Response.json(users);
}

export async function POST() {
  const newUser = User.build({
    displayName: "User 1",
    email: "user1",
    password: "user1",
  });

  return await newUser.save()
  .then((res) => {
    console.info(res)
    return Response.json( {...res, message: "success" })
  })
  .catch(err => {
    console.info(err)
    return Response.json({ ...err, message: "error" })
  });
}