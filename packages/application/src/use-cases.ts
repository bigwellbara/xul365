// ============================================
// USE CASES - The actions users can perform
// Each use case is one specific business action
// ============================================

import type { Feature, GradeLevel, Term } from "@xul365/domain"
import {
  canEnrollStudent,
  calculateSubscriptionPrice,
  isFeatureEnabled,
} from "@xul365/domain"
import type {
  TenantRepository,
  StudentRepository,
  TeacherRepository,
  ClassRepository,
  EnrollmentRepository,
  AttendanceRepository,
  InvoiceRepository,
  PaymentRepository,
  SubscriptionRepository,
} from "./repositories"

// ---- REGISTER SCHOOL ----
export class RegisterSchoolUseCase {
  constructor(private tenantRepo: TenantRepository) {}

  async execute(input: {
    schoolName: string
    subdomain: string
    adminEmail: string
    location: string
    primaryColor: string
    secondaryColor: string
    accentColor: string
  }) {
    // Check subdomain is not taken
    const exists = await this.tenantRepo.exists(input.subdomain)
    if (exists) {
      throw new Error("Subdomain is already taken")
    }

    // Create the tenant (inactive until payment)
    const tenant = await this.tenantRepo.create({
      schoolName: input.schoolName,
      subdomain: input.subdomain,
      databaseName: `xul365_${input.subdomain}`,
      subscriptionStatus: "pending",
      enabledFeatures: [],
      branding: {
        logoUrl: null,
        primaryColor: input.primaryColor,
        secondaryColor: input.secondaryColor,
        accentColor: input.accentColor,
      },
    })

    return tenant
  }
}

// ---- SELECT FEATURES ----
export class SelectFeaturesUseCase {
  constructor(
    private tenantRepo: TenantRepository,
    private subscriptionRepo: SubscriptionRepository
  ) {}

  async execute(input: {
    tenantId: string
    features: Feature[]
    billingCycle: "monthly" | "annual"
    featurePricing: Record<Feature, number>
  }) {
    const tenant = await this.tenantRepo.findById(input.tenantId)
    if (!tenant) throw new Error("School not found")

    const price = calculateSubscriptionPrice(
      input.features,
      input.billingCycle,
      input.featurePricing
    )

    // Create subscription draft
    const now = new Date()
    const endDate = new Date(now)
    if (input.billingCycle === "annual") {
      endDate.setFullYear(endDate.getFullYear() + 1)
    } else {
      endDate.setMonth(endDate.getMonth() + 1)
    }

    const subscription = await this.subscriptionRepo.create({
      tenantId: input.tenantId,
      selectedFeatures: input.features,
      billingCycle: input.billingCycle,
      priceUsd: price,
      startDate: now,
      endDate,
      status: "trial",
    })

    return { subscription, totalPrice: price }
  }
}

// ---- ENROLL STUDENT ----
export class EnrollStudentUseCase {
  constructor(
    private studentRepo: StudentRepository,
    private classRepo: ClassRepository,
    private enrollmentRepo: EnrollmentRepository
  ) {}

  async execute(input: { studentId: string; classId: string }) {
    const student = await this.studentRepo.findById(input.studentId)
    if (!student) throw new Error("Student not found")

    const cls = await this.classRepo.findById(input.classId)
    if (!cls) throw new Error("Class not found")

    const currentEnrollments = await this.enrollmentRepo.findByClass(input.classId)

    // Run domain rule check
    const check = canEnrollStudent(student, cls, currentEnrollments)
    if (!check.allowed) {
      throw new Error(check.reason)
    }

    await this.enrollmentRepo.enroll(input.studentId, input.classId)

    return { success: true }
  }
}

// ---- RECORD ATTENDANCE ----
export class RecordAttendanceUseCase {
  constructor(
    private attendanceRepo: AttendanceRepository,
    private subscriptionRepo: SubscriptionRepository
  ) {}

  async execute(input: {
    tenantId: string
    classId: string
    date: Date
    records: { studentId: string; status: "present" | "absent" | "late" | "excused" }[]
    recordedBy: string
  }) {
    // Check feature is enabled
    const subscription = await this.subscriptionRepo.findByTenant(input.tenantId)
    if (!subscription || !isFeatureEnabled("attendance", subscription)) {
      throw new Error("Attendance feature is not enabled for this school")
    }

    const saved = await Promise.all(
      input.records.map((r) =>
        this.attendanceRepo.record({
          tenantId: input.tenantId,
          classId: input.classId,
          studentId: r.studentId,
          date: input.date,
          status: r.status,
          recordedBy: input.recordedBy,
        })
      )
    )

    return saved
  }
}

// ---- CREATE INVOICE ----
export class CreateInvoiceUseCase {
  constructor(
    private invoiceRepo: InvoiceRepository,
    private studentRepo: StudentRepository,
    private subscriptionRepo: SubscriptionRepository
  ) {}

  async execute(input: {
    tenantId: string
    studentId: string
    academicYear: string
    term: Term
    items: { description: string; amountUsd: number; amountZig: number }[]
    dueDate: Date
  }) {
    // Check feature is enabled
    const subscription = await this.subscriptionRepo.findByTenant(input.tenantId)
    if (!subscription || !isFeatureEnabled("fees_billing", subscription)) {
      throw new Error("Fees & Billing feature is not enabled for this school")
    }

    const student = await this.studentRepo.findById(input.studentId)
    if (!student) throw new Error("Student not found")

    const totalAmountUsd = input.items.reduce((sum, i) => sum + i.amountUsd, 0)
    const totalAmountZig = input.items.reduce((sum, i) => sum + i.amountZig, 0)

    const invoice = await this.invoiceRepo.create({
      tenantId: input.tenantId,
      studentId: input.studentId,
      academicYear: input.academicYear,
      term: input.term,
      items: input.items,
      totalAmountUsd,
      totalAmountZig,
      status: "unpaid",
      dueDate: input.dueDate,
    })

    return invoice
  }
}