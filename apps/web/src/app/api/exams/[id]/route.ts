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

    const exam = await db.exam.findFirst({
      where: {
        id: params.id,
        tenantId: session.user.id,
      },
    })

    if (!exam) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 })
    }

    // Delete results first
    await db.examResult.deleteMany({
      where: { examId: params.id },
    })

    // Delete exam
    await db.exam.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/exams/[id] error:", error)
    return NextResponse.json(
      { error: "Failed to delete exam" },
      { status: 500 }
    )
  }
}