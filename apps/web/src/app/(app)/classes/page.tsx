"use client"

import React, { useState, useEffect } from "react"
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

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmConfig, setConfirmConfig] = useState<{
          title: string
          message: string
          onConfirm: () => void
        }>({
          title: "",
          message: "",
          onConfirm: () => {},
        })

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
        if (teachersData.teachers && teachersData.teachers.length > 0) {
          setForm((prev) => ({
            ...prev,
            teacherId: teachersData.teachers[0]?.id ?? "",
          }))
        }
      } catch {
        setError("Failed to load data")
      } finally {
        setFetching(false)
      }
    }
    void fetchData()
  }, [])

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }))
  }

  async function handleCreateClass() {
    if (!form.teacherId) {
      setError("Please add a teacher first")
      return
    }
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
      if (!res.ok) {
        setError(data.error ?? "Failed to create class")
        return
      }
      // Refresh classes
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
        body: JSON.stringify({
          classId: selectedClass.id,
          studentId: selectedStudentId,
        }),
      })
      const data = await res.json() as { error?: string }
      if (!res.ok) {
        setError(data.error ?? "Failed to enroll student")
        return
      }
      // Refresh classes
      const classesRes = await fetch("/api/classes")
      const classesData = await classesRes.json() as { classes: ClassItem[] }
      setClasses(classesData.classes ?? [])
      const updated = classesData.classes.find((c) => c.id === selectedClass.id)
      if (updated) setSelectedClass(updated)
      setSelectedStudentId("")
    } catch {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

async function handleUnenrollStudent(classId: string, studentId: string) {
  showConfirm(
    "Remove student",
    "Are you sure you want to remove this student from the class?",
    async () => {
      setConfirmOpen(false)
      setLoading(true)
      setError("")
      try {
        const res = await fetch("/api/classes/unenroll", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ classId, studentId }),
        })
        const data = await res.json() as { error?: string }
        if (!res.ok) {
          setError(data.error ?? "Failed to unenroll student")
          return
        }
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
    }
  )
}


async function handleDeleteClass(classId: string) {
  showConfirm(
    "Delete class",
    "Are you sure you want to delete this class? This action cannot be undone.",
    async () => {
      setConfirmOpen(false)
      setLoading(true)
      setError("")
      try {
        const res = await fetch("/api/classes/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ classId }),
        })
        const data = await res.json() as { error?: string }
        if (!res.ok) {
          setError(data.error ?? "Failed to delete class")
          return
        }
        setClasses((prev) => prev.filter((c) => c.id !== classId))
      } catch {
        setError("Something went wrong")
      } finally {
        setLoading(false)
      }
    }
  )
}


function showConfirm(title: string, message: string, onConfirm: () => void) {
  setConfirmConfig({ title, message, onConfirm })
  setConfirmOpen(true)
}

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Classes</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {classes.length} class{classes.length !== 1 ? "es" : ""} created
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="py-2 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
        >
          + Create class
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Create class form */}
      {showForm && (
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-base font-semibold text-foreground mb-4">
            Create new class
          </h3>
          <div className="space-y-4">

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-foreground">
                  Class name
                </label>
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Form 1A"
                  required
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
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
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {GRADE_LEVELS.map((g) => (
                    <option key={g} value={g}>
                      {g.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label htmlFor="teacherId" className="text-sm font-medium text-foreground">
                  Class teacher
                </label>
                <select
                  id="teacherId"
                  value={form.teacherId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {teachers.length === 0 ? (
                    <option value="">No teachers yet</option>
                  ) : (
                    teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.firstName} {t.lastName}
                      </option>
                    ))
                  )}
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="academicYear" className="text-sm font-medium text-foreground">
                  Academic year
                </label>
                <input
                  id="academicYear"
                  type="text"
                  value={form.academicYear}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="capacity" className="text-sm font-medium text-foreground">
                  Capacity
                </label>
                <input
                  id="capacity"
                  type="number"
                  value={form.capacity}
                  onChange={handleChange}
                  min="1"
                  max="100"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => void handleCreateClass()}
                disabled={loading || !form.name || !form.teacherId}
                className="py-2 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create class"}
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

      {/* Classes list */}
      {fetching ? (
        <div className="bg-card rounded-lg border border-border p-12 text-center">
          <p className="text-sm text-muted-foreground">Loading classes...</p>
        </div>
      ) : classes.length === 0 ? (
        <div className="bg-card rounded-lg border border-border p-12 text-center">
          <p className="text-4xl mb-4">🏫</p>
          <p className="text-base font-medium text-foreground">No classes yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Click the button above to create your first class
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((cls) => (
            <div
              key={cls.id}
              className="bg-card rounded-lg border border-border p-5 space-y-3"
            >
           <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-semibold text-foreground">
                    {cls.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {cls.gradeLevel.replace(/_/g, " ")} · {cls.academicYear}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-medium">
                    {cls.enrollments.length}/{cls.capacity}
                  </span>
                  {cls.enrollments.length === 0 && (
                    <button
                      type="button"
                      onClick={() => void handleDeleteClass(cls.id)}
                      className="text-xs text-red-500 hover:text-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div> 

              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
                  {cls.teacher.firstName[0]}
                </div>
                <p className="text-sm text-foreground">
                  {cls.teacher.firstName} {cls.teacher.lastName}
                </p>
              </div>

              {/* Enrolled students */}
           {cls.enrollments.length > 0 && (
                  <div className="border-t border-border pt-3">
                    <p className="text-xs text-muted-foreground mb-2">
                      {cls.enrollments.length} student{cls.enrollments.length !== 1 ? "s" : ""} enrolled
                    </p>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {cls.enrollments.map((e) => (
                        <div
                          key={e.student.id}
                          className="flex items-center justify-between gap-2"
                        >
                          <p className="text-xs text-foreground">
                            {e.student.firstName} {e.student.lastName}
                          </p>
                          <button
                            type="button"
                            onClick={() => void handleUnenrollStudent(cls.id, e.student.id)}
                            className="text-xs text-red-500 hover:text-red-700 transition-colors shrink-0"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              <button
                type="button"
                onClick={() => {
                  setSelectedClass(cls)
                  setShowEnrollForm(true)
                }}
                className="w-full py-1.5 px-3 border border-border rounded-md text-xs font-medium text-foreground hover:bg-muted transition-colors"
              >
                + Enroll student
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Enroll student modal */}
      {showEnrollForm && selectedClass && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg border border-border p-6 w-full max-w-md mx-4 space-y-4">
            <h3 className="text-base font-semibold text-foreground">
              Enroll student in {selectedClass.name}
            </h3>

            <div className="space-y-2">
              <label htmlFor="studentSelect" className="text-sm font-medium text-foreground">
                Select student
              </label>
              <select
                id="studentSelect"
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Choose a student...</option>
                {students
                  .filter(
                      (s) =>
                        s.gradeLevel === selectedClass.gradeLevel &&
                        !selectedClass.enrollments.some(
                          (e) => e.student.id === s.id
                        )
                    )
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.firstName} {s.lastName} — {s.gradeLevel.replace(/_/g, " ")}
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => void handleEnrollStudent()}
                disabled={loading || !selectedStudentId}
                className="py-2 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? "Enrolling..." : "Enroll student"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowEnrollForm(false)
                  setSelectedClass(null)
                  setSelectedStudentId("")
                }}
                className="py-2 px-4 border border-border rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                Close
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