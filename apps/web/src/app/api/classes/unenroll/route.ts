import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json() as {
      classId: string
      studentId: string
    }

    // Check class belongs to this tenant
    const cls = await db.class.findFirst({
      where: {
        id: body.classId,
        tenantId: session.user.id,
      },
    })

    if (!cls) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 })
    }

    // Delete the enrollment
    await db.enrollment.deleteMany({
      where: {
        classId: body.classId,
        studentId: body.studentId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("POST /api/classes/unenroll error:", error)
    return NextResponse.json(
      { error: "Failed to unenroll student" },
      { status: 500 }
    )
  }
}