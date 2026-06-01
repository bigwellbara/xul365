// // "use client"

// // import React, { useState, useRef, useEffect } from "react"
// // import Link from "next/link"
// // import { useRouter, usePathname } from "next/navigation"
// // import { signOut, useSession } from "@/lib/auth-client"
// // import { useTheme } from "@/components/providers/theme-provider"

// // import {
// //   LayoutDashboard,
// //   Users,
// //   GraduationCap,
// //   CheckCircle,
// //   DollarSign,
// //   Settings,
// //   LogOut,
// //   School,
// //   BookOpen,
// //   FileText,
// //   CalendarDays,
// //   Library,
// //   ChevronDown,
// //   ChevronRight,
// //   Search,
// //   Bell,
// //   Menu,
// //   User,
// //   Mail,
// // } from "lucide-react"

// // const navGroups = [
// //   {
// //     label: "Dashboard",
// //     href: "/dashboard",
// //     icon: LayoutDashboard,
// //     items: [],
// //   },
// //   {
// //     label: "Admissions",
// //     icon: GraduationCap,
// //     items: [
// //       { href: "/students", label: "Students", icon: GraduationCap },
// //       { href: "/teachers", label: "Teachers", icon: Users },
// //       { href: "/classes", label: "Classes", icon: School },
// //     ],
// //   },
// //   {
// //     label: "Academic",
// //     icon: BookOpen,
// //     items: [
// //       { href: "/subjects", label: "Subjects", icon: Library },
// //       { href: "/timetable", label: "Timetable", icon: CalendarDays },
// //       { href: "/attendance", label: "Attendance", icon: CheckCircle },
// //       { href: "/exams", label: "Exams", icon: BookOpen },
// //       { href: "/report-cards", label: "Report Cards", icon: FileText },
// //     ],
// //   },
// //   {
// //     label: "Finance",
// //     icon: DollarSign,
// //     items: [
// //       { href: "/fees", label: "Fees & Billing", icon: DollarSign },
// //     ],
// //   },
// //   {
// //     label: "System",
// //     icon: Settings,
// //     items: [
// //       { href: "/settings", label: "Settings", icon: Settings },
// //     ],
// //   },
// // ]

// // export default function AppLayout({
// //   children,
// // }: {
// //   children: React.ReactNode
// // }) {
// //   const { data: session } = useSession()
// //   const router = useRouter()
// //   const pathname = usePathname()
// //   const [openGroups, setOpenGroups] = useState<string[]>(["Admissions", "Academic"])
// //   const [sidebarOpen, setSidebarOpen] = useState(true)
// //   const [userDropdownOpen, setUserDropdownOpen] = useState(false)
// //   const dropdownRef = useRef<HTMLDivElement>(null)

// //   const userName = session?.user?.name ?? "Admin User"
// //   const userEmail = session?.user?.email ?? "admin@school.com"
// //   const userInitial = userName.charAt(0).toUpperCase()

// //   // Close dropdown when clicking outside
// //   useEffect(() => {
// //     function handleClickOutside(e: MouseEvent) {
// //       if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
// //         setUserDropdownOpen(false)
// //       }
// //     }
// //     document.addEventListener("mousedown", handleClickOutside)
// //     return () => document.removeEventListener("mousedown", handleClickOutside)
// //   }, [])

// //   async function handleSignOut() {
// //     try {
// //       await signOut()
// //     } finally {
// //       router.push("/login")
// //     }
// //   }

// //   function toggleGroup(label: string) {
// //     setOpenGroups((prev) =>
// //       prev.includes(label)
// //         ? prev.filter((g) => g !== label)
// //         : [...prev, label]
// //     )
// //   }

// //   function isGroupActive(items: { href: string }[]) {
// //     return items.some((item) => pathname.startsWith(item.href))
// //   }

// //   const segments = pathname.split("/").filter(Boolean)

// //   return (
// //   //  <div className="h-screen bg-[#eef1f6] flex overflow-hidden">
// // <div
// //   className="h-screen flex overflow-hidden"
// //   style={{ backgroundColor: theme.contentBg }}
// // >
// //       {/* ===== SIDEBAR ===== */}
// //       {/* <aside
// //   className={`${
// //     sidebarOpen ? "w-[260px]" : "w-[80px]"
// //   } transition-all duration-300 bg-white border-r border-slate-200 flex flex-col shrink-0 z-40 h-screen overflow-hidden`}
// // > */}

// // <aside
// //   className={`${
// //     sidebarOpen ? "w-[260px]" : "w-[80px]"
// //   } transition-all duration-300 flex flex-col shrink-0 z-40 h-screen overflow-hidden border-r`}
// //   style={{
// //     backgroundColor: theme.sidebarBg,
// //     borderColor: `${theme.sidebarText}20`,
// //   }}
// // >
// //         {/* Logo */}
// //         {/* <div className="h-[70px] flex items-center px-5 shrink-0 border-b border-slate-100">
// //           <div className="w-10 h-10 rounded-xl bg-[#0f4c5c] flex items-center justify-center text-white font-bold shadow-md shrink-0">
// //             X
// //           </div>
// //           {sidebarOpen && (
// //             <h1 className="ml-3 text-xl font-bold text-slate-800">Xul365</h1>
// //           )}
// //         </div> */}

// //         <div
// //   className="h-[70px] flex items-center px-5 shrink-0 border-b"
// //   style={{ borderColor: `${theme.sidebarText}15` }}
// // >
// //   <div
// //     className="w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-md shrink-0"
// //     style={{
// //       backgroundColor: theme.primaryColor,
// //       color: theme.primaryText,
// //     }}
// //   >
// //     X
// //   </div>
// //   {sidebarOpen && (
// //     <h1
// //       className="ml-3 text-xl font-bold"
// //       style={{ color: theme.sidebarText }}
// //     >
// //       Xul365
// //     </h1>
// //   )}
// // </div>

