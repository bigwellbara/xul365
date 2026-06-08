// // "use client"

// // import React, { useEffect, useState } from "react"
// // import Link from "next/link"

// // interface Stats {
// //   totalStudents: number
// //   totalTeachers: number
// //   totalBilled: number
// //   totalCollected: number
// //   outstanding: number
// //   attendanceRate: number
// //   totalAttendanceRecords: number
// // }

// // function StatCard({
// //   title,
// //   value,
// //   description,
// //   icon,
// // }: {
// //   title: string
// //   value: string
// //   description: string
// //   icon: string
// // }) {
// //   return (
// //     <div className="bg-card rounded-lg border border-border p-6 space-y-2">
// //       <div className="flex items-center justify-between">
// //         <p className="text-sm font-medium text-muted-foreground">{title}</p>
// //         <span className="text-2xl">{icon}</span>
// //       </div>
// //       <p className="text-3xl font-bold text-foreground">{value}</p>
// //       <p className="text-xs text-muted-foreground">{description}</p>
// //     </div>
// //   )
// // }

// // function ActivityItem({
// //   title,
// //   description,
// //   time,
// // }: {
// //   title: string
// //   description: string
// //   time: string
// // }) {
// //   return (
// //     <div className="flex items-start gap-4 py-3 border-b border-border last:border-0">
// //       <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
// //       <div className="flex-1 min-w-0">
// //         <p className="text-sm font-medium text-foreground">{title}</p>
// //         <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
// //       </div>
// //       <p className="text-xs text-muted-foreground shrink-0">{time}</p>
// //     </div>
// //   )
// // }

// // export default function DashboardPage() {
// //   const [stats, setStats] = useState<Stats | null>(null)
// //   const [loading, setLoading] = useState(true)

// //   useEffect(() => {
// //   async function fetchStats() {
// //     try {
// //       const res = await fetch("/api/stats")
// //       if (!res.ok) return
// //       const data = await res.json() as Stats
// //       setStats(data)
// //     } catch {
// //       // Silently fail - database may be offline
// //     } finally {
// //       setLoading(false)
// //     }
// //   }
// //   void fetchStats()
// // }, [])

// //   const greeting = () => {
// //     const hour = new Date().getHours()
// //     if (hour < 12) return "Good morning"
// //     if (hour < 17) return "Good afternoon"
// //     return "Good evening"
// //   }

// //   return (
// //     <div className="space-y-6">

// //       {/* Page header */}
// //       <div>
// //         <h2 className="text-2xl font-bold text-foreground">
// //           {greeting()} 👋
// //         </h2>
// //         <p className="text-sm text-muted-foreground mt-1">
// //           Here is what is happening at your school today
// //         </p>
// //       </div>

// //       {/* Stats grid */}
// //       {loading ? (
// //         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
// //           {[1, 2, 3, 4].map((i) => (
// //             <div
// //               key={i}
// //               className="bg-card rounded-lg border border-border p-6 animate-pulse"
// //             >
// //               <div className="h-4 bg-muted rounded w-24 mb-4" />
// //               <div className="h-8 bg-muted rounded w-16 mb-2" />
// //               <div className="h-3 bg-muted rounded w-32" />
// //             </div>
// //           ))}
// //         </div>
// //       ) : (
// //         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
// //         <StatCard
// //   title="Total Students"
// //   value={(stats?.totalStudents ?? 0).toString()}
// //   description="Active enrolled students"
// //   icon="🎓"
// // />
// // <StatCard
// //   title="Total Teachers"
// //   value={(stats?.totalTeachers ?? 0).toString()}
// //   description="Active teaching staff"
// //   icon="👨‍🏫"
// // />
// // <StatCard
// //   title="Attendance Today"
// //   value={
// //     !stats || stats.totalAttendanceRecords === 0
// //       ? "N/A"
// //       : `${stats.attendanceRate ?? 0}%`
// //   }
// //   description={
// //     !stats || stats.totalAttendanceRecords === 0
// //       ? "No attendance recorded today"
// //       : `${stats.totalAttendanceRecords} records today`
// //   }
// //   icon="✅"
// // />
// // <StatCard
// //   title="Fees Collected"
// //   value={`$${(stats?.totalCollected ?? 0).toFixed(2)}`}
// //   description={`$${(stats?.outstanding ?? 0).toFixed(2)} outstanding`}
// //   icon="💰"
// // />

