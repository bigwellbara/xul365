"use client"

import React, { useState, useEffect, useRef } from "react"

interface Student {
  id: string
  firstName: string
  lastName: string
  gradeLevel: string
}

interface InvoiceItem {
  description: string
  amountUsd: number
}

interface Invoice {
  id: string
  studentId: string
  term: string
  academicYear: string
  items: InvoiceItem[]
  totalAmountUsd: number
  status: "UNPAID" | "PARTIAL" | "PAID"
  dueDate: string
  studentName?: string
  gradeLevel?: string
}

const emptyForm = {
  studentId: "",
  studentName: "",
  gradeLevel: "",
  term: "TERM_1",
  academicYear: "2025",
  dueDate: "",
  tuitionFee: "",
  examFee: "",
  developmentFee: "",
  sportsFee: "",
}

const STATUS_STYLES = {
  UNPAID: "bg-red-100 text-red-800",
  PARTIAL: "bg-amber-100 text-amber-800",
  PAID: "bg-green-100 text-green-800",
}

export default function FeesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState("")
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState<"all" | "unpaid" | "paid">("all")

  // Student search state
  const [studentQuery, setStudentQuery] = useState("")
  const [studentResults, setStudentResults] = useState<Student[]>([])
  const [searchingStudents, setSearchingStudents] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchInvoices() {
      try {
        const res = await fetch("/api/invoices")
        const data = await res.json() as { invoices: Invoice[] }
        setInvoices(data.invoices ?? [])
      } catch {
        setError("Failed to load invoices")
      } finally {
        setFetching(false)
      }
    }
    void fetchInvoices()
  }, [])

  // Live student search
 useEffect(() => {
  // ✅ If a student is already selected, DON'T search again
  if (form.studentId) {
    return
  }

  if (studentQuery.length < 1) {
    setStudentResults([])
    setShowDropdown(false)
    return
  }

    const timeout = setTimeout(async () => {
      setSearchingStudents(true)
      try {
        const res = await fetch(`/api/students/search?q=${encodeURIComponent(studentQuery)}`)
        const data = await res.json() as { students: Student[] }
        setStudentResults(data.students ?? [])
        setShowDropdown(true)
      } catch {
        setStudentResults([])
      } finally {
        setSearchingStudents(false)
      }
    }, 300)

    return () => clearTimeout(timeout)
  }, [studentQuery])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function selectStudent(student: Student) {
  // console.log("SELECTED STUDENT:", student)

  setForm((prev) => ({
    ...prev,
    studentId: student.id,
    studentName: `${student.firstName} ${student.lastName}`,
    gradeLevel: student.gradeLevel,
  }))

  setStudentQuery(`${student.firstName} ${student.lastName}`)

  // ✅ ADD THESE
  setStudentResults([])
  setShowDropdown(false)
}

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }))
  }

  async function handleSubmit() {
    console.log("FORM STATE:", form)
    if (!form.studentId) {
      setError("Please select a student")
      return
    }

    setLoading(true)
    setError("")

    const items = [
      form.tuitionFee && { description: "Tuition Fee", amountUsd: parseFloat(form.tuitionFee) },
      form.examFee && { description: "Examination Fee", amountUsd: parseFloat(form.examFee) },
      form.developmentFee && { description: "Development Fee", amountUsd: parseFloat(form.developmentFee) },
      form.sportsFee && { description: "Sports Fee", amountUsd: parseFloat(form.sportsFee) },
    ].filter(Boolean) as InvoiceItem[]

    const totalAmountUsd = items.reduce((sum, i) => sum + i.amountUsd, 0)

    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: form.studentId,
          studentName: form.studentName,
          gradeLevel: form.gradeLevel,
          term: form.term,
          academicYear: form.academicYear,
          dueDate: form.dueDate,
          items,
          totalAmountUsd,
        }),
      })

      const data = await res.json() as { invoice: Invoice; error?: string }

      if (!res.ok) {
        setError(data.error ?? "Failed to create invoice")
        return
      }

      const newInvoice = {
        ...data.invoice,
        studentName: form.studentName,
        gradeLevel: form.gradeLevel,
      }

      setInvoices((prev) => [newInvoice, ...prev])
      setForm(emptyForm)
      setStudentQuery("")
      setShowForm(false)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function markAsPaid(invoiceId: string) {
    try {
      const res = await fetch("/api/invoices", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId }),
      })
      if (!res.ok) return
      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === invoiceId ? { ...inv, status: "PAID" } : inv
        )
      )
    } catch {
      setError("Failed to update invoice")
    }
  }

  const filtered = invoices
    .filter((inv) =>
      (inv.studentName ?? "").toLowerCase().includes(search.toLowerCase())
    )
    .filter((inv) => {
      if (activeTab === "unpaid") return inv.status === "UNPAID"
      if (activeTab === "paid") return inv.status === "PAID"
      return true
    })

  const totalBilled = invoices.reduce((sum, inv) => sum + Number(inv.totalAmountUsd), 0)
  const totalPaid = invoices
    .filter((inv) => inv.status === "PAID")
    .reduce((sum, inv) => sum + Number(inv.totalAmountUsd), 0)
  const totalOutstanding = totalBilled - totalPaid

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Fees & Billing</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage student invoices and payments
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="py-2 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
        >
          + Create invoice
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-lg border border-border p-5">
          <p className="text-sm text-muted-foreground">Total billed</p>
          <p className="text-2xl font-bold text-foreground mt-1">${totalBilled.toFixed(2)}</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-5">
          <p className="text-sm text-muted-foreground">Total collected</p>
          <p className="text-2xl font-bold text-green-600 mt-1">${totalPaid.toFixed(2)}</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-5">
          <p className="text-sm text-muted-foreground">Outstanding</p>
          <p className="text-2xl font-bold text-red-600 mt-1">${totalOutstanding.toFixed(2)}</p>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Create invoice form */}
      {showForm && (
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-base font-semibold text-foreground mb-4">
            Create new invoice
          </h3>
          <div className="space-y-4">

            {/* Student search */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Student
              </label>
              <div className="relative" ref={dropdownRef}>
                <input
                  type="text"
                  value={studentQuery}
                  onChange={(e) => {
                    setStudentQuery(e.target.value)
                    setForm((prev) => ({
                      ...prev,
                      studentId: "",
                      studentName: "",
                      gradeLevel: "",
                    }))
                  }}
                  placeholder="Search student by name..."
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                {searchingStudents && (
                  <p className="text-xs text-muted-foreground mt-1">Searching...</p>
                )}
                {showDropdown && studentResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-lg overflow-hidden">
                    {studentResults.map((student) => (
                      <button
                        key={student.id}
                        type="button"
                        onClick={() => selectStudent(student)}
                        className="w-full text-left px-4 py-3 hover:bg-muted transition-colors border-b border-border last:border-0"
                      >
                        <p className="text-sm font-medium text-foreground">
                          {student.firstName} {student.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {student.gradeLevel.replace(/_/g, " ")}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
                {showDropdown && studentResults.length === 0 && !searchingStudents && (
                  <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-lg p-4 text-center">
                    <p className="text-sm text-muted-foreground">No students found</p>
                  </div>
                )}
              </div>

              {/* Selected student info */}
              {form.studentId && (
                <div className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/20 rounded-md">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
                    {form.studentName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{form.studentName}</p>
                    <p className="text-xs text-muted-foreground">
                      {form.gradeLevel.replace(/_/g, " ")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setForm((prev) => ({ ...prev, studentId: "", studentName: "", gradeLevel: "" }))
                      setStudentQuery("")
                    }}
                    className="ml-auto text-xs text-muted-foreground hover:text-foreground"
                  >
                    ✕ Clear
                  </button>
                </div>
              )}
            </div>

            {/* Term, year, due date */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label htmlFor="term" className="text-sm font-medium text-foreground">Term</label>
                <select
                  id="term"
                  value={form.term}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="TERM_1">Term 1</option>
                  <option value="TERM_2">Term 2</option>
                  <option value="TERM_3">Term 3</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="academicYear" className="text-sm font-medium text-foreground">Academic year</label>
                <input
                  id="academicYear"
                  type="text"
                  value={form.academicYear}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="dueDate" className="text-sm font-medium text-foreground">Due date</label>
                <input
                  id="dueDate"
                  type="date"
                  value={form.dueDate}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            {/* Fee items */}
            <div className="border-t border-border pt-4 space-y-3">
              <h4 className="text-sm font-medium text-foreground">Fee items (USD)</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="tuitionFee" className="text-sm text-muted-foreground">Tuition fee</label>
                  <input
                    id="tuitionFee"
                    type="number"
                    value={form.tuitionFee}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="examFee" className="text-sm text-muted-foreground">Examination fee</label>
                  <input
                    id="examFee"
                    type="number"
                    value={form.examFee}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="developmentFee" className="text-sm text-muted-foreground">Development fee</label>
                  <input
                    id="developmentFee"
                    type="number"
                    value={form.developmentFee}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="sportsFee" className="text-sm text-muted-foreground">Sports fee</label>
                  <input
                    id="sportsFee"
                    type="number"
                    value={form.sportsFee}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between bg-muted rounded-md px-4 py-3">
                <p className="text-sm font-medium text-foreground">Total amount</p>
                <p className="text-lg font-bold text-foreground">
                  ${(
                    parseFloat(form.tuitionFee || "0") +
                    parseFloat(form.examFee || "0") +
                    parseFloat(form.developmentFee || "0") +
                    parseFloat(form.sportsFee || "0")
                  ).toFixed(2)}
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => void handleSubmit()}
                disabled={loading || !form.studentId}
                className="py-2 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create invoice"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setForm(emptyForm)
                  setStudentQuery("")
                }}
                className="py-2 px-4 border border-border rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Tabs and search */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          {(["all", "unpaid", "paid"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${
                activeTab === tab
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search invoices..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Invoices table */}
      {fetching ? (
        <div className="bg-card rounded-lg border border-border p-12 text-center">
          <p className="text-sm text-muted-foreground">Loading invoices...</p>
        </div>
      ) : invoices.length === 0 ? (
        <div className="bg-card rounded-lg border border-border p-12 text-center">
          <p className="text-4xl mb-4">💰</p>
          <p className="text-base font-medium text-foreground">No invoices yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Click the button above to create your first invoice
          </p>
        </div>
      ) : (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Invoice</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Student</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Term</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Amount</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Due date</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3 text-sm font-medium text-foreground">
                    {invoice.id.slice(0, 8).toUpperCase()}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-foreground">
                      {invoice.studentName ?? "Unknown"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {invoice.gradeLevel?.replace(/_/g, " ")}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {invoice.term.replace("_", " ")} {invoice.academicYear}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-foreground">
                    ${Number(invoice.totalAmountUsd).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[invoice.status]}`}>
                      {invoice.status.charAt(0) + invoice.status.slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => void markAsPaid(invoice.id)}
                      disabled={invoice.status === "PAID"}
                      className="text-xs text-primary hover:underline disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Mark as paid
                    </button>
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