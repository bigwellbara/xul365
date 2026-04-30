import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tenantId = session.user.id

    // Run all queries in parallel
    const [
      totalStudents,
      totalTeachers,
      totalInvoices,
      paidInvoices,
      todayAttendance,
    ] = await Promise.all([
      // Total students
      db.student.count({
        where: { tenantId, status: "ACTIVE" },
      }),

      // Total teachers
      db.teacher.count({
        where: { tenantId, status: "ACTIVE" },
      }),

      // All invoices
      db.invoice.findMany({
        where: { tenantId },
        select: { totalAmountUsd: true, status: true },
      }),

      // Paid invoices
      db.invoice.findMany({
        where: { tenantId, status: "PAID" },
        select: { totalAmountUsd: true },
      }),

      // Today's attendance
      db.attendanceRecord.findMany({
        where: {
          tenantId,
          date: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lte: new Date(new Date().setHours(23, 59, 59, 999)),
          },
        },
        select: { status: true },
      }),
    ])

    // Calculate totals
    const totalBilled = totalInvoices.reduce(
      (sum, inv) => sum + Number(inv.totalAmountUsd),
      0
    )

    const totalCollected = paidInvoices.reduce(
      (sum, inv) => sum + Number(inv.totalAmountUsd),
      0
    )

    const presentToday = todayAttendance.filter(
      (a) => a.status === "PRESENT" || a.status === "LATE"
    ).length

    const attendanceRate =
      todayAttendance.length > 0
        ? Math.round((presentToday / todayAttendance.length) * 100)
        : 0

    return NextResponse.json({
      totalStudents,
      totalTeachers,
      totalBilled,
      totalCollected,
      outstanding: totalBilled - totalCollected,
      attendanceRate,
      totalAttendanceRecords: todayAttendance.length,
    })
  } catch (error) {
    console.error("GET /api/stats error:", error)
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    )
  }
}