// //         </div>
// //       )}

// //       {/* Bottom grid */}
// //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

// //         {/* Recent activity */}
// //         <div className="bg-card rounded-lg border border-border p-6">
// //           <h3 className="text-base font-semibold text-foreground mb-4">
// //             Recent Activity
// //           </h3>
// //           <div className="space-y-0">
// //             {stats?.totalStudents === 0 && stats?.totalTeachers === 0 ? (
// //               <ActivityItem
// //                 title="System ready"
// //                 description="Your school management system is set up and ready to use"
// //                 time="Just now"
// //               />
// //             ) : (
// //               <>
// //                 {(stats?.totalStudents ?? 0) > 0 && (
// //                   <ActivityItem
// //                     title="Students enrolled"
// //                     description={`${stats?.totalStudents} active students in the system`}
// //                     time="Today"
// //                   />
// //                 )}
// //                 {(stats?.totalTeachers ?? 0) > 0 && (
// //                   <ActivityItem
// //                     title="Teachers registered"
// //                     description={`${stats?.totalTeachers} active teachers on staff`}
// //                     time="Today"
// //                   />
// //                 )}
// //                 {(stats?.totalBilled ?? 0) > 0 && (
// //                   <ActivityItem
// //                     title="Invoices created"
// //                     description={`$${(stats?.totalBilled ?? 0).toFixed(2)} total billed to students`}
// //                     time="Today"
// //                   />
// //                 )}
// //               </>
// //             )}
// //           </div>
// //         </div>

// //         {/* Quick actions */}
// //         <div className="bg-card rounded-lg border border-border p-6">
// //           <h3 className="text-base font-semibold text-foreground mb-4">
// //             Quick Actions
// //           </h3>
// //           <div className="space-y-2">
// //             <Link
// //               href="/students"
// //               className="flex items-center gap-3 p-3 rounded-md border border-border hover:bg-muted transition-colors"
// //             >
// //               <span className="text-xl">🎓</span>
// //               <div>
// //                 <p className="text-sm font-medium text-foreground">
// //                   Add a student
// //                 </p>
// //                 <p className="text-xs text-muted-foreground">
// //                   Enroll a new student
// //                 </p>
// //               </div>
// //             </Link>
// //             <Link
// //               href="/teachers"
// //               className="flex items-center gap-3 p-3 rounded-md border border-border hover:bg-muted transition-colors"
// //             >
// //               <span className="text-xl">👨‍🏫</span>
// //               <div>
// //                 <p className="text-sm font-medium text-foreground">
// //                   Add a teacher
// //                 </p>
// //                 <p className="text-xs text-muted-foreground">
// //                   Register a new teacher
// //                 </p>
// //               </div>
// //             </Link>
// //             <Link
// //               href="/attendance"
// //               className="flex items-center gap-3 p-3 rounded-md border border-border hover:bg-muted transition-colors"
// //             >
// //               <span className="text-xl">✅</span>
// //               <div>
// //                 <p className="text-sm font-medium text-foreground">
// //                   Record attendance
// //                 </p>
// //                 <p className="text-xs text-muted-foreground">
// //                   Mark today's attendance
// //                 </p>
// //               </div>
// //             </Link>
// //             <Link
// //               href="/fees"
// //               className="flex items-center gap-3 p-3 rounded-md border border-border hover:bg-muted transition-colors"
// //             >
// //               <span className="text-xl">💰</span>
// //               <div>
// //                 <p className="text-sm font-medium text-foreground">
// //                   Create an invoice
// //                 </p>
// //                 <p className="text-xs text-muted-foreground">
// //                   Bill a student for fees
// //                 </p>
// //               </div>
// //             </Link>
// //           </div>
// //         </div>

