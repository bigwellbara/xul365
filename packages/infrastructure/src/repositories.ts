// ============================================
// REPOSITORY IMPLEMENTATIONS
// Actual database queries using Prisma
// Implements the interfaces from application
// ============================================

import type { PrismaClient } from "@prisma/client"
import type {
  StudentRepository,
  TeacherRepository,
  ClassRepository,
  EnrollmentRepository,
  AttendanceRepository,
  InvoiceRepository,
  PaymentRepository,
  SubscriptionRepository,
  TenantRepository,
} from "@xul365/application"
import type {
  Student,
  Teacher,
  Class,
  AttendanceRecord,
  Invoice,
  Payment,
  Subscription,
  Tenant,
  Feature,
} from "@xul365/domain"

// ---- TENANT REPOSITORY ----
export class PrismaTenantRepository implements TenantRepository {
  constructor(private db: PrismaClient) {}

  async findBySubdomain(subdomain: string): Promise<Tenant | null> {
    const tenant = await this.db.tenant.findUnique({
      where: { subdomain },
    })
    if (!tenant) return null
    return this.mapTenant(tenant)
  }

  async findById(id: string): Promise<Tenant | null> {
    const tenant = await this.db.tenant.findUnique({
      where: { id },
    })
    if (!tenant) return null
    return this.mapTenant(tenant)
  }

  async create(
    data: Omit<Tenant, "id" | "createdAt" | "updatedAt">
  ): Promise<Tenant> {
    const tenant = await this.db.tenant.create({
      data: {
        schoolName: data.schoolName,
        subdomain: data.subdomain,
        databaseName: data.databaseName,
        subscriptionStatus: "PENDING",
        branding: data.branding,
      },
    })
    return this.mapTenant(tenant)
  }

  async update(id: string, data: Partial<Tenant>): Promise<Tenant> {
    const tenant = await this.db.tenant.update({
      where: { id },
      data: {
        schoolName: data.schoolName,
        subscriptionStatus: data.subscriptionStatus?.toUpperCase() as never,
        branding: data.branding as never,
      },
    })
    return this.mapTenant(tenant)
  }

  async updateEnabledFeatures(id: string, features: Feature[]): Promise<void> {
    await this.db.tenant.update({
      where: { id },
      data: { branding: { features } },
    })
  }

  async exists(subdomain: string): Promise<boolean> {
    const count = await this.db.tenant.count({
      where: { subdomain },
    })
    return count > 0
  }

  private mapTenant(raw: Record<string, unknown>): Tenant {
    const branding = raw["branding"] as Record<string, unknown>
    return {
      id: raw["id"] as string,
      schoolName: raw["schoolName"] as string,
      subdomain: raw["subdomain"] as string,
      databaseName: raw["databaseName"] as string,
      subscriptionStatus: (
        raw["subscriptionStatus"] as string
      ).toLowerCase() as Tenant["subscriptionStatus"],
      enabledFeatures: (branding?.["features"] as Feature[]) ?? [],
      branding: {
        logoUrl: branding?.["logoUrl"] as string | null,
        primaryColor: branding?.["primaryColor"] as string,
        secondaryColor: branding?.["secondaryColor"] as string,
        accentColor: branding?.["accentColor"] as string,
      },
      createdAt: raw["createdAt"] as Date,
      updatedAt: raw["updatedAt"] as Date,
    }
  }
}

// ---- STUDENT REPOSITORY ----
export class PrismaStudentRepository implements StudentRepository {
  constructor(private db: PrismaClient) {}

  async findById(id: string): Promise<Student | null> {
    const student = await this.db.student.findUnique({ where: { id } })
    if (!student) return null
    return this.mapStudent(student)
  }

  async findByTenant(_tenantId: string): Promise<Student[]> {
    const students = await this.db.student.findMany()
    return students.map(this.mapStudent)
  }

  async findByClass(classId: string): Promise<Student[]> {
    const enrollments = await this.db.enrollment.findMany({
      where: { classId },
      include: { student: true },
    })
    return enrollments.map((e) => this.mapStudent(e.student))
  }

  async create(data: Omit<Student, "id">): Promise<Student> {
    const student = await this.db.student.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender.toUpperCase() as never,
        gradeLevel: data.gradeLevel as never,
        enrollmentDate: data.enrollmentDate,
        status: data.status.toUpperCase() as never,
        parentContact: data.parentContact,
      },
    })
    return this.mapStudent(student)
  }

  async update(id: string, data: Partial<Student>): Promise<Student> {
    const student = await this.db.student.update({
      where: { id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        status: data.status?.toUpperCase() as never,
        gradeLevel: data.gradeLevel as never,
      },
    })
    return this.mapStudent(student)
  }

  async delete(id: string): Promise<void> {
    await this.db.student.delete({ where: { id } })
  }

  async count(_tenantId: string): Promise<number> {
    return this.db.student.count()
  }

  private mapStudent(raw: Record<string, unknown>): Student {
    return {
      id: raw["id"] as string,
      tenantId: "",
      firstName: raw["firstName"] as string,
      lastName: raw["lastName"] as string,
      dateOfBirth: raw["dateOfBirth"] as Date,
      gender: (raw["gender"] as string).toLowerCase() as Student["gender"],
      gradeLevel: raw["gradeLevel"] as Student["gradeLevel"],
      enrollmentDate: raw["enrollmentDate"] as Date,
      status: (raw["status"] as string).toLowerCase() as Student["status"],
      parentContact: raw["parentContact"] as Student["parentContact"],
    }
  }
}

