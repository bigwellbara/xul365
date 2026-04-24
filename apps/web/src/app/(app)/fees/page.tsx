// ============================================
// FEES & BILLING PAGE
// View and manage student invoices and payments
// ============================================

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Fees & Billing",
}

// Placeholder data — will be replaced with real DB data later
const placeholderInvoices = [
  {
    id: "1",
    studentName: "Tatenda Moyo",
    academicYear: "2025",
    term: "TERM_1",
    totalAmountUsd: 350,
    amountPaidUsd: 350,
    status: "paid",
    dueDate: "2025-02-28",
  },
  {
    id: "2",
    studentName: "Chiedza Mutasa",
    academicYear: "2025",
    term: "TERM_1",
    totalAmountUsd: 350,
    amountPaidUsd: 150,
    status: "partial",
    dueDate: "2025-02-28",
  },
  {
    id: "3",
    studentName: "Farai Ndlovu",
    academicYear: "2025",
    term: "TERM_1",
    totalAmountUsd: 350,
    amountPaidUsd: 0,
    status: "unpaid",
    dueDate: "2025-02-28",
  },
  {
    id: "4",
    studentName: "Nyasha Dube",
    academicYear: "2025",
    term: "TERM_1",
    totalAmountUsd: 350,
    amountPaidUsd: 0,
    status: "unpaid",
    dueDate: "2025-02-28",
  },
]

const termLabelMap: Record<string, string> = {
  TERM_1: "Term 1",
  TERM_2: "Term 2",
  TERM_3: "Term 3",
}

const statusStyles: Record<string, string> = {
  paid: "bg-green-100 text-green-700",
  partial: "bg-yellow-100 text-yellow-700",
  unpaid: "bg-red-100 text-red-700",
}

// Summary totals
const totalInvoiced = placeholderInvoices.reduce(
  (sum, i) => sum + i.totalAmountUsd,
  0
)
const totalCollected = placeholderInvoices.reduce(
  (sum, i) => sum + i.amountPaidUsd,
  0
)
const totalOutstanding = totalInvoiced - totalCollected

export default function FeesPage() {
  return (
    <div className="space-y-6">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Fees & Billing</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage student invoices and track payments
          </p>
        </div>
        
          href="/fees/new"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
        >
          + Create Invoice
        </a>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-5 space-y-1">
          <p className="text-sm text-muted-foreground">Total Invoiced</p>
          <p className="text-2xl font-bold text-foreground">
            ${totalInvoiced.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground">
            {placeholderInvoices.length} invoices this term
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-5 space-y-1">
          <p className="text-sm text-muted-foreground">Total Collected</p>
          <p className="text-2xl font-bold text-green-600">
            ${totalCollected.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground">
            {Math.round((totalCollected / totalInvoiced) * 100)}% of total
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-5 space-y-1">
          <p className="text-sm text-muted-foreground">Outstanding</p>
          <p className="text-2xl font-bold text-red-600">
            ${totalOutstanding.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground">
            {placeholderInvoices.filter((i) => i.status !== "paid").length} unpaid
            invoices
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Search by student name..."
          className="flex-1 max-w-sm px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <select className="px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="">All terms</option>
          <option value="TERM_1">Term 1</option>
          <option value="TERM_2">Term 2</option>
          <option value="TERM_3">Term 3</option>
        </select>
        <select className="px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="">All statuses</option>
          <option value="paid">Paid</option>
          <option value="partial">Partial</option>
          <option value="unpaid">Unpaid</option>
        </select>
      </div>

      {/* Invoices table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Student
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Term
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Amount
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Paid
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Balance
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Due Date
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
            {placeholderInvoices.map((invoice, index) => (
              <tr
                key={invoice.id}
                className={
                  index < placeholderInvoices.length - 1
                    ? "border-b border-border"
                    : ""
                }
              >
                <td className="px-4 py-3 font-medium text-foreground">
                  {invoice.studentName}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {termLabelMap[invoice.term] ?? invoice.term}{" "}
                  {invoice.academicYear}
                </td>
                <td className="px-4 py-3 text-foreground">
                  ${invoice.totalAmountUsd.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-green-600">
                  ${invoice.amountPaidUsd.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-red-600">
                  ${(invoice.totalAmountUsd - invoice.amountPaidUsd).toFixed(2)}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {invoice.dueDate}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      statusStyles[invoice.status] ??
                      "bg-muted text-muted-foreground"
                    }`}
                  >
                    {invoice.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    
                      href={`/fees/${invoice.id}`}
                      className="text-primary hover:underline text-xs"
                    >
                      View
                    </a>
                    {invoice.status !== "paid" && (
                      <>
                        <span className="text-border">·</span>
                        
                          href={`/fees/${invoice.id}/pay`}
                          className="text-primary hover:underline text-xs"
                        >
                          Record Payment
                        </a>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty state */}
        {placeholderInvoices.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm text-muted-foreground">
              No invoices yet. Create your first invoice to get started.
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>Showing {placeholderInvoices.length} invoices</p>
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