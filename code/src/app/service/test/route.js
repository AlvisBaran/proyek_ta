import User from '@/backend/models/User'
import { adminDB } from '@/configs/firebase-admin/adminApp';

export async function GET() {
  // let newUser = new User({email: "admin@example.com"});
  let users = [];
  await adminDB.collection('users').get()
    .then((snapshot) => {
      snapshot.forEach((user) => {
        users.push(new User({...user.data(), id: user.id}));
      });
    })
  return Response.json(users);
}