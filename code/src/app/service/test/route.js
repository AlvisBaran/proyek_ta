import User from '@/backend/models/user'
import '@/backend/models/association'

export async function GET() {
  const users = await User.findAll()
  return Response.json(users)
}