// //       </div>
// //     </div>
// //   )
// // }


// "use client"

// import React, { useEffect, useState } from "react"
// import Link from "next/link"
// import { Users, GraduationCap, CalendarCheck, Coin, UserPlus, ClipboardList, DollarSign } from "lucide-react"

// interface Stats {
//   totalStudents: number
//   totalTeachers: number
//   totalBilled: number
//   totalCollected: number
//   outstanding: number
//   attendanceRate: number
//   totalAttendanceRecords: number
// }

// function StatCard({
//   title,
//   value,
//   description,
//   icon: Icon,
//   iconBg,
//   iconColor,
// }: {
//   title: string
//   value: string
//   description: string
//   icon: React.ElementType
//   iconBg: string
//   iconColor: string
// }) {

//   const [hovered, setHovered] = useState(false)
//   return (
//  <div
//       className="relative"
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//     >
//       {/* Stacked shadow layers */}
//       <div
//         className="absolute rounded-xl"
//         style={{
//           bottom: "-8px", left: "8px", right: "-8px",
//           top: 0, zIndex: 0,
//           background: "rgba(15,76,92,0.10)",
//           borderRadius: "14px",
//         }}
//       />
//       <div
//         className="absolute rounded-xl"
//         style={{
//           bottom: "-4px", left: "4px", right: "-4px",
//           top: 0, zIndex: 1,
//           background: "rgba(15,76,92,0.07)",
//           borderRadius: "13px",
//         }}
//       />
//       {/* Glass card */}
//        <div
//         className="relative space-y-3 p-5 transition-all duration-300"
//         style={{
//           zIndex: 2,
//           background: hovered
//             ? "radial-gradient(ellipse at 60% 0%, rgba(56,189,248,0.18) 0%, rgba(255,255,255,0.82) 60%)"
//             : "rgba(255,255,255,0.72)",
//           backdropFilter: "blur(12px)",
//           WebkitBackdropFilter: "blur(12px)",
//           border: hovered
//             ? "0.5px solid rgba(56,189,248,0.45)"
//             : "0.5px solid rgba(255,255,255,0.6)",
//           borderRadius: "14px",
//           boxShadow: hovered
//             ? "0 4px 24px rgba(56,189,248,0.18), 0 1px 6px rgba(56,189,248,0.12), inset 0 1px 0 rgba(255,255,255,0.8)"
//             : "0 2px 16px rgba(15,76,92,0.08), 0 1px 4px rgba(15,76,92,0.06)",
//         }}
//       >
    

//         <div
//           className="w-9 h-9 rounded-xl flex items-center justify-center"
//           style={{ backgroundColor: iconBg }}
//         >
//           <Icon size={18} style={{ color: iconColor }} />
//         </div>
//         <div>
//           <p className="text-xs text-muted-foreground mb-1">{title}</p>
//           <p className="text-2xl font-semibold text-foreground">{value}</p>
//           <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
//         </div>
//       </div>
//     </div>
//   )
// }

// function ActivityItem({
//   title,
//   description,
//   time,
// }: {
//   title: string
//   description: string
//   time: string
// }) {
//   return (
//     <div className="flex items-start gap-4 py-3 border-b border-border last:border-0">
//       <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
//       <div className="flex-1 min-w-0">
//         <p className="text-sm font-medium text-foreground">{title}</p>
//         <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
//       </div>
//       <p className="text-xs text-muted-foreground shrink-0">{time}</p>
//     </div>
//   )
// }