// //         {/* Nav */}
// //         <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
// //           {navGroups.map((group) => {
// //             if (group.href) {
// //               const active = pathname === group.href
// //               const Icon = group.icon
// //               return (
// //                 // <Link
// //                 //   key={group.href}
// //                 //   href={group.href}
// //                 //   className={`flex items-center h-[46px] px-3 rounded-xl transition-all duration-200 ${
// //                 //     active
// //                 //       ? "bg-[#0f4c5c] text-white shadow-md"
// //                 //       : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
// //                 //   }`}
// //                 // >
// //                 //   <Icon size={20} className="shrink-0" />
// //                 //   {sidebarOpen && (
// //                 //     <span className="ml-3 text-sm font-medium">{group.label}</span>
// //                 //   )}
// //                 // </Link>

// //                 <Link
// //   key={group.href}
// //   href={group.href}
// //   className="flex items-center h-[46px] px-3 rounded-xl transition-all duration-200"
// //   style={{
// //     backgroundColor: active ? theme.sidebarActiveBg : "transparent",
// //     color: active ? theme.sidebarActiveText : theme.sidebarText,
// //   }}
// // >
// //   <Icon size={20} className="shrink-0" />
// //   {sidebarOpen && (
// //     <span className="ml-3 text-sm font-medium">{group.label}</span>
// //   )}
// // </Link>

// //               )
// //             }

// //             const groupActive = isGroupActive(group.items)
// //             const isOpen = openGroups.includes(group.label)
// //             const Icon = group.icon

// //             return (
// //               <div key={group.label}>
// //                 {/* <button
// //                   type="button"
// //                   onClick={() => toggleGroup(group.label)}
// //                   className={`w-full flex items-center justify-between h-[46px] px-3 rounded-xl transition-all duration-200 ${
// //                     groupActive
// //                       ? "text-[#0f4c5c] bg-[#0f4c5c]/10"
// //                       : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
// //                   }`}
// //                 > */}

// //                 <button
// //   type="button"
// //   onClick={() => toggleGroup(group.label)}
// //   className="w-full flex items-center justify-between h-[46px] px-3 rounded-xl transition-all duration-200"
// //   style={{
// //     backgroundColor: groupActive ? `${theme.sidebarActiveBg}20` : "transparent",
// //     color: groupActive ? theme.sidebarActiveBg : theme.sidebarText,
// //   }}
// // >
// //                   <div className="flex items-center">
// //                     <Icon size={20} className="shrink-0" />
// //                     {sidebarOpen && (
// //                       <span className="ml-3 text-sm font-medium">{group.label}</span>
// //                     )}
// //                   </div>
// //                   {sidebarOpen && (
// //                     isOpen
// //                       ? <ChevronDown size={15} />
// //                       : <ChevronRight size={15} />
// //                   )}
// //                 </button>

// //                 {isOpen && sidebarOpen && (
// //                   <div className="mt-1 ml-3 pl-4 border-l-2 border-slate-100 space-y-0.5">
// //                     {group.items.map((item) => {
// //                       const active = pathname.startsWith(item.href)
// //                       const ItemIcon = item.icon
// //                       return (
// //                         // <Link
// //                         //   key={item.href}
// //                         //   href={item.href}
// //                         //   className={`flex items-center h-[40px] px-3 rounded-xl text-sm transition-all duration-200 ${
// //                         //     active
// //                         //       ? "bg-[#0f4c5c] text-white shadow-sm"
// //                         //       : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
// //                         //   }`}
// //                         // >

// //                         <Link
// //   key={item.href}
// //   href={item.href}
// //   className="flex items-center h-[40px] px-3 rounded-xl text-sm transition-all duration-200"
// //   style={{
// //     backgroundColor: active ? theme.sidebarActiveBg : "transparent",
// //     color: active ? theme.sidebarActiveText : theme.sidebarText,
// //   }}
// // >
// //                           <ItemIcon size={16} className="shrink-0" />
// //                           <span className="ml-3">{item.label}</span>
// //                         </Link>
// //                       )
// //                     })}
// //                   </div>
// //                 )}
// //               </div>
// //             )
// //           })}
// //         </nav>
// //       </aside>

// //       {/* ===== MAIN ===== */}
// //      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

// //         {/* ===== TOP BAR ===== */}
// //        {/* <header className="sticky top-3 mx-3 z-50 h-[70px] bg-gradient-to-r from-[#0f4c5c] via-[#155e75] to-[#0e7490] flex items-center justify-between px-6 shrink-0 shadow-lg rounded-2xl"> */}
// // <header
// //   className="sticky top-3 mx-3 z-50 h-[70px] flex items-center justify-between px-6 shrink-0 shadow-lg rounded-2xl"
// //   style={{ backgroundColor: theme.navbarBg }}
// // >

// //           {/* Left */}
// //           <div className="flex items-center gap-4">
// //             <button
// //               type="button"
// //               onClick={() => setSidebarOpen((prev) => !prev)}
// //              className="w-9 h-9 rounded-xl transition flex items-center justify-center" style={{ backgroundColor: `${theme.navbarText}20`,color: theme.navbarText,}}
// //             >
// //               <Menu size={20} />
// //             </button>

// //             {/* Breadcrumb */}
// //             <div className="hidden md:flex items-center text-sm text-white/80">
// //               <Link href="/dashboard" className="hover: transition" style={{ color: `${theme.navbarText}80` }}>
// //                 Application
// //               </Link>
// //               {segments.map((seg, i) => {
// //                 const path = "/" + segments.slice(0, i + 1).join("/")
// //                 const isLast = i === segments.length - 1
// //                 return (
// //                   <React.Fragment key={path}>
// //                     <ChevronRight size={14} className="mx-2 text-white/40" />
// //                     {isLast ? (
// //                       <span className=" font-medium capitalize" style={{ color: `${theme.navbarText}80` }}>
// //                         {seg.replace(/-/g, " ")}
// //                       </span>
// //                     ) : (
// //                       <Link href={path} className="hover: capitalize transition" style={{ color: `${theme.navbarText}80` }}>
// //                         {seg.replace(/-/g, " ")}
// //                       </Link>
// //                     )}
// //                   </React.Fragment>
// //                 )
// //               })}
// //             </div>
// //           </div>

