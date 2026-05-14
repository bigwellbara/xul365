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

    const subjects = await db.subject.findMany({
      where: { tenantId: session.user.id },
      orderBy: { name: "asc" },
    })

    return NextResponse.json({ subjects })
  } catch (error) {
    console.error("GET /api/subjects error:", error)
    return NextResponse.json(
      { error: "Failed to fetch subjects" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json() as {
      name: string
      code: string
      gradeLevel: string
    }

    const subject = await db.subject.create({
      data: {
        tenantId: session.user.id,
        name: body.name,
        code: body.code,
        gradeLevel: body.gradeLevel,
      },
    })

    return NextResponse.json({ subject }, { status: 201 })
  } catch (error) {
    console.error("POST /api/subjects error:", error)
    return NextResponse.json(
      { error: "Failed to create subject" },
      { status: 500 }
    )
  }
}