"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signUp } from "@/lib/auth-client"

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    schoolName: "",
    subdomain: "",
    location: "",
    email: "",
    password: "",
    primaryColor: "#2563eb",
    secondaryColor: "#64748b",
    accentColor: "#f59e0b",
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const result = await signUp.email({
        email: form.email,
        password: form.password,
        name: form.schoolName,
      })

      if (result.error) {
        setError(result.error.message ?? "Registration failed")
        return
      }

      // Redirect to onboarding after registration
      router.push("/onboarding")
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-lg space-y-8 p-8">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary">Xul365</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Register your school to get started
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
              1
            </div>
            <span className="text-sm font-medium text-foreground">
              School Info
            </span>
          </div>
          <div className="w-8 h-px bg-border" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-medium">
              2
            </div>
            <span className="text-sm text-muted-foreground">Features</span>
          </div>
          <div className="w-8 h-px bg-border" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-medium">
              3
            </div>
            <span className="text-sm text-muted-foreground">Payment</span>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-card rounded-lg border border-border p-6 shadow-sm space-y-4"
        >

          {/* Error message */}
          {error && (
            <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* School name */}
          <div className="space-y-2">
            <label
              htmlFor="schoolName"
              className="text-sm font-medium text-foreground"
            >
              School name
            </label>
            <input
              id="schoolName"
              type="text"
              value={form.schoolName}
              onChange={handleChange}
              placeholder="e.g. Harare High School"
              required
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Subdomain */}
          <div className="space-y-2">
            <label
              htmlFor="subdomain"
              className="text-sm font-medium text-foreground"
            >
              School subdomain
            </label>
            <div className="flex items-center">
              <input
                id="subdomain"
                type="text"
                value={form.subdomain}
                onChange={handleChange}
                placeholder="hararehigh"
                required
                className="flex-1 px-3 py-2 border border-input rounded-l-md bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <span className="px-3 py-2 border border-l-0 border-input rounded-r-md bg-muted text-muted-foreground text-sm">
                .xul365.co.zw
              </span>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label
              htmlFor="location"
              className="text-sm font-medium text-foreground"
            >
              Location
            </label>
            <input
              id="location"
              type="text"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Harare, Zimbabwe"
              required
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Admin email */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-foreground"
            >
              Admin email
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="admin@yourschool.com"
              required
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Password */}
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
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              minLength={8}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Branding colors */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              School colors
            </label>
            <div className="flex items-center gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Primary</p>
                <input
                  id="primaryColor"
                  type="color"
                  value={form.primaryColor}
                  onChange={handleChange}
                  className="w-10 h-10 rounded cursor-pointer border border-input"
                />
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Secondary</p>
                <input
                  id="secondaryColor"
                  type="color"
                  value={form.secondaryColor}
                  onChange={handleChange}
                  className="w-10 h-10 rounded cursor-pointer border border-input"
                />
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Accent</p>
                <input
                  id="accentColor"
                  type="color"
                  value={form.accentColor}
                  onChange={handleChange}
                  className="w-10 h-10 rounded cursor-pointer border border-input"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating your school..." : "Continue to feature selection"}
          </button>

        </form>

        {/* Login link */}
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>

      </div>
    </div>
  )
}