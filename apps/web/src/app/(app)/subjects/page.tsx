// "use client"

// import React, { useState, useEffect } from "react"
// import { Plus, Trash2, BookMarked } from "lucide-react"
// import { ConfirmModal } from "@/components/ui/confirm-modal"

// interface Subject {
//   id: string
//   name: string
//   code: string
//   gradeLevel: string
// }

// const GRADE_LEVELS = [
//   "ECD_A", "ECD_B",
//   "GRADE_1", "GRADE_2", "GRADE_3",
//   "GRADE_4", "GRADE_5", "GRADE_6", "GRADE_7",
//   "FORM_1", "FORM_2", "FORM_3",
//   "FORM_4", "FORM_5", "FORM_6",
// ]

// const emptyForm = {
//   name: "",
//   code: "",
//   gradeLevel: "FORM_1",
// }

// export default function SubjectsPage() {
//   const [subjects, setSubjects] = useState<Subject[]>([])
//   const [showForm, setShowForm] = useState(false)
//   const [form, setForm] = useState(emptyForm)
//   const [loading, setLoading] = useState(false)
//   const [fetching, setFetching] = useState(true)
//   const [error, setError] = useState("")
//   const [filterGrade, setFilterGrade] = useState("all")
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
//     async function fetchSubjects() {
//       try {
//         const res = await fetch("/api/subjects")
//         const data = await res.json() as { subjects: Subject[] }
//         setSubjects(data.subjects ?? [])
//       } catch {
//         setError("Failed to load subjects")
//       } finally {
//         setFetching(false)
//       }
//     }
//     void fetchSubjects()
//   }, [])

