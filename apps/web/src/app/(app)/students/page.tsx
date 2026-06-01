// "use client"

// import React, { useState, useEffect } from "react"
// import { Trash2 } from "lucide-react"
// import { ConfirmModal } from "@/components/ui/confirm-modal"

// // ---- TYPES ----
// interface Student {
//   id: string
//   firstName: string
//   lastName: string
//   gradeLevel: string
//   gender: string
//   status: string
//   parentContact: {
//     name: string
//     phone: string
//   }
// }

// // ---- GRADE LEVELS ----
// const GRADE_LEVELS = [
//   "ECD_A", "ECD_B",
//   "GRADE_1", "GRADE_2", "GRADE_3",
//   "GRADE_4", "GRADE_5", "GRADE_6", "GRADE_7",
//   "FORM_1", "FORM_2", "FORM_3",
//   "FORM_4", "FORM_5", "FORM_6",
// ]

// // ---- EMPTY FORM STATE ----
// const emptyForm = {
//   firstName: "",
//   lastName: "",
//   dateOfBirth: "",
//   gender: "male",
//   gradeLevel: "GRADE_1",
//   parentName: "",
//   parentPhone: "",
//   parentRelationship: "mother",
// }






// export default function StudentsPage() {
//   const [students, setStudents] = useState<Student[]>([])
//   const [showForm, setShowForm] = useState(false)
//   const [search, setSearch] = useState("")
//   const [form, setForm] = useState(emptyForm)
//   const [loading, setLoading] = useState(false)
//   const [fetching, setFetching] = useState(true)
//   const [error, setError] = useState("")
//   const [confirmOpen, setConfirmOpen] = useState(false)

//   const [confirmConfig, setConfirmConfig] = useState<{
//     title: string
//     message: string
//     onConfirm: () => void
//   }>({
//     title: "",
//     message: "",
//     onConfirm: () => {},
//   })

//   // Fetch students from API on load
//   useEffect(() => {
//     async function fetchStudents() {
//       try {
//         const res = await fetch("/api/students")
//         const data = await res.json() as { students: Student[] }
//         setStudents(data.students ?? [])
//       } catch {
//         setError("Failed to load students")
//       } finally {
//         setFetching(false)
//       }
//     }
//     void fetchStudents()
//   }, [])

