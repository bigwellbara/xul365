// "use client"

// import React, { useState, useEffect } from "react"
// import { Plus, Trash2, ClipboardList } from "lucide-react"
// import { ConfirmModal } from "@/components/ui/confirm-modal"

// interface Exam {
//   id: string
//   name: string
//   academicYear: string
//   term: string
//   gradeLevel: string
//   startDate: string
//   endDate: string
//   results?: ExamResult[]
// }

// interface ExamResult {
//   id: string
//   studentId: string
//   subjectId: string
//   marks: number
//   grade: string
//   comments?: string
//   student?: {
//     firstName: string
//     lastName: string
//   }
//   subject?: {
//     name: string
//   }
// }

// interface Student {
//   id: string
//   firstName: string
//   lastName: string
//   gradeLevel: string
// }

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

// const TERMS = ["TERM_1", "TERM_2", "TERM_3"]

// const emptyExamForm = {
//   name: "",
//   academicYear: "2025",
//   term: "TERM_1",
//   gradeLevel: "FORM_1",
//   startDate: "",
//   endDate: "",
// }

// function getGrade(marks: number): string {
//   if (marks >= 80) return "A"
//   if (marks >= 70) return "B"
//   if (marks >= 60) return "C"
//   if (marks >= 50) return "D"
//   if (marks >= 40) return "E"
//   return "U"
// }

// const GRADE_STYLES: Record<string, string> = {
//   A: "bg-green-100 text-green-800",
//   B: "bg-blue-100 text-blue-800",
//   C: "bg-amber-100 text-amber-800",
//   D: "bg-orange-100 text-orange-800",
//   E: "bg-red-100 text-red-800",
//   U: "bg-red-200 text-red-900",
// }

// export default function ExamsPage() {
//   const [exams, setExams] = useState<Exam[]>([])
//   const [students, setStudents] = useState<Student[]>([])
//   const [subjects, setSubjects] = useState<Subject[]>([])
//   const [showExamForm, setShowExamForm] = useState(false)
//   const [selectedExam, setSelectedExam] = useState<Exam | null>(null)
//   const [showResultForm, setShowResultForm] = useState(false)
//   const [examForm, setExamForm] = useState(emptyExamForm)
//   const [resultForm, setResultForm] = useState({
//     studentId: "",
//     subjectId: "",
//     marks: "",
//     comments: "",
//   })
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
//         const [examsRes, studentsRes, subjectsRes] = await Promise.all([
//           fetch("/api/exams"),
//           fetch("/api/students"),
//           fetch("/api/subjects"),
//         ])
//         const examsData = await examsRes.json() as { exams: Exam[] }
//         const studentsData = await studentsRes.json() as { students: Student[] }
//         const subjectsData = await subjectsRes.json() as { subjects: Subject[] }
//         setExams(examsData.exams ?? [])
//         setStudents(studentsData.students ?? [])
//         setSubjects(subjectsData.subjects ?? [])
//       } catch {
//         setError("Failed to load data")
//       } finally {
//         setFetching(false)
//       }
//     }
//     void fetchData()
//   }, [])