// //           {/* Right */}
// //           <div className="flex items-center gap-3">

// //             {/* Search */}
// //             <div className="hidden md:flex relative">
// //               <input
// //                 type="text"
// //                 placeholder="Search..."
// //                 className="w-[220px] h-[38px] rounded-full bg-white/10 border border-white/20 placeholder:text-white/50 px-4 pr-10 text-sm outline-none focus:ring-2 focus:ring-white/30 transition"
// //               style={{
// //   backgroundColor: `${theme.navbarText}15`,
// //   borderColor: `${theme.navbarText}20`,
// //   color: theme.navbarText,
// // }}
// //               />
// //               <Search size={16} className="absolute right-3 top-2.5 text-white/60 " />
// //             </div>

// //             {/* Notifications */}
// //             <button
// //               type="button"
// //               className="relative w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center justify-center"
// //                   style={{
// //   backgroundColor: `${theme.navbarText}15`,
// //   color: theme.navbarText,
// // }}
// //                 >
// //               <Bell size={18} />
// //               <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-400" />
// //             </button>

// //             {/* User dropdown */}
// //             <div className="relative" ref={dropdownRef}>
// //               <button
// //                 type="button"
// //                 onClick={() => setUserDropdownOpen((prev) => !prev)}
// //                 className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition"
// //               >
// //                 <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm"  style={{ color: theme.navbarText }}>
// //                   {userInitial}
// //                 </div>
// //                 <div className="hidden sm:block text-left">
// //                   <p className="text-sm font-semibold  leading-none" style={{ color: theme.navbarText }}>
// //                     {userName}
// //                   </p>
// //                   <p className="text-xs text-white/60 mt-0.5">Administrator</p>
// //                 </div>
// //                 <ChevronDown
// //                   size={14}
// //                   className={`text-white/70 transition-transform ${
// //                     userDropdownOpen ? "rotate-180" : ""
// //                   }`}
// //                 />
// //               </button>

// //               {/* Dropdown menu */}
// //               {userDropdownOpen && (
// //                 <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">

// //                   {/* User info header */}
// //                   <div className="px-4 py-4 bg-slate-50 border-b border-slate-100">
// //                     <div className="flex items-center gap-3">
// //                       <div className="w-12 h-12 rounded-full bg-[#0f4c5c] flex items-center justify-center font-bold text-lg" style={{ color: theme.navbarText }}>
// //                         {userInitial}
// //                       </div>
// //                       <div className="min-w-0">
// //                         <p className="text-sm font-semibold text-slate-800 truncate" style={{ color: theme.navbarText }}>
// //                           {userName}
// //                         </p>
// //                         <p className="text-xs text-slate-500 truncate" style={{ color: `${theme.navbarText}80` }}>{userEmail}</p>
// //                         <span className="inline-block mt-1 px-2 py-0.5 bg-[#0f4c5c]/10 text-[#0f4c5c] rounded-full text-xs font-medium" style={{ color: theme.navbarText }}>
// //                           Administrator
// //                         </span>
// //                       </div>
// //                     </div>
// //                   </div>

// //                   {/* Menu items */}
// //                   <div className="py-2">
// //                     <Link
// //                       href="/settings"
// //                       onClick={() => setUserDropdownOpen(false)}
// //                       className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
// //                     >
// //                       <User size={16} className="text-slate-400" />
// //                       Profile settings
// //                     </Link>
// //                     <Link
// //                       href="/settings"
// //                       onClick={() => setUserDropdownOpen(false)}
// //                       className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
// //                     >
// //                       <Mail size={16} className="text-slate-400" />
// //                       {userEmail}
// //                     </Link>
// //                   </div>

// //                   {/* Sign out */}
// //                   <div className="py-2 border-t border-slate-100">
// //                     <button
// //                       type="button"
// //                       onClick={handleSignOut}
// //                       className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
// //                     >
// //                       <LogOut size={16} />
// //                       Sign out
// //                     </button>
// //                   </div>

// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //         </header>

// //         {/* ===== PAGE CONTENT ===== */}
// //     <main className="flex-1 overflow-y-auto p-6 pt-4">

// //           {/* Page title */}
// //           <h2 className="text-xl font-semibold text-slate-700 capitalize mb-4">
// //             {segments[segments.length - 1]?.replace(/-/g, " ") || "Dashboard"}
// //           </h2>

// //           {children}
// //         </main>

// //       </div>
// //     </div>
// //   )
// // }


// // update to use theme system

// "use client"

// import React, { useState, useRef, useEffect } from "react"
// import Link from "next/link"
// import { useRouter, usePathname } from "next/navigation"
// import { signOut, useSession } from "@/lib/auth-client"
// import { useTheme } from "@/components/providers/theme-provider"
// import { AlertTriangle, ClipboardList, UserPlus, BarChart2 } from "lucide-react"
// import {
//   LayoutDashboard,
//   Users,
//   GraduationCap,
//   CheckCircle,
//   DollarSign,
//   Settings,
//   LogOut,
//   School,
//   BookOpen,
//   FileText,
//   CalendarDays,
//   Library,
//   ChevronDown,
//   ChevronRight,
//   Search,
//   Bell,
//   Menu,
//   User,
//   Mail,
// } from "lucide-react"

