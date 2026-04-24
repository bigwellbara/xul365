// ============================================
// APP LAYOUT
// Wraps all protected pages
// Contains the sidebar and top navigation
// ============================================

import React from "react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: "%s | Xul365",
  },
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex bg-background">

      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col">

        {/* School logo/name */}
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-bold text-primary">Xul365</h2>
          <p className="text-xs text-muted-foreground mt-1">School Management</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          
           <Link href="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            <span className="w-4 h-4">📊</span>
            Dashboard
          </Link>
          
            <Link href="/students"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            <span className="w-4 h-4">🎓</span>
            Students
          </Link>
          
            <Link href="/teachers"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            <span className="w-4 h-4">👨‍🏫</span>
            Teachers
          </Link>
          
            <Link href="/attendance"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            <span className="w-4 h-4">✅</span>
            Attendance
          </Link>
          
            <Link href="/fees"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            <span className="w-4 h-4">💰</span>
            Fees & Billing
          </Link>
          
            <Link href="/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            <span className="w-4 h-4">⚙️</span>
            Settings
          </Link>
        </nav>

        {/* Bottom user section */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                Admin User
              </p>
              <p className="text-xs text-muted-foreground truncate">
                admin@school.com
              </p>
            </div>
          </div>
        </div>

      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
          <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
          <button
            type="button"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign out
          </button>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>

      </main>

    </div>
  )
}