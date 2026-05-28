// "use client"

// import React, { useState, useEffect } from "react"
// import { Plus, Trash2, CalendarDays } from "lucide-react"
// import { ConfirmModal } from "@/components/ui/confirm-modal"

// interface TimetableEntry {
//   id: string
//   classId: string
//   subjectId: string
//   dayOfWeek: string
//   startTime: string
//   endTime: string
//   class: { name: string; gradeLevel: string }
//   subject: { name: string; code: string }
// }

// interface ClassItem {
//   id: string
//   name: string
//   gradeLevel: string
// }

// interface Subject {
//   id: string
//   name: string
//   code: string
//   gradeLevel: string
// }

// const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"]

// const DAY_COLORS: Record<string, string> = {
//   MONDAY: "bg-blue-50 border-blue-200",
//   TUESDAY: "bg-purple-50 border-purple-200",
//   WEDNESDAY: "bg-green-50 border-green-200",
//   THURSDAY: "bg-amber-50 border-amber-200",
//   FRIDAY: "bg-red-50 border-red-200",
// }

// const DAY_TEXT: Record<string, string> = {
//   MONDAY: "text-blue-800",
//   TUESDAY: "text-purple-800",
//   WEDNESDAY: "text-green-800",
//   THURSDAY: "text-amber-800",
//   FRIDAY: "text-red-800",
// }

// const emptyForm = {
//   subjectId: "",
//   dayOfWeek: "MONDAY",
//   startTime: "07:00",
//   endTime: "08:00",
// }

// export default function TimetablePage() {
//   const [timetable, setTimetable] = useState<TimetableEntry[]>([])
//   const [classes, setClasses] = useState<ClassItem[]>([])
//   const [subjects, setSubjects] = useState<Subject[]>([])
//   const [selectedClassId, setSelectedClassId] = useState("")
//   const [showForm, setShowForm] = useState(false)
//   const [form, setForm] = useState(emptyForm)
//   const [loading, setLoading] = useState(false)
//   const [fetching, setFetching] = useState(true)
//   const [error, setError] = useState("")
//   const [confirmOpen, setConfirmOpen] = useState(false)
//   const [confirmConfig, setConfirmConfig] = useState<{
//     title: string
//     message: string
//     onConfirm: () => void
//   }>({ title: "", message: "", onConfirm: () => {} })

