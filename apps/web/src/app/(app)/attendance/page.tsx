"use client"

import React, { useState } from "react"

// ---- TYPES ----
interface Student {
  id: string
  firstName: string
  lastName: string
  gradeLevel: string
}

interface AttendanceRecord {
  studentId: string
  status: "present" | "absent" | "late" | "excused"
}

// ---- MOCK STUDENTS ----
// Later this will come from the database
const MOCK_STUDENTS: Student[] = [
  { id: "1", firstName: "Takudzwa", lastName: "Moyo", gradeLevel: "FORM_1" },
  { id: "2", firstName: "Chiedza", lastName: "Ncube", gradeLevel: "FORM_1" },
  { id: "3", firstName: "Farai", lastName: "Mutasa", gradeLevel: "FORM_1" },
  { id: "4", firstName: "Rudo", lastName: "Dlamini", gradeLevel: "FORM_1" },
  { id: "5", firstName: "Tinashe", lastName: "Banda", gradeLevel: "FORM_1" },
]

const STATUS_STYLES = {
  present: "bg-green-100 text-green-800 border-green-200",
  absent: "bg-red-100 text-red-800 border-red-200",
  late: "bg-amber-100 text-amber-800 border-amber-200",
  excused: "bg-blue-100 text-blue-800 border-blue-200",
}

const STATUS_LABELS = {
  present: "Present",
  absent: "Absent",
  late: "Late",
  excused: "Excused",
}

export default function AttendancePage() {
  const today = new Date().toISOString().split("T")[0] ?? ""
  const [date, setDate] = useState(today)
  const [records, setRecords] = useState<AttendanceRecord[]>(
    MOCK_STUDENTS.map((s) => ({ studentId: s.id, status: "present" }))
  )
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  function setStatus(
    studentId: string,
    status: AttendanceRecord["status"]
  ) {
    setSaved(false)
    setRecords((prev) =>
      prev.map((r) =>
        r.studentId === studentId ? { ...r, status } : r
      )
    )
  }

  function markAll(status: AttendanceRecord["status"]) {
    setSaved(false)
    setRecords(MOCK_STUDENTS.map((s) => ({ studentId: s.id, status })))
  }

  function handleSave() {
    setLoading(true)
    // Later this will save to the database
    setTimeout(() => {
      setSaved(true)
      setLoading(false)
    }, 600)
  }

  // Summary counts
  const summary = {
    present: records.filter((r) => r.status === "present").length,
    absent: records.filter((r) => r.status === "absent").length,
    late: records.filter((r) => r.status === "late").length,
    excused: records.filter((r) => r.status === "excused").length,
  }

  const attendanceRate = Math.round(
    ((summary.present + summary.late) / MOCK_STUDENTS.length) * 100
  )

  return (
    <div className="space-y-6">

      {/* Page header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Attendance</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Record daily student attendance
        </p>
      </div>

      {/* Date and class selector */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="space-y-1">
          <label
            htmlFor="date"
            className="text-sm font-medium text-foreground"
          >
            Date
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value)
              setSaved(false)
            }}
            className="px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="space-y-1">
          <label
            htmlFor="class"
            className="text-sm font-medium text-foreground"
          >
            Class
          </label>
          <select
            id="class"
            className="px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option>Form 1A</option>
            <option>Form 1B</option>
            <option>Form 2A</option>
          </select>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-green-800">{summary.present}</p>
          <p className="text-xs text-green-700 mt-1">Present</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-red-800">{summary.absent}</p>
          <p className="text-xs text-red-700 mt-1">Absent</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-amber-800">{summary.late}</p>
          <p className="text-xs text-amber-700 mt-1">Late</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-blue-800">{summary.excused}</p>
          <p className="text-xs text-blue-700 mt-1">Excused</p>
        </div>
      </div>

      {/* Attendance rate */}
      <div className="bg-card rounded-lg border border-border p-4 flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">
          Attendance rate today
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
      <div className="flex items-center gap-2">
        <p className="text-sm text-muted-foreground">Mark all as:</p>
        {(["present", "absent", "late", "excused"] as const).map((status) => (
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
            {MOCK_STUDENTS.map((student) => {
              const record = records.find((r) => r.studentId === student.id)
              const status = record?.status ?? "present"
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
                    {student.gradeLevel.replace("_", " ")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {(["present", "absent", "late", "excused"] as const).map(
                        (s) => (
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
                        )
                      )}
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
          onClick={handleSave}
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

    </div>
  )
}