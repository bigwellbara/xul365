// "use client"

// import React, { useState, useEffect } from "react"

// interface Student {
//   id: string
//   firstName: string
//   lastName: string
//   gradeLevel: string
// }

// interface ClassItem {
//   id: string
//   name: string
//   gradeLevel: string
//   teacher: {
//     firstName: string
//     lastName: string
//   }
//   enrollments: {
//     student: Student
//   }[]
// }

// interface AttendanceRecord {
//   studentId: string
//   status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED"
// }

// const STATUS_STYLES = {
//   PRESENT: "bg-green-100 text-green-800 border-green-200",
//   ABSENT: "bg-red-100 text-red-800 border-red-200",
//   LATE: "bg-amber-100 text-amber-800 border-amber-200",
//   EXCUSED: "bg-blue-100 text-blue-800 border-blue-200",
// }

// const STATUS_LABELS = {
//   PRESENT: "Present",
//   ABSENT: "Absent",
//   LATE: "Late",
//   EXCUSED: "Excused",
// }

// export default function AttendancePage() {
//   const today = new Date().toISOString().split("T")[0] ?? ""
//   const [date, setDate] = useState(today)
//   const [classes, setClasses] = useState<ClassItem[]>([])
//   const [selectedClassId, setSelectedClassId] = useState("")
//   const [students, setStudents] = useState<Student[]>([])
//   const [records, setRecords] = useState<AttendanceRecord[]>([])
//   const [saved, setSaved] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const [fetching, setFetching] = useState(true)
//   const [error, setError] = useState("")

//   // Fetch classes on load
//   useEffect(() => {
//     async function fetchClasses() {
//       try {
//         const res = await fetch("/api/classes")
//         const data = await res.json() as { classes: ClassItem[] }
//         setClasses(data.classes ?? [])
//         if (data.classes && data.classes.length > 0) {
//           const firstClass = data.classes[0]
//           if (firstClass) {
//             setSelectedClassId(firstClass.id)
//           }
//         }
//       } catch {
//         setError("Failed to load classes")
//       } finally {
//         setFetching(false)
//       }
//     }
//     void fetchClasses()
//   }, [])

//   // Update students when class changes
//   useEffect(() => {
//     if (!selectedClassId) return
//     const cls = classes.find((c) => c.id === selectedClassId)
//     if (!cls) return

//     const classStudents = cls.enrollments.map((e) => e.student)
//     setStudents(classStudents)
//     setRecords(
//       classStudents.map((s) => ({ studentId: s.id, status: "PRESENT" as const }))
//     )
//     setSaved(false)
//   }, [selectedClassId, classes])

//   function setStatus(studentId: string, status: AttendanceRecord["status"]) {
//     setSaved(false)
//     setRecords((prev) =>
//       prev.map((r) => r.studentId === studentId ? { ...r, status } : r)
//     )
//   }

//   function markAll(status: AttendanceRecord["status"]) {
//     setSaved(false)
//     setRecords(students.map((s) => ({ studentId: s.id, status })))
//   }

//   async function handleSave() {
//     if (!selectedClassId) {
//       setError("Please select a class first")
//       return
//     }

//     if (students.length === 0) {
//       setError("No students in this class")
//       return
//     }

//     setLoading(true)
//     setError("")

//     try {
//       const res = await fetch("/api/attendance", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           date,
//           classId: selectedClassId,
//           records,
//         }),
//       })

//       if (!res.ok) {
//         const data = await res.json() as { error: string }
//         setError(data.error ?? "Failed to save attendance")
//         return
//       }

//       setSaved(true)
//     } catch {
//       setError("Something went wrong. Please try again.")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const summary = {
//     PRESENT: records.filter((r) => r.status === "PRESENT").length,
//     ABSENT: records.filter((r) => r.status === "ABSENT").length,
//     LATE: records.filter((r) => r.status === "LATE").length,
//     EXCUSED: records.filter((r) => r.status === "EXCUSED").length,
//   }

//   const attendanceRate =
//     students.length > 0
//       ? Math.round(
//           ((summary.PRESENT + summary.LATE) / students.length) * 100
//         )
//       : 0

//   return (
//     <div className="space-y-6">

//       <div>
//         <h2 className="text-2xl font-bold text-foreground">Attendance</h2>
//         <p className="text-sm text-muted-foreground mt-1">
//           Record daily student attendance
//         </p>
//       </div>

//       {error && (
//         <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
//           <p className="text-sm text-destructive">{error}</p>
//         </div>
//       )}

