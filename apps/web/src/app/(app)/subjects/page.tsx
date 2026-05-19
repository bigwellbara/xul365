"use client"

import React, { useState, useEffect } from "react"
import { Plus, Trash2, BookMarked } from "lucide-react"
import { ConfirmModal } from "@/components/ui/confirm-modal"

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

const emptyForm = {
  name: "",
  code: "",
  gradeLevel: "FORM_1",
}

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState("")
  const [filterGrade, setFilterGrade] = useState("all")
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
    async function fetchSubjects() {
      try {
        const res = await fetch("/api/subjects")
        const data = await res.json() as { subjects: Subject[] }
        setSubjects(data.subjects ?? [])
      } catch {
        setError("Failed to load subjects")
      } finally {
        setFetching(false)
      }
    }
    void fetchSubjects()
  }, [])

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }))
  }

  async function handleSubmit() {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json() as { subject: Subject; error?: string }
      if (!res.ok) {
        setError(data.error ?? "Failed to create subject")
        return
      }
      setSubjects((prev) => [...prev, data.subject])
      setForm(emptyForm)
      setShowForm(false)
    } catch {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(subjectId: string) {
    showConfirm(
      "Delete subject",
      "Are you sure you want to delete this subject? All related exam results will also be removed.",
      async () => {
        setConfirmOpen(false)
        try {
          const res = await fetch(`/api/subjects/${subjectId}`, {
            method: "DELETE",
          })
          if (!res.ok) {
            const data = await res.json() as { error?: string }
            setError(data.error ?? "Failed to delete subject")
            return
          }
          setSubjects((prev) => prev.filter((s) => s.id !== subjectId))
        } catch {
          setError("Something went wrong")
        }
      }
    )
  }

  const filtered = filterGrade === "all"
    ? subjects
    : subjects.filter((s) => s.gradeLevel === filterGrade)

  // Group by grade level
  const grouped = filtered.reduce<Record<string, Subject[]>>((acc, subject) => {
    const key = subject.gradeLevel
    if (!acc[key]) acc[key] = []
    acc[key].push(subject)
    return acc
  }, {})

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Subjects</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {subjects.length} subject{subjects.length !== 1 ? "s" : ""} configured
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 py-2 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus size={16} />
          Add subject
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Add subject form */}
      {showForm && (
        <div className="bg-card rounded-lg border border-border p-6 space-y-4">
          <h3 className="text-base font-semibold text-foreground">
            Add new subject
          </h3>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-foreground">
                Subject name
              </label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Mathematics"
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="code" className="text-sm font-medium text-foreground">
                Subject code
              </label>
              <input
                id="code"
                type="text"
                value={form.code}
                onChange={handleChange}
                placeholder="e.g. MATH-F1"
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
                  <option key={g} value={g}>{g.replace(/_/g, " ")}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => void handleSubmit()}
              disabled={loading || !form.name || !form.code}
              className="flex items-center gap-2 py-2 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Plus size={16} />
              {loading ? "Saving..." : "Save subject"}
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
      )}

      {/* Filter by grade */}
      <div className="flex items-center gap-2 flex-wrap">
        <p className="text-sm text-muted-foreground">Filter by grade:</p>
        <button
          type="button"
          onClick={() => setFilterGrade("all")}
          className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
            filterGrade === "all"
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-background text-foreground border-border hover:border-primary"
          }`}
        >
          All
        </button>
        {GRADE_LEVELS.map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => setFilterGrade(g)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
              filterGrade === g
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-foreground border-border hover:border-primary"
            }`}
          >
            {g.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      {/* Subjects list */}
      {fetching ? (
        <div className="bg-card rounded-lg border border-border p-12 text-center">
          <p className="text-sm text-muted-foreground">Loading subjects...</p>
        </div>
      ) : subjects.length === 0 ? (
        <div className="bg-card rounded-lg border border-border p-12 text-center">
          <BookMarked size={40} className="mx-auto text-muted-foreground mb-3" />
          <p className="text-base font-medium text-foreground">No subjects yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Add subjects to use in exams and timetables
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([gradeLevel, gradeSubjects]) => (
            <div key={gradeLevel} className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">
                {gradeLevel.replace(/_/g, " ")}
              </h3>
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Subject</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Code</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Grade</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gradeSubjects.map((subject) => (
                      <tr
                        key={subject.id}
                        className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <BookMarked size={14} className="text-muted-foreground" />
                            <p className="text-sm font-medium text-foreground">
                              {subject.name}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 bg-muted rounded text-xs font-mono text-muted-foreground">
                            {subject.code}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-foreground">
                          {subject.gradeLevel.replace(/_/g, " ")}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => void handleDelete(subject.id)}
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
            </div>
          ))}
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