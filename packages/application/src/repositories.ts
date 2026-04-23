// ============================================
// REPOSITORY INTERFACES
// These define WHAT we need from the database
// The actual database code lives in infrastructure
// ============================================

import type {
  Tenant,
  Student,
  Teacher,
  Class,
  AttendanceRecord,
  Invoice,
  Payment,
  Subscription,
  Feature,
} from "@xul365/domain"

// ---- TENANT REPOSITORY ----
export interface TenantRepository {
  findBySubdomain(subdomain: string): Promise<Tenant | null>
  findById(id: string): Promise<Tenant | null>
  create(tenant: Omit<Tenant, "id" | "createdAt" | "updatedAt">): Promise<Tenant>
  update(id: string, data: Partial<Tenant>): Promise<Tenant>
  updateEnabledFeatures(id: string, features: Feature[]): Promise<void>
  exists(subdomain: string): Promise<boolean>
}

// ---- STUDENT REPOSITORY ----
export interface StudentRepository {
  findById(id: string): Promise<Student | null>
  findByTenant(tenantId: string): Promise<Student[]>
  findByClass(classId: string): Promise<Student[]>
  create(student: Omit<Student, "id">): Promise<Student>
  update(id: string, data: Partial<Student>): Promise<Student>
  delete(id: string): Promise<void>
  count(tenantId: string): Promise<number>
}

// ---- TEACHER REPOSITORY ----
export interface TeacherRepository {
  findById(id: string): Promise<Teacher | null>
  findByTenant(tenantId: string): Promise<Teacher[]>
  create(teacher: Omit<Teacher, "id">): Promise<Teacher>
  update(id: string, data: Partial<Teacher>): Promise<Teacher>
  delete(id: string): Promise<void>
}

// ---- CLASS REPOSITORY ----
export interface ClassRepository {
  findById(id: string): Promise<Class | null>
  findByTenant(tenantId: string): Promise<Class[]>
  findByGradeLevel(tenantId: string, gradeLevel: string): Promise<Class[]>
  create(cls: Omit<Class, "id">): Promise<Class>
  update(id: string, data: Partial<Class>): Promise<Class>
  delete(id: string): Promise<void>
}

// ---- ENROLLMENT REPOSITORY ----
export interface EnrollmentRepository {
  findByStudent(studentId: string): Promise<{ studentId: string; classId: string }[]>
  findByClass(classId: string): Promise<{ studentId: string; classId: string }[]>
  enroll(studentId: string, classId: string): Promise<void>
  unenroll(studentId: string, classId: string): Promise<void>
}

// ---- ATTENDANCE REPOSITORY ----
export interface AttendanceRepository {
  findByClass(classId: string, date: Date): Promise<AttendanceRecord[]>
  findByStudent(studentId: string): Promise<AttendanceRecord[]>
  record(attendance: Omit<AttendanceRecord, "id">): Promise<AttendanceRecord>
  update(id: string, data: Partial<AttendanceRecord>): Promise<AttendanceRecord>
}

// ---- INVOICE REPOSITORY ----
export interface InvoiceRepository {
  findById(id: string): Promise<Invoice | null>
  findByStudent(studentId: string): Promise<Invoice[]>
  findByTenant(tenantId: string): Promise<Invoice[]>
  create(invoice: Omit<Invoice, "id" | "createdAt">): Promise<Invoice>
  update(id: string, data: Partial<Invoice>): Promise<Invoice>
}

// ---- PAYMENT REPOSITORY ----
export interface PaymentRepository {
  findById(id: string): Promise<Payment | null>
  findByInvoice(invoiceId: string): Promise<Payment[]>
  create(payment: Omit<Payment, "id">): Promise<Payment>
  updateStatus(id: string, status: Payment["status"]): Promise<void>
}

// ---- SUBSCRIPTION REPOSITORY ----
export interface SubscriptionRepository {
  findByTenant(tenantId: string): Promise<Subscription | null>
  create(subscription: Omit<Subscription, "id">): Promise<Subscription>
  update(id: string, data: Partial<Subscription>): Promise<Subscription>
}