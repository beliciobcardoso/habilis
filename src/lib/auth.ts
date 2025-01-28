import NextAuth from "next-auth"
import { prisma } from "@/lib/db/prisma"
import bcrypt from "bcryptjs"
import Credentials from "next-auth/providers/credentials"
import authConfig from "./auth.config"


export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/login",
    // signOut: "/auth/signout",
    error: "/auth/error",
    verifyRequest: "",
    newUser: ''
  },
  session: { strategy: "jwt", maxAge: 60 * 60 * 4 },
  ...authConfig,
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        const email = credentials.email as string;
        const password = credentials.password as string;

        const user = await prisma.user.findFirst({ where: { email } });

        if (!user) {
            console.log('User not found')
            return null
          }
  

        if (user) {
          const isValid = await bcrypt.compare(password, user?.hashedPassword || "");
          if (isValid) {
            return { id: user.id, email: user.email, name: user.name, role: user.role, image: user.image };  
          }
          return null;
        }
        return null;
      }
    })
  ],
  callbacks: {
    jwt({ token, user }) {
        if (user) {
          token.role = user.role
        }
        return token
    },
    session({ session, token }) {
        session.user.role = token.role
        session.user.id = token.sub || ''
        return session
    }    
  }
})