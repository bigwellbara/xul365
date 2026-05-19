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

    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get("studentId")
    const term = searchParams.get("term")
    const academicYear = searchParams.get("academicYear")

    if (!studentId) {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 }
      )
    }

    const student = await db.student.findFirst({
      where: {
        id: studentId,
        tenantId: session.user.id,
      },
    })

    if (!student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      )
    }

    const results = await db.examResult.findMany({
      where: {
        studentId,
        exam: {
          tenantId: session.user.id,
          ...(term && { term }),
          ...(academicYear && { academicYear }),
        },
      },
      include: {
        exam: {
          select: {
            name: true,
            term: true,
            academicYear: true,
            gradeLevel: true,
          },
        },
        subject: {
          select: {
            name: true,
            code: true,
          },
        },
      },
      orderBy: {
        subject: { name: "asc" },
      },
    })

    const attendance = await db.attendanceRecord.groupBy({
      by: ["status"],
      where: {
        studentId,
        tenantId: session.user.id,
      },
      _count: { status: true },
    })

    const attendanceSummary = {
      present: attendance.find((a) => a.status === "PRESENT")?._count.status ?? 0,
      absent: attendance.find((a) => a.status === "ABSENT")?._count.status ?? 0,
      late: attendance.find((a) => a.status === "LATE")?._count.status ?? 0,
      excused: attendance.find((a) => a.status === "EXCUSED")?._count.status ?? 0,
    }

    return NextResponse.json({
      student,
      results,
      attendanceSummary,
    })
  } catch (error) {
    console.error("GET /api/report-cards error:", error)
    return NextResponse.json(
      { error: "Failed to generate report card" },
      { status: 500 }
    )
  }
}