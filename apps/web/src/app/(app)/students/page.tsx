"use client"

import React, { useState } from "react"

// ---- TYPES ----
interface Student {
  id: string
  firstName: string
  lastName: string
  gradeLevel: string
  gender: string
  status: string
  parentContact: {
    name: string
    phone: string
  }
}

// ---- GRADE LEVELS ----
const GRADE_LEVELS = [
  "ECD_A", "ECD_B",
  "GRADE_1", "GRADE_2", "GRADE_3",
  "GRADE_4", "GRADE_5", "GRADE_6", "GRADE_7",
  "FORM_1", "FORM_2", "FORM_3",
  "FORM_4", "FORM_5", "FORM_6",
]

// ---- EMPTY FORM STATE ----
const emptyForm = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "male",
  gradeLevel: "GRADE_1",
  parentName: "",
  parentPhone: "",
  parentRelationship: "mother",
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState("")
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    // For now add student locally
    // Later we will save to the database
    const newStudent: Student = {
      id: Date.now().toString(),
      firstName: form.firstName,
      lastName: form.lastName,
      gradeLevel: form.gradeLevel,
      gender: form.gender,
      status: "active",
      parentContact: {
        name: form.parentName,
        phone: form.parentPhone,
      },
    }

    setTimeout(() => {
      setStudents((prev) => [newStudent, ...prev])
      setForm(emptyForm)
      setShowForm(false)
      setLoading(false)
    }, 500)
  }

  const filtered = students.filter((s) =>
    `${s.firstName} ${s.lastName}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Students</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {students.length} student{students.length !== 1 ? "s" : ""} enrolled
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="py-2 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
        >
          + Add student
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search students..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-sm px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />

      {/* Add student form */}
      {showForm && (
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-base font-semibold text-foreground mb-4">
            Add new student
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium text-foreground">
                  First name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium text-foreground">
                  Last name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            {/* DOB and gender */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="dateOfBirth" className="text-sm font-medium text-foreground">
                  Date of birth
                </label>
                <input
                  id="dateOfBirth"
                  type="date"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="gender" className="text-sm font-medium text-foreground">
                  Gender
                </label>
                <select
                  id="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            {/* Grade level */}
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
                    {g.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>

            {/* Parent contact */}
            <div className="border-t border-border pt-4 space-y-3">
              <h4 className="text-sm font-medium text-foreground">
                Parent / Guardian contact
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="parentName" className="text-sm font-medium text-foreground">
                    Full name
                  </label>
                  <input
                    id="parentName"
                    type="text"
                    value={form.parentName}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="parentPhone" className="text-sm font-medium text-foreground">
                    Phone number
                  </label>
                  <input
                    id="parentPhone"
                    type="tel"
                    value={form.parentPhone}
                    onChange={handleChange}
                    placeholder="07X XXX XXXX"
                    required
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="parentRelationship" className="text-sm font-medium text-foreground">
                  Relationship
                </label>
                <select
                  id="parentRelationship"
                  value={form.parentRelationship}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="mother">Mother</option>
                  <option value="father">Father</option>
                  <option value="guardian">Guardian</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="py-2 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save student"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setForm(emptyForm)
                }}
                className="py-2 px-4 border border-border rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      )}

      {/* Students table */}
      {students.length === 0 ? (
        <div className="bg-card rounded-lg border border-border p-12 text-center">
          <p className="text-4xl mb-4">🎓</p>
          <p className="text-base font-medium text-foreground">
            No students yet
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Click the button above to add your first student
          </p>
        </div>
      ) : (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Name
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Grade
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Gender
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Parent
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((student) => (
                <tr
                  key={student.id}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
                        {student.firstName[0]}{student.lastName[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {student.firstName} {student.lastName}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {student.gradeLevel.replace("_", " ")}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground capitalize">
                    {student.gender}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-foreground">
                      {student.parentContact.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {student.parentContact.phone}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  )
}