//   function showConfirm(title: string, message: string, onConfirm: () => void) {
//     setConfirmConfig({ title, message, onConfirm })
//     setConfirmOpen(true)
//   }

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const [classesRes, subjectsRes] = await Promise.all([
//           fetch("/api/classes"),
//           fetch("/api/subjects"),
//         ])
//         const classesData = await classesRes.json() as { classes: ClassItem[] }
//         const subjectsData = await subjectsRes.json() as { subjects: Subject[] }
//         setClasses(classesData.classes ?? [])
//         setSubjects(subjectsData.subjects ?? [])
//         if (classesData.classes && classesData.classes.length > 0) {
//           setSelectedClassId(classesData.classes[0]?.id ?? "")
//         }
//       } catch {
//         setError("Failed to load data")
//       } finally {
//         setFetching(false)
//       }
//     }
//     void fetchData()
//   }, [])

//   useEffect(() => {
//     if (!selectedClassId) return
//     async function fetchTimetable() {
//       try {
//         const res = await fetch(`/api/timetable?classId=${selectedClassId}`)
//         const data = await res.json() as { timetable: TimetableEntry[] }
//         setTimetable(data.timetable ?? [])
//       } catch {
//         setError("Failed to load timetable")
//       }
//     }
//     void fetchTimetable()
//   }, [selectedClassId])

//   function handleChange(
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) {
//     setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }))
//   }

//   async function handleAddEntry() {
//     setLoading(true)
//     setError("")
//     try {
//       const res = await fetch("/api/timetable", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           classId: selectedClassId,
//           ...form,
//         }),
//       })
//       const data = await res.json() as { entry: TimetableEntry; error?: string }
//       if (!res.ok) {
//         setError(data.error ?? "Failed to add entry")
//         return
//       }
//       setTimetable((prev) => [...prev, data.entry])
//       setForm(emptyForm)
//       setShowForm(false)
//     } catch {
//       setError("Something went wrong")
//     } finally {
//       setLoading(false)
//     }
//   }

//   async function handleDelete(id: string) {
//     showConfirm(
//       "Delete timetable entry",
//       "Are you sure you want to remove this lesson from the timetable?",
//       async () => {
//         setConfirmOpen(false)
//         try {
//           const res = await fetch(`/api/timetable?id=${id}`, {
//             method: "DELETE",
//           })
//           if (!res.ok) {
//             const data = await res.json() as { error?: string }
//             setError(data.error ?? "Failed to delete entry")
//             return
//           }
//           setTimetable((prev) => prev.filter((e) => e.id !== id))
//         } catch {
//           setError("Something went wrong")
//         }
//       }
//     )
//   }

//   const selectedClass = classes.find((c) => c.id === selectedClassId)

//   // Filter subjects by class grade level
//   const filteredSubjects = selectedClass
//     ? subjects.filter((s) => s.gradeLevel === selectedClass.gradeLevel)
//     : subjects

//   // Group timetable by day
//   const grouped = DAYS.reduce<Record<string, TimetableEntry[]>>((acc, day) => {
//     acc[day] = timetable.filter((e) => e.dayOfWeek === day)
//     return acc
//   }, {})

//   return (
//     <div className="space-y-6">

//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-2xl font-bold text-foreground">Timetable</h2>
//           <p className="text-sm text-muted-foreground mt-1">
//             Manage class schedules and lesson plans
//           </p>
//         </div>
//         {selectedClassId && (
//           <button
//             type="button"
//             onClick={() => setShowForm(true)}
//             className="flex items-center gap-2 py-2 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
//           >
//             <Plus size={16} />
//             Add lesson
//           </button>
//         )}
//       </div>

//       {error && (
//         <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
//           <p className="text-sm text-destructive">{error}</p>
//         </div>
//       )}

//       {/* Class selector */}
//       {fetching ? (
//         <div className="bg-card rounded-lg border border-border p-8 text-center">
//           <p className="text-sm text-muted-foreground">Loading...</p>
//         </div>
//       ) : classes.length === 0 ? (
//         <div className="bg-card rounded-lg border border-border p-12 text-center">
//           <CalendarDays size={40} className="mx-auto text-muted-foreground mb-3" />
//           <p className="text-base font-medium text-foreground">No classes yet</p>
//           <p className="text-sm text-muted-foreground mt-1">
//             Create classes first before building a timetable
//           </p>
//         </div>
//       ) : (
//         <>
//           <div className="flex items-center gap-3 flex-wrap">
//             <p className="text-sm font-medium text-foreground">Class:</p>
//             {classes.map((cls) => (
//               <button
//                 key={cls.id}
//                 type="button"
//                 onClick={() => setSelectedClassId(cls.id)}
//                 className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
//                   selectedClassId === cls.id
//                     ? "bg-primary text-primary-foreground border-primary"
//                     : "bg-background text-foreground border-border hover:border-primary"
//                 }`}
//               >
//                 {cls.name}
//               </button>
//             ))}
//           </div>

//           {/* Add lesson form */}
//           {showForm && (
//             <div className="bg-card rounded-lg border border-border p-6 space-y-4">
//               <h3 className="text-base font-semibold text-foreground">
//                 Add lesson to {selectedClass?.name}
//               </h3>
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <label htmlFor="subjectId" className="text-sm font-medium text-foreground">
//                     Subject
//                   </label>
//                   <select
//                     id="subjectId"
//                     value={form.subjectId}
//                     onChange={handleChange}
//                     className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
//                   >
//                     <option value="">Select subject...</option>
//                     {filteredSubjects.map((s) => (
//                       <option key={s.id} value={s.id}>
//                         {s.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div className="space-y-2">
//                   <label htmlFor="dayOfWeek" className="text-sm font-medium text-foreground">
//                     Day
//                   </label>
//                   <select
//                     id="dayOfWeek"
//                     value={form.dayOfWeek}
//                     onChange={handleChange}
//                     className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
//                   >
//                     {DAYS.map((day) => (
//                       <option key={day} value={day}>
//                         {day.charAt(0) + day.slice(1).toLowerCase()}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div className="space-y-2">
//                   <label htmlFor="startTime" className="text-sm font-medium text-foreground">
//                     Start time
//                   </label>
//                   <input
//                     id="startTime"
//                     type="time"
//                     value={form.startTime}
//                     onChange={handleChange}
//                     className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <label htmlFor="endTime" className="text-sm font-medium text-foreground">
//                     End time
//                   </label>
//                   <input
//                     id="endTime"
//                     type="time"
//                     value={form.endTime}
//                     onChange={handleChange}
//                     className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
//                   />
//                 </div>
//               </div>
//               <div className="flex gap-3 pt-2">
//                 <button
//                   type="button"
//                   onClick={() => void handleAddEntry()}
//                   disabled={loading || !form.subjectId}
//                   className="flex items-center gap-2 py-2 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
//                 >
//                   <Plus size={16} />
//                   {loading ? "Adding..." : "Add lesson"}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => { setShowForm(false); setForm(emptyForm) }}
//                   className="py-2 px-4 border border-border rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Timetable grid */}
//           {timetable.length === 0 ? (
//             <div className="bg-card rounded-lg border border-border p-12 text-center">
//               <CalendarDays size={40} className="mx-auto text-muted-foreground mb-3" />
//               <p className="text-base font-medium text-foreground">
//                 No lessons scheduled
//               </p>
//               <p className="text-sm text-muted-foreground mt-1">
//                 Click Add lesson to build the timetable for {selectedClass?.name}
//               </p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
//               {DAYS.map((day) => (
//                 <div key={day} className="space-y-2">
//                   <h3 className={`text-xs font-semibold uppercase tracking-wide ${DAY_TEXT[day]}`}>
//                     {day.charAt(0) + day.slice(1).toLowerCase()}
//                   </h3>
//                   <div className="space-y-2">
//                     {grouped[day]?.length === 0 ? (
//                       <div className="bg-muted/30 rounded-lg border border-dashed border-border p-4 text-center">
//                         <p className="text-xs text-muted-foreground">No lessons</p>
//                       </div>
//                     ) : (
//                       grouped[day]?.map((entry) => (
//                         <div
//                           key={entry.id}
//                           className={`rounded-lg border p-3 space-y-1 ${DAY_COLORS[day]}`}
//                         >
//                           <div className="flex items-start justify-between gap-1">
//                             <p className={`text-xs font-semibold ${DAY_TEXT[day]}`}>
//                               {entry.subject.name}
//                             </p>
//                             <button
//                               type="button"
//                               onClick={() => void handleDelete(entry.id)}
//                               className="text-muted-foreground hover:text-red-600 transition-colors shrink-0"
//                             >
//                               <Trash2 size={12} />
//                             </button>
//                           </div>
//                           <p className="text-xs text-muted-foreground">
//                             {entry.startTime} — {entry.endTime}
//                           </p>
//                         </div>
//                       ))
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </>
//       )}

//       <ConfirmModal
//         open={confirmOpen}
//         title={confirmConfig.title}
//         message={confirmConfig.message}
//         confirmLabel="Yes, remove"
//         onConfirm={confirmConfig.onConfirm}
//         onCancel={() => setConfirmOpen(false)}
//       />

//     </div>
//   )
// }



"use client"

import React, { useState, useEffect } from "react"
import { Plus, Trash2, CalendarDays, Search, ChevronRight, Clock } from "lucide-react"
import { ConfirmModal } from "@/components/ui/confirm-modal"
import { useTheme } from "@/components/providers/theme-provider"

interface TimetableEntry {
  id: string
  classId: string
  subjectId: string
  dayOfWeek: string
  startTime: string
  endTime: string
  class: { name: string; gradeLevel: string }
  subject: { name: string; code: string }
}

interface ClassItem {
  id: string
  name: string
  gradeLevel: string
}

interface Subject {
  id: string
  name: string
  code: string
  gradeLevel: string
}

const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"]

const DAY_COLORS: Record<string, string> = {
  MONDAY: "bg-blue-50 border-blue-200",
  TUESDAY: "bg-purple-50 border-purple-200",
  WEDNESDAY: "bg-green-50 border-green-200",
  THURSDAY: "bg-amber-50 border-amber-200",
  FRIDAY: "bg-red-50 border-red-200",
}

const DAY_TEXT: Record<string, string> = {
  MONDAY: "text-blue-700",
  TUESDAY: "text-purple-700",
  WEDNESDAY: "text-green-700",
  THURSDAY: "text-amber-700",
  FRIDAY: "text-red-700",
}

const DAY_DOT: Record<string, string> = {
  MONDAY: "bg-blue-400",
  TUESDAY: "bg-purple-400",
  WEDNESDAY: "bg-green-400",
  THURSDAY: "bg-amber-400",
  FRIDAY: "bg-red-400",
}

const emptyForm = {
  subjectId: "",
  dayOfWeek: "MONDAY",
  startTime: "07:00",
  endTime: "08:00",
}

export default function TimetablePage() {
  const [timetable, setTimetable] = useState<TimetableEntry[]>([])
  const [classes, setClasses] = useState<ClassItem[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [selectedClassId, setSelectedClassId] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const { theme } = useTheme()
  const [focused, setFocused] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [timetableFetching, setTimetableFetching] = useState(false)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmConfig, setConfirmConfig] = useState<{
    title: string
    message: string
    onConfirm: () => void
  }>({ title: "", message: "", onConfirm: () => {} })

  function showConfirm(title: string, message: string, onConfirm: () => void) {
    setConfirmConfig({ title, message, onConfirm })
    setConfirmOpen(true)
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const [classesRes, subjectsRes] = await Promise.all([
          fetch("/api/classes"),
          fetch("/api/subjects"),
        ])
        const classesData = await classesRes.json() as { classes: ClassItem[] }
        const subjectsData = await subjectsRes.json() as { subjects: Subject[] }
        setClasses(classesData.classes ?? [])
        setSubjects(subjectsData.subjects ?? [])
        if (classesData.classes && classesData.classes.length > 0) {
          setSelectedClassId(classesData.classes[0]?.id ?? "")
        }
      } catch {
        setError("Failed to load data")
      } finally {
        setFetching(false)
      }
    }
    void fetchData()
  }, [])

  useEffect(() => {
    if (!selectedClassId) return
    setTimetableFetching(true)
    async function fetchTimetable() {
      try {
        const res = await fetch(`/api/timetable?classId=${selectedClassId}`)
        const data = await res.json() as { timetable: TimetableEntry[] }
        setTimetable(data.timetable ?? [])
      } catch {
        setError("Failed to load timetable")
      } finally {
        setTimetableFetching(false)
      }
    }
    void fetchTimetable()
  }, [selectedClassId])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }))
  }

  async function handleAddEntry() {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/timetable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classId: selectedClassId, ...form }),
      })
      const data = await res.json() as { entry: TimetableEntry; error?: string }
      if (!res.ok) {
        setError(data.error ?? "Failed to add entry")
        return
      }
      setTimetable((prev) => [...prev, data.entry])
      setForm(emptyForm)
      setShowForm(false)
    } catch {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    showConfirm(
      "Delete timetable entry",
      "Are you sure you want to remove this lesson from the timetable?",
      async () => {
        setConfirmOpen(false)
        try {
          const res = await fetch(`/api/timetable?id=${id}`, { method: "DELETE" })
          if (!res.ok) {
            const data = await res.json() as { error?: string }
            setError(data.error ?? "Failed to delete entry")
            return
          }
          setTimetable((prev) => prev.filter((e) => e.id !== id))
        } catch {
          setError("Something went wrong")
        }
      }
    )
  }

  const selectedClass = classes.find((c) => c.id === selectedClassId)

  const filteredSubjects = selectedClass
    ? subjects.filter((s) => s.gradeLevel === selectedClass.gradeLevel)
    : subjects

  const filteredClasses = classes.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.gradeLevel.toLowerCase().includes(search.toLowerCase())
  )

  // Group timetable by day
  const grouped = DAYS.reduce<Record<string, TimetableEntry[]>>((acc, day) => {
    acc[day] = timetable.filter((e) => e.dayOfWeek === day)
    return acc
  }, {})

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Timetable</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage class schedules and lesson plans
          </p>
        </div>
        {selectedClassId && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 py-2 px-4 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
            style={{ backgroundColor: theme.primaryColor, color: theme.primaryText }}
          >
            <Plus size={15} />
            Add lesson
          </button>
        )}
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
          <div className="p-3 border-b border-border">
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
                <CalendarDays size={26} className="mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No classes found</p>
              </div>
            ) : (
              filteredClasses.map((cls) => {
                const lessonCount = timetable.filter((t) => t.classId === cls.id).length
                return (
                  <button
                    key={cls.id}
                    type="button"
                    onClick={() => { setSelectedClassId(cls.id); setShowForm(false) }}
                    className={`w-full flex items-center gap-3 px-3 py-3 text-left transition-colors border-b border-border/50 last:border-0 ${
                      selectedClassId === cls.id
                        ? "bg-primary/10 border-l-2 border-l-primary"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <CalendarDays size={15} style={{ color: theme.primaryColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{cls.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {cls.gradeLevel.replace(/_/g, " ")}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      {selectedClassId === cls.id && lessonCount > 0 && (
                        <span className="text-xs font-medium" style={{ color: theme.primaryColor }}>
                          {lessonCount} lesson{lessonCount !== 1 ? "s" : ""}
                        </span>
                      )}
                      <ChevronRight size={12} className="text-muted-foreground" />
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* RIGHT — timetable / form panel */}
        <div className="flex-1 bg-card border border-border rounded-xl overflow-y-auto">

          {/* No classes at all */}
          {!fetching && classes.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-3">
                <CalendarDays size={24} className="text-muted-foreground" />
              </div>
              <p className="text-base font-medium text-foreground">No classes yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Create classes first before building a timetable
              </p>
            </div>
          )}

          {/* Add lesson form */}
          {showForm && selectedClass && (
            <div className="p-6">
              <h3 className="text-base font-semibold text-foreground mb-5">
                Add lesson to {selectedClass.name}
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="subjectId" className="text-sm font-medium text-foreground">Subject</label>
                    <select
                      id="subjectId"
                      value={form.subjectId}
                      onChange={handleChange}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      className="w-full px-3 py-2 rounded-md bg-background text-foreground text-sm focus:outline-none"
                      style={{
                        border: `1px solid ${focused ? theme.primaryColor : "#d1d5db"}`,
                        boxShadow: focused ? `0 0 0 2px ${theme.primaryColor}33` : "none",
                      }}
                    >
                      <option value="">Select subject...</option>
                      {filteredSubjects.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="dayOfWeek" className="text-sm font-medium text-foreground">Day</label>
                    <select
                      id="dayOfWeek"
                      value={form.dayOfWeek}
                      onChange={handleChange}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      className="w-full px-3 py-2 rounded-md bg-background text-foreground text-sm focus:outline-none"
                      style={{
                        border: `1px solid ${focused ? theme.primaryColor : "#d1d5db"}`,
                        boxShadow: focused ? `0 0 0 2px ${theme.primaryColor}33` : "none",
                      }}
                    >
                      {DAYS.map((day) => (
                        <option key={day} value={day}>
                          {day.charAt(0) + day.slice(1).toLowerCase()}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="startTime" className="text-sm font-medium text-foreground">Start time</label>
                    <input
                      id="startTime"
                      type="time"
                      value={form.startTime}
                      onChange={handleChange}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      className="w-full px-3 py-2 rounded-md bg-background text-foreground text-sm focus:outline-none"
                      style={{
                        border: `1px solid ${focused ? theme.primaryColor : "#d1d5db"}`,
                        boxShadow: focused ? `0 0 0 2px ${theme.primaryColor}33` : "none",
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="endTime" className="text-sm font-medium text-foreground">End time</label>
                    <input
                      id="endTime"
                      type="time"
                      value={form.endTime}
                      onChange={handleChange}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      className="w-full px-3 py-2 rounded-md bg-background text-foreground text-sm focus:outline-none"
                      style={{
                        border: `1px solid ${focused ? theme.primaryColor : "#d1d5db"}`,
                        boxShadow: focused ? `0 0 0 2px ${theme.primaryColor}33` : "none",
                      }}
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => void handleAddEntry()}
                    disabled={loading || !form.subjectId}
                    className="flex items-center gap-2 py-2 px-4 rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                    style={{ backgroundColor: theme.primaryColor, color: theme.primaryText }}
                  >
                    <Plus size={16} />
                    {loading ? "Adding..." : "Add lesson"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowForm(false); setForm(emptyForm) }}
                    className="py-2 px-4 border border-border rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Timetable grid */}
          {!showForm && selectedClass && (
            <div className="p-6 space-y-5">

              {/* Class header */}
              <div className="flex items-center justify-between pb-5 border-b border-border">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                    <CalendarDays size={24} style={{ color: theme.primaryColor }} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{selectedClass.name}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {selectedClass.gradeLevel.replace(/_/g, " ")}
                    </p>
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 mt-2"
                      style={{ color: theme.primaryColor }}
                    >
                      <Clock size={11} />
                      {timetable.length} lesson{timetable.length !== 1 ? "s" : ""} scheduled
                    </span>
                  </div>
                </div>
              
              </div>

              {timetableFetching ? (
                <div className="grid grid-cols-5 gap-3">
                  {DAYS.map((day) => (
                    <div key={day} className="space-y-2 animate-pulse">
                      <div className="h-3 bg-muted rounded w-16" />
                      <div className="h-20 bg-muted rounded-lg" />
                    </div>
                  ))}
                </div>
              ) : timetable.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-16">
                  <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-3">
                    <CalendarDays size={24} className="text-muted-foreground" />
                  </div>
                  <p className="text-base font-medium text-foreground">No lessons scheduled</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Click Add lesson to build the timetable for {selectedClass.name}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                  {DAYS.map((day) => (
                    <div key={day} className="space-y-2">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${DAY_DOT[day]}`} />
                        <h3 className={`text-xs font-semibold uppercase tracking-wide ${DAY_TEXT[day]}`}>
                          {day.charAt(0) + day.slice(1).toLowerCase()}
                        </h3>
                      </div>
                      <div className="space-y-2">
                        {grouped[day]?.length === 0 ? (
                          <div className="bg-muted/30 rounded-lg border border-dashed border-border p-4 text-center">
                            <p className="text-xs text-muted-foreground">No lessons</p>
                          </div>
                        ) : (
                          grouped[day]?.map((entry) => (
                            <div
                              key={entry.id}
                              className={`rounded-lg border p-3 space-y-1.5 ${DAY_COLORS[day]}`}
                            >
                              <div className="flex items-start justify-between gap-1">
                                <p className={`text-xs font-semibold leading-tight ${DAY_TEXT[day]}`}>
                                  {entry.subject.name}
                                </p>
                                <button
                                  type="button"
                                  onClick={() => void handleDelete(entry.id)}
                                  className="text-muted-foreground hover:text-red-600 transition-colors shrink-0"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                              <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-mono opacity-70 ${DAY_TEXT[day]}`}>
                                {entry.subject.code}
                              </span>
                              <div className={`flex items-center gap-1 text-xs ${DAY_TEXT[day]} opacity-80`}>
                                <Clock size={10} />
                                {entry.startTime} — {entry.endTime}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Empty state — no class selected */}
          {!showForm && !selectedClass && !fetching && classes.length > 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-3">
                <CalendarDays size={24} className="text-muted-foreground" />
              </div>
              <p className="text-base font-medium text-foreground">Select a class</p>
              <p className="text-sm text-muted-foreground mt-1">
                Click any class on the left to view its timetable
              </p>
            </div>
          )}

        </div>
      </div>

      <ConfirmModal
        open={confirmOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmLabel="Yes, remove"
        onConfirm={confirmConfig.onConfirm}
        onCancel={() => setConfirmOpen(false)}
      />

    </div>
  )
}
