// ============================================
// CORE DOMAIN ENTITIES - No external dependencies
// These are the heart of the entire system
// ============================================

// ---- TENANT (School) ----
export interface Tenant {
  id: string
  schoolName: string
  subdomain: string
  databaseName: string
  subscriptionStatus: SubscriptionStatus
  enabledFeatures: Feature[]
  branding: Branding
  createdAt: Date
  updatedAt: Date
}

export type SubscriptionStatus =
  | "pending"
  | "active"
  | "restricted"
  | "suspended"
  | "cancelled"

// ---- BRANDING ----
export interface Branding {
  logoUrl: string | null
  primaryColor: string
  secondaryColor: string
  accentColor: string
}

// ---- FEATURES ----
export type Feature =
  | "student_management"
  | "teacher_management"
  | "attendance"
  | "exams_grading"
  | "timetable"
  | "fees_billing"
  | "parent_portal"
  | "sms_notifications"

// ---- STUDENT ----
export interface Student {
  id: string
  tenantId: string
  firstName: string
  lastName: string
  dateOfBirth: Date
  gender: "male" | "female"
  gradeLevel: GradeLevel
  enrollmentDate: Date
  status: "active" | "inactive" | "transferred"
  parentContact: ParentContact
}

export type GradeLevel =
  | "ECD_A"
  | "ECD_B"
  | "GRADE_1"
  | "GRADE_2"
  | "GRADE_3"
  | "GRADE_4"
  | "GRADE_5"
  | "GRADE_6"
  | "GRADE_7"
  | "FORM_1"
  | "FORM_2"
  | "FORM_3"
  | "FORM_4"
  | "FORM_5"
  | "FORM_6"

export interface ParentContact {
  name: string
  phone: string
  email: string | null
  relationship: "mother" | "father" | "guardian"
}

// ---- TEACHER ----
export interface Teacher {
  id: string
  tenantId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  subjects: string[]
  status: "active" | "inactive"
  joinedAt: Date
}

// ---- CLASS ----
export interface Class {
  id: string
  tenantId: string
  name: string
  gradeLevel: GradeLevel
  teacherId: string
  academicYear: string
  capacity: number
}

// ---- ATTENDANCE ----
export interface AttendanceRecord {
  id: string
  tenantId: string
  studentId: string
  classId: string
  date: Date
  status: "present" | "absent" | "late" | "excused"
  recordedBy: string
}

// ---- FEES & PAYMENTS ----
export interface Invoice {
  id: string
  tenantId: string
  studentId: string
  academicYear: string
  term: Term
  items: InvoiceItem[]
  totalAmountUsd: number
  totalAmountZig: number
  status: "unpaid" | "partial" | "paid"
  dueDate: Date
  createdAt: Date
}

export interface InvoiceItem {
  description: string
  amountUsd: number
  amountZig: number
}

export type Term = "TERM_1" | "TERM_2" | "TERM_3"

export interface Payment {
  id: string
  tenantId: string
  invoiceId: string
  amountPaid: number
  currency: "USD" | "ZiG"
  method: "ecocash" | "paynow" | "bank_transfer" | "cash"
  reference: string
  status: "pending" | "verified" | "failed"
  paidAt: Date
}

// ---- SUBSCRIPTION ----
export interface Subscription {
  id: string
  tenantId: string
  selectedFeatures: Feature[]
  billingCycle: "monthly" | "annual"
  priceUsd: number
  startDate: Date
  endDate: Date
  status: "trial" | "active" | "expired"
}