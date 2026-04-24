// // ============================================
// // AUTH CLIENT
// // Used in client components to access session
// // and call auth actions like sign in / sign out
// // ============================================

// import { createAuthClient } from "better-auth/client"

// export const authClient = createAuthClient({
//   baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
// })

// export const {
//   signIn,
//   signOut,
//   signUp,
//   useSession,
// } = authClient

import { createAuthClient } from "better-auth/client"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
})

export const {
  signIn,
  signOut,
  signUp,
  useSession,
} = authClient