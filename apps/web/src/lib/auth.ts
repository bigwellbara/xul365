// import { betterAuth } from "better-auth"
// import { prismaAdapter } from "@better-auth/prisma-adapter"
// import { PrismaClient } from "@prisma/client"

// const prisma = new PrismaClient()

// export const auth = betterAuth({
//   baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
//   secret: process.env.BETTER_AUTH_SECRET ?? "development-secret-change-in-production",

//   database: prismaAdapter(prisma, {
//     provider: "mysql",
//   }),

//   emailAndPassword: {
//     enabled: true,
//     minPasswordLength: 8,
//   },

//   session: {
//     expiresIn: 60 * 60 * 24 * 7,
//     updateAge: 60 * 60 * 24,
//   },
// })

// export type Session = typeof auth.$Infer.Session
// export type User = typeof auth.$Infer.Session.user



import { betterAuth } from "better-auth"
import { prismaAdapter } from "@better-auth/prisma-adapter"
import { mothershipDb } from "./mothership-db"

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET ?? "development-secret-change-in-production",
  database: prismaAdapter(mothershipDb, {
    provider: "mysql",
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
})

export type Session = typeof auth.$Infer.Session
export type User = typeof auth.$Infer.Session.user