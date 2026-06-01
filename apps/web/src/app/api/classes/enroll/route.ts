// import { NextRequest, NextResponse } from "next/server"
// import { db } from "@/lib/db"
// import { auth } from "@/lib/auth"

// export async function POST(request: NextRequest) {
//   try {
//     const session = await auth.api.getSession({
//       headers: request.headers,
//     })

//     if (!session) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const body = await request.json() as {
//       classId: string
//       studentId: string
//     }

//     // Check class belongs to this tenant
//     const cls = await db.class.findFirst({
//       where: {
//         id: body.classId,
//         tenantId: session.user.id,
//       },
//     })

//     if (!cls) {
//       return NextResponse.json({ error: "Class not found" }, { status: 404 })
//     }

//     // Check student belongs to this tenant
//     const student = await db.student.findFirst({
//       where: {
//         id: body.studentId,
//         tenantId: session.user.id,
//       },
//     })

//     if (!student) {
//       return NextResponse.json({ error: "Student not found" }, { status: 404 })
//     }

//     // Check not already enrolled
//     const existing = await db.enrollment.findFirst({
//       where: {
//         classId: body.classId,
//         studentId: body.studentId,
//       },
//     })

//     if (existing) {
//       return NextResponse.json(
//         { error: "Student is already enrolled in this class" },
//         { status: 400 }
//       )
//     }

//     // Check capacity
//     const enrollmentCount = await db.enrollment.count({
//       where: { classId: body.classId },
//     })

//     if (enrollmentCount >= cls.capacity) {
//       return NextResponse.json(
//         { error: "Class has reached maximum capacity" },
//         { status: 400 }
//       )
//     }

//     const enrollment = await db.enrollment.create({
//       data: {
//         studentId: body.studentId,
//         classId: body.classId,
//       },
//     })

//     return NextResponse.json({ enrollment }, { status: 201 })
//   } catch (error) {
//     console.error("POST /api/classes/enroll error:", error)
//     return NextResponse.json(
//       { error: "Failed to enroll student" },
//       { status: 500 }
//     )
//   }
// }

import { NextRequest, NextResponse } from "next/server"
import { getTenantDb } from "@/lib/tenant-db"
import { mothershipDb } from "@/lib/mothership-db"
import { auth } from "@/lib/auth"

async function getTenantDbForUser(userId: string) {
  const user = await mothershipDb.user.findUnique({
    where: { id: userId },
  })
  if (!user?.tenantId) throw new Error("User has no tenant assigned")
  const tenant = await mothershipDb.tenant.findUnique({
    where: { id: user.tenantId },
  })
  if (!tenant) throw new Error("Tenant not found")
  return getTenantDb(tenant.databaseName)
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const tenantDb = await getTenantDbForUser(session.user.id)
    const body = await request.json() as {
      classId: string
      studentId: string
    }

    const cls = await tenantDb.class.findUnique({
      where: { id: body.classId },
    })
    if (!cls) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 })
    }

    const student = await tenantDb.student.findUnique({
      where: { id: body.studentId },
    })
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    const existing = await tenantDb.enrollment.findFirst({
      where: {
        classId: body.classId,
        studentId: body.studentId,
      },
    })
    if (existing) {
      return NextResponse.json(
        { error: "Student is already enrolled in this class" },
        { status: 400 }
      )
    }

    const enrollmentCount = await tenantDb.enrollment.count({
      where: { classId: body.classId },
    })
    if (enrollmentCount >= cls.capacity) {
      return NextResponse.json(
        { error: "Class has reached maximum capacity" },
        { status: 400 }
      )
    }

    const enrollment = await tenantDb.enrollment.create({
      data: {
        studentId: body.studentId,
        classId: body.classId,
      },
    })
    return NextResponse.json({ enrollment }, { status: 201 })
  } catch (error) {
    console.error("POST /api/classes/enroll error:", error)
    return NextResponse.json(
      { error: "Failed to enroll student" },
      { status: 500 }
    )
  }
}