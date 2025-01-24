import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { InactiveAccountError, InvalidEmailPasswordError } from "./utils/errors";
import { sendRequest } from "./utils/api";
import { access } from "fs";
import { IUser } from "./types/next-auth";
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        let user = null

        const res = await sendRequest<IBackendRes<ILogin>>({
          method: "POST",
          url: "http://localhost:8080/api/v1/auth/login",
          body: {
            username: credentials.email,
            password: credentials.password
          }
        })

        if(res.statusCode === 201) {
          return {
            _id: res.data?.user?._id,
            email: res.data?.user?.email,
            name: res.data?.user?.name,
            access_token: res.data?.access_token
          }
        }
        if(+res.statusCode === 401) throw new InvalidEmailPasswordError()
          
        if(+res.statusCode === 400) throw new InactiveAccountError()

        if(!user) {
          // No user found, so this is their first attempt to login
          // Optionally, this is also the place you could do a user registration
          // throw new Error("Invalid credentials.")
          throw new Error("Internal server error!")
        }
 
        // return user object with their profile data
        return user
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) { // User is available during sign-in
        token.user = (user as IUser)
        
      }
      return token
    },
    session({ session, token }) {
      (session.user as IUser ) = token.user
      return session
    },
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth
    },
  },
})