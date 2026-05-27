"use client"

import React, { useState, useEffect } from "react"
import { ChevronRight, Search, Plus, BookOpen, Users, UserRound, Trash2, UserMinus, GraduationCap } from "lucide-react"
import { ConfirmModal } from "@/components/ui/confirm-modal"

interface Teacher {
  id: string
  firstName: string
  lastName: string
}

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
  academicYear: string
  capacity: number
  teacher: {
    firstName: string
    lastName: string
  }
  enrollments: {
    student: Student
  }[]
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
  gradeLevel: "FORM_1",
  teacherId: "",
  academicYear: "2025",
  capacity: "40",
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<ClassItem[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [showForm, setShowForm] = useState(false)
  const [showEnrollForm, setShowEnrollForm] = useState(false)
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null)
  const [selectedStudentId, setSelectedStudentId] = useState("")
  const [form, setForm] = useState(emptyForm)
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

  useEffect(() => {
    async function fetchData() {
      try {
        const [classesRes, teachersRes, studentsRes] = await Promise.all([
          fetch("/api/classes"),
          fetch("/api/teachers"),
          fetch("/api/students"),
        ])
        const classesData = await classesRes.json() as { classes: ClassItem[] }
        const teachersData = await teachersRes.json() as { teachers: Teacher[] }
        const studentsData = await studentsRes.json() as { students: Student[] }
        setClasses(classesData.classes ?? [])
        setTeachers(teachersData.teachers ?? [])
        setStudents(studentsData.students ?? [])
        if (teachersData.teachers?.length > 0) {
          setForm((prev) => ({ ...prev, teacherId: teachersData.teachers[0]?.id ?? "" }))
        }
      } catch {
        setError("Failed to load data")
      } finally {
        setFetching(false)
      }
    }
    void fetchData()
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }))
  }

  function showConfirm(title: string, message: string, onConfirm: () => void) {
    setConfirmConfig({ title, message, onConfirm })
    setConfirmOpen(true)
  }

  async function handleCreateClass() {
    if (!form.teacherId) { setError("Please add a teacher first"); return }
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          gradeLevel: form.gradeLevel,
          teacherId: form.teacherId,
          academicYear: form.academicYear,
          capacity: parseInt(form.capacity),
        }),
      })
      const data = await res.json() as { class: ClassItem; error?: string }
      if (!res.ok) { setError(data.error ?? "Failed to create class"); return }
      const classesRes = await fetch("/api/classes")
      const classesData = await classesRes.json() as { classes: ClassItem[] }
      setClasses(classesData.classes ?? [])
      setForm(emptyForm)
      setShowForm(false)
    } catch {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  async function handleEnrollStudent() {
    if (!selectedClass || !selectedStudentId) return
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classId: selectedClass.id, studentId: selectedStudentId }),
      })
      const data = await res.json() as { error?: string }
      if (!res.ok) { setError(data.error ?? "Failed to enroll student"); return }
      const classesRes = await fetch("/api/classes")
      const classesData = await classesRes.json() as { classes: ClassItem[] }
      setClasses(classesData.classes ?? [])
      const updated = classesData.classes.find((c) => c.id === selectedClass.id)
      if (updated) setSelectedClass(updated)
      setSelectedStudentId("")
      setShowEnrollForm(false)
    } catch {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  async function handleUnenrollStudent(classId: string, studentId: string) {
    showConfirm("Remove student", "Are you sure you want to remove this student from the class?", async () => {
      setConfirmOpen(false)
      setLoading(true)
      try {
        const res = await fetch("/api/classes/unenroll", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ classId, studentId }),
        })
        const data = await res.json() as { error?: string }
        if (!res.ok) { setError(data.error ?? "Failed to unenroll student"); return }
        const classesRes = await fetch("/api/classes")
        const classesData = await classesRes.json() as { classes: ClassItem[] }
        setClasses(classesData.classes ?? [])
        const updated = classesData.classes.find((c) => c.id === classId)
        if (updated) setSelectedClass(updated)
      } catch {
        setError("Something went wrong")
      } finally {
        setLoading(false)
      }
    })
  }

  async function handleDeleteClass(classId: string) {
    showConfirm("Delete class", "Are you sure you want to delete this class? This action cannot be undone.", async () => {
      setConfirmOpen(false)
      setLoading(true)
      try {
        const res = await fetch("/api/classes/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ classId }),
        })
        const data = await res.json() as { error?: string }
        if (!res.ok) { setError(data.error ?? "Failed to delete class"); return }
        setClasses((prev) => prev.filter((c) => c.id !== classId))
        if (selectedClass?.id === classId) setSelectedClass(null)
      } catch {
        setError("Something went wrong")
      } finally {
        setLoading(false)
      }
    })
  }

  const filtered = classes.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.gradeLevel.toLowerCase().includes(search.toLowerCase())
  )

  const enrollableStudents = students.filter(
    (s) =>
      s.gradeLevel === selectedClass?.gradeLevel &&
      !selectedClass?.enrollments.some((e) => e.student.id === s.id)
  )

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Classes</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {classes.length} class{classes.length !== 1 ? "es" : ""} created
          </p>
        </div>
        <button
          type="button"
          onClick={() => { setShowForm(true); setSelectedClass(null) }}
          className="flex items-center gap-2 py-2 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus size={15} />
          Create class
        </button>
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
                className="w-full pl-8 pr-3 py-1.5 border border-input rounded-md bg-background text-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {fetching ? (
              <div className="p-4 space-y-2">
                {[1,2,3,4].map(i => (
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
                <BookOpen size={26} className="mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No classes found</p>
              </div>
            ) : (
              filtered.map((cls) => (
                <button
                  key={cls.id}
                  type="button"
                  onClick={() => { setSelectedClass(cls); setShowForm(false) }}
                  className={`w-full flex items-center gap-3 px-3 py-3 text-left transition-colors border-b border-border/50 last:border-0 ${
                    selectedClass?.id === cls.id
                      ? "bg-primary/10 border-l-2 border-l-primary"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <BookOpen size={15} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{cls.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {cls.gradeLevel.replace(/_/g, " ")} · {cls.academicYear}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-xs font-medium text-primary">
                      {cls.enrollments.length}/{cls.capacity}
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

          {/* Create class form */}
          {showForm && (
            <div className="p-6">
              <h3 className="text-base font-semibold text-foreground mb-5">Create new class</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-foreground">Class name</label>
                    <input id="name" type="text" value={form.name} onChange={handleChange}
                      placeholder="e.g. Form 1A" required
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="gradeLevel" className="text-sm font-medium text-foreground">Grade level</label>
                    <select id="gradeLevel" value={form.gradeLevel} onChange={handleChange}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                      {GRADE_LEVELS.map((g) => <option key={g} value={g}>{g.replace(/_/g, " ")}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="teacherId" className="text-sm font-medium text-foreground">Class teacher</label>
                    <select id="teacherId" value={form.teacherId} onChange={handleChange}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                      {teachers.length === 0
                        ? <option value="">No teachers yet</option>
                        : teachers.map((t) => <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>)
                      }
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="academicYear" className="text-sm font-medium text-foreground">Academic year</label>
                    <input id="academicYear" type="text" value={form.academicYear} onChange={handleChange}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="capacity" className="text-sm font-medium text-foreground">Capacity</label>
                    <input id="capacity" type="number" value={form.capacity} onChange={handleChange} min="1" max="100"
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => void handleCreateClass()}
                    disabled={loading || !form.name || !form.teacherId}
                    className="py-2 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
                    {loading ? "Creating..." : "Create class"}
                  </button>
                  <button type="button" onClick={() => { setShowForm(false); setForm(emptyForm) }}
                    className="py-2 px-4 border border-border rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Class detail */}
          {!showForm && selectedClass && (
            <div className="p-6 space-y-6">

              {/* Header */}
              <div className="flex items-start justify-between pb-5 border-b border-border">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                    <BookOpen size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{selectedClass.name}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {selectedClass.gradeLevel.replace(/_/g, " ")} · {selectedClass.academicYear}
                    </p>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary mt-2">
                      <Users size={11} />
                      {selectedClass.enrollments.length} / {selectedClass.capacity} students
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowEnrollForm(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
                  >
                    <Plus size={14} />
                    Enroll student
                  </button>
                  {selectedClass.enrollments.length === 0 && (
                    <button
                      type="button"
                      onClick={() => void handleDeleteClass(selectedClass.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded-md hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  )}
                </div>
              </div>

              {/* Info cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-muted/40 rounded-lg p-4 space-y-1">
                  <p className="text-xs text-muted-foreground">Grade level</p>
                  <p className="text-sm font-medium text-foreground">{selectedClass.gradeLevel.replace(/_/g, " ")}</p>
                </div>
                <div className="bg-muted/40 rounded-lg p-4 space-y-1">
                  <p className="text-xs text-muted-foreground">Academic year</p>
                  <p className="text-sm font-medium text-foreground">{selectedClass.academicYear}</p>
                </div>
                <div className="bg-muted/40 rounded-lg p-4 space-y-1">
                  <p className="text-xs text-muted-foreground">Capacity</p>
                  <p className="text-sm font-medium text-foreground">{selectedClass.capacity} students</p>
                </div>
              </div>

              {/* Class teacher */}
              <div className="border border-border rounded-lg p-4">
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                  <GraduationCap size={15} className="text-muted-foreground" />
                  Class teacher
                </h4>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
                    {selectedClass.teacher.firstName[0]}{selectedClass.teacher.lastName[0]}
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    {selectedClass.teacher.firstName} {selectedClass.teacher.lastName}
                  </p>
                </div>
              </div>

              {/* Enrolled students */}
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="px-4 py-2.5 bg-muted/40 border-b border-border flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Users size={14} className="text-muted-foreground" />
                    Enrolled students
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    {selectedClass.enrollments.length} student{selectedClass.enrollments.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {selectedClass.enrollments.length === 0 ? (
                  <div className="p-8 text-center">
                    <UserRound size={26} className="mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">No students enrolled yet</p>
                    <button
                      type="button"
                      onClick={() => setShowEnrollForm(true)}
                      className="mt-3 text-xs text-primary hover:underline"
                    >
                      Enroll the first student
                    </button>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Student</th>
                        <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Grade</th>
                        <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedClass.enrollments.map((e, i) => (
                        <tr key={e.student.id} className={`border-b border-border last:border-0 ${i % 2 === 0 ? "bg-muted/20" : ""}`}>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0">
                                {e.student.firstName[0]}{e.student.lastName[0]}
                              </div>
                              <p className="text-sm font-medium text-foreground">
                                {e.student.firstName} {e.student.lastName}
                              </p>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            {e.student.gradeLevel.replace(/_/g, " ")}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              type="button"
                              onClick={() => void handleUnenrollStudent(selectedClass.id, e.student.id)}
                              className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition-colors"
                            >
                              <UserMinus size={13} />
                              Remove
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
          {!showForm && !selectedClass && (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-3">
                <BookOpen size={24} className="text-muted-foreground" />
              </div>
              <p className="text-base font-medium text-foreground">Select a class</p>
              <p className="text-sm text-muted-foreground mt-1">
                Click any class on the left to view its details and students
              </p>
            </div>
          )}

        </div>
      </div>

      {/* Enroll student modal */}
      {showEnrollForm && selectedClass && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-xl border border-border p-6 w-full max-w-md mx-4 space-y-4 shadow-xl">
            <div className="flex items-center gap-3 pb-3 border-b border-border">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users size={16} className="text-primary" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">Enroll student</h3>
                <p className="text-xs text-muted-foreground">{selectedClass.name} · {selectedClass.gradeLevel.replace(/_/g, " ")}</p>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="studentSelect" className="text-sm font-medium text-foreground">Select student</label>
              <select id="studentSelect" value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="">Choose a student...</option>
                {enrollableStudents.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.firstName} {s.lastName} — {s.gradeLevel.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
              {enrollableStudents.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  No eligible students — all students in {selectedClass.gradeLevel.replace(/_/g, " ")} are already enrolled.
                </p>
              )}
            </div>
            <div className="flex gap-3 pt-1">
              <button type="button" onClick={() => void handleEnrollStudent()}
                disabled={loading || !selectedStudentId}
                className="py-2 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
                {loading ? "Enrolling..." : "Enroll student"}
              </button>
              <button type="button"
                onClick={() => { setShowEnrollForm(false); setSelectedStudentId("") }}
                className="py-2 px-4 border border-border rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={confirmOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmLabel="Yes, confirm"
        onConfirm={confirmConfig.onConfirm}
        onCancel={() => setConfirmOpen(false)}
      />

    </div>
  )
}