// function getGreeting() {
//   const hour = new Date().getHours()
//   if (hour < 12) return "Good morning"
//   if (hour < 17) return "Good afternoon"
//   return "Good evening"
// }

// export default function DashboardPage() {
//   const [stats, setStats] = useState<Stats | null>(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     async function fetchStats() {
//       try {
//         const res = await fetch("/api/stats")
//         if (!res.ok) return
//         const data = await res.json() as Stats
//         setStats(data)
//       } catch {
//         // Silently fail
//       } finally {
//         setLoading(false)
//       }
//     }
//     void fetchStats()
//   }, [])

//   return (
//     <div className="space-y-6">

//       {/* Page header */}
//       <div>
//         <h2 className="text-2xl font-bold text-foreground">{getGreeting()}</h2>
//         <p className="text-sm text-muted-foreground mt-1">
//           Here is what is happening at your school today
//         </p>
//       </div>

//       {/* Stats grid */}
//       {loading ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           {[1, 2, 3, 4].map((i) => (
//             <div key={i} className="bg-card rounded-xl border border-border p-5 animate-pulse">
//               <div className="h-9 w-9 bg-muted rounded-xl mb-3" />
//               <div className="h-4 bg-muted rounded w-24 mb-3" />
//               <div className="h-7 bg-muted rounded w-16 mb-2" />
//               <div className="h-3 bg-muted rounded w-32" />
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-3">
//           <StatCard
//             title="Total students"
//             value={(stats?.totalStudents ?? 0).toString()}
//             description="Active enrolled students"
//             icon={Users}
//             iconBg="#e1f5ee"
//             iconColor="#0f6e56"
//           />
//           <StatCard
//             title="Total teachers"
//             value={(stats?.totalTeachers ?? 0).toString()}
//             description="Active teaching staff"
//             icon={GraduationCap}
//             iconBg="#e6f1fb"
//             iconColor="#185fa5"
//           />
//           <StatCard
//             title="Attendance today"
//             value={
//               !stats || stats.totalAttendanceRecords === 0
//                 ? "N/A"
//                 : `${stats.attendanceRate ?? 0}%`
//             }
//             description={
//               !stats || stats.totalAttendanceRecords === 0
//                 ? "No attendance recorded today"
//                 : `${stats.totalAttendanceRecords} records today`
//             }
//             icon={CalendarCheck}
//             iconBg="#eaf3de"
//             iconColor="#3b6d11"
//           />
//           <StatCard
//             title="Fees collected"
//             value={`$${(stats?.totalCollected ?? 0).toFixed(2)}`}
//             description={`$${(stats?.outstanding ?? 0).toFixed(2)} outstanding`}
//             icon={DollarSign}
//             iconBg="#faeeda"
//             iconColor="#854f0b"
//           />
//         </div>
//       )}

//       {/* Bottom grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

//         {/* Recent activity */}
//         <div className="bg-card rounded-lg border border-border p-6">
//           <h3 className="text-base font-semibold text-foreground mb-4">Recent activity</h3>
//           <div className="space-y-0">
//             {stats?.totalStudents === 0 && stats?.totalTeachers === 0 ? (
//               <ActivityItem
//                 title="System ready"
//                 description="Your school management system is set up and ready to use"
//                 time="Just now"
//               />
//             ) : (
//               <>
//                 {(stats?.totalStudents ?? 0) > 0 && (
//                   <ActivityItem
//                     title="Students enrolled"
//                     description={`${stats?.totalStudents} active students in the system`}
//                     time="Today"
//                   />
//                 )}
//                 {(stats?.totalTeachers ?? 0) > 0 && (
//                   <ActivityItem
//                     title="Teachers registered"
//                     description={`${stats?.totalTeachers} active teachers on staff`}
//                     time="Today"
//                   />
//                 )}
//                 {(stats?.totalBilled ?? 0) > 0 && (
//                   <ActivityItem
//                     title="Invoices created"
//                     description={`$${(stats?.totalBilled ?? 0).toFixed(2)} total billed to students`}
//                     time="Today"
//                   />
//                 )}
//               </>
//             )}
//           </div>
//         </div>

