"use client"

import React, { useState, useEffect } from "react"
import { X, Receipt, CheckCircle } from "lucide-react"
import { useTheme } from "@/components/providers/theme-provider"
import { createPortal } from "react-dom"

type PaymentMethod = "CASH" | "BANK_TRANSFER" | "MOBILE_MONEY" | "CHEQUE"
type Currency = "USD" | "ZIG"

interface Invoice {
  id: string
  studentName?: string
  gradeLevel?: string
  term: string
  academicYear: string
  totalAmountUsd: number
  status: "UNPAID" | "PARTIAL" | "PAID"
}

interface Payment {
  id: string
  invoiceId: string
  amountPaid: number
  currency: string
  method: string
  reference: string
  status: string
  paidAt: string
}

const METHOD_LABELS: Record<PaymentMethod, string> = {
  CASH: "Cash",
  BANK_TRANSFER: "Bank transfer",
  MOBILE_MONEY: "Mobile money (EcoCash / InnBucks)",
  CHEQUE: "Cheque",
}

const STATUS_COLORS = {
  UNPAID: { bg: "#FCEBEB", text: "#791F1F" },
  PARTIAL: { bg: "#FAEEDA", text: "#633806" },
  PAID: { bg: "#EAF3DE", text: "#27500A" },
}

const emptyForm = {
  amountPaid: "",
  currency: "USD" as Currency,
  method: "CASH" as PaymentMethod,
  reference: "",
}

export function PostPaymentModal({
  invoice,
  totalPaid: initialTotalPaid,
  onClose,
  onPaymentPosted,
}: {
  invoice: Invoice
  totalPaid: number
  onClose: () => void
  onPaymentPosted: (payment: Payment, newStatus: Invoice["status"], newTotalPaid: number) => void
}) {
  const { theme } = useTheme()
  const [form, setForm] = useState(emptyForm)
  const [posting, setPosting] = useState(false)
  const [error, setError] = useState("")
  const [focused, setFocused] = useState<string | null>(null)

  const totalBilled = Number(invoice.totalAmountUsd)
  const enteredAmount = parseFloat(form.amountPaid) || 0
  const balanceAfter = Math.max(0, totalBilled - initialTotalPaid - enteredAmount)
  const willBeFullyPaid = initialTotalPaid + enteredAmount >= totalBilled

  function inputStyle(field: string) {
    return {
      width: "100%",
      boxSizing: "border-box" as const,
      border: `1px solid ${focused === field ? theme.primaryColor : "var(--color-border-secondary)"}`,
      boxShadow: focused === field ? `0 0 0 2px ${theme.primaryColor}33` : "none",
      borderRadius: "var(--border-radius-md)",
      padding: "8px 10px",
      fontSize: "13px",
      background: "var(--color-background-primary)",
      color: "var(--color-text-primary)",
      outline: "none",
    }
  }

  // Close on backdrop click
  function handleBackdrop(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose()
  }

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  async function handleSubmit() {
    if (!form.amountPaid || !form.reference.trim()) {
      setError("Amount and reference are required")
      return
    }
    if (enteredAmount <= 0) {
      setError("Enter a valid amount greater than 0")
      return
    }
    setPosting(true)
    setError("")
    try {
      const res = await fetch("/api/invoices/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId: invoice.id,
          amountPaid: enteredAmount,
          currency: form.currency,
          method: form.method,
          reference: form.reference.trim(),
        }),
      })
      const data = await res.json() as {
        payment: Payment
        invoice: { status: string }
        error?: string
      }
      if (!res.ok) {
        setError(data.error ?? "Failed to post payment")
        return
      }
      onPaymentPosted(
        data.payment,
        data.invoice.status as Invoice["status"],
        initialTotalPaid + enteredAmount
      )
      onClose()
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setPosting(false)
    }
  }

  const statusColor = STATUS_COLORS[invoice.status]
  const initials = (invoice.studentName ?? "??")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

 