//   function handleChange(
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) {
//     setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }))
//   }

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault()
//     setLoading(true)
//     setError("")

//     try {
//       const res = await fetch("/api/students", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       })

//       const data = await res.json() as { student: Student; error?: string }

//       if (!res.ok) {
//         setError(data.error ?? "Failed to save student")
//         return
//       }

//       setStudents((prev) => [data.student, ...prev])
//       setForm(emptyForm)
//       setShowForm(false)
//     } catch {
//       setError("Something went wrong. Please try again.")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const filtered = students.filter((s) =>
//     `${s.firstName} ${s.lastName}`
//       .toLowerCase()
//       .includes(search.toLowerCase())
//   )

//   async function handleDeleteStudent(studentId: string) {
//   showConfirm(
//     "Delete student",
//     "Are you sure you want to delete this student? All their records will be permanently removed.",
//     async () => {
//       setConfirmOpen(false)
//       try {
//         const res = await fetch(`/api/students/${studentId}`, {
//           method: "DELETE",
//         })
//         if (!res.ok) {
//           const data = await res.json() as { error?: string }
//           setError(data.error ?? "Failed to delete student")
//           return
//         }
//         setStudents((prev) => prev.filter((s) => s.id !== studentId))
//       } catch {
//         setError("Something went wrong")
//       }
//     }
//   )
// }

// function showConfirm(title: string, message: string, onConfirm: () => void) {
//   setConfirmConfig({ title, message, onConfirm })
//   setConfirmOpen(true)
// }

//   return (
//     <div className="space-y-6">

//       {/* Page header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-2xl font-bold text-foreground">Students</h2>
//           <p className="text-sm text-muted-foreground mt-1">
//             {students.length} student{students.length !== 1 ? "s" : ""} enrolled
//           </p>
//         </div>
//         <button
//           type="button"
//           onClick={() => setShowForm(true)}
//           className="py-2 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
//         >
//           + Add student
//         </button>
//       </div>

//       {/* Error message */}
//       {error && (
//         <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
//           <p className="text-sm text-destructive">{error}</p>
//         </div>
//       )}

//       {/* Search */}
//       <input
//         type="text"
//         placeholder="Search students..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         className="w-full max-w-sm px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
//       />

//       {/* Add student form */}
//       {showForm && (
//         <div className="bg-card rounded-lg border border-border p-6">
//           <h3 className="text-base font-semibold text-foreground mb-4">
//             Add new student
//           </h3>
//           <form onSubmit={handleSubmit} className="space-y-4">

//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <label htmlFor="firstName" className="text-sm font-medium text-foreground">
//                   First name
//                 </label>
//                 <input
//                   id="firstName"
//                   type="text"
//                   value={form.firstName}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <label htmlFor="lastName" className="text-sm font-medium text-foreground">
//                   Last name
//                 </label>
//                 <input
//                   id="lastName"
//                   type="text"
//                   value={form.lastName}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <label htmlFor="dateOfBirth" className="text-sm font-medium text-foreground">
//                   Date of birth
//                 </label>
//                 <input
//                   id="dateOfBirth"
//                   type="date"
//                   value={form.dateOfBirth}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <label htmlFor="gender" className="text-sm font-medium text-foreground">
//                   Gender
//                 </label>
//                 <select
//                   id="gender"
//                   value={form.gender}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
//                 >
//                   <option value="male">Male</option>
//                   <option value="female">Female</option>
//                 </select>
//               </div>
//             </div>

//             <div className="space-y-2">
//               <label htmlFor="gradeLevel" className="text-sm font-medium text-foreground">
//                 Grade level
//               </label>
//               <select
//                 id="gradeLevel"
//                 value={form.gradeLevel}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
//               >
//                 {GRADE_LEVELS.map((g) => (
//                   <option key={g} value={g}>
//                     {g.replace(/_/g, " ")}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="border-t border-border pt-4 space-y-3">
//               <h4 className="text-sm font-medium text-foreground">
//                 Parent / Guardian contact
//               </h4>
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <label htmlFor="parentName" className="text-sm font-medium text-foreground">
//                     Full name
//                   </label>
//                   <input
//                     id="parentName"
//                     type="text"
//                     value={form.parentName}
//                     onChange={handleChange}
//                     required
//                     className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <label htmlFor="parentPhone" className="text-sm font-medium text-foreground">
//                     Phone number
//                   </label>
//                   <input
//                     id="parentPhone"
//                     type="tel"
//                     value={form.parentPhone}
//                     onChange={handleChange}
//                     placeholder="07X XXX XXXX"
//                     required
//                     className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
//                   />
//                 </div>
//               </div>
//               <div className="space-y-2">
//                 <label htmlFor="parentRelationship" className="text-sm font-medium text-foreground">
//                   Relationship
//                 </label>
//                 <select
//                   id="parentRelationship"
//                   value={form.parentRelationship}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
//                 >
//                   <option value="mother">Mother</option>
//                   <option value="father">Father</option>
//                   <option value="guardian">Guardian</option>
//                 </select>
//               </div>
//             </div>

//             <div className="flex gap-3 pt-2">
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="py-2 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
//               >
//                 {loading ? "Saving..." : "Save student"}
//               </button>
//               <button
//                 type="button"
//                 onClick={() => {
//                   setShowForm(false)
//                   setForm(emptyForm)
//                 }}
//                 className="py-2 px-4 border border-border rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors"
//               >
//                 Cancel
//               </button>
//             </div>

//           </form>
//         </div>
//       )}

//       {/* Students table */}
//       {fetching ? (
//         <div className="bg-card rounded-lg border border-border p-12 text-center">
//           <p className="text-sm text-muted-foreground">Loading students...</p>
//         </div>
//       ) : students.length === 0 ? (
//         <div className="bg-card rounded-lg border border-border p-12 text-center">
//           <p className="text-4xl mb-4">🎓</p>
//           <p className="text-base font-medium text-foreground">No students yet</p>
//           <p className="text-sm text-muted-foreground mt-1">
//             Click the button above to add your first student
//           </p>
//         </div>
//       ) : (
//         <div className="bg-card rounded-lg border border-border overflow-hidden">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b border-border bg-muted/50">
//                 <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Name</th>
//                 <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Grade</th>
//                 <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Gender</th>
//                 <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Parent</th>
//                 <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</th>
//                 <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filtered.map((student) => (
//                 <tr
//                   key={student.id}
//                   className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
//                 >
//                   <td className="px-4 py-3">
//                     <div className="flex items-center gap-3">
//                       <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
//                         {student.firstName[0]}{student.lastName[0]}
//                       </div>
//                       <p className="text-sm font-medium text-foreground">
//                         {student.firstName} {student.lastName}
//                       </p>
//                     </div>
//                   </td>
//                   <td className="px-4 py-3 text-sm text-foreground">
//                     {student.gradeLevel.replace(/_/g, " ")}
//                   </td>
//                   <td className="px-4 py-3 text-sm text-foreground capitalize">
//                     {student.gender.toLowerCase()}
//                   </td>
//                   <td className="px-4 py-3">
//                     <p className="text-sm text-foreground">
//                       {(student.parentContact as { name: string }).name}
//                     </p>
//                     <p className="text-xs text-muted-foreground">
//                       {(student.parentContact as { phone: string }).phone}
//                     </p>
//                   </td>
//                   <td className="px-4 py-3">
//                     <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                       Active
//                     </span>
//                   </td>
//                   <td className="px-4 py-3">
//                     <button
//                       type="button"
//                       onClick={() => handleDeleteStudent(student.id)}
//                       className="text-muted-foreground hover:text-red-600 transition-colors"
//                     >
//                       <Trash2 size={16} />
//                     </button>
//                   </td>

//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}


//       <ConfirmModal
//         open={confirmOpen}
//         title={confirmConfig.title}
//         message={confirmConfig.message}
//         confirmLabel="Yes, delete"
//         onConfirm={confirmConfig.onConfirm}
//         onCancel={() => setConfirmOpen(false)}
//       />

//     </div>
//   )
// }


"use client"

import React, { useState, useEffect } from "react"
import { Trash2, UserRound, Phone, Users, ChevronRight, Search, Plus } from "lucide-react"
import { ConfirmModal } from "@/components/ui/confirm-modal"
import { Mail, MapPin, CalendarCheck, DollarSign } from "lucide-react"
import { useTheme } from "@/components/providers/theme-provider"

interface Student {
  id: string
  firstName: string
  lastName: string
  gradeLevel: string
  gender: string
  status: string
  parentContact: {
    name: string
    phone: string
  }
}

const GRADE_LEVELS = [
  "ECD_A", "ECD_B",
  "GRADE_1", "GRADE_2", "GRADE_3",
  "GRADE_4", "GRADE_5", "GRADE_6", "GRADE_7",
  "FORM_1", "FORM_2", "FORM_3",
  "FORM_4", "FORM_5", "FORM_6",
]

const emptyForm = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "male",
  gradeLevel: "GRADE_1",
  parentName: "",
  parentPhone: "",
  parentRelationship: "mother",
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [selected, setSelected] = useState<Student | null>(null)
  const [detailTab, setDetailTab] = useState("Personal details")
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState("")
  const { theme } = useTheme()
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState("")
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmConfig, setConfirmConfig] = useState<{
    title: string
    message: string
    onConfirm: () => void
  }>({ title: "", message: "", onConfirm: () => {} })

  useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await fetch("/api/students")
        const data = await res.json() as { students: Student[] }
        setStudents(data.students ?? [])
      } catch {
        setError("Failed to load students")
      } finally {
        setFetching(false)
      }
    }
    void fetchStudents()
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json() as { student: Student; error?: string }
      if (!res.ok) { setError(data.error ?? "Failed to save student"); return }
      setStudents((prev) => [data.student, ...prev])
      setForm(emptyForm)
      setShowForm(false)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  function showConfirm(title: string, message: string, onConfirm: () => void) {
    setConfirmConfig({ title, message, onConfirm })
    setConfirmOpen(true)
  }

  async function handleDeleteStudent(studentId: string) {
    showConfirm(
      "Delete student",
      "Are you sure you want to delete this student? All their records will be permanently removed.",
      async () => {
        setConfirmOpen(false)
        try {
          const res = await fetch(`/api/students/${studentId}`, { method: "DELETE" })
          if (!res.ok) {
            const data = await res.json() as { error?: string }
            setError(data.error ?? "Failed to delete student")
            return
          }
          setStudents((prev) => prev.filter((s) => s.id !== studentId))
          if (selected?.id === studentId) setSelected(null)
        } catch {
          setError("Something went wrong")
        }
      }
    )
  }

  const filtered = students.filter((s) =>
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Students</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {students.length} student{students.length !== 1 ? "s" : ""} enrolled
          </p>
        </div>
        <button
          type="button"
          onClick={() => { setShowForm(true); setSelected(null) }}
          className="flex items-center gap-2 py-2 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
       
          style={{
              backgroundColor: theme.primaryColor,
              color: theme.primaryText,
            }}
        >
          <Plus size={15} />
          Add student
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Split layout */}
      <div className="flex gap-4 h-[calc(100vh-180px)]">

        {/* LEFT — student list */}
        <div className="w-72 shrink-0 bg-card border border-border rounded-xl flex flex-col overflow-hidden">

          {/* Search */}
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search students..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 border border-input rounded-md bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {fetching ? (
              <div className="p-4 space-y-2">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="flex items-center gap-3 p-2 animate-pulse">
                    <div className="w-9 h-9 rounded-full bg-muted shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 bg-muted rounded w-28" />
                      <div className="h-2.5 bg-muted rounded w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-6 text-center">
                <Users size={28} className="mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No students found</p>
              </div>
            ) : (
              filtered.map((student) => (
                <button
                  key={student.id}
                  type="button"
                  onClick={() => { setSelected(student); setShowForm(false); setDetailTab("Personal details") }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors border-b border-border/50 last:border-0 ${
                    selected?.id === student.id
                      ? "bg-primary/10 border-l-2 border-l-primary"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-primary/10 text-white flex items-center justify-center text-xs font-semibold shrink-0" style={{backgroundColor: theme.primaryColor,}}>
                    {student.firstName[0]}{student.lastName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {student.firstName} {student.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                     {student.gradeLevel?.replace(/_/g, " ") ?? "—"}
                    </p>
                  </div>
                  <ChevronRight size={14} className="text-muted-foreground shrink-0" />
                </button>
              ))
            )}
          </div>
        </div>

        {/* RIGHT — detail / form panel */}
        <div className="flex-1 bg-card border border-border rounded-xl overflow-y-auto">

          {/* Add student form */}
          {showForm && (
            <div className="p-6">
              <h3 className="text-base font-semibold text-foreground mb-5">Add new student</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium text-foreground">First name</label>
                    <input id="firstName" type="text" value={form.firstName} onChange={handleChange} required
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium text-foreground">Last name</label>
                    <input id="lastName" type="text" value={form.lastName} onChange={handleChange} required
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="dateOfBirth" className="text-sm font-medium text-foreground">Date of birth</label>
                    <input id="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} required
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="gender" className="text-sm font-medium text-foreground">Gender</label>
                    <select id="gender" value={form.gender} onChange={handleChange}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="gradeLevel" className="text-sm font-medium text-foreground">Grade level</label>
                  <select id="gradeLevel" value={form.gradeLevel} onChange={handleChange}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    {GRADE_LEVELS.map((g) => (
                      <option key={g} value={g}>{g.replace(/_/g, " ")}</option>
                    ))}
                  </select>
                </div>
                <div className="border-t border-border pt-4 space-y-3">
                  <h4 className="text-sm font-medium text-foreground">Parent / Guardian contact</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="parentName" className="text-sm font-medium text-foreground">Full name</label>
                      <input id="parentName" type="text" value={form.parentName} onChange={handleChange} required
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="parentPhone" className="text-sm font-medium text-foreground">Phone number</label>
                      <input id="parentPhone" type="tel" value={form.parentPhone} onChange={handleChange} placeholder="07X XXX XXXX" required
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="parentRelationship" className="text-sm font-medium text-foreground">Relationship</label>
                    <select id="parentRelationship" value={form.parentRelationship} onChange={handleChange}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                      <option value="mother">Mother</option>
                      <option value="father">Father</option>
                      <option value="guardian">Guardian</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={loading}
                    className="py-2 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50" style={{backgroundColor: theme.primaryColor,}}>
                    {loading ? "Saving..." : "Save student"}
                  </button>
                  <button type="button" onClick={() => { setShowForm(false); setForm(emptyForm) }}
                    className="py-2 px-4 border border-border rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Student detail */}
         
         {/* Student detail */}
{!showForm && selected && (
  <div className="p-6 space-y-6">

    {/* Profile header */}
    <div className="flex items-start justify-between pb-5 border-b border-border">
      <div className="flex items-center gap-5">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold" style={{color: theme.primaryColor,}}>
            {selected.firstName[0]}{selected.lastName[0]}
          </div>
          <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center"  style={{backgroundColor: theme.primaryColor}}>
            <UserRound size={12} className="text-white"   />
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">
            {selected.firstName} {selected.lastName}
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5">
             {selected.gradeLevel?.replace(/_/g, " ") ?? "—"}
          </p>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
            Active
          </span>
        </div>
      </div>

    {/* Contact details top-right */}
<div className="space-y-2 min-w-48">
  <p className="text-sm font-semibold text-foreground mb-3">Contact Details</p>
  <div className="flex items-center gap-2.5">
    <Mail size={14} className="text-muted-foreground shrink-0" />
    <span className="text-sm text-muted-foreground">—</span>
  </div>
  <div className="flex items-center gap-2.5">
    <Phone size={14} className="text-muted-foreground shrink-0" />
    <span className="text-sm text-muted-foreground">
      {(selected.parentContact?.phone) ?? "—"}
    </span>
  </div>
  <div className="flex items-center gap-2.5">
    <MapPin size={14} className="text-muted-foreground shrink-0" />
    <span className="text-sm text-muted-foreground">Zimbabwe</span>
  </div>
</div>
    </div>

    {/* Tabs */}
    <div className="flex gap-1 border-b border-border">
      {["Personal details", "Attendance", "Fees"].map((tab) => (
       <button
  key={tab}
  type="button"
  onClick={() => setDetailTab(tab)}
  style={
    detailTab === tab
      ? {
          color: theme.primaryColor,
          borderColor: theme.primaryColor,
        }
      : {}
  }
  className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
    detailTab === tab
      ? ""
      : "border-transparent text-muted-foreground hover:text-foreground"
  }`}
>
  {tab}
</button>
      ))}
    </div>

    {/* Personal details tab */}
    {detailTab === "Personal details" && (
      <div className="space-y-4">
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full">
            <tbody>
              {[
                { label: "First name", value: selected.firstName },
                { label: "Last name", value: selected.lastName },
                { label: "Gender", value: selected.gender.charAt(0).toUpperCase() + selected.gender.slice(1) },
                { label: "Grade level", value: selected.gradeLevel.replace(/_/g, " ") },
                { label: "Status", value: selected.status ?? "Active" },
              ].map(({ label, value }, i) => (
                <tr key={label} className={i % 2 === 0 ? "bg-muted/30" : "bg-background"}>
                  <td className="px-4 py-3 text-sm font-medium text-foreground w-48">{label}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Parent / Guardian */}
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="px-4 py-2.5 bg-muted/40 border-b border-border">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Users size={14} className="text-muted-foreground" />
              Parent / Guardian
            </h4>
          </div>
          <table className="w-full">
            <tbody>
              {[
                { label: "Full name", value: (selected.parentContact as { name: string }).name },
                { label: "Phone", value: (selected.parentContact as { phone: string }).phone },
              ].map(({ label, value }, i) => (
                <tr key={label} className={i % 2 === 0 ? "bg-muted/30" : "bg-background"}>
                  <td className="px-4 py-3 text-sm font-medium text-foreground w-48">{label}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Delete */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={() => handleDeleteStudent(selected.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded-md hover:bg-red-50 transition-colors"
          >
            <Trash2 size={14} />
            Delete student
          </button>
        </div>
      </div>
    )}

    {/* Attendance tab */}
    {detailTab === "Attendance" && (
      <div className="rounded-lg border border-border p-8 text-center">
        <CalendarCheck size={28} className="mx-auto text-muted-foreground mb-2" />
        <p className="text-sm font-medium text-foreground">No attendance records</p>
        <p className="text-xs text-muted-foreground mt-1">
          Attendance records for this student will appear here
        </p>
      </div>
    )}

    {/* Fees tab */}
    {detailTab === "Fees" && (
      <div className="rounded-lg border border-border p-8 text-center">
        <DollarSign size={28} className="mx-auto text-muted-foreground mb-2" />
        <p className="text-sm font-medium text-foreground">No fee records</p>
        <p className="text-xs text-muted-foreground mt-1">
          Fee invoices and payments for this student will appear here
        </p>
      </div>
    )}

  </div>
)}

          {/* Empty state */}
          {!showForm && !selected && (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-3">
                <UserRound size={24} className="text-muted-foreground" />
              </div>
              <p className="text-base font-medium text-foreground">Select a student</p>
              <p className="text-sm text-muted-foreground mt-1">
                Click any student on the left to view their details
              </p>
            </div>
          )}

        </div>
      </div>

      <ConfirmModal
        open={confirmOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmLabel="Yes, delete"
        onConfirm={confirmConfig.onConfirm}
        onCancel={() => setConfirmOpen(false)}
      />

    </div>
  )
}