//       {/* Date and class selector */}
//       <div className="flex flex-wrap items-end gap-4">
//         <div className="space-y-1">
//           <label htmlFor="date" className="text-sm font-medium text-foreground">
//             Date
//           </label>
//           <input
//             id="date"
//             type="date"
//             value={date}
//             onChange={(e) => { setDate(e.target.value); setSaved(false) }}
//             className="px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
//           />
//         </div>
//         <div className="space-y-1">
//           <label htmlFor="class" className="text-sm font-medium text-foreground">
//             Class
//           </label>
//           {fetching ? (
//             <div className="px-3 py-2 border border-input rounded-md bg-muted text-sm w-48">
//               Loading classes...
//             </div>
//           ) : classes.length === 0 ? (
//             <div className="px-3 py-2 border border-input rounded-md bg-muted text-sm text-muted-foreground w-48">
//               No classes yet
//             </div>
//           ) : (
//             <select
//               id="class"
//               value={selectedClassId}
//               onChange={(e) => setSelectedClassId(e.target.value)}
//               className="px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
//             >
//               {classes.map((cls) => (
//                 <option key={cls.id} value={cls.id}>
//                   {cls.name} — {cls.teacher.firstName} {cls.teacher.lastName}
//                 </option>
//               ))}
//             </select>
//           )}
//         </div>
//       </div>

//       {/* No classes message */}
//       {!fetching && classes.length === 0 && (
//         <div className="bg-card rounded-lg border border-border p-12 text-center">
//           <p className="text-4xl mb-4">🏫</p>
//           <p className="text-base font-medium text-foreground">
//             No classes set up yet
//           </p>
//           <p className="text-sm text-muted-foreground mt-1">
//             Go to Settings to create classes and enroll students
//           </p>
//         </div>
//       )}

//       {/* Attendance UI — only show if class selected and has students */}
//       {classes.length > 0 && students.length === 0 && (
//         <div className="bg-card rounded-lg border border-border p-12 text-center">
//           <p className="text-4xl mb-4">🎓</p>
//           <p className="text-base font-medium text-foreground">
//             No students in this class
//           </p>
//           <p className="text-sm text-muted-foreground mt-1">
//             Enroll students in this class first
//           </p>
//         </div>
//       )}

//       {students.length > 0 && (
//         <>
//           {/* Summary cards */}
//           <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//             <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
//               <p className="text-2xl font-bold text-green-800">{summary.PRESENT}</p>
//               <p className="text-xs text-green-700 mt-1">Present</p>
//             </div>
//             <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
//               <p className="text-2xl font-bold text-red-800">{summary.ABSENT}</p>
//               <p className="text-xs text-red-700 mt-1">Absent</p>
//             </div>
//             <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
//               <p className="text-2xl font-bold text-amber-800">{summary.LATE}</p>
//               <p className="text-xs text-amber-700 mt-1">Late</p>
//             </div>
//             <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
//               <p className="text-2xl font-bold text-blue-800">{summary.EXCUSED}</p>
//               <p className="text-xs text-blue-700 mt-1">Excused</p>
//             </div>
//           </div>

//           {/* Attendance rate */}
//           <div className="bg-card rounded-lg border border-border p-4 flex items-center justify-between">
//             <p className="text-sm font-medium text-foreground">
//               Attendance rate
//             </p>
//             <div className="flex items-center gap-3">
//               <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
//                 <div
//                   className="h-full bg-primary rounded-full transition-all"
//                   style={{ width: `${attendanceRate}%` }}
//                 />
//               </div>
//               <p className="text-sm font-bold text-foreground">
//                 {attendanceRate}%
//               </p>
//             </div>
//           </div>

//           {/* Mark all buttons */}
//           <div className="flex items-center gap-2 flex-wrap">
//             <p className="text-sm text-muted-foreground">Mark all as:</p>
//             {(["PRESENT", "ABSENT", "LATE", "EXCUSED"] as const).map((status) => (
//               <button
//                 key={status}
//                 type="button"
//                 onClick={() => markAll(status)}
//                 className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${STATUS_STYLES[status]}`}
//               >
//                 {STATUS_LABELS[status]}
//               </button>
//             ))}
//           </div>