return createPortal(
  // Backdrop
  <div
    onClick={handleBackdrop}
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 9999,
      background: "rgba(0,0,0,0.45)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem",
    }}
  >
    {/* Modal */}
    <div
      style={{
        background: "white",
        borderRadius: "16px",
        border: "0.5px solid #e2e8f0",
        width: "100%",
        maxWidth: "480px",
        overflow: "hidden",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "1.1rem 1.5rem",
          borderBottom: "0.5px solid #e2e8f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <p style={{ fontSize: "15px", fontWeight: 500, margin: 0, color: "#0f172a" }}>
            Post payment
          </p>
          <p style={{ fontSize: "12px", color: "#64748b", margin: "3px 0 0" }}>
            Invoice #{invoice.id.slice(0, 8).toUpperCase()}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px",
            color: "#64748b",
            display: "flex",
            alignItems: "center",
          }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Student + invoice summary */}
      <div
        style={{
          padding: "1rem 1.5rem",
          background: "#f8fafc",
          borderBottom: "0.5px solid #e2e8f0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
          <div
            style={{
              width: 36, height: 36, borderRadius: "50%",
              background: `${theme.primaryColor}1a`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "13px", fontWeight: 500, color: theme.primaryColor,
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: "13px", fontWeight: 500, color: "#0f172a" }}>
              {invoice.studentName ?? "Unknown"}
            </p>
            <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>
              {invoice.gradeLevel?.replace(/_/g, " ")} · {invoice.term.replace("_", " ")} {invoice.academicYear}
            </p>
          </div>
          <span
            style={{
              fontSize: "11px", fontWeight: 500,
              background: statusColor.bg, color: statusColor.text,
              padding: "3px 10px", borderRadius: "6px",
              flexShrink: 0,
            }}
          >
            {invoice.status}
          </span>
        </div>

        {/* Balance tiles */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
          {[
            { label: "Total billed", value: `$${totalBilled.toFixed(2)}`, color: "#0f172a" },
            { label: "Paid so far", value: `$${initialTotalPaid.toFixed(2)}`, color: "#3B6D11" },
            { label: "Balance due", value: `$${(totalBilled - initialTotalPaid).toFixed(2)}`, color: "#A32D2D" },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              style={{
                background: "white",
                borderRadius: "8px",
                border: "0.5px solid #e2e8f0",
                padding: "8px 10px",
              }}
            >
              <p style={{ fontSize: "11px", color: "#64748b", margin: "0 0 2px" }}>{label}</p>
              <p style={{ fontSize: "14px", fontWeight: 500, margin: 0, color }}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div style={{ padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: "14px" }}>

        {error && (
          <div
            style={{
              background: "#fef2f2",
              border: "0.5px solid #fecaca",
              borderRadius: "8px",
              padding: "8px 12px",
            }}
          >
            <p style={{ margin: 0, fontSize: "12px", color: "#dc2626" }}>{error}</p>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div>
            <label style={{ fontSize: "12px", fontWeight: 500, color: "#64748b", display: "block", marginBottom: "6px" }}>
              Amount
            </label>
            <input
              type="number" min="0.01" step="0.01" placeholder="0.00"
              value={form.amountPaid}
              onChange={(e) => setForm((p) => ({ ...p, amountPaid: e.target.value }))}
              onFocus={() => setFocused("amount")}
              onBlur={() => setFocused(null)}
              style={inputStyle("amount")}
            />
          </div>
          <div>
            <label style={{ fontSize: "12px", fontWeight: 500, color: "#64748b", display: "block", marginBottom: "6px" }}>
              Currency
            </label>
            <select
              value={form.currency}
              onChange={(e) => setForm((p) => ({ ...p, currency: e.target.value as Currency }))}
              onFocus={() => setFocused("currency")}
              onBlur={() => setFocused(null)}
              style={inputStyle("currency")}
            >
              <option value="USD">USD</option>
              <option value="ZIG">ZIG</option>
            </select>
          </div>
        </div>

        <div>
          <label style={{ fontSize: "12px", fontWeight: 500, color: "#64748b", display: "block", marginBottom: "6px" }}>
            Payment method
          </label>
          <select
            value={form.method}
            onChange={(e) => setForm((p) => ({ ...p, method: e.target.value as PaymentMethod }))}
            onFocus={() => setFocused("method")}
            onBlur={() => setFocused(null)}
            style={inputStyle("method")}
          >
            {(Object.entries(METHOD_LABELS) as [PaymentMethod, string][]).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ fontSize: "12px", fontWeight: 500, color: "#64748b", display: "block", marginBottom: "6px" }}>
            Reference / receipt no.
          </label>
          <input
            type="text" placeholder="e.g. REC-00123"
            value={form.reference}
            onChange={(e) => setForm((p) => ({ ...p, reference: e.target.value }))}
            onFocus={() => setFocused("reference")}
            onBlur={() => setFocused(null)}
            style={inputStyle("reference")}
          />
        </div>

        {/* Live balance hint */}
        {enteredAmount > 0 && (
          <div
            style={{
              background: willBeFullyPaid ? "#EAF3DE" : "#FAEEDA",
              borderRadius: "8px",
              padding: "10px 12px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <CheckCircle size={15} style={{ color: willBeFullyPaid ? "#3B6D11" : "#854F0B", flexShrink: 0 }} />
            <p style={{ margin: 0, fontSize: "12px", color: willBeFullyPaid ? "#27500A" : "#633806" }}>
              {willBeFullyPaid
                ? "This payment will fully clear the invoice."
                : `After this payment, balance remaining will be $${balanceAfter.toFixed(2)}`}
            </p>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: "10px", paddingTop: "4px" }}>
          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={posting}
            style={{
              flex: 1,
              background: theme.primaryColor,
              color: theme.primaryText,
              border: "none",
              borderRadius: "8px",
              padding: "9px",
              fontSize: "13px",
              fontWeight: 500,
              cursor: posting ? "not-allowed" : "pointer",
              opacity: posting ? 0.6 : 1,
              transition: "opacity 0.15s",
            }}
          >
            {posting ? "Posting..." : "Confirm payment"}
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "9px 16px",
              borderRadius: "8px",
              border: "0.5px solid #e2e8f0",
              background: "transparent",
              fontSize: "13px",
              color: "#0f172a",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>,
  document.body
)
}