//   function handleChange(
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) {
//     setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }))
//   }

//   async function handleSubmit() {
//     setLoading(true)
//     setError("")
//     try {
//       const res = await fetch("/api/subjects", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       })
//       const data = await res.json() as { subject: Subject; error?: string }
//       if (!res.ok) {
//         setError(data.error ?? "Failed to create subject")
//         return
//       }
//       setSubjects((prev) => [...prev, data.subject])
//       setForm(emptyForm)
//       setShowForm(false)
//     } catch {
//       setError("Something went wrong")
//     } finally {
//       setLoading(false)
//     }
//   }

//   async function handleDelete(subjectId: string) {
//     showConfirm(
//       "Delete subject",
//       "Are you sure you want to delete this subject? All related exam results will also be removed.",
//       async () => {
//         setConfirmOpen(false)
//         try {
//           const res = await fetch(`/api/subjects/${subjectId}`, {
//             method: "DELETE",
//           })
//           if (!res.ok) {
//             const data = await res.json() as { error?: string }
//             setError(data.error ?? "Failed to delete subject")
//             return
//           }
//           setSubjects((prev) => prev.filter((s) => s.id !== subjectId))
//         } catch {
//           setError("Something went wrong")
//         }
//       }
//     )
//   }

//   const filtered = filterGrade === "all"
//     ? subjects
//     : subjects.filter((s) => s.gradeLevel === filterGrade)

//   // Group by grade level
//   const grouped = filtered.reduce<Record<string, Subject[]>>((acc, subject) => {
//     const key = subject.gradeLevel
//     if (!acc[key]) acc[key] = []
//     acc[key].push(subject)
//     return acc
//   }, {})

//   return (
//     <div className="space-y-6">

//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-2xl font-bold text-foreground">Subjects</h2>
//           <p className="text-sm text-muted-foreground mt-1">
//             {subjects.length} subject{subjects.length !== 1 ? "s" : ""} configured
//           </p>
//         </div>
//         <button
//           type="button"
//           onClick={() => setShowForm(true)}
//           className="flex items-center gap-2 py-2 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
//         >
//           <Plus size={16} />
//           Add subject
//         </button>
//       </div>

//       {error && (
//         <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
//           <p className="text-sm text-destructive">{error}</p>
//         </div>
//       )}

//       {/* Add subject form */}
//       {showForm && (
//         <div className="bg-card rounded-lg border border-border p-6 space-y-4">
//           <h3 className="text-base font-semibold text-foreground">
//             Add new subject
//           </h3>

//           <div className="grid grid-cols-3 gap-4">
//             <div className="space-y-2">
//               <label htmlFor="name" className="text-sm font-medium text-foreground">
//                 Subject name
//               </label>
//               <input
//                 id="name"
//                 type="text"
//                 value={form.name}
//                 onChange={handleChange}
//                 placeholder="e.g. Mathematics"
//                 className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
//               />
//             </div>
//             <div className="space-y-2">
//               <label htmlFor="code" className="text-sm font-medium text-foreground">
//                 Subject code
//               </label>
//               <input
//                 id="code"
//                 type="text"
//                 value={form.code}
//                 onChange={handleChange}
//                 placeholder="e.g. MATH-F1"
//                 className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
//               />
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
//                   <option key={g} value={g}>{g.replace(/_/g, " ")}</option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           <div className="flex gap-3 pt-2">
//             <button
//               type="button"
//               onClick={() => void handleSubmit()}
//               disabled={loading || !form.name || !form.code}
//               className="flex items-center gap-2 py-2 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
//             >
//               <Plus size={16} />
//               {loading ? "Saving..." : "Save subject"}
//             </button>
//             <button
//               type="button"
//               onClick={() => { setShowForm(false); setForm(emptyForm) }}
//               className="py-2 px-4 border border-border rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Filter by grade */}
//       <div className="flex items-center gap-2 flex-wrap">
//         <p className="text-sm text-muted-foreground">Filter by grade:</p>
//         <button
//           type="button"
//           onClick={() => setFilterGrade("all")}
//           className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
//             filterGrade === "all"
//               ? "bg-primary text-primary-foreground border-primary"
//               : "bg-background text-foreground border-border hover:border-primary"
//           }`}
//         >
//           All
//         </button>
//         {GRADE_LEVELS.map((g) => (
//           <button
//             key={g}
//             type="button"
//             onClick={() => setFilterGrade(g)}
//             className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
//               filterGrade === g
//                 ? "bg-primary text-primary-foreground border-primary"
//                 : "bg-background text-foreground border-border hover:border-primary"
//             }`}
//           >
//             {g.replace(/_/g, " ")}
//           </button>
//         ))}
//       </div>

//       {/* Subjects list */}
//       {fetching ? (
//         <div className="bg-card rounded-lg border border-border p-12 text-center">
//           <p className="text-sm text-muted-foreground">Loading subjects...</p>
//         </div>
//       ) : subjects.length === 0 ? (
//         <div className="bg-card rounded-lg border border-border p-12 text-center">
//           <BookMarked size={40} className="mx-auto text-muted-foreground mb-3" />
//           <p className="text-base font-medium text-foreground">No subjects yet</p>
//           <p className="text-sm text-muted-foreground mt-1">
//             Add subjects to use in exams and timetables
//           </p>
//         </div>
//       ) : (
//         <div className="space-y-6">
//           {Object.entries(grouped).map(([gradeLevel, gradeSubjects]) => (
//             <div key={gradeLevel} className="space-y-2">
//               <h3 className="text-sm font-semibold text-foreground">
//                 {gradeLevel.replace(/_/g, " ")}
//               </h3>
//               <div className="bg-card rounded-lg border border-border overflow-hidden">
//                 <table className="w-full">
//                   <thead>
//                     <tr className="border-b border-border bg-muted/50">
//                       <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Subject</th>
//                       <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Code</th>
//                       <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Grade</th>
//                       <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Action</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {gradeSubjects.map((subject) => (
//                       <tr
//                         key={subject.id}
//                         className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
//                       >
//                         <td className="px-4 py-3">
//                           <div className="flex items-center gap-2">
//                             <BookMarked size={14} className="text-muted-foreground" />
//                             <p className="text-sm font-medium text-foreground">
//                               {subject.name}
//                             </p>
//                           </div>
//                         </td>
//                         <td className="px-4 py-3">
//                           <span className="px-2 py-0.5 bg-muted rounded text-xs font-mono text-muted-foreground">
//                             {subject.code}
//                           </span>
//                         </td>
//                         <td className="px-4 py-3 text-sm text-foreground">
//                           {subject.gradeLevel.replace(/_/g, " ")}
//                         </td>
//                         <td className="px-4 py-3">
//                           <button
//                             type="button"
//                             onClick={() => void handleDelete(subject.id)}
//                             className="text-muted-foreground hover:text-red-600 transition-colors"
//                           >
//                             <Trash2 size={16} />
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           ))}
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
import { Plus, Trash2, BookMarked, Search, ChevronRight } from "lucide-react"
import { ConfirmModal } from "@/components/ui/confirm-modal"
import { useTheme } from "@/components/providers/theme-provider"

interface Subject {
  id: string
  name: string
  code: string
  gradeLevel: string
}

const GRADE_LEVELS = [
  "ECD_A", "ECD_B",
  "GRADE_1", "GRADE_2", "GRADE_3",
  "GRADE_4", "GRADE_5", "GRADE_6", "GRADE_7",
  "FORM_1", "FORM_2", "FORM_3",
  "FORM_4", "FORM_5", "FORM_6",
]

