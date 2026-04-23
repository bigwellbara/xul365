// ============================================
// LOGIN PAGE
// ============================================

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-8">

        {/* Logo */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary">Xul365</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to your school account
          </p>
        </div>

        {/* Form */}
        <div className="bg-card rounded-lg border border-border p-6 shadow-sm space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-foreground"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              placeholder="admin@yourschool.com"
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-foreground"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <button
            type="button"
            className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Sign in
          </button>
        </div>

        {/* Register link */}
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          
            href="/register"
            className="text-primary font-medium hover:underline"
          >
            Register your school
          </a>
        </p>

      </div>
    </div>
  )
}