//         {/* Quick actions */}
//         <div className="bg-card rounded-lg border border-border p-6">
//           <h3 className="text-base font-semibold text-foreground mb-4">Quick actions</h3>
//           <div className="space-y-2">
//             {[
//               { href: "/students", icon: UserPlus, label: "Add a student", desc: "Enroll a new student" },
//               { href: "/teachers", icon: GraduationCap, label: "Add a teacher", desc: "Register a new teacher" },
//               { href: "/attendance", icon: CalendarCheck, label: "Record attendance", desc: "Mark today's attendance" },
//               { href: "/fees", icon: ClipboardList, label: "Create an invoice", desc: "Bill a student for fees" },
//             ].map(({ href, icon: Icon, label, desc }) => (
//               <Link
//                 key={href}
//                 href={href}
//                 className="flex items-center gap-3 p-3 rounded-md border border-border hover:bg-muted transition-colors"
//               >
//                 <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
//                   <Icon size={16} className="text-primary" />
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-foreground">{label}</p>
//                   <p className="text-xs text-muted-foreground">{desc}</p>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         </div>

//       </div>
//     </div>
//   )
// }



"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import {
  Users,
  GraduationCap,
  CalendarCheck,
  DollarSign,
  UserPlus,
  ClipboardList,
  Lock,
  Zap,
  TrendingUp,
  AlertCircle,
} from "lucide-react"
import { useTheme } from "@/components/providers/theme-provider"

interface Stats {
  totalStudents: number
  totalTeachers: number
  totalBilled: number
  totalCollected: number
  outstanding: number
  attendanceRate: number
  totalAttendanceRecords: number
}

interface Subscription {
  selectedFeatures: string[]
  status: string
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  iconBg,
  iconColor,
  locked,
  featureName,
  primaryColor,
  primaryText,
}: {
  title: string
  value: string
  description: string
  icon: React.ElementType
  iconBg: string
  iconColor: string
  locked?: boolean
  featureName?: string
  primaryColor: string
  primaryText: string
}) {
  const [hovered, setHovered] = useState(false)

  if (locked) {
    return (
      <div className="relative">
        <div
          className="absolute rounded-xl"
          style={{
            bottom: "-8px", left: "8px", right: "-8px",
            top: 0, zIndex: 0,
            background: "rgba(100,116,139,0.08)",
            borderRadius: "14px",
          }}
        />
        <div
          className="relative p-5 space-y-3"
          style={{
            zIndex: 2,
            background: "rgba(248,250,252,0.7)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "0.5px solid rgba(203,213,225,0.6)",
            borderRadius: "14px",
          }}
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-100">
            <Lock size={16} className="text-slate-400" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">{title}</p>
            <p className="text-2xl font-semibold text-muted-foreground/40">—</p>
            <p className="text-xs text-muted-foreground/60 mt-0.5">
              {featureName} not on your plan
            </p>
          </div>
          <Link
            href="/settings"
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg w-fit transition-opacity hover:opacity-80"
            style={{ backgroundColor: primaryColor, color: primaryText }}
          >
            <Zap size={11} />
            Upgrade to unlock
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="absolute rounded-xl"
        style={{
          bottom: "-8px", left: "8px", right: "-8px",
          top: 0, zIndex: 0,
          background: "rgba(15,76,92,0.10)",
          borderRadius: "14px",
        }}
      />
      <div
        className="absolute rounded-xl"
        style={{
          bottom: "-4px", left: "4px", right: "-4px",
          top: 0, zIndex: 1,
          background: "rgba(15,76,92,0.07)",
          borderRadius: "13px",
        }}
      />
      <div
        className="relative space-y-3 p-5 transition-all duration-300"
        style={{
          zIndex: 2,
          background: hovered
            ? "radial-gradient(ellipse at 60% 0%, rgba(56,189,248,0.18) 0%, rgba(255,255,255,0.82) 60%)"
            : "rgba(255,255,255,0.72)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: hovered
            ? "0.5px solid rgba(56,189,248,0.45)"
            : "0.5px solid rgba(255,255,255,0.6)",
          borderRadius: "14px",
          boxShadow: hovered
            ? "0 4px 24px rgba(56,189,248,0.18), 0 1px 6px rgba(56,189,248,0.12), inset 0 1px 0 rgba(255,255,255,0.8)"
            : "0 2px 16px rgba(15,76,92,0.08), 0 1px 4px rgba(15,76,92,0.06)",
        }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: iconBg }}
        >
          <Icon size={18} style={{ color: iconColor }} />
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">{title}</p>
          <p className="text-2xl font-semibold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
      </div>
    </div>
  )
}

