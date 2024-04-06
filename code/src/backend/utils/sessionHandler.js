import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
import User from '../models/user'

export async function getUserFromServerSession(req, res) {
  return new Promise(async resolve => {
    const session = await getServerSession(
      req,
      {
        ...res,
        getHeader: name => res.headers?.get(name),
        setHeader: (name, value) => res.headers?.set(name, value)
      },
      authOptions
    )
    if (!!session && !!session?.user) {
      const currUser = await User.findByPk(Number(session.user.id), {
        attributes: ['id', 'cUsername', 'email', 'displayName', 'profilePicture', 'joinDate']
      })
      if (!!currUser) {
        return resolve({
          user: { ...currUser.dataValues }
        })
      }
    }

    return resolve({
      error: {
        code: 401,
        message: 'Unauthorized!'
      }
    })
  })
}
