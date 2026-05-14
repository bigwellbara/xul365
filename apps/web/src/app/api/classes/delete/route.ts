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

    const body = await request.json() as { classId: string }

    // Check class belongs to this tenant
    const cls = await db.class.findFirst({
      where: {
        id: body.classId,
        tenantId: session.user.id,
      },
      include: {
        enrollments: true,
      },
    })

    if (!cls) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 })
    }

    // Cannot delete if students are enrolled
    if (cls.enrollments.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete a class with enrolled students. Remove all students first." },
        { status: 400 }
      )
    }

    await db.class.delete({
      where: { id: body.classId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("POST /api/classes/delete error:", error)
    return NextResponse.json(
      { error: "Failed to delete class" },
      { status: 500 }
    )
  }
}