// // const navGroups = [
// //   {
// //     label: "Dashboard",
// //     href: "/dashboard",
// //     icon: LayoutDashboard,
// //     items: [],
// //   },
// //   {
// //     label: "Admissions",
// //     icon: GraduationCap,
// //     items: [
// //       { href: "/students", label: "Students", icon: GraduationCap },
// //       { href: "/teachers", label: "Teachers", icon: Users },
// //       { href: "/classes", label: "Classes", icon: School },
// //     ],
// //   },
// //   {
// //     label: "Academic",
// //     icon: BookOpen,
// //     items: [
// //       { href: "/subjects", label: "Subjects", icon: Library },
// //       { href: "/timetable", label: "Timetable", icon: CalendarDays },
// //       { href: "/attendance", label: "Attendance", icon: CheckCircle },
// //       { href: "/exams", label: "Exams", icon: BookOpen },
// //       { href: "/report-cards", label: "Report Cards", icon: FileText },
// //     ],
// //   },
// //   {
// //     label: "Finance",
// //     icon: DollarSign,
// //     items: [
// //       { href: "/fees", label: "Fees & Billing", icon: DollarSign },
// //     ],
// //   },
// //   {
// //     label: "System",
// //     icon: Settings,
// //     items: [
// //       { href: "/settings", label: "Settings", icon: Settings },
// //     ],
// //   },
// // ]

// // ---- FEATURE -> NAV MAPPING ----
// const ALL_NAV_GROUPS = [
//   {
//     label: "Dashboard",
//     href: "/dashboard",
//     icon: LayoutDashboard,
//     items: [],
//     feature: null, // always visible
//   },
//   {
//     label: "Admissions",
//     icon: GraduationCap,
//     feature: "student_management",
//     items: [
//       { href: "/students", label: "Students", icon: GraduationCap },
//       { href: "/teachers", label: "Teachers", icon: Users },
//       { href: "/classes", label: "Classes", icon: School },
//     ],
//   },
//   {
//     label: "Academic",
//     icon: BookOpen,
//     feature: "attendance",
//     items: [
//       { href: "/subjects", label: "Subjects", icon: Library },
//       { href: "/timetable", label: "Timetable", icon: CalendarDays, feature: "timetable" },
//       { href: "/attendance", label: "Attendance", icon: CheckCircle, feature: "attendance" },
//       { href: "/exams", label: "Exams", icon: BookOpen, feature: "exams_grading" },
//       { href: "/report-cards", label: "Report Cards", icon: FileText, feature: "exams_grading" },
//     ],
//   },
//   {
//     label: "Finance",
//     icon: DollarSign,
//     feature: "fees_billing",
//     items: [
//       { href: "/fees", label: "Fees & Billing", icon: DollarSign },
//     ],
//   },
//   {
//     label: "System",
//     icon: Settings,
//     feature: null, // always visible
//     items: [
//       { href: "/settings", label: "Settings", icon: Settings },
//     ],
//   },
// ]


// const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])

// useEffect(() => {
//   fetch("/api/subscription")
//     .then((r) => r.json())
//     .then((data) => {
//       if (data.subscription?.selectedFeatures) {
//         setSelectedFeatures(data.subscription.selectedFeatures as string[])
//       }
//     })
//     .catch(() => {})
// }, [])

// // Filter nav based on features
// const navGroups = ALL_NAV_GROUPS
//   .filter((group) => {
//     if (!group.feature) return true // always show
//     return selectedFeatures.includes(group.feature)
//   })
//   .map((group) => ({
//     ...group,
//     items: group.items.filter((item: any) => {
//       if (!item.feature) return true
//       return selectedFeatures.includes(item.feature)
//     }),
//   }))


// export default function AppLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   const { data: session } = useSession()
//   const { theme } = useTheme()
//   const router = useRouter()
//   const pathname = usePathname()
//   const [openGroups, setOpenGroups] = useState<string[]>(["Admissions", "Academic"])
//   const [sidebarOpen, setSidebarOpen] = useState(true)
//   const [userDropdownOpen, setUserDropdownOpen] = useState(false)
//   const dropdownRef = useRef<HTMLDivElement>(null)

//   const [notifOpen, setNotifOpen] = useState(false)

//   const userName = session?.user?.name ?? "Admin User"
//   const userEmail = session?.user?.email ?? "admin@school.com"
//   const userInitial = userName.charAt(0).toUpperCase()

//   useEffect(() => {
//     function handleClickOutside(e: MouseEvent) {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
//         setUserDropdownOpen(false)
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside)
//     return () => document.removeEventListener("mousedown", handleClickOutside)
//   }, [])

//   async function handleSignOut() {
//     try {
//       await signOut()
//     } finally {
//       router.push("/login")
//     }
//   }

//   function toggleGroup(label: string) {
//     setOpenGroups((prev) =>
//       prev.includes(label)
//         ? prev.filter((g) => g !== label)
//         : [...prev, label]
//     )
//   }

//   function isGroupActive(items: { href: string }[]) {
//     return items.some((item) => pathname.startsWith(item.href))
//   }

//   const segments = pathname.split("/").filter(Boolean)

//   return (
//     <div
//       className="h-screen flex overflow-hidden"
//       style={{ backgroundColor: theme.contentBg }}
//     >

//       {/* ===== SIDEBAR ===== */}
//       <aside
//         className={`${
//           sidebarOpen ? "w-[260px]" : "w-[80px]"
//         } transition-all duration-300 flex flex-col shrink-0 z-40 h-screen overflow-hidden border-r`}
//         style={{
//           backgroundColor: theme.sidebarBg,
//           borderColor: `${theme.sidebarText}20`,
//         }}
//       >
//         {/* Logo */}
//         <div
//           className="h-[70px] flex items-center px-5 shrink-0 border-b"
//           style={{ borderColor: `${theme.sidebarText}15` }}
//         >
//           <div
//             className="w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-md shrink-0 text-sm"
//             style={{backgroundColor: theme.primaryColor,color: theme.primaryText,}}
//           >
//             X
//           </div>
//           {sidebarOpen && (
//             <h1
//               className="ml-3 text-xl font-bold"
//               style={{ color: theme.sidebarText }}
//             >
//               Xul365
//             </h1>
//           )}
//         </div>