function ActivityItem({
  title,
  description,
  time,
}: {
  title: string
  description: string
  time: string
}) {
  return (
    <div className="flex items-start gap-4 py-3 border-b border-border last:border-0">
      <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <p className="text-xs text-muted-foreground shrink-0">{time}</p>
    </div>
  )
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

export default function DashboardPage() {
  const { theme } = useTheme()
  const [stats, setStats] = useState<Stats | null>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, subRes] = await Promise.all([
          fetch("/api/stats"),
          fetch("/api/subscription"),
        ])
        if (statsRes.ok) {
          const data = await statsRes.json() as Stats
          setStats(data)
        }
        if (subRes.ok) {
          const data = await subRes.json() as { subscription: Subscription }
          setSubscription(data.subscription)
        }
      } catch {
        // Silently fail
      } finally {
        setLoading(false)
      }
    }
    void fetchData()
  }, [])

  const features = subscription?.selectedFeatures ?? []
  const hasAttendance = features.includes("attendance")
  const hasFees = features.includes("fees_billing")

  // Quick actions filtered by feature
  const quickActions = [
    { href: "/students", icon: UserPlus, label: "Add a student", desc: "Enroll a new student", feature: null },
    { href: "/teachers", icon: GraduationCap, label: "Add a teacher", desc: "Register a new teacher", feature: "teacher_management" },
    { href: "/attendance", icon: CalendarCheck, label: "Record attendance", desc: "Mark today's attendance", feature: "attendance" },
    { href: "/fees", icon: ClipboardList, label: "Create an invoice", desc: "Bill a student for fees", feature: "fees_billing" },
    { href: "/exams", icon: TrendingUp, label: "Add exam results", desc: "Record student results", feature: "exams_grading" },
  ].filter((a) => !a.feature || features.includes(a.feature))

  return (
    <div className="space-y-6">

      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{getGreeting()} 👋</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Here is what is happening at your school today
          </p>
        </div>

        {/* Subscription status badge */}
        {subscription && (
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{
              backgroundColor: `${theme.primaryColor}15`,
              color: theme.primaryColor,
              border: `1px solid ${theme.primaryColor}30`,
            }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: theme.primaryColor }}
            />
            {subscription.status === "ACTIVE" ? "Active plan" : "Trial plan"}
            · {features.length} features
          </div>
        )}
      </div>

      {/* Stats grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-card rounded-xl border border-border p-5 animate-pulse">
              <div className="h-9 w-9 bg-muted rounded-xl mb-3" />
              <div className="h-4 bg-muted rounded w-24 mb-3" />
              <div className="h-7 bg-muted rounded w-16 mb-2" />
              <div className="h-3 bg-muted rounded w-32" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-3">
          <StatCard
            title="Total students"
            value={(stats?.totalStudents ?? 0).toString()}
            description="Active enrolled students"
            icon={Users}
            iconBg="#e1f5ee"
            iconColor="#0f6e56"
            primaryColor={theme.primaryColor}
            primaryText={theme.primaryText}
          />
          <StatCard
            title="Total teachers"
            value={(stats?.totalTeachers ?? 0).toString()}
            description="Active teaching staff"
            icon={GraduationCap}
            iconBg="#e6f1fb"
            iconColor="#185fa5"
            primaryColor={theme.primaryColor}
            primaryText={theme.primaryText}
          />
          <StatCard
            title="Attendance today"
            value={
              !hasAttendance
                ? "—"
                : !stats || stats.totalAttendanceRecords === 0
                  ? "N/A"
                  : `${stats.attendanceRate ?? 0}%`
            }
            description={
              hasAttendance
                ? stats?.totalAttendanceRecords === 0
                  ? "No attendance recorded today"
                  : `${stats?.totalAttendanceRecords} records today`
                : "Attendance not on your plan"
            }
            icon={CalendarCheck}
            iconBg="#eaf3de"
            iconColor="#3b6d11"
            locked={!hasAttendance}
            featureName="Attendance"
            primaryColor={theme.primaryColor}
            primaryText={theme.primaryText}
          />
          <StatCard
            title="Fees collected"
            value={
              hasFees
                ? `$${(stats?.totalCollected ?? 0).toFixed(2)}`
                : "—"
            }
            description={
              hasFees
                ? `$${(stats?.outstanding ?? 0).toFixed(2)} outstanding`
                : "Fees not on your plan"
            }
            icon={DollarSign}
            iconBg="#faeeda"
            iconColor="#854f0b"
            locked={!hasFees}
            featureName="Fees & Billing"
            primaryColor={theme.primaryColor}
            primaryText={theme.primaryText}
          />
        </div>
      )}

      {/* Bottom grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent activity */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-base font-semibold text-foreground mb-4">Recent activity</h3>
          <div className="space-y-0">
            {!stats || (stats.totalStudents === 0 && stats.totalTeachers === 0) ? (
              <ActivityItem
                title="System ready"
                description="Your school management system is set up and ready to use"
                time="Just now"
              />
            ) : (
              <>
                {(stats.totalStudents ?? 0) > 0 && (
                  <ActivityItem
                    title="Students enrolled"
                    description={`${stats.totalStudents} active students in the system`}
                    time="Today"
                  />
                )}
                {(stats.totalTeachers ?? 0) > 0 && (
                  <ActivityItem
                    title="Teachers registered"
                    description={`${stats.totalTeachers} active teachers on staff`}
                    time="Today"
                  />
                )}
                {hasFees && (stats.totalBilled ?? 0) > 0 && (
                  <ActivityItem
                    title="Invoices created"
                    description={`$${stats.totalBilled.toFixed(2)} total billed to students`}
                    time="Today"
                  />
                )}
              </>
            )}
          </div>

          {/* Upgrade nudge if features missing */}
          {features.length < 4 && (
            <div
              className="mt-4 flex items-center gap-3 p-3 rounded-lg"
              style={{
                backgroundColor: `${theme.primaryColor}08`,
                border: `1px solid ${theme.primaryColor}20`,
              }}
            >
              <AlertCircle size={16} style={{ color: theme.primaryColor }} className="shrink-0" />
              <p className="text-xs text-muted-foreground flex-1">
                You are using {features.length} of 8 available features.
              </p>
              <Link
                href="/settings"
                className="text-xs font-semibold flex items-center gap-1 shrink-0"
                style={{ color: theme.primaryColor }}
              >
                <Zap size={11} />
                Upgrade
              </Link>
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-base font-semibold text-foreground mb-4">Quick actions</h3>
          <div className="space-y-2">
            {quickActions.map(({ href, icon: Icon, label, desc }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 p-3 rounded-md border border-border hover:bg-muted transition-colors"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${theme.primaryColor}15` }}
                >
                  <Icon size={16} style={{ color: theme.primaryColor }} />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}