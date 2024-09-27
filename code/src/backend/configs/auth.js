import bcrypt from 'bcrypt'
import { getServerSession } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { mainBucketName, minioClient } from '@/minio/config'

import User from '@/backend/models/user'
import { composeName } from '../utils/nextAuthUserSessionHelper'

export const dynamic = 'force-dynamic'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials, req) {
        //get email & password from fe
        const { email, password } = credentials
        //get the jwt token
        const user = await User.findOne({
          where: { email },
          attributes: ['id', 'email', 'password', 'role', 'cUsername', 'banStatus', 'displayName', 'profilePicture']
        })

        if (!!user) {
          let passMatch = false

          await bcrypt
            .compare(password, user.password)
            .then(res => {
              if (res) passMatch = true
            })
            .catch(err => {
              passMatch = false
            })

          if (passMatch) {
            let profileUrl = null
            await minioClient
              .presignedGetObject(mainBucketName, user.dataValues.profilePicture)
              .then(url => {
                profileUrl = url
              })
              .catch(error => {
                console.error('minio ERROR: presignedGetObject', error)
              })

            return {
              name: composeName(
                user.dataValues.id,
                user.dataValues.displayName,
                user.dataValues.role,
                user.dataValues.cUsername,
                user.dataValues.banStatus
              ),
              email: user.dataValues.email,
              image: profileUrl
            }
          }
        }

        return null
      }
    })
  ],
  // callbacks: {
  // Dalam callbacks ada urutannya, jadi emang harus begini lempar-lemparan data
  // async jwt({ token, user }) {
  //   if (!!user)
  //     // token.accessToken = user.accessToken
  //     return {
  //       ...token,
  //       id: user.id,
  //       cUsername: user.cUsername,
  //       role: user.role,
  //       accessToken: user.accessToken
  //     }
  //   return token
  // },
  // async session({ session, token }) {
  //   // session.accessToken = token.accessToken
  //   return {
  //     ...session,
  //     user: {
  //       ...session.user,
  //       id: token.id,
  //       cUsername: token.cUsername,
  //       role: token.role,
  //       accessToken: token.accessToken
  //     }
  //   }
  // }
  // },
  // callbacks: {
  //   jwt: async (token, user, account) => {
  //     if (account) {
  //       token.accessToken = account.accessToken
  //     }
  //     return token
  //   },

  //   session: async (session, token) => {
  //     session.accessToken = token.accessToken
  //     return session
  //   }
  // },
  // callbacks: {
  //   async jwt({ token, user, trigger, session }) {
  //     if (trigger === 'update') return { ...token, ...session.user }
  //     return { ...token, ...user }
  //   },
  //   async session({ session, trigger, newSession }) {
  //     if (trigger === 'update') return { ...session, ...newSession }
  //     return { ...session }
  //   }
  // },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60 // 7 days
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60 // 7 days
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      }
    }
  },
  // Ini buat kalo mau pake custom pages
  pages: {
    signIn: '/auth/signIn'
    // signOut: '/service/auth/signout',
    // error: '/service/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/service/auth/verify-request', // (used for check email message)
    // newUser: '/service/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
  }
  // Ini kalo mau custom logo dll
  // theme: {
  //   colorScheme: "auto", // "auto" | "dark" | "light"
  //   brandColor: "", // Hex color code
  //   logo: "", // Absolute URL to image
  //   buttonText: "" // Hex color code
  // },
}

export const getServerAuthSession = () => getServerSession(authOptions)
