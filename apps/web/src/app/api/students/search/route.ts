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
    const query = searchParams.get("q") ?? ""

    const students = await db.student.findMany({
      where: {
        tenantId: session.user.id,
        OR: [
          { firstName: { contains: query } },
          { lastName: { contains: query } },
        ],
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        gradeLevel: true,
      },
      take: 10,
    })

    return NextResponse.json({ students })
  } catch (error) {
    console.error("GET /api/students/search error:", error)
    return NextResponse.json(
      { error: "Failed to search students" },
      { status: 500 }
    )
  }
}