//           {/* Attendance list */}
//           <div className="bg-card rounded-lg border border-border overflow-hidden">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b border-border bg-muted/50">
//                   <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
//                     Student
//                   </th>
//                   <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
//                     Grade
//                   </th>
//                   <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
//                     Status
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {students.map((student) => {
//                   const record = records.find((r) => r.studentId === student.id)
//                   const status = record?.status ?? "PRESENT"
//                   return (
//                     <tr
//                       key={student.id}
//                       className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
//                     >
//                       <td className="px-4 py-3">
//                         <div className="flex items-center gap-3">
//                           <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
//                             {student.firstName[0]}{student.lastName[0]}
//                           </div>
//                           <p className="text-sm font-medium text-foreground">
//                             {student.firstName} {student.lastName}
//                           </p>
//                         </div>
//                       </td>
//                       <td className="px-4 py-3 text-sm text-foreground">
//                         {student.gradeLevel.replace(/_/g, " ")}
//                       </td>
//                       <td className="px-4 py-3">
//                         <div className="flex gap-2 flex-wrap">
//                           {(["PRESENT", "ABSENT", "LATE", "EXCUSED"] as const).map((s) => (
//                             <button
//                               key={s}
//                               type="button"
//                               onClick={() => setStatus(student.id, s)}
//                               className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
//                                 status === s
//                                   ? STATUS_STYLES[s]
//                                   : "bg-background text-muted-foreground border-border hover:border-primary"
//                               }`}
//                             >
//                               {STATUS_LABELS[s]}
//                             </button>
//                           ))}
//                         </div>
//                       </td>
//                     </tr>
//                   )
//                 })}
//               </tbody>
//             </table>
//           </div>

//           {/* Save button */}
//           <div className="flex items-center gap-4">
//             <button
//               type="button"
//               onClick={() => void handleSave()}
//               disabled={loading || saved}
//               className="py-2 px-6 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
//             >
//               {loading ? "Saving..." : saved ? "Saved ✓" : "Save attendance"}
//             </button>
//             {saved && (
//               <p className="text-sm text-green-600">
//                 Attendance saved successfully
//               </p>
//             )}
//           </div>
//         </>
//       )}

//     </div>
//   )
// }


"use client"

import React, { useState, useEffect } from "react"
import { Search, ChevronRight, CheckCircle2, Users, CalendarCheck } from "lucide-react"
import { useTheme } from "@/components/providers/theme-provider"
import { FeatureGate } from "@/components/ui/feature-gate"
import { useFeatures } from "@/hooks/use-features"

interface Student {
  id: string
  firstName: string
  lastName: string
  gradeLevel: string
}

interface ClassItem {
  id: string
  name: string
  gradeLevel: string
  teacher: {
    firstName: string
    lastName: string
  }
  enrollments: {
    student: Student
  }[]
}

interface AttendanceRecord {
  studentId: string
  status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED"
}

const STATUS_STYLES = {
  PRESENT: "bg-green-100 text-green-800 border-green-200",
  ABSENT: "bg-red-100 text-red-800 border-red-200",
  LATE: "bg-amber-100 text-amber-800 border-amber-200",
  EXCUSED: "bg-blue-100 text-blue-800 border-blue-200",
}

const STATUS_LABELS = {
  PRESENT: "Present",
  ABSENT: "Absent",
  LATE: "Late",
  EXCUSED: "Excused",
}

export default function AttendancePage() {
  const today = new Date().toISOString().split("T")[0] ?? ""
  const [date, setDate] = useState(today)
  const [classes, setClasses] = useState<ClassItem[]>([])
  const [selectedClassId, setSelectedClassId] = useState("")
  const [students, setStudents] = useState<Student[]>([])
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [focused, setFocused] = useState(false)
  const { theme } = useTheme()
  const { selectedFeatures } = useFeatures()

  useEffect(() => {
    async function fetchClasses() {
      try {
        const res = await fetch("/api/classes")
        const data = await res.json() as { classes: ClassItem[] }
        setClasses(data.classes ?? [])
        if (data.classes && data.classes.length > 0) {
          const firstClass = data.classes[0]
          if (firstClass) setSelectedClassId(firstClass.id)
        }
      } catch {
        setError("Failed to load classes")
      } finally {
        setFetching(false)
      }
    }
    void fetchClasses()
  }, [])

  useEffect(() => {
    if (!selectedClassId) return
    const cls = classes.find((c) => c.id === selectedClassId)
    if (!cls) return
    const classStudents = cls.enrollments.map((e) => e.student)
    setStudents(classStudents)
    setRecords(classStudents.map((s) => ({ studentId: s.id, status: "PRESENT" as const })))
    setSaved(false)
  }, [selectedClassId, classes])

  function setStatus(studentId: string, status: AttendanceRecord["status"]) {
    setSaved(false)
    setRecords((prev) => prev.map((r) => r.studentId === studentId ? { ...r, status } : r))
  }

  function markAll(status: AttendanceRecord["status"]) {
    setSaved(false)
    setRecords(students.map((s) => ({ studentId: s.id, status })))
  }

  async function handleSave() {
    if (!selectedClassId) { setError("Please select a class first"); return }
    if (students.length === 0) { setError("No students in this class"); return }
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, classId: selectedClassId, records }),
      })
      if (!res.ok) {
        const data = await res.json() as { error: string }
        setError(data.error ?? "Failed to save attendance")
        return
      }
      setSaved(true)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const summary = {
    PRESENT: records.filter((r) => r.status === "PRESENT").length,
    ABSENT: records.filter((r) => r.status === "ABSENT").length,
    LATE: records.filter((r) => r.status === "LATE").length,
    EXCUSED: records.filter((r) => r.status === "EXCUSED").length,
  }

  const attendanceRate = students.length > 0
    ? Math.round(((summary.PRESENT + summary.LATE) / students.length) * 100)
    : 0

  const selectedClass = classes.find((c) => c.id === selectedClassId)

  const filteredClasses = classes.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.gradeLevel.toLowerCase().includes(search.toLowerCase())
  )

  return (

    <FeatureGate
    featureKey="attendance"
    featureName="Attendance Tracking"
    description="Record and monitor daily student attendance per class."
    selectedFeatures={selectedFeatures}
  >

    <div className="space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Attendance</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Record daily student attendance
          </p>
        </div>
        
      </div>

      {error && (
        <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Split layout */}
      <div className="flex gap-4 h-[calc(100vh-180px)]">

        {/* LEFT — class list */}
        <div className="w-72 shrink-0 bg-card border border-border rounded-xl flex flex-col overflow-hidden">
          <div className="p-3 border-b border-border space-y-2">
            {/* Search */}
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search classes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className="w-full pl-8 pr-3 py-1.5 rounded-md bg-background text-foreground text-xs placeholder:text-muted-foreground focus:outline-none"
                style={{
                  border: `1px solid ${focused ? theme.primaryColor : "#d1d5db"}`,
                  boxShadow: focused ? `0 0 0 2px ${theme.primaryColor}33` : "none",
                }}
              />
            </div>
            {/* Date picker */}
            <input
              type="date"
              value={date}
              onChange={(e) => { setDate(e.target.value); setSaved(false) }}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className="w-full px-2 py-1.5 rounded-md bg-background text-foreground text-xs focus:outline-none"
              style={{
                border: `1px solid ${focused ? theme.primaryColor : "#d1d5db"}`,
                boxShadow: focused ? `0 0 0 2px ${theme.primaryColor}33` : "none",
              }}
            />
          </div>

          <div className="flex-1 overflow-y-auto">
            {fetching ? (
              <div className="p-4 space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-2 animate-pulse">
                    <div className="w-9 h-9 rounded-lg bg-muted shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 bg-muted rounded w-24" />
                      <div className="h-2.5 bg-muted rounded w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredClasses.length === 0 ? (
              <div className="p-6 text-center">
                <CalendarCheck size={26} className="mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No classes found</p>
              </div>
            ) : (
              filteredClasses.map((cls) => (
                <button
                  key={cls.id}
                  type="button"
                  onClick={() => setSelectedClassId(cls.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 text-left transition-colors border-b border-border/50 last:border-0 ${
                    selectedClassId === cls.id
                      ? "bg-primary/10 border-l-2 border-l-primary"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <CalendarCheck size={15} style={{ color: theme.primaryColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{cls.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {cls.teacher.firstName} {cls.teacher.lastName}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-xs text-muted-foreground">
                      {cls.enrollments.length}
                    </span>
                    <ChevronRight size={12} className="text-muted-foreground" />
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* RIGHT — attendance panel */}
        <div className="flex-1 bg-card border border-border rounded-xl overflow-y-auto">

          {/* No classes */}
          {!fetching && classes.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-3">
                <CalendarCheck size={24} className="text-muted-foreground" />
              </div>
              <p className="text-base font-medium text-foreground">No classes set up yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Create classes and enroll students first
              </p>
            </div>
          )}

          {/* Class selected but no students */}
          {!fetching && classes.length > 0 && selectedClass && students.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-3">
                <Users size={24} className="text-muted-foreground" />
              </div>
              <p className="text-base font-medium text-foreground">No students in {selectedClass.name}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Enroll students in this class first
              </p>
            </div>
          )}

          {/* Empty state — no class selected */}
          {!fetching && classes.length > 0 && !selectedClass && (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-3">
                <CalendarCheck size={24} className="text-muted-foreground" />
              </div>
              <p className="text-base font-medium text-foreground">Select a class</p>
              <p className="text-sm text-muted-foreground mt-1">
                Click any class on the left to take attendance
              </p>
            </div>
          )}

          {/* Attendance UI */}
          {students.length > 0 && selectedClass && (
            <div className="p-6 space-y-5">

              {/* Class header */}
              <div className="flex items-start justify-between pb-5 border-b border-border">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                    <CalendarCheck size={24} style={{ color: theme.primaryColor }} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{selectedClass.name}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {selectedClass.gradeLevel.replace(/_/g, " ")} ·{" "}
                      {selectedClass.teacher.firstName} {selectedClass.teacher.lastName}
                    </p>
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 mt-2"
                      style={{ color: theme.primaryColor }}
                    >
                      <Users size={11} />
                      {students.length} student{students.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
                {saved && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                    <CheckCircle2 size={13} />
                    Saved
                  </span>
                )}
              </div>

              {/* Summary cards */}
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-green-800">{summary.PRESENT}</p>
                  <p className="text-xs text-green-700 mt-0.5">Present</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-red-800">{summary.ABSENT}</p>
                  <p className="text-xs text-red-700 mt-0.5">Absent</p>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-amber-800">{summary.LATE}</p>
                  <p className="text-xs text-amber-700 mt-0.5">Late</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-blue-800">{summary.EXCUSED}</p>
                  <p className="text-xs text-blue-700 mt-0.5">Excused</p>
                </div>
              </div>

              {/* Attendance rate bar */}
              <div className="bg-muted/40 rounded-lg p-4 flex items-center justify-between gap-4">
                <p className="text-sm font-medium text-foreground shrink-0">Attendance rate</p>
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${attendanceRate}%`, backgroundColor: theme.primaryColor }}
                    />
                  </div>
                  <p className="text-sm font-bold text-foreground shrink-0 w-10 text-right">
                    {attendanceRate}%
                  </p>
                </div>
              </div>

              {/* Mark all */}
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm text-muted-foreground">Mark all as:</p>
                {(["PRESENT", "ABSENT", "LATE", "EXCUSED"] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => markAll(status)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${STATUS_STYLES[status]}`}
                  >
                    {STATUS_LABELS[status]}
                  </button>
                ))}
              </div>

              {/* Student table */}
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Student</th>
                      <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Grade</th>
                      <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, i) => {
                      const record = records.find((r) => r.studentId === student.id)
                      const status = record?.status ?? "PRESENT"
                      return (
                        <tr
                          key={student.id}
                          className={`border-b border-border last:border-0 transition-colors ${i % 2 === 0 ? "bg-muted/20" : ""}`}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold shrink-0"
                                style={{ color: theme.primaryColor }}
                              >
                                {student.firstName[0]}{student.lastName[0]}
                              </div>
                              <p className="text-sm font-medium text-foreground">
                                {student.firstName} {student.lastName}
                              </p>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            {student.gradeLevel.replace(/_/g, " ")}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1.5 flex-wrap">
                              {(["PRESENT", "ABSENT", "LATE", "EXCUSED"] as const).map((s) => (
                                <button
                                  key={s}
                                  type="button"
                                  onClick={() => setStatus(student.id, s)}
                                  className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                                    status === s
                                      ? STATUS_STYLES[s]
                                      : "bg-background text-muted-foreground border-border hover:border-primary"
                                  }`}
                                >
                                  {STATUS_LABELS[s]}
                                </button>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Save footer */}
              <div className="flex items-center gap-4 pt-1">
                <button
                  type="button"
                  onClick={() => void handleSave()}
                  disabled={loading || saved}
                  className="flex items-center gap-2 py-2 px-5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                  style={{ backgroundColor: theme.primaryColor, color: theme.primaryText }}
                >
                  <CheckCircle2 size={15} />
                  {loading ? "Saving..." : saved ? "Saved ✓" : "Save attendance"}
                </button>
                {saved && (
                  <p className="text-sm text-green-600 font-medium">
                    Attendance saved successfully
                  </p>
                )}
              </div>

            </div>
          )}

        </div>
      </div>

    </div>
    </FeatureGate>
  )
}