// ---- ENROLLMENT REPOSITORY ----
export class PrismaEnrollmentRepository implements EnrollmentRepository {
  constructor(private db: PrismaClient) {}

  async findByStudent(
    studentId: string
  ): Promise<{ studentId: string; classId: string }[]> {
    return this.db.enrollment.findMany({ where: { studentId } })
  }

  async findByClass(
    classId: string
  ): Promise<{ studentId: string; classId: string }[]> {
    return this.db.enrollment.findMany({ where: { classId } })
  }

  async enroll(studentId: string, classId: string): Promise<void> {
    await this.db.enrollment.create({ data: { studentId, classId } })
  }

  async unenroll(studentId: string, classId: string): Promise<void> {
    await this.db.enrollment.delete({
      where: { studentId_classId: { studentId, classId } },
    })
  }
}

// ---- ATTENDANCE REPOSITORY ----
export class PrismaAttendanceRepository implements AttendanceRepository {
  constructor(private db: PrismaClient) {}

  async findByClass(classId: string, date: Date): Promise<AttendanceRecord[]> {
    const records = await this.db.attendanceRecord.findMany({
      where: { classId, date },
    })
    return records.map(this.mapAttendance)
  }

  async findByStudent(studentId: string): Promise<AttendanceRecord[]> {
    const records = await this.db.attendanceRecord.findMany({
      where: { studentId },
    })
    return records.map(this.mapAttendance)
  }

  async record(
    data: Omit<AttendanceRecord, "id">
  ): Promise<AttendanceRecord> {
    const record = await this.db.attendanceRecord.create({
      data: {
        studentId: data.studentId,
        classId: data.classId,
        date: data.date,
        status: data.status.toUpperCase() as never,
        recordedBy: data.recordedBy,
      },
    })
    return this.mapAttendance(record)
  }

  async update(
    id: string,
    data: Partial<AttendanceRecord>
  ): Promise<AttendanceRecord> {
    const record = await this.db.attendanceRecord.update({
      where: { id },
      data: { status: data.status?.toUpperCase() as never },
    })
    return this.mapAttendance(record)
  }

  private mapAttendance(raw: Record<string, unknown>): AttendanceRecord {
    return {
      id: raw["id"] as string,
      tenantId: "",
      studentId: raw["studentId"] as string,
      classId: raw["classId"] as string,
      date: raw["date"] as Date,
      status: (
        raw["status"] as string
      ).toLowerCase() as AttendanceRecord["status"],
      recordedBy: raw["recordedBy"] as string,
    }
  }
}

// ---- SUBSCRIPTION REPOSITORY ----
export class PrismaSubscriptionRepository implements SubscriptionRepository {
  constructor(private db: PrismaClient) {}

  async findByTenant(tenantId: string): Promise<Subscription | null> {
    const sub = await this.db.subscription.findUnique({
      where: { tenantId },
    })
    if (!sub) return null
    return {
      id: sub.id,
      tenantId: sub.tenantId,
      selectedFeatures: sub.selectedFeatures as Feature[],
      billingCycle: sub.billingCycle.toLowerCase() as Subscription["billingCycle"],
      priceUsd: Number(sub.priceUsd),
      startDate: sub.startDate,
      endDate: sub.endDate,
      status: sub.status.toLowerCase() as Subscription["status"],
    }
  }

  async create(data: Omit<Subscription, "id">): Promise<Subscription> {
    const sub = await this.db.subscription.create({
      data: {
        tenantId: data.tenantId,
        selectedFeatures: data.selectedFeatures,
        billingCycle: data.billingCycle.toUpperCase() as never,
        priceUsd: data.priceUsd,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status.toUpperCase() as never,
      },
    })
    return {
      id: sub.id,
      tenantId: sub.tenantId,
      selectedFeatures: sub.selectedFeatures as Feature[],
      billingCycle: sub.billingCycle.toLowerCase() as Subscription["billingCycle"],
      priceUsd: Number(sub.priceUsd),
      startDate: sub.startDate,
      endDate: sub.endDate,
      status: sub.status.toLowerCase() as Subscription["status"],
    }
  }

  async update(id: string, data: Partial<Subscription>): Promise<Subscription> {
    const sub = await this.db.subscription.update({
      where: { id },
      data: {
        selectedFeatures: data.selectedFeatures,
        status: data.status?.toUpperCase() as never,
        endDate: data.endDate,
      },
    })
    return {
      id: sub.id,
      tenantId: sub.tenantId,
      selectedFeatures: sub.selectedFeatures as Feature[],
      billingCycle: sub.billingCycle.toLowerCase() as Subscription["billingCycle"],
      priceUsd: Number(sub.priceUsd),
      startDate: sub.startDate,
      endDate: sub.endDate,
      status: sub.status.toLowerCase() as Subscription["status"],
    }
  }
}