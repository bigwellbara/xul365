"use client"

import React from "react"

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary">Xul365</h1>
          <p className="text-sm text-muted-foreground">
            Setting up your school
          </p>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        {children}
      </div>
    </div>
  )
}