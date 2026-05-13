// "use client"

// import React from "react"
// import Link from "next/link"
// import { useRouter } from "next/navigation"
// import { signOut } from "@/lib/auth-client"

// export default function AppLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   const router = useRouter()

//  async function handleSignOut() {
//   try {
//     await signOut()
//   } catch {
//     // ignore errors if no session exists
//   } finally {
//     // Always redirect to login regardless
//     router.push("/login")
//   }
// }

//   return (
//     <div className="min-h-screen flex bg-background">

//       {/* Sidebar */}
//       <aside className="w-64 border-r border-border bg-card flex flex-col">

//         {/* School logo/name */}
//         <div className="p-6 border-b border-border">
//           <h2 className="text-lg font-bold text-primary">Xul365</h2>
//           <p className="text-xs text-muted-foreground mt-1">School Management</p>
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 p-4 space-y-1">
//           <Link
//             href="/dashboard"
//             className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors"
//           >
//             <span className="w-4 h-4">📊</span>
//             Dashboard
//           </Link>
//           <Link
//             href="/students"
//             className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors"
//           >
//             <span className="w-4 h-4">🎓</span>
//             Students
//           </Link>
//           <Link
//             href="/teachers"
//             className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors"
//           >
//             <span className="w-4 h-4">👨‍🏫</span>
//             Teachers
//           </Link>
//           <Link
//             href="/attendance"
//             className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors"
//           >
//             <span className="w-4 h-4">✅</span>
//             Attendance
//           </Link>
//           <Link
//             href="/fees"
//             className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors"
//           >
//             <span className="w-4 h-4">💰</span>
//             Fees & Billing
//           </Link>
//           <Link
//             href="/settings"
//             className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors"
//           >
//             <span className="w-4 h-4">⚙️</span>
//             Settings
//           </Link>
//         </nav>

//         {/* Bottom user section */}
//         <div className="p-4 border-t border-border">
//           <div className="flex items-center gap-3">
//             <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
//               A
//             </div>
//             <div className="flex-1 min-w-0">
//               <p className="text-sm font-medium text-foreground truncate">
//                 Admin User
//               </p>
//               <p className="text-xs text-muted-foreground truncate">
//                 admin@school.com
//               </p>
//             </div>
//           </div>
//           <button
//             type="button"
//             onClick={handleSignOut}
//             className="mt-3 w-full py-2 px-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors text-left"
//           >
//             Sign out
//           </button>
//         </div>

//       </aside>

//       {/* Main content */}
//       <main className="flex-1 flex flex-col overflow-hidden">

//         {/* Top bar */}
//         <header className="h-16 border-b border-border bg-card flex items-center px-6">
//           <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
//         </header>

//         {/* Page content */}
//         <div className="flex-1 overflow-auto p-6">
//           {children}
//         </div>

//       </main>

//     </div>
//   )
// }


"use client"

import React from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { signOut } from "@/lib/auth-client"

// ✅ Lucide icons
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CheckCircle,
  DollarSign,
  Settings,
  LogOut,
  School,
} from "lucide-react"

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/students", label: "Students", icon: GraduationCap },
  { href: "/teachers", label: "Teachers", icon: Users },
  { href: "/classes", label: "Classes", icon: School },
  { href: "/attendance", label: "Attendance", icon: CheckCircle },
  { href: "/fees", label: "Fees", icon: DollarSign },
  { href: "/settings", label: "Settings", icon: Settings },
]

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  async function handleSignOut() {
    try {
      await signOut()
    } finally {
      router.push("/login")
    }
  }

  const segments = pathname.split("/").filter(Boolean)

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* 🔵 MAIN NAVBAR */}
      <header className="h-16 border-b bg-card flex items-center justify-between px-6 shadow-sm">
        <h1 className="text-xl font-bold text-primary">Xul365</h1>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-muted-foreground">admin@school.com</p>
          </div>

          <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center">
            A
          </div>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-md hover:bg-muted"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      {/* 🟣 SECONDARY NAV */}
      <div className="border-b bg-background px-6">
        <div className="flex gap-2 overflow-x-auto py-3">
          {navLinks.map((link) => {
            const active = pathname.startsWith(link.href)
            const Icon = link.icon

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm whitespace-nowrap transition
                  ${
                    active
                      ? "bg-primary text-white shadow"
                      : "bg-muted hover:bg-muted/70"
                  }`}
              >
                <Icon size={16} />
                {link.label}
              </Link>
            )
          })}
        </div>
      </div>

      {/* 🟡 MAIN CONTENT */}
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
                    {seg}
                  </span>
                ) : (
                  <Link href={path} className="hover:text-foreground capitalize">
                    {seg}
                  </Link>
                )}
              </React.Fragment>
            )
          })}
        </div>

        {/* Page Title */}
        <h2 className="text-2xl font-semibold capitalize">
          {segments[segments.length - 1] || "Dashboard"}
        </h2>

        {/* Content Card */}
        <div className="bg-card border rounded-xl p-6 shadow-sm">
          {children}
        </div>

      </main>

    </div>
  )
}