import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials"

import User from "@/backend/models/user"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email", },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        //get email & password from fe
        const {email, password} = credentials

        //get the jwt token
        let user = await User.findOne({
          where: { email, password }, // TODO: ini kurang mainan di encryption nya aja
        });

        if (!!user) {
          return {
            id: user.id,
            cUsername: user.cUsername,
            email: user.email,
            name: user.displayName,
            image: user.profilePicture,
          }
        }
        else return null;
      }
    })
  ],
  callbacks: {
    // Dalam callbacks ada urutannya, jadi emang harus begini lempar-lemparan data
    async jwt({ token, user}) {
      if (!!user) return {
        ...token,
        id: user.id,
        cUsername: user.cUsername,
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          cUsername: token.cUsername,
        }
      }
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  // Ini buat kalo mau pake custom pages
  // pages: {
  //   signIn: '/service/auth/signin',
  //   signOut: '/service/auth/signout',
  //   error: '/service/auth/error', // Error code passed in query string as ?error=
  //   verifyRequest: '/service/auth/verify-request', // (used for check email message)
  //   newUser: '/service/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
  // },
  // Ini kalo mau custom logo dll
  // theme: {
  //   colorScheme: "auto", // "auto" | "dark" | "light"
  //   brandColor: "", // Hex color code
  //   logo: "", // Absolute URL to image
  //   buttonText: "" // Hex color code
  // },
});

export { handler as GET, handler as POST }