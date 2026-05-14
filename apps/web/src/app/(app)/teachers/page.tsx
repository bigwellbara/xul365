"use client"

import React, { useState, useEffect } from "react"
import { Trash2 } from "lucide-react"
import { ConfirmModal } from "@/components/ui/confirm-modal"

interface Teacher {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  subjects: string[]
  status: string
}

const SUBJECTS = [
  "Mathematics", "English Language", "Shona", "Ndebele",
  "Science", "Social Studies", "History", "Geography",
  "Agriculture", "Home Economics", "Physical Education",
  "Art & Craft", "Music", "ICT", "Accounts",
  "Business Studies", "Economics", "Physics",
  "Chemistry", "Biology", "Combined Science",
  "Fashion & Fabrics",
]

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  subjects: [] as string[],
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState("")
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
    async function fetchTeachers() {
      try {
        const res = await fetch("/api/teachers")
        const data = await res.json() as { teachers: Teacher[] }
        setTeachers(data.teachers ?? [])
      } catch {
        setError("Failed to load teachers")
      } finally {
        setFetching(false)
      }
    }
    void fetchTeachers()
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }))
  }

  function toggleSubject(subject: string) {
    setForm((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter((s) => s !== subject)
        : [...prev.subjects, subject],
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    console.log("FORM SUBMITTED")
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const data = await res.json() as { teacher: Teacher; error?: string }

      if (!res.ok) {
        setError(data.error ?? "Failed to save teacher")
        return
      }

      setTeachers((prev) => [data.teacher, ...prev])
      setForm(emptyForm)
      setShowForm(false)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const filtered = teachers.filter((t) =>
    `${t.firstName} ${t.lastName}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  function showConfirm(title: string, message: string, onConfirm: () => void) {
  setConfirmConfig({ title, message, onConfirm })
  setConfirmOpen(true)
}

async function handleDeleteTeacher(teacherId: string) {
  showConfirm(
    "Delete teacher",
    "Are you sure you want to delete this teacher? This action cannot be undone.",
    async () => {
      setConfirmOpen(false)
      try {
        const res = await fetch(`/api/teachers/${teacherId}`, {
          method: "DELETE",
        })
        if (!res.ok) {
          const data = await res.json() as { error?: string }
          setError(data.error ?? "Failed to delete teacher")
          return
        }
        setTeachers((prev) => prev.filter((t) => t.id !== teacherId))
      } catch {
        setError("Something went wrong")
      }
    }
  )
}

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Teachers</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {teachers.length} teacher{teachers.length !== 1 ? "s" : ""} registered
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="py-2 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
        >
          + Add teacher
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <input
        type="text"
        placeholder="Search teachers..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-sm px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />

      {showForm && (
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-base font-semibold text-foreground mb-4">
            Add new teacher
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium text-foreground">First name</label>
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
                <label htmlFor="lastName" className="text-sm font-medium text-foreground">Last name</label>
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">Email address</label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-foreground">Phone number</label>
                <input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="07X XXX XXXX"
                  required
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Subjects taught</label>
              <div className="flex flex-wrap gap-2">
                {SUBJECTS.map((subject) => (
                  <button
                    key={subject}
                    type="button"
                    onClick={() => toggleSubject(subject)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                      form.subjects.includes(subject)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-foreground border-border hover:border-primary"
                    }`}
                  >
                    {subject}
                  </button>
                ))}
              </div>
              {form.subjects.length === 0 && (
                <p className="text-xs text-muted-foreground">Select at least one subject</p>
              )}
            </div>

            <div className="flex gap-3 pt-2">
             <button
  type="button"
  onClick={(e) => void handleSubmit(e as unknown as React.FormEvent)}
  disabled={loading || form.subjects.length === 0}
  className="py-2 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
>
  {loading ? "Saving..." : "Save teacher"}
</button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setForm(emptyForm) }}
                className="py-2 px-4 border border-border rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      )}

      {fetching ? (
        <div className="bg-card rounded-lg border border-border p-12 text-center">
          <p className="text-sm text-muted-foreground">Loading teachers...</p>
        </div>
      ) : teachers.length === 0 ? (
        <div className="bg-card rounded-lg border border-border p-12 text-center">
          <p className="text-4xl mb-4">👨‍🏫</p>
          <p className="text-base font-medium text-foreground">No teachers yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Click the button above to add your first teacher
          </p>
        </div>
      ) : (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Name</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Email</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Phone</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Subjects</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((teacher) => (
                <tr
                  key={teacher.id}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
                        {teacher.firstName[0]}{teacher.lastName[0]}
                      </div>
                      <p className="text-sm font-medium text-foreground">
                        {teacher.firstName} {teacher.lastName}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">{teacher.email}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{teacher.phone}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {(teacher.subjects as string[]).slice(0, 2).map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded-full text-xs bg-muted text-muted-foreground">
                          {s}
                        </span>
                      ))}
                      {(teacher.subjects as string[]).length > 2 && (
                        <span className="px-2 py-0.5 rounded-full text-xs bg-muted text-muted-foreground">
                          +{(teacher.subjects as string[]).length - 2} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>


                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => handleDeleteTeacher(teacher.id)}
                          className="text-muted-foreground hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}


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