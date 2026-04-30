// ============================================
// STUDENTS API ROUTE
// GET - fetch all students for a tenant
// POST - create a new student
// ============================================

import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

// GET /api/students
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const students = await db.student.findMany({
      where: { tenantId: session.user.id },
      orderBy: { enrollmentDate: "desc" },
    })

    return NextResponse.json({ students })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    )
  }
}

// POST /api/students
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json() as {
      firstName: string
      lastName: string
      dateOfBirth: string
      gender: string
      gradeLevel: string
      parentName: string
      parentPhone: string
      parentRelationship: string
    }

    const student = await db.student.create({
      data: {
        tenantId: session.user.id,
        firstName: body.firstName,
        lastName: body.lastName,
        dateOfBirth: new Date(body.dateOfBirth),
        gender: body.gender.toUpperCase(),
        gradeLevel: body.gradeLevel,
        status: "ACTIVE",
        parentContact: {
          name: body.parentName,
          phone: body.parentPhone,
          relationship: body.parentRelationship,
          email: null,
        },
      },
    })

    return NextResponse.json({ student }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create student" },
      { status: 500 }
    )
  }
}