//         {/* Nav */}
//         <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
//           {navGroups.map((group) => {
//             if (group.href) {
//               const active = pathname === group.href
//               const Icon = group.icon
//               return (
//                 <Link
//                   key={group.href}
//                   href={group.href}
//                   className="flex items-center h-[46px] px-3 rounded-xl transition-all duration-200"
//                   style={{
//                     backgroundColor: active ? theme.sidebarActiveBg : "transparent",
//                     color: active ? theme.sidebarActiveText : theme.sidebarText,
//                   }}
//                 >
//                   <Icon size={20} className="shrink-0" />
//                   {sidebarOpen && (
//                     <span className="ml-3 text-sm font-medium">{group.label}</span>
//                   )}
//                 </Link>
//               )
//             }

//             const groupActive = isGroupActive(group.items)
//             const isOpen = openGroups.includes(group.label)
//             const Icon = group.icon

//             return (
//               <div key={group.label}>
//                 <button
//                   type="button"
//                   onClick={() => toggleGroup(group.label)}
//                   className="w-full flex items-center justify-between h-[46px] px-3 rounded-xl transition-all duration-200"
//                   style={{
//                     backgroundColor: groupActive
//                       ? `${theme.sidebarActiveBg}20`
//                       : "transparent",
//                     color: groupActive ? theme.sidebarActiveBg : theme.sidebarText,
//                   }}
//                 >
//                   <div className="flex items-center">
//                     <Icon size={20} className="shrink-0" />
//                     {sidebarOpen && (
//                       <span className="ml-3 text-sm font-medium">{group.label}</span>
//                     )}
//                   </div>
//                   {sidebarOpen && (
//                     isOpen
//                       ? <ChevronDown size={15} />
//                       : <ChevronRight size={15} />
//                   )}
//                 </button>

//                 {isOpen && sidebarOpen && (
//                   <div
//                     className="mt-1 ml-3 pl-4 border-l-2 space-y-0.5"
//                     style={{ borderColor: `${theme.sidebarText}20` }}
//                   >
//                     {group.items.map((item) => {
//                       const active = pathname.startsWith(item.href)
//                       const ItemIcon = item.icon
//                       return (
//                         <Link
//                           key={item.href}
//                           href={item.href}
//                           className="flex items-center h-[40px] px-3 rounded-xl text-sm transition-all duration-200"
//                           style={{
//                             backgroundColor: active ? theme.sidebarActiveBg : "transparent",
//                             color: active ? theme.sidebarActiveText : theme.sidebarText,
//                           }}
//                         >
//                           <ItemIcon size={16} className="shrink-0" />
//                           <span className="ml-3">{item.label}</span>
//                         </Link>
//                       )
//                     })}
//                   </div>
//                 )}
//               </div>
//             )
//           })}
//         </nav>
//       </aside>

//       {/* ===== MAIN ===== */}
//       <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

//         {/* ===== TOP BAR ===== */}
//         <header
//           className="sticky top-3 mx-3 z-50 h-[70px] flex items-center justify-between px-6 shrink-0 shadow-lg rounded-2xl"
//           style={{ backgroundColor: theme.navbarBg }}
//         >
//           {/* Left */}
//           <div className="flex items-center gap-4">
//             <button
//               type="button"
//               onClick={() => setSidebarOpen((prev) => !prev)}
//               className="w-9 h-9 rounded-xl transition flex items-center justify-center"
//               style={{
//                 backgroundColor: `${theme.navbarText}20`,
//                 color: theme.navbarText,
//               }}
//             >
//               <Menu size={20} />
//             </button>

//             {/* Breadcrumb */}
//             <div
//               className="hidden md:flex items-center text-sm"
//               style={{ color: `${theme.navbarText}80` }}
//             >
//               <Link
//                 href="/dashboard"
//                 className="hover:opacity-100 transition-opacity"
//                 style={{ color: `${theme.navbarText}80` }}
//               >
//                 Application
//               </Link>
//               {segments.map((seg, i) => {
//                 const path = "/" + segments.slice(0, i + 1).join("/")
//                 const isLast = i === segments.length - 1
//                 return (
//                   <React.Fragment key={path}>
//                     <ChevronRight size={14} className="mx-2 opacity-40" />
//                     {isLast ? (
//                       <span
//                         className="font-medium capitalize"
//                         style={{ color: theme.navbarText }}
//                       >
//                         {seg.replace(/-/g, " ")}
//                       </span>
//                     ) : (
//                       <Link
//                         href={path}
//                         className="capitalize hover:opacity-100 transition-opacity"
//                         style={{ color: `${theme.navbarText}80` }}
//                       >
//                         {seg.replace(/-/g, " ")}
//                       </Link>
//                     )}
//                   </React.Fragment>
//                 )
//               })}
//             </div>
//           </div>

//           {/* Right */}
//           <div className="flex items-center gap-3">

//             {/* Search */}
//             {/* <div className="hidden md:flex relative">
//               <input
//                 type="text"
//                 placeholder="Search..."
//                 className="w-[220px] h-[38px] rounded-full px-4 pr-10 text-sm outline-none transition"
//                 style={{
//                   backgroundColor: `${theme.navbarText}15`,
//                   borderColor: `${theme.navbarText}20`,
//                   color: theme.navbarText,
//                 }}
//               />
//               <Search
//                 size={16}
//                 className="absolute right-3 top-2.5"
//                 style={{ color: `${theme.navbarText}60` }}
//               />
//             </div> */}

//             {/* Notifications */}
//             {/* <button
//               type="button"
//               className="relative w-9 h-9 rounded-full transition flex items-center justify-center"
//               style={{
//                 backgroundColor: `${theme.navbarText}15`,
//                 color: theme.navbarText,
//               }}
//             >
//               <Bell size={18} />
//               <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-400" />
//             </button> */}

           

// {/* Notifications */}
// <div className="relative">
//   <button
//     type="button"
//     onClick={() => setNotifOpen((v) => !v)}
//     className="relative w-9 h-9 rounded-full transition flex items-center justify-center"
//     style={{
//       backgroundColor: `${theme.navbarText}15`,
//       color: theme.navbarText,
//     }}
//   >
//     <Bell size={18} />
//     <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-400" />
//   </button>

//   {notifOpen && (
//     <>
//       <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />

