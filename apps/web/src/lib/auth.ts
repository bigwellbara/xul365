// ============================================
// BETTER AUTH CONFIGURATION
// Handles authentication for all tenants
// ============================================

import { betterAuth } from "better-auth"

export const auth = betterAuth({
  // We will connect this to the database shortly
  secret: process.env.BETTER_AUTH_SECRET ?? "development-secret-change-in-production",

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24,      // refresh if older than 1 day
  },

  // We will add tenant/school context here later
  user: {
    additionalFields: {
      tenantId: {
        type: "string",
        required: false,
      },
      role: {
        type: "string",
        required: false,
        defaultValue: "admin",
      },
    },
  },
})

export type Session = typeof auth.$Infer.Session
export type User = typeof auth.$Infer.Session.user