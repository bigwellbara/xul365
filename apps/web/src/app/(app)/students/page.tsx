// ============================================
// STUDENTS PAGE
// List of all students with search and filter
// ============================================

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Students",
}

// Placeholder data — will be replaced with real DB data later
const placeholderStudents = [
  {
    id: "1",
    firstName: "Tatenda",
    lastName: "Moyo",
    gradeLevel: "FORM_3",
    status: "active",
    parentPhone: "+263 77 123 4567",
  },
  {
    id: "2",
    firstName: "Chiedza",
    lastName: "Mutasa",
    gradeLevel: "GRADE_6",
    status: "active",
    parentPhone: "+263 71 987 6543",
  },
  {
    id: "3",
    firstName: "Farai",
    lastName: "Ndlovu",
    gradeLevel: "FORM_1",
    status: "inactive",
    parentPhone: "+263 78 456 7890",
  },
]

const gradeLabelMap: Record<string, string> = {
  ECD_A: "ECD A",
  ECD_B: "ECD B",
  GRADE_1: "Grade 1",
  GRADE_2: "Grade 2",
  GRADE_3: "Grade 3",
  GRADE_4: "Grade 4",
  GRADE_5: "Grade 5",
  GRADE_6: "Grade 6",
  GRADE_7: "Grade 7",
  FORM_1: "Form 1",
  FORM_2: "Form 2",
  FORM_3: "Form 3",
  FORM_4: "Form 4",
  FORM_5: "Form 5",
  FORM_6: "Form 6",
}

export default function StudentsPage() {
  return (
    <div className="space-y-6">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Students</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage all enrolled students
          </p>
        </div>
        
          href="/students/new"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
        >
          + Add Student
        </a>
      </div>

      {/* Search and filter bar */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Search students..."
          className="flex-1 max-w-sm px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <select className="px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="">All grades</option>
          {Object.entries(gradeLabelMap).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select className="px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="transferred">Transferred</option>
        </select>
      </div>

      {/* Students table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Name
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Grade
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Parent Contact
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
            {placeholderStudents.map((student, index) => (
              <tr
                key={student.id}
                className={
                  index < placeholderStudents.length - 1
                    ? "border-b border-border"
                    : ""
                }
              >
                <td className="px-4 py-3 font-medium text-foreground">
                  {student.firstName} {student.lastName}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {gradeLabelMap[student.gradeLevel] ?? student.gradeLevel}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {student.parentPhone}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      student.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {student.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    
                      href={`/students/${student.id}`}
                      className="text-primary hover:underline text-xs"
                    >
                      View
                    </a>
                    <span className="text-border">·</span>
                    
                      href={`/students/${student.id}/edit`}
                      className="text-primary hover:underline text-xs"
                    >
                      Edit
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty state */}
        {placeholderStudents.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm text-muted-foreground">
              No students yet. Add your first student to get started.
            </p>
          </div>
        )}
      </div>

      {/* Pagination placeholder */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>Showing {placeholderStudents.length} students</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="px-3 py-1 border border-border rounded-md hover:bg-muted transition-colors disabled:opacity-50"
            disabled
          >
            Previous
          </button>
          <button
            type="button"
            className="px-3 py-1 border border-border rounded-md hover:bg-muted transition-colors disabled:opacity-50"
            disabled
          >
            Next
          </button>
        </div>
      </div>

    </div>
  )
}