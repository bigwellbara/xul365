"use client"

import React, { useState, useEffect } from "react"
import { Trash2, Search, Plus, ChevronRight, GraduationCap, Mail, Phone, BookOpen, UserRound } from "lucide-react"
import { ConfirmModal } from "@/components/ui/confirm-modal"
import { useTheme } from "@/components/providers/theme-provider"

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
  const [selected, setSelected] = useState<Teacher | null>(null)
  const [showForm, setShowForm] = useState(false)
  const { theme } = useTheme()
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
  }>({ title: "", message: "", onConfirm: () => {} })

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

  function showConfirm(title: string, message: string, onConfirm: () => void) {
    setConfirmConfig({ title, message, onConfirm })
    setConfirmOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json() as { teacher: Teacher; error?: string }
      if (!res.ok) { setError(data.error ?? "Failed to save teacher"); return }
      setTeachers((prev) => [data.teacher, ...prev])
      setSelected(data.teacher)
      setForm(emptyForm)
      setShowForm(false)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteTeacher(teacherId: string) {
    showConfirm(
      "Delete teacher",
      "Are you sure you want to delete this teacher? This action cannot be undone.",
      async () => {
        setConfirmOpen(false)
        try {
          const res = await fetch(`/api/teachers/${teacherId}`, { method: "DELETE" })
          if (!res.ok) {
            const data = await res.json() as { error?: string }
            setError(data.error ?? "Failed to delete teacher")
            return
          }
          setTeachers((prev) => prev.filter((t) => t.id !== teacherId))
          if (selected?.id === teacherId) setSelected(null)
        } catch {
          setError("Something went wrong")
        }
      }
    )
  }

  const filtered = teachers.filter((t) =>
    `${t.firstName} ${t.lastName}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Teachers</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {teachers.length} teacher{teachers.length !== 1 ? "s" : ""} registered
          </p>
        </div>
        <button
          type="button"
          onClick={() => { setShowForm(true); setSelected(null) }}
          className="flex items-center gap-2 py-2 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
          style={{
              backgroundColor: theme.primaryColor,
              color: theme.primaryText,
            }}
        >
          <Plus size={15} />
          Add teacher
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Split layout */}
      <div className="flex gap-4 h-[calc(100vh-180px)]">

        {/* LEFT — teacher list */}
        <div className="w-72 shrink-0 bg-card border border-border rounded-xl flex flex-col overflow-hidden">
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search teachers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 border border-input rounded-md bg-background text-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {fetching ? (
              <div className="p-4 space-y-2">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="flex items-center gap-3 p-2 animate-pulse">
                    <div className="w-9 h-9 rounded-full bg-muted shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 bg-muted rounded w-28" />
                      <div className="h-2.5 bg-muted rounded w-20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-6 text-center">
                <GraduationCap size={28} className="mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No teachers found</p>
              </div>
            ) : (
              filtered.map((teacher) => (
                <button
                  key={teacher.id}
                  type="button"
                  onClick={() => { setSelected(teacher); setShowForm(false) }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors border-b border-border/50 last:border-0 ${
                    selected?.id === teacher.id
                      ? "bg-primary/10 border-l-2 border-l-primary"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-primary/10 text-white flex items-center justify-center text-xs font-semibold shrink-0" style={{backgroundColor: theme.primaryColor,}}>
                    {teacher.firstName[0]}{teacher.lastName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {teacher.firstName} {teacher.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {(teacher.subjects as string[]).slice(0, 2).join(", ")}
                      {(teacher.subjects as string[]).length > 2 && ` +${(teacher.subjects as string[]).length - 2}`}
                    </p>
                  </div>
                  <ChevronRight size={14} className="text-muted-foreground shrink-0" />
                </button>
              ))
            )}
          </div>
        </div>

        {/* RIGHT — detail / form panel */}
        <div className="flex-1 bg-card border border-border rounded-xl overflow-y-auto">

          {/* Add teacher form */}
          {showForm && (
            <div className="p-6">
              <h3 className="text-base font-semibold text-foreground mb-5">Add new teacher</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium text-foreground">First name</label>
                    <input id="firstName" type="text" value={form.firstName} onChange={handleChange} required
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium text-foreground">Last name</label>
                    <input id="lastName" type="text" value={form.lastName} onChange={handleChange} required
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-foreground">Email address</label>
                    <input id="email" type="email" value={form.email} onChange={handleChange} required
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium text-foreground">Phone number</label>
                    <input id="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="07X XXX XXXX" required
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
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
  style={
    form.subjects.includes(subject)
      ? { backgroundColor: theme.primaryColor }
      : {}
  }
  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
    form.subjects.includes(subject)
      ? "text-primary-foreground border-primary"
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
                  <button type="submit" disabled={loading || form.subjects.length === 0}
                    className="py-2 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50" style={{backgroundColor: theme.primaryColor,}}>
                    {loading ? "Saving..." : "Save teacher"}
                  </button>
                  <button type="button" onClick={() => { setShowForm(false); setForm(emptyForm) }}
                    className="py-2 px-4 border border-border rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Teacher detail */}
          {!showForm && selected && (
            <div className="p-6 space-y-6">

              {/* Header */}
              <div className="flex items-start justify-between pb-5 border-b border-border">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold" style={{color: theme.primaryColor,}}>
                      {selected.firstName[0]}{selected.lastName[0]}
                    </div>
                    <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-green-500 border-2 border-card" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">
                      {selected.firstName} {selected.lastName}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {(selected.subjects as string[]).length} subject{(selected.subjects as string[]).length !== 1 ? "s" : ""} taught
                    </p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                      Active
                    </span>
                  </div>
                </div>

                {/* Contact details */}
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground mb-3">Contact Details</p>
                  <div className="flex items-center gap-2.5">
                    <Mail size={14} className="text-muted-foreground shrink-0" />
                    <span className="text-sm text-muted-foreground">{selected.email}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone size={14} className="text-muted-foreground shrink-0" />
                    <span className="text-sm text-muted-foreground">{selected.phone}</span>
                  </div>
                </div>
              </div>

              {/* Personal details table */}
              <div className="rounded-lg border border-border overflow-hidden">
                <div className="px-4 py-2.5 bg-muted/40 border-b border-border">
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <UserRound size={14} className="text-muted-foreground" />
                    Personal details
                  </h4>
                </div>
                <table className="w-full">
                  <tbody>
                    {[
                      { label: "First name", value: selected.firstName },
                      { label: "Last name", value: selected.lastName },
                      { label: "Email address", value: selected.email },
                      { label: "Phone number", value: selected.phone },
                      { label: "Status", value: selected.status ?? "Active" },
                    ].map(({ label, value }, i) => (
                      <tr key={label} className={i % 2 === 0 ? "bg-muted/30" : "bg-background"}>
                        <td className="px-4 py-3 text-sm font-medium text-foreground w-48">{label}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Subjects */}
              <div className="rounded-lg border border-border overflow-hidden">
                <div className="px-4 py-2.5 bg-muted/40 border-b border-border">
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <BookOpen size={14} className="text-muted-foreground" />
                    Subjects taught
                  </h4>
                </div>
                <div className="p-4 flex flex-wrap gap-2">
                  {(selected.subjects as string[]).map((subject) => (
                    <span key={subject}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20" style={{color: theme.primaryColor,}}>
                      {subject}
                    </span>
                  ))}
                </div>
              </div>

              {/* Delete */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => void handleDeleteTeacher(selected.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded-md hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={14} />
                  Delete teacher
                </button>
              </div>

            </div>
          )}

          {/* Empty state */}
          {!showForm && !selected && (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-3">
                <GraduationCap size={24} className="text-muted-foreground" />
              </div>
              <p className="text-base font-medium text-foreground">Select a teacher</p>
              <p className="text-sm text-muted-foreground mt-1">
                Click any teacher on the left to view their details
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