//   function handleExamFormChange(
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) {
//     setExamForm((prev) => ({ ...prev, [e.target.id]: e.target.value }))
//   }

//   function handleResultFormChange(
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
//   ) {
//     setResultForm((prev) => ({ ...prev, [e.target.id]: e.target.value }))
//   }

//   async function handleCreateExam() {
//     setLoading(true)
//     setError("")
//     try {
//       const res = await fetch("/api/exams", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(examForm),
//       })
//       const data = await res.json() as { exam: Exam; error?: string }
//       if (!res.ok) {
//         setError(data.error ?? "Failed to create exam")
//         return
//       }
//       setExams((prev) => [data.exam, ...prev])
//       setExamForm(emptyExamForm)
//       setShowExamForm(false)
//     } catch {
//       setError("Something went wrong")
//     } finally {
//       setLoading(false)
//     }
//   }

//   async function handleAddResult() {
//     if (!selectedExam) return
//     setLoading(true)
//     setError("")
//     try {
//       const marks = parseFloat(resultForm.marks)
//       const grade = getGrade(marks)
//       const res = await fetch("/api/exams/results", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           examId: selectedExam.id,
//           studentId: resultForm.studentId,
//           subjectId: resultForm.subjectId,
//           marks,
//           grade,
//           comments: resultForm.comments,
//         }),
//       })
//       const data = await res.json() as { result: ExamResult; error?: string }
//       if (!res.ok) {
//         setError(data.error ?? "Failed to add result")
//         return
//       }
//       // Refresh exams
//       const examsRes = await fetch("/api/exams")
//       const examsData = await examsRes.json() as { exams: Exam[] }
//       setExams(examsData.exams ?? [])
//       const updated = examsData.exams.find((e) => e.id === selectedExam.id)
//       if (updated) setSelectedExam(updated)
//       setResultForm({ studentId: "", subjectId: "", marks: "", comments: "" })
//       setShowResultForm(false)
//     } catch {
//       setError("Something went wrong")
//     } finally {
//       setLoading(false)
//     }
//   }

//   async function handleDeleteExam(examId: string) {
//     showConfirm(
//       "Delete exam",
//       "Are you sure you want to delete this exam and all its results?",
//       async () => {
//         setConfirmOpen(false)
//         try {
//           const res = await fetch(`/api/exams/${examId}`, {
//             method: "DELETE",
//           })
//           if (!res.ok) {
//             const data = await res.json() as { error?: string }
//             setError(data.error ?? "Failed to delete exam")
//             return
//           }
//           setExams((prev) => prev.filter((e) => e.id !== examId))
//           if (selectedExam?.id === examId) setSelectedExam(null)
//         } catch {
//           setError("Something went wrong")
//         }
//       }
//     )
//   }

//   // Filter students by exam grade level
//   const filteredStudents = selectedExam
//     ? students.filter((s) => s.gradeLevel === selectedExam.gradeLevel)
//     : students

//   // Filter subjects by exam grade level
//   const filteredSubjects = selectedExam
//     ? subjects.filter((s) => s.gradeLevel === selectedExam.gradeLevel)
//     : subjects

//   return (
//     <div className="space-y-6">

//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-2xl font-bold text-foreground">Exams & Results</h2>
//           <p className="text-sm text-muted-foreground mt-1">
//             Manage exams and student results
//           </p>
//         </div>
//         <button
//           type="button"
//           onClick={() => setShowExamForm(true)}
//           className="flex items-center gap-2 py-2 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
//         >
//           <Plus size={16} />
//           Create exam
//         </button>
//       </div>

//       {error && (
//         <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
//           <p className="text-sm text-destructive">{error}</p>
//         </div>
//       )}

//       {/* Create exam form */}
//       {showExamForm && (
//         <div className="bg-card rounded-lg border border-border p-6 space-y-4">
//           <h3 className="text-base font-semibold text-foreground">
//             Create new exam
//           </h3>

//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <label htmlFor="name" className="text-sm font-medium text-foreground">
//                 Exam name
//               </label>
//               <input
//                 id="name"
//                 type="text"
//                 value={examForm.name}
//                 onChange={handleExamFormChange}
//                 placeholder="e.g. End of Term Exam"
//                 className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
//               />
//             </div>
//             <div className="space-y-2">
//               <label htmlFor="gradeLevel" className="text-sm font-medium text-foreground">
//                 Grade level
//               </label>
//               <select
//                 id="gradeLevel"
//                 value={examForm.gradeLevel}
//                 onChange={handleExamFormChange}
//                 className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
//               >
//                 {GRADE_LEVELS.map((g) => (
//                   <option key={g} value={g}>{g.replace(/_/g, " ")}</option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           <div className="grid grid-cols-3 gap-4">
//             <div className="space-y-2">
//               <label htmlFor="term" className="text-sm font-medium text-foreground">
//                 Term
//               </label>
//               <select
//                 id="term"
//                 value={examForm.term}
//                 onChange={handleExamFormChange}
//                 className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
//               >
//                 {TERMS.map((t) => (
//                   <option key={t} value={t}>{t.replace("_", " ")}</option>
//                 ))}
//               </select>
//             </div>
//             <div className="space-y-2">
//               <label htmlFor="academicYear" className="text-sm font-medium text-foreground">
//                 Academic year
//               </label>
//               <input
//                 id="academicYear"
//                 type="text"
//                 value={examForm.academicYear}
//                 onChange={handleExamFormChange}
//                 className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
//               />
//             </div>
//             <div className="space-y-2">
//               <label htmlFor="startDate" className="text-sm font-medium text-foreground">
//                 Start date
//               </label>
//               <input
//                 id="startDate"
//                 type="date"
//                 value={examForm.startDate}
//                 onChange={handleExamFormChange}
//                 className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
//               />
//             </div>
//           </div>

//           <div className="space-y-2">
//             <label htmlFor="endDate" className="text-sm font-medium text-foreground">
//               End date
//             </label>
//             <input
//               id="endDate"
//               type="date"
//               value={examForm.endDate}
//               onChange={handleExamFormChange}
//               className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
//             />
//           </div>

//           <div className="flex gap-3 pt-2">
//             <button
//               type="button"
//               onClick={() => void handleCreateExam()}
//               disabled={loading || !examForm.name || !examForm.startDate || !examForm.endDate}
//               className="flex items-center gap-2 py-2 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
//             >
//               <Plus size={16} />
//               {loading ? "Creating..." : "Create exam"}
//             </button>
//             <button
//               type="button"
//               onClick={() => { setShowExamForm(false); setExamForm(emptyExamForm) }}
//               className="py-2 px-4 border border-border rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

//         {/* Exams list */}
//         <div className="space-y-3">
//           <h3 className="text-sm font-medium text-foreground">All exams</h3>

//           {fetching ? (
//             <div className="bg-card rounded-lg border border-border p-8 text-center">
//               <p className="text-sm text-muted-foreground">Loading...</p>
//             </div>
//           ) : exams.length === 0 ? (
//             <div className="bg-card rounded-lg border border-border p-8 text-center">
//               <ClipboardList size={32} className="mx-auto text-muted-foreground mb-3" />
//               <p className="text-sm font-medium text-foreground">No exams yet</p>
//               <p className="text-xs text-muted-foreground mt-1">
//                 Create your first exam above
//               </p>
//             </div>
//           ) : (
//             exams.map((exam) => (
//               <div
//                 key={exam.id}
//                 onClick={() => setSelectedExam(exam)}
//                 className={`bg-card rounded-lg border p-4 cursor-pointer transition-colors space-y-2 ${
//                   selectedExam?.id === exam.id
//                     ? "border-primary bg-primary/5"
//                     : "border-border hover:border-primary/50"
//                 }`}
//               >
//                 <div className="flex items-start justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-foreground">
//                       {exam.name}
//                     </p>
//                     <p className="text-xs text-muted-foreground mt-0.5">
//                       {exam.gradeLevel.replace(/_/g, " ")} · {exam.term.replace("_", " ")} {exam.academicYear}
//                     </p>
//                   </div>
//                   <button
//                     type="button"
//                     onClick={(e) => {
//                       e.stopPropagation()
//                       void handleDeleteExam(exam.id)
//                     }}
//                     className="text-muted-foreground hover:text-red-600 transition-colors"
//                   >
//                     <Trash2 size={14} />
//                   </button>
//                 </div>
//                 <p className="text-xs text-muted-foreground">
//                   {new Date(exam.startDate).toLocaleDateString()} — {new Date(exam.endDate).toLocaleDateString()}
//                 </p>
//                 <p className="text-xs text-primary font-medium">
//                   {exam.results?.length ?? 0} results recorded
//                 </p>
//               </div>
//             ))
//           )}
//         </div>

//         {/* Results panel */}
//         <div className="lg:col-span-2 space-y-4">
//           {!selectedExam ? (
//             <div className="bg-card rounded-lg border border-border p-12 text-center">
//               <ClipboardList size={40} className="mx-auto text-muted-foreground mb-3" />
//               <p className="text-sm font-medium text-foreground">
//                 Select an exam to view results
//               </p>
//             </div>
//           ) : (
//             <>
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h3 className="text-base font-semibold text-foreground">
//                     {selectedExam.name}
//                   </h3>
//                   <p className="text-xs text-muted-foreground mt-0.5">
//                     {selectedExam.gradeLevel.replace(/_/g, " ")} · {selectedExam.term.replace("_", " ")} {selectedExam.academicYear}
//                   </p>
//                 </div>
//                 <button
//                   type="button"
//                   onClick={() => setShowResultForm(true)}
//                   className="flex items-center gap-2 py-2 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
//                 >
//                   <Plus size={16} />
//                   Add result
//                 </button>
//               </div>

//               {/* Add result form */}
//               {showResultForm && (
//                 <div className="bg-card rounded-lg border border-border p-4 space-y-4">
//                   <h4 className="text-sm font-semibold text-foreground">
//                     Add result
//                   </h4>

//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <label htmlFor="studentId" className="text-sm font-medium text-foreground">
//                         Student
//                       </label>
//                       <select
//                         id="studentId"
//                         value={resultForm.studentId}
//                         onChange={handleResultFormChange}
//                         className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
//                       >
//                         <option value="">Select student...</option>
//                         {filteredStudents.map((s) => (
//                           <option key={s.id} value={s.id}>
//                             {s.firstName} {s.lastName}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     <div className="space-y-2">
//                       <label htmlFor="subjectId" className="text-sm font-medium text-foreground">
//                         Subject
//                       </label>
//                       <select
//                         id="subjectId"
//                         value={resultForm.subjectId}
//                         onChange={handleResultFormChange}
//                         className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
//                       >
//                         <option value="">Select subject...</option>
//                         {filteredSubjects.map((s) => (
//                           <option key={s.id} value={s.id}>
//                             {s.name}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <label htmlFor="marks" className="text-sm font-medium text-foreground">
//                         Marks (out of 100)
//                       </label>
//                       <input
//                         id="marks"
//                         type="number"
//                         value={resultForm.marks}
//                         onChange={handleResultFormChange}
//                         min="0"
//                         max="100"
//                         placeholder="0 - 100"
//                         className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
//                       />
//                       {resultForm.marks && (
//                         <p className="text-xs text-muted-foreground">
//                           Grade: <span className="font-bold text-foreground">
//                             {getGrade(parseFloat(resultForm.marks))}
//                           </span>
//                         </p>
//                       )}
//                     </div>
//                     <div className="space-y-2">
//                       <label htmlFor="comments" className="text-sm font-medium text-foreground">
//                         Comments (optional)
//                       </label>
//                       <input
//                         id="comments"
//                         type="text"
//                         value={resultForm.comments}
//                         onChange={handleResultFormChange}
//                         placeholder="Any remarks..."
//                         className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
//                       />
//                     </div>
//                   </div>

//                   <div className="flex gap-3">
//                     <button
//                       type="button"
//                       onClick={() => void handleAddResult()}
//                       disabled={loading || !resultForm.studentId || !resultForm.subjectId || !resultForm.marks}
//                       className="py-2 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
//                     >
//                       {loading ? "Saving..." : "Save result"}
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() => setShowResultForm(false)}
//                       className="py-2 px-4 border border-border rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors"
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {/* Results table */}
//               {(!selectedExam.results || selectedExam.results.length === 0) ? (
//                 <div className="bg-card rounded-lg border border-border p-8 text-center">
//                   <p className="text-sm text-muted-foreground">
//                     No results recorded yet. Click Add result to get started.
//                   </p>
//                 </div>
//               ) : (
//                 <div className="bg-card rounded-lg border border-border overflow-hidden">
//                   <table className="w-full">
//                     <thead>
//                       <tr className="border-b border-border bg-muted/50">
//                         <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Student</th>
//                         <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Subject</th>
//                         <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Marks</th>
//                         <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Grade</th>
//                         <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Comments</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {selectedExam.results.map((result) => (
//                         <tr
//                           key={result.id}
//                           className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
//                         >
//                           <td className="px-4 py-3 text-sm font-medium text-foreground">
//                             {result.student
//                               ? `${result.student.firstName} ${result.student.lastName}`
//                               : "Unknown"}
//                           </td>
//                           <td className="px-4 py-3 text-sm text-foreground">
//                             {result.subject?.name ?? "Unknown"}
//                           </td>
//                           <td className="px-4 py-3 text-sm font-medium text-foreground">
//                             {result.marks}%
//                           </td>
//                           <td className="px-4 py-3">
//                             <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${GRADE_STYLES[result.grade] ?? ""}`}>
//                               {result.grade}
//                             </span>
//                           </td>
//                           <td className="px-4 py-3 text-sm text-muted-foreground">
//                             {result.comments ?? "—"}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </>
//           )}
//         </div>

