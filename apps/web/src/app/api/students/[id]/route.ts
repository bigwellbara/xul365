import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const student = await db.student.findFirst({
      where: {
        id: params.id,
        tenantId: session.user.id,
      },
      include: {
        enrollments: true,
      },
    })

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    // Delete enrollments first
    await db.enrollment.deleteMany({
      where: { studentId: params.id },
    })

    // Delete attendance records
    await db.attendanceRecord.deleteMany({
      where: { studentId: params.id },
    })

    // Delete invoices
    await db.invoice.deleteMany({
      where: { studentId: params.id },
    })

    // Delete student
    await db.student.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/students/[id] error:", error)
    return NextResponse.json(
      { error: "Failed to delete student" },
      { status: 500 }
    )
  }
}