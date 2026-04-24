// ============================================
// AUTH API ROUTE
// Better Auth handles all auth endpoints here
// e.g. /api/auth/sign-in
//      /api/auth/sign-up
//      /api/auth/sign-out
//      /api/auth/session
// ============================================

import { auth } from "@/lib/auth"
import type { NextRequest } from "next/server"

export const GET = async (req: NextRequest) => {
  return auth.handler(req)
}

export const POST = async (req: NextRequest) => {
  return auth.handler(req)
}