//       </div>

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
import { Plus, Trash2, ClipboardList, Search, ChevronRight } from "lucide-react"
import { ConfirmModal } from "@/components/ui/confirm-modal"
import { useTheme } from "@/components/providers/theme-provider"
import { FeatureGate } from "@/components/ui/feature-gate"
import { useFeatures } from "@/hooks/use-features"

interface Exam {
  id: string
  name: string
  academicYear: string
  term: string
  gradeLevel: string
  startDate: string
  endDate: string
  results?: ExamResult[]
}

interface ExamResult {
  id: string
  studentId: string
  subjectId: string
  marks: number
  grade: string
  comments?: string
  student?: { firstName: string; lastName: string }
  subject?: { name: string }
}

interface Student {
  id: string
  firstName: string
  lastName: string
  gradeLevel: string
}

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

const TERMS = ["TERM_1", "TERM_2", "TERM_3"]

const emptyExamForm = {
  name: "",
  academicYear: "2025",
  term: "TERM_1",
  gradeLevel: "FORM_1",
  startDate: "",
  endDate: "",
}

function getGrade(marks: number): string {
  if (marks >= 80) return "A"
  if (marks >= 70) return "B"
  if (marks >= 60) return "C"
  if (marks >= 50) return "D"
  if (marks >= 40) return "E"
  return "U"
}

