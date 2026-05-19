"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { signOut } from "@/lib/auth-client"
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CheckCircle,
  DollarSign,
  Settings,
  LogOut,
  School,
  BookOpen,
  FileText,
  CalendarDays,
  Library,
  ChevronDown,
} from "lucide-react"

const navGroups = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    items: [],
  },
  {
    label: "Admissions",
    items: [
      { href: "/students", label: "Students", icon: GraduationCap },
      { href: "/teachers", label: "Teachers", icon: Users },
      { href: "/classes", label: "Classes", icon: School },
    ],
  },
  {
    label: "Academic",
    items: [
      { href: "/subjects", label: "Subjects", icon: Library },
      { href: "/timetable", label: "Timetable", icon: CalendarDays },
      { href: "/attendance", label: "Attendance", icon: CheckCircle },
      { href: "/exams", label: "Exams", icon: BookOpen },
      { href: "/report-cards", label: "Report Cards", icon: FileText },
    ],
  },
  {
    label: "Finance",
    items: [
      { href: "/fees", label: "Fees & Billing", icon: DollarSign },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/settings", label: "Settings", icon: Settings },
    ],
  },
]

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  async function handleSignOut() {
    try {
      await signOut()
    } finally {
      router.push("/login")
    }
  }

  const segments = pathname.split("/").filter(Boolean)

  function isGroupActive(items: { href: string }[]) {
    return items.some((item) => pathname.startsWith(item.href))
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* MAIN NAVBAR */}
      <header className="h-16 border-b bg-card flex items-center justify-between px-6 shadow-sm z-50">
        <h1 className="text-xl font-bold text-primary">Xul365</h1>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-muted-foreground">admin@school.com</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
            A
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-md hover:bg-muted text-foreground"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      {/* SECONDARY NAV */}
      <div className="border-b bg-background px-6 z-40 relative">
      <div className="flex gap-1 py-2 overflow-x-auto justify-center">
          {navGroups.map((group) => {
            // Dashboard standalone link
            if (group.href) {
              const active = pathname === group.href
              const Icon = group.icon
              return (
                <Link
                  key={group.href}
                  href={group.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm whitespace-nowrap transition ${
                    active
                      ? "bg-primary text-primary-foreground shadow"
                      : "bg-muted hover:bg-muted/70 text-foreground"
                  }`}
                >
                  {Icon && <Icon size={16} />}
                  {group.label}
                </Link>
              )
            }

            // Grouped dropdown
            const active = isGroupActive(group.items)
            const isOpen = openDropdown === group.label

            return (
              <div key={group.label} className="relative">
                <button
                  type="button"
                  onClick={() => setOpenDropdown(isOpen ? null : group.label)}
                  onBlur={() => setTimeout(() => setOpenDropdown(null), 150)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm whitespace-nowrap transition ${
                    active
                      ? "bg-primary text-primary-foreground shadow"
                      : "bg-muted hover:bg-muted/70 text-foreground"
                  }`}
                >
                  {group.label}
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isOpen && (
                  <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-lg shadow-lg py-1 min-w-48 z-50">
                    {group.items.map((item) => {
                      const itemActive = pathname.startsWith(item.href)
                      const Icon = item.icon
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setOpenDropdown(null)}
                          className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                            itemActive
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-foreground hover:bg-muted"
                          }`}
                        >
                          <Icon size={16} />
                          {item.label}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 space-y-4">

        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <Link href="/dashboard" className="hover:text-foreground">
            Dashboard
          </Link>
          {segments.map((seg, i) => {
            const path = "/" + segments.slice(0, i + 1).join("/")
            const isLast = i === segments.length - 1
            return (
              <React.Fragment key={path}>
                <span>/</span>
                {isLast ? (
                  <span className="text-foreground font-medium capitalize">
                    {seg.replace(/-/g, " ")}
                  </span>
                ) : (
                  <Link
                    href={path}
                    className="hover:text-foreground capitalize"
                  >
                    {seg.replace(/-/g, " ")}
                  </Link>
                )}
              </React.Fragment>
            )
          })}
        </div>

        {/* Page Title */}
        <h2 className="text-2xl font-semibold capitalize">
          {segments[segments.length - 1]?.replace(/-/g, " ") || "Dashboard"}
        </h2>

        {/* Content Card */}
        <div className="bg-card border rounded-xl p-6 shadow-sm">
          {children}
        </div>

      </main>

    </div>
  )
}