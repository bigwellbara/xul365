// ============================================
// DOMAIN RULES - Pure business logic
// No frameworks, no databases, just rules
// ============================================

import type { Student, Class, Invoice, Payment, Feature, Subscription } from "./entities"

// ---- STUDENT RULES ----

export function canEnrollStudent(
  student: Student,
  targetClass: Class,
  currentEnrollments: { studentId: string; classId: string }[]
): { allowed: boolean; reason?: string } {
  // Rule 1: Student cannot be enrolled twice in the same class
  const alreadyEnrolled = currentEnrollments.some(
    (e) => e.studentId === student.id && e.classId === targetClass.id
  )
  if (alreadyEnrolled) {
    return { allowed: false, reason: "Student is already enrolled in this class" }
  }

  // Rule 2: Class must not exceed capacity
  const classEnrollments = currentEnrollments.filter(
    (e) => e.classId === targetClass.id
  )
  if (classEnrollments.length >= targetClass.capacity) {
    return { allowed: false, reason: "Class has reached maximum capacity" }
  }

  // Rule 3: Grade level must match
  if (student.gradeLevel !== targetClass.gradeLevel) {
    return { allowed: false, reason: "Student grade level does not match class grade level" }
  }

  return { allowed: true }
}

// ---- FEE RULES ----

export function calculateOutstandingBalance(
  invoice: Invoice,
  payments: Payment[]
): number {
  // Only count verified payments against this invoice
  const verifiedPayments = payments.filter(
    (p) => p.invoiceId === invoice.id && p.status === "verified"
  )

  const totalPaid = verifiedPayments.reduce((sum, p) => sum + p.amountPaid, 0)
  const outstanding = invoice.totalAmountUsd - totalPaid

  // Balance can never be negative
  return Math.max(0, outstanding)
}

export function getInvoiceStatus(
  invoice: Invoice,
  payments: Payment[]
): "unpaid" | "partial" | "paid" {
  const outstanding = calculateOutstandingBalance(invoice, payments)

  if (outstanding === 0) return "paid"
  if (outstanding < invoice.totalAmountUsd) return "partial"
  return "unpaid"
}

// ---- SUBSCRIPTION RULES ----

export function isFeatureEnabled(
  feature: Feature,
  subscription: Subscription
): boolean {
  if (subscription.status === "expired") return false
  return subscription.selectedFeatures.includes(feature)
}

export function calculateSubscriptionPrice(
  features: Feature[],
  billingCycle: "monthly" | "annual",
  featurePricing: Record<Feature, number>
): number {
  const monthlyTotal = features.reduce((sum, feature) => {
    return sum + (featurePricing[feature] ?? 0)
  }, 0)

  // 20% discount for annual billing
  if (billingCycle === "annual") {
    return monthlyTotal * 12 * 0.8
  }

  return monthlyTotal
}

export function isSubscriptionExpired(subscription: Subscription): boolean {
  return new Date() > subscription.endDate
}

export function isSubscriptionInTrial(subscription: Subscription): boolean {
  return subscription.status === "trial" && !isSubscriptionExpired(subscription)
}