const GRADE_STYLES: Record<string, string> = {
  A: "bg-green-100 text-green-800",
  B: "bg-blue-100 text-blue-800",
  C: "bg-amber-100 text-amber-800",
  D: "bg-orange-100 text-orange-800",
  E: "bg-red-100 text-red-800",
  U: "bg-red-200 text-red-900",
}

const TERM_COLORS: Record<string, string> = {
  TERM_1: "bg-blue-50 text-blue-700 border-blue-200",
  TERM_2: "bg-purple-50 text-purple-700 border-purple-200",
  TERM_3: "bg-green-50 text-green-700 border-green-200",
}

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [showExamForm, setShowExamForm] = useState(false)
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null)
  const [showResultForm, setShowResultForm] = useState(false)
  const [examForm, setExamForm] = useState(emptyExamForm)
  const [resultForm, setResultForm] = useState({ studentId: "", subjectId: "", marks: "", comments: "" })
  const { theme } = useTheme()
  const { selectedFeatures } = useFeatures()
  const [focused, setFocused] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
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
        const [examsRes, studentsRes, subjectsRes] = await Promise.all([
          fetch("/api/exams"),
          fetch("/api/students"),
          fetch("/api/subjects"),
        ])
        const examsData = await examsRes.json() as { exams: Exam[] }
        const studentsData = await studentsRes.json() as { students: Student[] }
        const subjectsData = await subjectsRes.json() as { subjects: Subject[] }
        setExams(examsData.exams ?? [])
        setStudents(studentsData.students ?? [])
        setSubjects(subjectsData.subjects ?? [])
      } catch {
        setError("Failed to load data")
      } finally {
        setFetching(false)
      }
    }
    void fetchData()
  }, [])

  function handleExamFormChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setExamForm((prev) => ({ ...prev, [e.target.id]: e.target.value }))
  }

  function handleResultFormChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setResultForm((prev) => ({ ...prev, [e.target.id]: e.target.value }))
  }

  async function handleCreateExam() {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(examForm),
      })
      const data = await res.json() as { exam: Exam; error?: string }
      if (!res.ok) { setError(data.error ?? "Failed to create exam"); return }
      setExams((prev) => [data.exam, ...prev])
      setExamForm(emptyExamForm)
      setShowExamForm(false)
      setSelectedExam(data.exam)
    } catch {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  async function handleAddResult() {
    if (!selectedExam) return
    setLoading(true)
    setError("")
    try {
      const marks = parseFloat(resultForm.marks)
      const grade = getGrade(marks)
      const res = await fetch("/api/exams/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examId: selectedExam.id,
          studentId: resultForm.studentId,
          subjectId: resultForm.subjectId,
          marks,
          grade,
          comments: resultForm.comments,
        }),
      })
      const data = await res.json() as { result: ExamResult; error?: string }
      if (!res.ok) { setError(data.error ?? "Failed to add result"); return }
      const examsRes = await fetch("/api/exams")
      const examsData = await examsRes.json() as { exams: Exam[] }
      setExams(examsData.exams ?? [])
      const updated = examsData.exams.find((e) => e.id === selectedExam.id)
      if (updated) setSelectedExam(updated)
      setResultForm({ studentId: "", subjectId: "", marks: "", comments: "" })
      setShowResultForm(false)
    } catch {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteExam(examId: string) {
    showConfirm(
      "Delete exam",
      "Are you sure you want to delete this exam and all its results?",
      async () => {
        setConfirmOpen(false)
        try {
          const res = await fetch(`/api/exams/${examId}`, { method: "DELETE" })
          if (!res.ok) {
            const data = await res.json() as { error?: string }
            setError(data.error ?? "Failed to delete exam")
            return
          }
          setExams((prev) => prev.filter((e) => e.id !== examId))
          if (selectedExam?.id === examId) setSelectedExam(null)
        } catch {
          setError("Something went wrong")
        }
      }
    )
  }

  const filteredStudents = selectedExam
    ? students.filter((s) => s.gradeLevel === selectedExam.gradeLevel)
    : students

  const filteredSubjects = selectedExam
    ? subjects.filter((s) => s.gradeLevel === selectedExam.gradeLevel)
    : subjects

  const filteredExams = exams.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.gradeLevel.toLowerCase().includes(search.toLowerCase()) ||
    e.term.toLowerCase().includes(search.toLowerCase())
  )

  const inputStyle = {
    border: `1px solid ${focused ? theme.primaryColor : "#d1d5db"}`,
    boxShadow: focused ? `0 0 0 2px ${theme.primaryColor}33` : "none",
  }

  return (

      <FeatureGate
      featureKey="exams_grading"
      featureName="Exams and Grading"
      description="Manage exams and student results."
      selectedFeatures={selectedFeatures}
    >
    <div className="space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Exams & Results</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage exams and student results
          </p>
        </div>
        <button
          type="button"
          onClick={() => { setShowExamForm(true); setSelectedExam(null) }}
          className="flex items-center gap-2 py-2 px-4 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
          style={{ backgroundColor: theme.primaryColor, color: theme.primaryText }}
        >
          <Plus size={15} />
          Create exam
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Split layout */}
      <div className="flex gap-4 h-[calc(100vh-180px)]">

        {/* LEFT — exam list */}
        <div className="w-72 shrink-0 bg-card border border-border rounded-xl flex flex-col overflow-hidden">
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search exams..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className="w-full pl-8 pr-3 py-1.5 rounded-md bg-background text-foreground text-xs placeholder:text-muted-foreground focus:outline-none"
                style={inputStyle}
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
            ) : filteredExams.length === 0 ? (
              <div className="p-6 text-center">
                <ClipboardList size={26} className="mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No exams found</p>
              </div>
            ) : (
              filteredExams.map((exam) => (
                <button
                  key={exam.id}
                  type="button"
                  onClick={() => { setSelectedExam(exam); setShowExamForm(false) }}
                  className={`w-full flex items-center gap-3 px-3 py-3 text-left transition-colors border-b border-border/50 last:border-0 ${
                    selectedExam?.id === exam.id
                      ? "bg-primary/10 border-l-2 border-l-primary"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <ClipboardList size={15} style={{ color: theme.primaryColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{exam.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {exam.gradeLevel.replace(/_/g, " ")} · {exam.academicYear}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-xs font-medium" style={{ color: theme.primaryColor }}>
                      {exam.results?.length ?? 0}
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

          {/* Create exam form */}
          {showExamForm && (
            <div className="p-6">
              <h3 className="text-base font-semibold text-foreground mb-5">Create new exam</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-foreground">Exam name</label>
                    <input
                      id="name" type="text" value={examForm.name} onChange={handleExamFormChange}
                      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                      placeholder="e.g. End of Term Exam"
                      className="w-full px-3 py-2 rounded-md bg-background text-foreground text-sm focus:outline-none"
                      style={inputStyle}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="gradeLevel" className="text-sm font-medium text-foreground">Grade level</label>
                    <select
                      id="gradeLevel" value={examForm.gradeLevel} onChange={handleExamFormChange}
                      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                      className="w-full px-3 py-2 rounded-md bg-background text-foreground text-sm focus:outline-none"
                      style={inputStyle}
                    >
                      {GRADE_LEVELS.map((g) => <option key={g} value={g}>{g.replace(/_/g, " ")}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="term" className="text-sm font-medium text-foreground">Term</label>
                    <select
                      id="term" value={examForm.term} onChange={handleExamFormChange}
                      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                      className="w-full px-3 py-2 rounded-md bg-background text-foreground text-sm focus:outline-none"
                      style={inputStyle}
                    >
                      {TERMS.map((t) => <option key={t} value={t}>{t.replace("_", " ")}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="academicYear" className="text-sm font-medium text-foreground">Academic year</label>
                    <input
                      id="academicYear" type="text" value={examForm.academicYear} onChange={handleExamFormChange}
                      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                      className="w-full px-3 py-2 rounded-md bg-background text-foreground text-sm focus:outline-none"
                      style={inputStyle}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="startDate" className="text-sm font-medium text-foreground">Start date</label>
                    <input
                      id="startDate" type="date" value={examForm.startDate} onChange={handleExamFormChange}
                      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                      className="w-full px-3 py-2 rounded-md bg-background text-foreground text-sm focus:outline-none"
                      style={inputStyle}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="endDate" className="text-sm font-medium text-foreground">End date</label>
                    <input
                      id="endDate" type="date" value={examForm.endDate} onChange={handleExamFormChange}
                      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                      className="w-full px-3 py-2 rounded-md bg-background text-foreground text-sm focus:outline-none"
                      style={inputStyle}
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => void handleCreateExam()}
                    disabled={loading || !examForm.name || !examForm.startDate || !examForm.endDate}
                    className="flex items-center gap-2 py-2 px-4 rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                    style={{ backgroundColor: theme.primaryColor, color: theme.primaryText }}
                  >
                    <Plus size={16} />
                    {loading ? "Creating..." : "Create exam"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowExamForm(false); setExamForm(emptyExamForm) }}
                    className="py-2 px-4 border border-border rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Exam detail + results */}
          {!showExamForm && selectedExam && (
            <div className="p-6 space-y-6">

              {/* Header */}
              <div className="flex items-start justify-between pb-5 border-b border-border">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                    <ClipboardList size={24} style={{ color: theme.primaryColor }} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{selectedExam.name}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {selectedExam.gradeLevel.replace(/_/g, " ")} · {selectedExam.academicYear}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${TERM_COLORS[selectedExam.term] ?? ""}`}>
                        {selectedExam.term.replace("_", " ")}
                      </span>
                      <span
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10"
                        style={{ color: theme.primaryColor }}
                      >
                        {selectedExam.results?.length ?? 0} result{(selectedExam.results?.length ?? 0) !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowResultForm(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: theme.primaryColor, color: theme.primaryText }}
                  >
                    <Plus size={14} />
                    Add result
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDeleteExam(selectedExam.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded-md hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>

              {/* Info cards */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-muted/40 rounded-lg p-4 space-y-1">
                  <p className="text-xs text-muted-foreground">Grade level</p>
                  <p className="text-sm font-medium text-foreground">{selectedExam.gradeLevel.replace(/_/g, " ")}</p>
                </div>
                <div className="bg-muted/40 rounded-lg p-4 space-y-1">
                  <p className="text-xs text-muted-foreground">Term</p>
                  <p className="text-sm font-medium text-foreground">{selectedExam.term.replace("_", " ")}</p>
                </div>
                <div className="bg-muted/40 rounded-lg p-4 space-y-1">
                  <p className="text-xs text-muted-foreground">Start date</p>
                  <p className="text-sm font-medium text-foreground">
                    {new Date(selectedExam.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-muted/40 rounded-lg p-4 space-y-1">
                  <p className="text-xs text-muted-foreground">End date</p>
                  <p className="text-sm font-medium text-foreground">
                    {new Date(selectedExam.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Add result form */}
              {showResultForm && (
                <div className="border border-border rounded-lg p-5 space-y-4">
                  <h4 className="text-sm font-semibold text-foreground">Add result</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="studentId" className="text-sm font-medium text-foreground">Student</label>
                      <select
                        id="studentId" value={resultForm.studentId} onChange={handleResultFormChange}
                        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                        className="w-full px-3 py-2 rounded-md bg-background text-foreground text-sm focus:outline-none"
                        style={inputStyle}
                      >
                        <option value="">Select student...</option>
                        {filteredStudents.map((s) => (
                          <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="subjectId" className="text-sm font-medium text-foreground">Subject</label>
                      <select
                        id="subjectId" value={resultForm.subjectId} onChange={handleResultFormChange}
                        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                        className="w-full px-3 py-2 rounded-md bg-background text-foreground text-sm focus:outline-none"
                        style={inputStyle}
                      >
                        <option value="">Select subject...</option>
                        {filteredSubjects.map((s) => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="marks" className="text-sm font-medium text-foreground">Marks (out of 100)</label>
                      <input
                        id="marks" type="number" value={resultForm.marks} onChange={handleResultFormChange}
                        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                        min="0" max="100" placeholder="0 – 100"
                        className="w-full px-3 py-2 rounded-md bg-background text-foreground text-sm focus:outline-none"
                        style={inputStyle}
                      />
                      {resultForm.marks && (
                        <p className="text-xs text-muted-foreground">
                          Grade:{" "}
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-bold ${GRADE_STYLES[getGrade(parseFloat(resultForm.marks))] ?? ""}`}>
                            {getGrade(parseFloat(resultForm.marks))}
                          </span>
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="comments" className="text-sm font-medium text-foreground">Comments (optional)</label>
                      <input
                        id="comments" type="text" value={resultForm.comments} onChange={handleResultFormChange}
                        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                        placeholder="Any remarks..."
                        className="w-full px-3 py-2 rounded-md bg-background text-foreground text-sm focus:outline-none"
                        style={inputStyle}
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => void handleAddResult()}
                      disabled={loading || !resultForm.studentId || !resultForm.subjectId || !resultForm.marks}
                      className="py-2 px-4 rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                      style={{ backgroundColor: theme.primaryColor, color: theme.primaryText }}
                    >
                      {loading ? "Saving..." : "Save result"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowResultForm(false)}
                      className="py-2 px-4 border border-border rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Results table */}
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="px-4 py-2.5 bg-muted/40 border-b border-border flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-foreground">Results</h4>
                  <span className="text-xs text-muted-foreground">
                    {selectedExam.results?.length ?? 0} record{(selectedExam.results?.length ?? 0) !== 1 ? "s" : ""}
                  </span>
                </div>

                {!selectedExam.results || selectedExam.results.length === 0 ? (
                  <div className="p-8 text-center">
                    <ClipboardList size={26} className="mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">No results yet — click Add result to get started.</p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Student</th>
                        <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Subject</th>
                        <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Marks</th>
                        <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Grade</th>
                        <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Comments</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedExam.results.map((result, i) => (
                        <tr
                          key={result.id}
                          className={`border-b border-border last:border-0 transition-colors ${i % 2 === 0 ? "bg-muted/20" : ""}`}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold shrink-0"
                                style={{ color: theme.primaryColor }}
                              >
                                {result.student
                                  ? `${result.student.firstName[0]}${result.student.lastName[0]}`
                                  : "?"}
                              </div>
                              <p className="text-sm font-medium text-foreground">
                                {result.student
                                  ? `${result.student.firstName} ${result.student.lastName}`
                                  : "Unknown"}
                              </p>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-foreground">
                            {result.subject?.name ?? "Unknown"}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-foreground">
                            {result.marks}%
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${GRADE_STYLES[result.grade] ?? ""}`}>
                              {result.grade}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            {result.comments ?? "—"}
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
          {!showExamForm && !selectedExam && (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-3">
                <ClipboardList size={24} className="text-muted-foreground" />
              </div>
              <p className="text-base font-medium text-foreground">Select an exam</p>
              <p className="text-sm text-muted-foreground mt-1">
                Click any exam on the left to view its results
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
    </FeatureGate>
  )
}
