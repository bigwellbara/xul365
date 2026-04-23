// ============================================
// HOME PAGE
// Redirects to login or dashboard
// ============================================

import { redirect } from "next/navigation"

export default function HomePage() {
  // For now redirect to login
  // Later we will check session and redirect
  // to dashboard if already logged in
  redirect("/login")
}