const emptyForm = {
  name: "",
  code: "",
  gradeLevel: "FORM_1",
}

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [showForm, setShowForm] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [form, setForm] = useState(emptyForm)
  const { theme } = useTheme()
  const [focused, setFocused] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [filterGrade, setFilterGrade] = useState("all")
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
    async function fetchSubjects() {
      try {
        const res = await fetch("/api/subjects")
        const data = await res.json() as { subjects: Subject[] }
        setSubjects(data.subjects ?? [])
      } catch {
        setError("Failed to load subjects")
      } finally {
        setFetching(false)
      }
    }
    void fetchSubjects()
  }, [])

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }))
  }

  async function handleSubmit() {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json() as { subject: Subject; error?: string }
      if (!res.ok) {
        setError(data.error ?? "Failed to create subject")
        return
      }
      setSubjects((prev) => [...prev, data.subject])
      setForm(emptyForm)
      setShowForm(false)
      setSelectedSubject(data.subject)
    } catch {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(subjectId: string) {
    showConfirm(
      "Delete subject",
      "Are you sure you want to delete this subject? All related exam results will also be removed.",
      async () => {
        setConfirmOpen(false)
        try {
          const res = await fetch(`/api/subjects/${subjectId}`, {
            method: "DELETE",
          })
          if (!res.ok) {
            const data = await res.json() as { error?: string }
            setError(data.error ?? "Failed to delete subject")
            return
          }
          setSubjects((prev) => prev.filter((s) => s.id !== subjectId))
          if (selectedSubject?.id === subjectId) setSelectedSubject(null)
        } catch {
          setError("Something went wrong")
        }
      }
    )
  }

  const filtered = subjects.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase()) ||
      s.gradeLevel.toLowerCase().includes(search.toLowerCase())
    const matchesGrade = filterGrade === "all" || s.gradeLevel === filterGrade
    return matchesSearch && matchesGrade
  })

  // Subjects grouped by grade for the detail panel right side
  const grouped = filtered.reduce<Record<string, Subject[]>>((acc, subject) => {
    const key = subject.gradeLevel
    if (!acc[key]) acc[key] = []
    acc[key].push(subject)
    return acc
  }, {})

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Subjects</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {subjects.length} subject{subjects.length !== 1 ? "s" : ""} configured
          </p>
        </div>
        <button
          type="button"
          onClick={() => { setShowForm(true); setSelectedSubject(null) }}
          className="flex items-center gap-2 py-2 px-4 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
          style={{ backgroundColor: theme.primaryColor, color: theme.primaryText }}
        >
          <Plus size={15} />
          Add subject
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Split layout */}
      <div className="flex gap-4 h-[calc(100vh-180px)]">

        {/* LEFT — subject list */}
        <div className="w-72 shrink-0 bg-card border border-border rounded-xl flex flex-col overflow-hidden">
          <div className="p-3 border-b border-border space-y-2">
            {/* Search */}
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search subjects..."
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
            {/* Grade filter */}
            <select
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value)}
              className="w-full px-2 py-1.5 border border-input rounded-md bg-background text-foreground text-xs focus:outline-none"
            >
              <option value="all">All grades</option>
              {GRADE_LEVELS.map((g) => (
                <option key={g} value={g}>{g.replace(/_/g, " ")}</option>
              ))}
            </select>
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
            ) : filtered.length === 0 ? (
              <div className="p-6 text-center">
                <BookMarked size={26} className="mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No subjects found</p>
              </div>
            ) : (
              filtered.map((subject) => (
                <button
                  key={subject.id}
                  type="button"
                  onClick={() => { setSelectedSubject(subject); setShowForm(false) }}
                  className={`w-full flex items-center gap-3 px-3 py-3 text-left transition-colors border-b border-border/50 last:border-0 ${
                    selectedSubject?.id === subject.id
                      ? "bg-primary/10 border-l-2 border-l-primary"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <BookMarked
                      size={15}
                      style={{ color: theme.primaryColor }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{subject.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {subject.gradeLevel.replace(/_/g, " ")}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span
                      className="text-xs font-mono font-medium"
                      style={{ color: theme.primaryColor }}
                    >
                      {subject.code}
                    </span>
                    <ChevronRight size={12} className="text-muted-foreground" />
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* RIGHT — detail / form panel */}
        <div className="flex-1 bg-card border border-border rounded-xl overflow-y-auto">

          {/* Add subject form */}
          {showForm && (
            <div className="p-6">
              <h3 className="text-base font-semibold text-foreground mb-5">Add new subject</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-foreground">
                      Subject name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      placeholder="e.g. Mathematics"
                      className="w-full px-3 py-2 rounded-md bg-background text-foreground text-sm focus:outline-none"
                      style={{
                        border: `1px solid ${focused ? theme.primaryColor : "#d1d5db"}`,
                        boxShadow: focused ? `0 0 0 2px ${theme.primaryColor}33` : "none",
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="code" className="text-sm font-medium text-foreground">
                      Subject code
                    </label>
                    <input
                      id="code"
                      type="text"
                      value={form.code}
                      onChange={handleChange}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      placeholder="e.g. MATH-F1"
                      className="w-full px-3 py-2 rounded-md bg-background text-foreground text-sm focus:outline-none"
                      style={{
                        border: `1px solid ${focused ? theme.primaryColor : "#d1d5db"}`,
                        boxShadow: focused ? `0 0 0 2px ${theme.primaryColor}33` : "none",
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="gradeLevel" className="text-sm font-medium text-foreground">
                      Grade level
                    </label>
                    <select
                      id="gradeLevel"
                      value={form.gradeLevel}
                      onChange={handleChange}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      className="w-full px-3 py-2 rounded-md bg-background text-foreground text-sm focus:outline-none"
                      style={{
                        border: `1px solid ${focused ? theme.primaryColor : "#d1d5db"}`,
                        boxShadow: focused ? `0 0 0 2px ${theme.primaryColor}33` : "none",
                      }}
                    >
                      {GRADE_LEVELS.map((g) => (
                        <option key={g} value={g}>{g.replace(/_/g, " ")}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => void handleSubmit()}
                    disabled={loading || !form.name || !form.code}
                    className="flex items-center gap-2 py-2 px-4 rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                    style={{ backgroundColor: theme.primaryColor, color: theme.primaryText }}
                  >
                    <Plus size={16} />
                    {loading ? "Saving..." : "Save subject"}
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

          {/* Subject detail */}
          {!showForm && selectedSubject && (
            <div className="p-6 space-y-6">

              {/* Header */}
              <div className="flex items-start justify-between pb-5 border-b border-border">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                    <BookMarked size={24} style={{ color: theme.primaryColor }} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{selectedSubject.name}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {selectedSubject.gradeLevel.replace(/_/g, " ")}
                    </p>
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-primary/10 mt-2"
                      style={{ color: theme.primaryColor }}
                    >
                      {selectedSubject.code}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => void handleDelete(selectedSubject.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded-md hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>

              {/* Info cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-muted/40 rounded-lg p-4 space-y-1">
                  <p className="text-xs text-muted-foreground">Subject name</p>
                  <p className="text-sm font-medium text-foreground">{selectedSubject.name}</p>
                </div>
                <div className="bg-muted/40 rounded-lg p-4 space-y-1">
                  <p className="text-xs text-muted-foreground">Subject code</p>
                  <p className="text-sm font-mono font-medium text-foreground">{selectedSubject.code}</p>
                </div>
                <div className="bg-muted/40 rounded-lg p-4 space-y-1">
                  <p className="text-xs text-muted-foreground">Grade level</p>
                  <p className="text-sm font-medium text-foreground">
                    {selectedSubject.gradeLevel.replace(/_/g, " ")}
                  </p>
                </div>
              </div>

              {/* All subjects in same grade */}
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="px-4 py-2.5 bg-muted/40 border-b border-border flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <BookMarked size={14} className="text-muted-foreground" />
                    Other subjects in {selectedSubject.gradeLevel.replace(/_/g, " ")}
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    {subjects.filter((s) => s.gradeLevel === selectedSubject.gradeLevel && s.id !== selectedSubject.id).length} other{subjects.filter((s) => s.gradeLevel === selectedSubject.gradeLevel && s.id !== selectedSubject.id).length !== 1 ? "s" : ""}
                  </span>
                </div>

                {subjects.filter((s) => s.gradeLevel === selectedSubject.gradeLevel && s.id !== selectedSubject.id).length === 0 ? (
                  <div className="p-8 text-center">
                    <BookMarked size={26} className="mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">No other subjects in this grade</p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Subject</th>
                        <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Code</th>
                        <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subjects
                        .filter((s) => s.gradeLevel === selectedSubject.gradeLevel && s.id !== selectedSubject.id)
                        .map((s, i) => (
                          <tr
                            key={s.id}
                            className={`border-b border-border last:border-0 ${i % 2 === 0 ? "bg-muted/20" : ""}`}
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold shrink-0"
                                  style={{ color: theme.primaryColor }}
                                >
                                  <BookMarked size={13} />
                                </div>
                                <p className="text-sm font-medium text-foreground">{s.name}</p>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-0.5 bg-muted rounded text-xs font-mono text-muted-foreground">
                                {s.code}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button
                                type="button"
                                onClick={() => void handleDelete(s.id)}
                                className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition-colors"
                              >
                                <Trash2 size={13} />
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                )}
              </div>

            </div>
          )}

          {/* Empty state */}
          {!showForm && !selectedSubject && (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-3">
                <BookMarked size={24} className="text-muted-foreground" />
              </div>
              <p className="text-base font-medium text-foreground">Select a subject</p>
              <p className="text-sm text-muted-foreground mt-1">
                Click any subject on the left to view its details
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
