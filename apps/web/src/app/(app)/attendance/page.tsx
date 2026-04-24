// ============================================
// ATTENDANCE PAGE
// Record and view daily attendance per class
// ============================================

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Attendance",
}

// Placeholder data — will be replaced with real DB data later
const placeholderClasses = [
  { id: "1", name: "Form 3A", gradeLevel: "FORM_3", teacher: "Tendai Chirwa" },
  { id: "2", name: "Grade 6B", gradeLevel: "GRADE_6", teacher: "Rudo Sithole" },
  { id: "3", name: "Form 1C", gradeLevel: "FORM_1", teacher: "Blessing Gumbo" },
]

const placeholderRecords = [
  {
    id: "1",
    studentName: "Tatenda Moyo",
    class: "Form 3A",
    date: "2025-04-23",
    status: "present",
  },
  {
    id: "2",
    studentName: "Chiedza Mutasa",
    class: "Grade 6B",
    date: "2025-04-23",
    status: "absent",
  },
  {
    id: "3",
    studentName: "Farai Ndlovu",
    class: "Form 1C",
    date: "2025-04-23",
    status: "late",
  },
  {
    id: "4",
    studentName: "Nyasha Dube",
    class: "Form 3A",
    date: "2025-04-23",
    status: "present",
  },
]

const statusStyles: Record<string, string> = {
  present: "bg-green-100 text-green-700",
  absent: "bg-red-100 text-red-700",
  late: "bg-yellow-100 text-yellow-700",
  excused: "bg-blue-100 text-blue-700",
}

// Summary counts from placeholder data
const summary = {
  present: placeholderRecords.filter((r) => r.status === "present").length,
  absent: placeholderRecords.filter((r) => r.status === "absent").length,
  late: placeholderRecords.filter((r) => r.status === "late").length,
  excused: placeholderRecords.filter((r) => r.status === "excused").length,
}

export default function AttendancePage() {
  return (
    <div className="space-y-6">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Attendance</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Record and track daily student attendance
          </p>
        </div>
        
          href="/attendance/record"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
        >
          + Record Attendance
        </a>
      </div>

      {/* Today's summary cards */}
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-3">
          Today — April 23, 2025
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{summary.present}</p>
            <p className="text-xs text-muted-foreground mt-1">Present</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{summary.absent}</p>
            <p className="text-xs text-muted-foreground mt-1">Absent</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">{summary.late}</p>
            <p className="text-xs text-muted-foreground mt-1">Late</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{summary.excused}</p>
            <p className="text-xs text-muted-foreground mt-1">Excused</p>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3">
        <input
          type="date"
          defaultValue="2025-04-23"
          className="px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <select className="px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="">All classes</option>
          {placeholderClasses.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.name}
            </option>
          ))}
        </select>
        <select className="px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="">All statuses</option>
          <option value="present">Present</option>
          <option value="absent">Absent</option>
          <option value="late">Late</option>
          <option value="excused">Excused</option>
        </select>
      </div>

      {/* Attendance table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Student
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Class
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Date
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Status
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {placeholderRecords.map((record, index) => (
              <tr
                key={record.id}
                className={
                  index < placeholderRecords.length - 1
                    ? "border-b border-border"
                    : ""
                }
              >
                <td className="px-4 py-3 font-medium text-foreground">
                  {record.studentName}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {record.class}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {record.date}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      statusStyles[record.status] ?? "bg-muted text-muted-foreground"
                    }`}
                  >
                    {record.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    className="text-primary hover:underline text-xs"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty state */}
        {placeholderRecords.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm text-muted-foreground">
              No attendance records for this date. Start by recording attendance.
            </p>
          </div>
        )}
      </div>

      {/* Classes quick access */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">
          Record by Class
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {placeholderClasses.map((cls) => (
            
              key={cls.id}
              href={`/attendance/record?classId=${cls.id}`}
              className="bg-card border border-border rounded-lg p-4 hover:bg-muted transition-colors"
            >
              <p className="font-medium text-foreground text-sm">{cls.name}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Teacher: {cls.teacher}
              </p>
              <p className="text-xs text-primary mt-2 font-medium">
                Record attendance →
              </p>
            </a>
          ))}
        </div>
      </div>

    </div>
  )
}