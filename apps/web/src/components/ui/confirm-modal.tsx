"use client"

import React from "react"
import { AlertTriangle } from "lucide-react"

interface ConfirmModalProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: "danger" | "warning"
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-card border border-border rounded-xl shadow-lg w-full max-w-md mx-4 p-6 space-y-4">

        {/* Icon and title */}
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
            variant === "danger"
              ? "bg-red-100 text-red-600"
              : "bg-amber-100 text-amber-600"
          }`}>
            <AlertTriangle size={20} />
          </div>
          <h3 className="text-base font-semibold text-foreground">
            {title}
          </h3>
        </div>

        {/* Message */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {message}
        </p>

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="py-2 px-4 border border-border rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`py-2 px-4 rounded-md text-sm font-medium text-white transition-opacity hover:opacity-90 ${
              variant === "danger"
                ? "bg-red-600"
                : "bg-amber-500"
            }`}
          >
            {confirmLabel}
          </button>
        </div>

      </div>
    </div>
  )
}