//       <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-border z-20 overflow-hidden">
//         {/* Header */}
//         <div className="flex items-center justify-between px-4 py-3 border-b border-border">
//           <span className="text-sm font-semibold text-foreground">Notifications</span>
//           <span className="text-xs text-primary cursor-pointer hover:underline">Mark all read</span>
//         </div>

//         {/* Items */}
//         <div className="divide-y divide-border max-h-80 overflow-y-auto">
//           {[
//             {
//               icon: AlertTriangle,
//               iconColor: "text-amber-500",
//               iconBg: "bg-amber-50",
//               title: "Subscription expiring soon",
//               desc: "Your plan expires in 7 days. Renew to avoid interruption.",
//               time: "Just now",
//               unread: true,
//             },
//             {
//               icon: ClipboardList,
//               iconColor: "text-blue-500",
//               iconBg: "bg-blue-50",
//               title: "Term exams starting",
//               desc: "End of term exams are scheduled to begin on June 2nd.",
//               time: "2h ago",
//               unread: true,
//             },
//             {
//               icon: DollarSign,
//               iconColor: "text-red-500",
//               iconBg: "bg-red-50",
//               title: "Fee collection reminder",
//               desc: "42 students have outstanding fee balances for this term.",
//               time: "Yesterday",
//               unread: true,
//             },
//             {
//               icon: UserPlus,
//               iconColor: "text-green-500",
//               iconBg: "bg-green-50",
//               title: "New student enrolled",
//               desc: "Tendai Moyo has been added to Form 3A.",
//               time: "2 days ago",
//               unread: false,
//             },
//             {
//               icon: BarChart2,
//               iconColor: "text-purple-500",
//               iconBg: "bg-purple-50",
//               title: "Term report cards ready",
//               desc: "Term 1 report cards are ready to be printed and distributed.",
//               time: "3 days ago",
//               unread: false,
//             },
//           ].map((n, i) => (
//             <div
//               key={i}
//               className={`flex gap-3 px-4 py-3 hover:bg-muted/50 cursor-pointer transition-colors ${
//                 n.unread ? "bg-primary/5" : ""
//               }`}
//             >
//               <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${n.iconBg}`}>
//                 <n.icon size={15} className={n.iconColor} />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-start justify-between gap-2">
//                   <p className={`text-sm ${n.unread ? "font-semibold" : "font-medium"} text-foreground`}>
//                     {n.title}
//                   </p>
//                   {n.unread && (
//                     <span className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
//                   )}
//                 </div>
//                 <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{n.desc}</p>
//                 <p className="text-xs text-muted-foreground/70 mt-1">{n.time}</p>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Footer */}
//         <div className="px-4 py-2.5 border-t border-border text-center">
//           <span className="text-xs text-primary cursor-pointer hover:underline">
//             View all notifications
//           </span>
//         </div>
//       </div>
//     </>
//   )}
// </div>



//             {/* User dropdown */}
//             <div className="relative" ref={dropdownRef}>
//               <button
//                 type="button"
//                 onClick={() => setUserDropdownOpen((prev) => !prev)}
//                 className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full transition"
//                 style={{ backgroundColor: `${theme.navbarText}15` }}
//               >
//                 <div
//                   className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
//                   style={{
//                     backgroundColor: `${theme.navbarText}25`,
//                     color: theme.navbarText,
//                   }}
//                 >
//                   {userInitial}
//                 </div>
//                 <div className="hidden sm:block text-left">
//                   <p
//                     className="text-sm font-semibold leading-none"
//                     style={{ color: theme.navbarText }}
//                   >
//                     {userName}
//                   </p>
//                   <p
//                     className="text-xs mt-0.5"
//                     style={{ color: `${theme.navbarText}70` }}
//                   >
//                     Administrator
//                   </p>
//                 </div>
//                 <ChevronDown
//                   size={14}
//                   className={`transition-transform ${userDropdownOpen ? "rotate-180" : ""}`}
//                   style={{ color: `${theme.navbarText}70` }}
//                 />
//               </button>

//               {/* Dropdown */}
//               {userDropdownOpen && (
//                 <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
//                   <div className="px-4 py-4 bg-slate-50 border-b border-slate-100">
//                     <div className="flex items-center gap-3">
//                       <div
//                         className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg"
//                         style={{
//                           backgroundColor: theme.primaryColor,
//                           color: theme.primaryText,
//                         }}
//                       >
//                         {userInitial}
//                       </div>
//                       <div className="min-w-0">
//                         <p className="text-sm font-semibold text-slate-800 truncate">
//                           {userName}
//                         </p>
//                         <p className="text-xs text-slate-500 truncate">{userEmail}</p>
//                         <span
//                           className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium"
//                           style={{
//                             backgroundColor: `${theme.primaryColor}15`,
//                             color: theme.primaryColor,
//                           }}
//                         >
//                           Administrator
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="py-2">
//                     <Link
//                       href="/settings"
//                       onClick={() => setUserDropdownOpen(false)}
//                       className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
//                     >
//                       <User size={16} className="text-slate-400" />
//                       Profile settings
//                     </Link>
//                     <div className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600">
//                       <Mail size={16} className="text-slate-400" />
//                       <span className="truncate">{userEmail}</span>
//                     </div>
//                   </div>

//                   <div className="py-2 border-t border-slate-100">
//                     <button
//                       type="button"
//                       onClick={handleSignOut}
//                       className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
//                     >
//                       <LogOut size={16} />
//                       Sign out
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </header>

//         {/* ===== PAGE CONTENT ===== */}
//         <main className="flex-1 overflow-y-auto p-6 pt-4">
//           <h2
//             className="text-xl font-semibold capitalize mb-4"
//             style={{ color: theme.sidebarText }}
//           >
//             {segments[segments.length - 1]?.replace(/-/g, " ") || "Dashboard"}
//           </h2>
//           {children}
//         </main>

//       </div>
//     </div>
//   )
// }



"use client"

