"use client"

import React, { useState, useEffect } from "react"

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

  // Fetch classes on load
  useEffect(() => {
    async function fetchClasses() {
      try {
        const res = await fetch("/api/classes")
        const data = await res.json() as { classes: ClassItem[] }
        setClasses(data.classes ?? [])
        if (data.classes && data.classes.length > 0) {
          const firstClass = data.classes[0]
          if (firstClass) {
            setSelectedClassId(firstClass.id)
          }
        }
      } catch {
        setError("Failed to load classes")
      } finally {
        setFetching(false)
      }
    }
    void fetchClasses()
  }, [])

  // Update students when class changes
  useEffect(() => {
    if (!selectedClassId) return
    const cls = classes.find((c) => c.id === selectedClassId)
    if (!cls) return

    const classStudents = cls.enrollments.map((e) => e.student)
    setStudents(classStudents)
    setRecords(
      classStudents.map((s) => ({ studentId: s.id, status: "PRESENT" as const }))
    )
    setSaved(false)
  }, [selectedClassId, classes])

  function setStatus(studentId: string, status: AttendanceRecord["status"]) {
    setSaved(false)
    setRecords((prev) =>
      prev.map((r) => r.studentId === studentId ? { ...r, status } : r)
    )
  }

  function markAll(status: AttendanceRecord["status"]) {
    setSaved(false)
    setRecords(students.map((s) => ({ studentId: s.id, status })))
  }

  async function handleSave() {
    if (!selectedClassId) {
      setError("Please select a class first")
      return
    }

    if (students.length === 0) {
      setError("No students in this class")
      return
    }

    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          classId: selectedClassId,
          records,
        }),
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

  const attendanceRate =
    students.length > 0
      ? Math.round(
          ((summary.PRESENT + summary.LATE) / students.length) * 100
        )
      : 0

  return (
    <div className="space-y-6">

      <div>
        <h2 className="text-2xl font-bold text-foreground">Attendance</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Record daily student attendance
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Date and class selector */}
      <div className="flex flex-wrap items-end gap-4">
        <div className="space-y-1">
          <label htmlFor="date" className="text-sm font-medium text-foreground">
            Date
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => { setDate(e.target.value); setSaved(false) }}
            className="px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="class" className="text-sm font-medium text-foreground">
            Class
          </label>
          {fetching ? (
            <div className="px-3 py-2 border border-input rounded-md bg-muted text-sm w-48">
              Loading classes...
            </div>
          ) : classes.length === 0 ? (
            <div className="px-3 py-2 border border-input rounded-md bg-muted text-sm text-muted-foreground w-48">
              No classes yet
            </div>
          ) : (
            <select
              id="class"
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} — {cls.teacher.firstName} {cls.teacher.lastName}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* No classes message */}
      {!fetching && classes.length === 0 && (
        <div className="bg-card rounded-lg border border-border p-12 text-center">
          <p className="text-4xl mb-4">🏫</p>
          <p className="text-base font-medium text-foreground">
            No classes set up yet
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Go to Settings to create classes and enroll students
          </p>
        </div>
      )}

      {/* Attendance UI — only show if class selected and has students */}
      {classes.length > 0 && students.length === 0 && (
        <div className="bg-card rounded-lg border border-border p-12 text-center">
          <p className="text-4xl mb-4">🎓</p>
          <p className="text-base font-medium text-foreground">
            No students in this class
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Enroll students in this class first
          </p>
        </div>
      )}

      {students.length > 0 && (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-800">{summary.PRESENT}</p>
              <p className="text-xs text-green-700 mt-1">Present</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-red-800">{summary.ABSENT}</p>
              <p className="text-xs text-red-700 mt-1">Absent</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-amber-800">{summary.LATE}</p>
              <p className="text-xs text-amber-700 mt-1">Late</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-blue-800">{summary.EXCUSED}</p>
              <p className="text-xs text-blue-700 mt-1">Excused</p>
            </div>
          </div>

          {/* Attendance rate */}
          <div className="bg-card rounded-lg border border-border p-4 flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">
              Attendance rate
            </p>
            <div className="flex items-center gap-3">
              <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${attendanceRate}%` }}
                />
              </div>
              <p className="text-sm font-bold text-foreground">
                {attendanceRate}%
              </p>
            </div>
          </div>

          {/* Mark all buttons */}
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

          {/* Attendance list */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Student
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Grade
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  const record = records.find((r) => r.studentId === student.id)
                  const status = record?.status ?? "PRESENT"
                  return (
                    <tr
                      key={student.id}
                      className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
                            {student.firstName[0]}{student.lastName[0]}
                          </div>
                          <p className="text-sm font-medium text-foreground">
                            {student.firstName} {student.lastName}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        {student.gradeLevel.replace(/_/g, " ")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2 flex-wrap">
                          {(["PRESENT", "ABSENT", "LATE", "EXCUSED"] as const).map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setStatus(student.id, s)}
                              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
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

          {/* Save button */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={loading || saved}
              className="py-2 px-6 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Saving..." : saved ? "Saved ✓" : "Save attendance"}
            </button>
            {saved && (
              <p className="text-sm text-green-600">
                Attendance saved successfully
              </p>
            )}
          </div>
        </>
      )}

    </div>
  )
}