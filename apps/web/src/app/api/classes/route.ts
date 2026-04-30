import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

// GET /api/classes
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const classes = await db.class.findMany({
      where: { tenantId: session.user.id },
      include: {
        teacher: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        enrollments: {
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                gradeLevel: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json({ classes })
  } catch (error) {
    console.error("GET /api/classes error:", error)
    return NextResponse.json(
      { error: "Failed to fetch classes" },
      { status: 500 }
    )
  }
}

// POST /api/classes
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
      gradeLevel: string
      teacherId: string
      academicYear: string
      capacity: number
    }

    const cls = await db.class.create({
      data: {
        tenantId: session.user.id,
        name: body.name,
        gradeLevel: body.gradeLevel,
        teacherId: body.teacherId,
        academicYear: body.academicYear,
        capacity: body.capacity,
      },
    })

    return NextResponse.json({ class: cls }, { status: 201 })
  } catch (error) {
    console.error("POST /api/classes error:", error)
    return NextResponse.json(
      { error: "Failed to create class" },
      { status: 500 }
    )
  }
}