import React, { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { signOut, useSession } from "@/lib/auth-client"
import { useTheme } from "@/components/providers/theme-provider"
import { AlertTriangle, ClipboardList, UserPlus, BarChart2 } from "lucide-react"
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
  ChevronRight,
  Bell,
  Menu,
  User,
  Mail,
} from "lucide-react"

// ---- FEATURE -> NAV MAPPING ----
const ALL_NAV_GROUPS = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    items: [] as any[],
    feature: null,
  },
  {
    label: "Admissions",
    icon: GraduationCap,
    href: undefined,
    feature: "student_management",
    items: [
      { href: "/students", label: "Students", icon: GraduationCap, feature: null },
      { href: "/teachers", label: "Teachers", icon: Users, feature: "teacher_management" },
      { href: "/classes", label: "Classes", icon: School, feature: null },
    ],
  },
  {
    label: "Academic",
    icon: BookOpen,
    href: undefined,
    feature: "attendance",
    items: [
      { href: "/subjects", label: "Subjects", icon: Library, feature: null },
      { href: "/timetable", label: "Timetable", icon: CalendarDays, feature: "timetable" },
      { href: "/attendance", label: "Attendance", icon: CheckCircle, feature: "attendance" },
      { href: "/exams", label: "Exams", icon: BookOpen, feature: "exams_grading" },
      { href: "/report-cards", label: "Report Cards", icon: FileText, feature: "exams_grading" },
    ],
  },
  {
    label: "Finance",
    icon: DollarSign,
    href: undefined,
    feature: "fees_billing",
    items: [
      { href: "/fees", label: "Fees & Billing", icon: DollarSign, feature: null },
    ],
  },
  {
    label: "System",
    icon: Settings,
    href: undefined,
    feature: null,
    items: [
      { href: "/settings", label: "Settings", icon: Settings, feature: null },
    ],
  },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const { theme } = useTheme()
  const router = useRouter()
  const pathname = usePathname()
  const [openGroups, setOpenGroups] = useState<string[]>(["Admissions", "Academic"])
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const dropdownRef = useRef<HTMLDivElement>(null)

  const userName = session?.user?.name ?? "Admin User"
  const userEmail = session?.user?.email ?? "admin@school.com"
  const userInitial = userName.charAt(0).toUpperCase()

  // Fetch subscription features
  useEffect(() => {
    fetch("/api/subscription")
      .then((r) => r.json())
      .then((data) => {
        if (data.subscription?.selectedFeatures) {
          setSelectedFeatures(data.subscription.selectedFeatures as string[])
        }
      })
      .catch(() => {})
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Filter nav based on selected features
  const navGroups = ALL_NAV_GROUPS
    .filter((group) => !group.feature || selectedFeatures.includes(group.feature))
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => !item.feature || selectedFeatures.includes(item.feature)),
    }))

  async function handleSignOut() {
    try {
      await signOut()
    } finally {
      router.push("/login")
    }
  }

  function toggleGroup(label: string) {
    setOpenGroups((prev) =>
      prev.includes(label) ? prev.filter((g) => g !== label) : [...prev, label]
    )
  }

  function isGroupActive(items: { href: string }[]) {
    return items.some((item) => pathname.startsWith(item.href))
  }

  const segments = pathname.split("/").filter(Boolean)

  return (
    <div className="h-screen flex overflow-hidden" style={{ backgroundColor: theme.contentBg }}>

      {/* ===== SIDEBAR ===== */}
      <aside
        className={`${sidebarOpen ? "w-[260px]" : "w-[80px]"} transition-all duration-300 flex flex-col shrink-0 z-40 h-screen overflow-hidden border-r`}
        style={{ backgroundColor: theme.sidebarBg, borderColor: `${theme.sidebarText}20` }}
      >
        {/* Logo */}
        <div className="h-[70px] flex items-center px-5 shrink-0 border-b" style={{ borderColor: `${theme.sidebarText}15` }}>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-md shrink-0 text-sm"
            style={{ backgroundColor: theme.primaryColor, color: theme.primaryText }}
          >
            X
          </div>
          {sidebarOpen && (
            <h1 className="ml-3 text-xl font-bold" style={{ color: theme.sidebarText }}>
              Xul365
            </h1>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navGroups.map((group) => {
            if (group.href) {
              const active = pathname === group.href
              const Icon = group.icon
              return (
                <Link
                  key={group.href}
                  href={group.href}
                  className="flex items-center h-[46px] px-3 rounded-xl transition-all duration-200"
                  style={{
                    backgroundColor: active ? theme.sidebarActiveBg : "transparent",
                    color: active ? theme.sidebarActiveText : theme.sidebarText,
                  }}
                >
                  <Icon size={20} className="shrink-0" />
                  {sidebarOpen && <span className="ml-3 text-sm font-medium">{group.label}</span>}
                </Link>
              )
            }

            const groupActive = isGroupActive(group.items)
            const isOpen = openGroups.includes(group.label)
            const Icon = group.icon

            return (
              <div key={group.label}>
                <button
                  type="button"
                  onClick={() => toggleGroup(group.label)}
                  className="w-full flex items-center justify-between h-[46px] px-3 rounded-xl transition-all duration-200"
                  style={{
                    backgroundColor: groupActive ? `${theme.sidebarActiveBg}20` : "transparent",
                    color: groupActive ? theme.sidebarActiveBg : theme.sidebarText,
                  }}
                >
                  <div className="flex items-center">
                    <Icon size={20} className="shrink-0" />
                    {sidebarOpen && <span className="ml-3 text-sm font-medium">{group.label}</span>}
                  </div>
                  {sidebarOpen && (isOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />)}
                </button>

                {isOpen && sidebarOpen && (
                  <div className="mt-1 ml-3 pl-4 border-l-2 space-y-0.5" style={{ borderColor: `${theme.sidebarText}20` }}>
                    {group.items.map((item) => {
                      const active = pathname.startsWith(item.href)
                      const ItemIcon = item.icon
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center h-[40px] px-3 rounded-xl text-sm transition-all duration-200"
                          style={{
                            backgroundColor: active ? theme.sidebarActiveBg : "transparent",
                            color: active ? theme.sidebarActiveText : theme.sidebarText,
                          }}
                        >
                          <ItemIcon size={16} className="shrink-0" />
                          <span className="ml-3">{item.label}</span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </aside>

      {/* ===== MAIN ===== */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* ===== TOP BAR ===== */}
        <header
          className="sticky top-3 mx-3 z-50 h-[70px] flex items-center justify-between px-6 shrink-0 shadow-lg rounded-2xl"
          style={{ backgroundColor: theme.navbarBg }}
        >
          {/* Left */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSidebarOpen((prev) => !prev)}
              className="w-9 h-9 rounded-xl transition flex items-center justify-center"
              style={{ backgroundColor: `${theme.navbarText}20`, color: theme.navbarText }}
            >
              <Menu size={20} />
            </button>

            <div className="hidden md:flex items-center text-sm" style={{ color: `${theme.navbarText}80` }}>
              <Link href="/dashboard" className="hover:opacity-100 transition-opacity" style={{ color: `${theme.navbarText}80` }}>
                Application
              </Link>
              {segments.map((seg, i) => {
                const path = "/" + segments.slice(0, i + 1).join("/")
                const isLast = i === segments.length - 1
                return (
                  <React.Fragment key={path}>
                    <ChevronRight size={14} className="mx-2 opacity-40" />
                    {isLast ? (
                      <span className="font-medium capitalize" style={{ color: theme.navbarText }}>
                        {seg.replace(/-/g, " ")}
                      </span>
                    ) : (
                      <Link href={path} className="capitalize hover:opacity-100 transition-opacity" style={{ color: `${theme.navbarText}80` }}>
                        {seg.replace(/-/g, " ")}
                      </Link>
                    )}
                  </React.Fragment>
                )
              })}
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">

            {/* Notifications */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotifOpen((v) => !v)}
                className="relative w-9 h-9 rounded-full transition flex items-center justify-center"
                style={{ backgroundColor: `${theme.navbarText}15`, color: theme.navbarText }}
              >
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-400" />
              </button>

              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-border z-20 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                      <span className="text-sm font-semibold text-foreground">Notifications</span>
                      <span className="text-xs text-primary cursor-pointer hover:underline">Mark all read</span>
                    </div>
                    <div className="divide-y divide-border max-h-80 overflow-y-auto">
                      {[
                        { icon: AlertTriangle, iconColor: "text-amber-500", iconBg: "bg-amber-50", title: "Subscription expiring soon", desc: "Your plan expires in 7 days. Renew to avoid interruption.", time: "Just now", unread: true },
                        { icon: ClipboardList, iconColor: "text-blue-500", iconBg: "bg-blue-50", title: "Term exams starting", desc: "End of term exams are scheduled to begin on June 2nd.", time: "2h ago", unread: true },
                        { icon: DollarSign, iconColor: "text-red-500", iconBg: "bg-red-50", title: "Fee collection reminder", desc: "42 students have outstanding fee balances for this term.", time: "Yesterday", unread: true },
                        { icon: UserPlus, iconColor: "text-green-500", iconBg: "bg-green-50", title: "New student enrolled", desc: "Tendai Moyo has been added to Form 3A.", time: "2 days ago", unread: false },
                        { icon: BarChart2, iconColor: "text-purple-500", iconBg: "bg-purple-50", title: "Term report cards ready", desc: "Term 1 report cards are ready to be printed and distributed.", time: "3 days ago", unread: false },
                      ].map((n, i) => (
                        <div key={i} className={`flex gap-3 px-4 py-3 hover:bg-muted/50 cursor-pointer transition-colors ${n.unread ? "bg-primary/5" : ""}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${n.iconBg}`}>
                            <n.icon size={15} className={n.iconColor} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className={`text-sm ${n.unread ? "font-semibold" : "font-medium"} text-foreground`}>{n.title}</p>
                              {n.unread && <span className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{n.desc}</p>
                            <p className="text-xs text-muted-foreground/70 mt-1">{n.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-2.5 border-t border-border text-center">
                      <span className="text-xs text-primary cursor-pointer hover:underline">View all notifications</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* User dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full transition"
                style={{ backgroundColor: `${theme.navbarText}15` }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                  style={{ backgroundColor: `${theme.navbarText}25`, color: theme.navbarText }}
                >
                  {userInitial}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold leading-none" style={{ color: theme.navbarText }}>{userName}</p>
                  <p className="text-xs mt-0.5" style={{ color: `${theme.navbarText}70` }}>Administrator</p>
                </div>
                <ChevronDown
                  size={14}
                  className={`transition-transform ${userDropdownOpen ? "rotate-180" : ""}`}
                  style={{ color: `${theme.navbarText}70` }}
                />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
                  <div className="px-4 py-4 bg-slate-50 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg"
                        style={{ backgroundColor: theme.primaryColor, color: theme.primaryText }}
                      >
                        {userInitial}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">{userName}</p>
                        <p className="text-xs text-slate-500 truncate">{userEmail}</p>
                        <span
                          className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{ backgroundColor: `${theme.primaryColor}15`, color: theme.primaryColor }}
                        >
                          Administrator
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="py-2">
                    <Link
                      href="/settings"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                    >
                      <User size={16} className="text-slate-400" />
                      Profile settings
                    </Link>
                    <div className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600">
                      <Mail size={16} className="text-slate-400" />
                      <span className="truncate">{userEmail}</span>
                    </div>
                  </div>
                  <div className="py-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={16} />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ===== PAGE CONTENT ===== */}
        <main className="flex-1 overflow-y-auto p-6 pt-4">
          <h2 className="text-xl font-semibold capitalize mb-4" style={{ color: theme.sidebarText }}>
            {segments[segments.length - 1]?.replace(/-/g, " ") || "Dashboard"}
          </h2>
          {children}
        </main>

      </div>
    </div>
  )
}