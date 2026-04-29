"use client"

import React, { useState } from "react"

// ---- TYPES ----
interface Invoice {
  id: string
  studentName: string
  gradeLevel: string
  term: string
  academicYear: string
  items: { description: string; amountUsd: number }[]
  totalAmountUsd: number
  status: "unpaid" | "partial" | "paid"
  dueDate: string
}

// ---- EMPTY FORM ----
const emptyForm = {
  studentName: "",
  gradeLevel: "FORM_1",
  term: "TERM_1",
  academicYear: "2025",
  dueDate: "",
  tuitionFee: "",
  examFee: "",
  developmentFee: "",
  sportsFee: "",
}

const STATUS_STYLES = {
  unpaid: "bg-red-100 text-red-800",
  partial: "bg-amber-100 text-amber-800",
  paid: "bg-green-100 text-green-800",
}

export default function FeesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState("")
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"all" | "unpaid" | "paid">("all")

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    // Build invoice items from filled fields
    const items = [
      form.tuitionFee && {
        description: "Tuition Fee",
        amountUsd: parseFloat(form.tuitionFee),
      },
      form.examFee && {
        description: "Examination Fee",
        amountUsd: parseFloat(form.examFee),
      },
      form.developmentFee && {
        description: "Development Fee",
        amountUsd: parseFloat(form.developmentFee),
      },
      form.sportsFee && {
        description: "Sports Fee",
        amountUsd: parseFloat(form.sportsFee),
      },
    ].filter(Boolean) as { description: string; amountUsd: number }[]

    const totalAmountUsd = items.reduce((sum, i) => sum + i.amountUsd, 0)

    const newInvoice: Invoice = {
      id: `INV-${Date.now()}`,
      studentName: form.studentName,
      gradeLevel: form.gradeLevel,
      term: form.term,
      academicYear: form.academicYear,
      items,
      totalAmountUsd,
      status: "unpaid",
      dueDate: form.dueDate,
    }

    setTimeout(() => {
      setInvoices((prev) => [newInvoice, ...prev])
      setForm(emptyForm)
      setShowForm(false)
      setLoading(false)
    }, 500)
  }

  // Filter invoices
  const filtered = invoices
    .filter((inv) =>
      inv.studentName.toLowerCase().includes(search.toLowerCase())
    )
    .filter((inv) => {
      if (activeTab === "unpaid") return inv.status === "unpaid"
      if (activeTab === "paid") return inv.status === "paid"
      return true
    })

  // Summary totals
  const totalBilled = invoices.reduce((sum, inv) => sum + inv.totalAmountUsd, 0)
  const totalPaid = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.totalAmountUsd, 0)
  const totalOutstanding = totalBilled - totalPaid

  return (
    <div className="space-y-6">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Fees & Billing
          </h2>
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
          <p className="text-2xl font-bold text-foreground mt-1">
            ${totalBilled.toFixed(2)}
          </p>
        </div>
        <div className="bg-card rounded-lg border border-border p-5">
          <p className="text-sm text-muted-foreground">Total collected</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            ${totalPaid.toFixed(2)}
          </p>
        </div>
        <div className="bg-card rounded-lg border border-border p-5">
          <p className="text-sm text-muted-foreground">Outstanding</p>
          <p className="text-2xl font-bold text-red-600 mt-1">
            ${totalOutstanding.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Create invoice form */}
      {showForm && (
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-base font-semibold text-foreground mb-4">
            Create new invoice
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Student and grade */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="studentName"
                  className="text-sm font-medium text-foreground"
                >
                  Student name
                </label>
                <input
                  id="studentName"
                  type="text"
                  value={form.studentName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="gradeLevel"
                  className="text-sm font-medium text-foreground"
                >
                  Grade level
                </label>
                <select
                  id="gradeLevel"
                  value={form.gradeLevel}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="ECD_A">ECD A</option>
                  <option value="ECD_B">ECD B</option>
                  <option value="GRADE_1">Grade 1</option>
                  <option value="GRADE_7">Grade 7</option>
                  <option value="FORM_1">Form 1</option>
                  <option value="FORM_2">Form 2</option>
                  <option value="FORM_3">Form 3</option>
                  <option value="FORM_4">Form 4</option>
                  <option value="FORM_5">Form 5</option>
                  <option value="FORM_6">Form 6</option>
                </select>
              </div>
            </div>

            {/* Term, year, due date */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="term"
                  className="text-sm font-medium text-foreground"
                >
                  Term
                </label>
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
                <label
                  htmlFor="academicYear"
                  className="text-sm font-medium text-foreground"
                >
                  Academic year
                </label>
                <input
                  id="academicYear"
                  type="text"
                  value={form.academicYear}
                  onChange={handleChange}
                  placeholder="2025"
                  required
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="dueDate"
                  className="text-sm font-medium text-foreground"
                >
                  Due date
                </label>
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
              <h4 className="text-sm font-medium text-foreground">
                Fee items (USD)
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="tuitionFee"
                    className="text-sm text-muted-foreground"
                  >
                    Tuition fee
                  </label>
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
                  <label
                    htmlFor="examFee"
                    className="text-sm text-muted-foreground"
                  >
                    Examination fee
                  </label>
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
                  <label
                    htmlFor="developmentFee"
                    className="text-sm text-muted-foreground"
                  >
                    Development fee
                  </label>
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
                  <label
                    htmlFor="sportsFee"
                    className="text-sm text-muted-foreground"
                  >
                    Sports fee
                  </label>
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

              {/* Total preview */}
              <div className="flex items-center justify-between bg-muted rounded-md px-4 py-3">
                <p className="text-sm font-medium text-foreground">
                  Total amount
                </p>
                <p className="text-lg font-bold text-foreground">
                  $
                  {(
                    parseFloat(form.tuitionFee || "0") +
                    parseFloat(form.examFee || "0") +
                    parseFloat(form.developmentFee || "0") +
                    parseFloat(form.sportsFee || "0")
                  ).toFixed(2)}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="py-2 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create invoice"}
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
      {invoices.length === 0 ? (
        <div className="bg-card rounded-lg border border-border p-12 text-center">
          <p className="text-4xl mb-4">💰</p>
          <p className="text-base font-medium text-foreground">
            No invoices yet
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Click the button above to create your first invoice
          </p>
        </div>
      ) : (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Invoice
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Student
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Term
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Amount
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Due date
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3 text-sm font-medium text-foreground">
                    {invoice.id}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-foreground">
                      {invoice.studentName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {invoice.gradeLevel.replace("_", " ")}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {invoice.term.replace("_", " ")} {invoice.academicYear}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-foreground">
                    ${invoice.totalAmountUsd.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {invoice.dueDate}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[invoice.status]}`}
                    >
                      {invoice.status.charAt(0).toUpperCase() +
                        invoice.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() =>
                        setInvoices((prev) =>
                          prev.map((inv) =>
                            inv.id === invoice.id
                              ? { ...inv, status: "paid" }
                              : inv
                          )
                        )
                      }
                      disabled={invoice.status === "paid"}
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