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
//       examId: string
//       studentId: string
//       subjectId: string
//       marks: number
//       grade: string
//       comments?: string
//     }

//     // Check if result already exists
//     const existing = await db.examResult.findFirst({
//       where: {
//         examId: body.examId,
//         studentId: body.studentId,
//         subjectId: body.subjectId,
//       },
//     })

//     if (existing) {
//       // Update existing result
//       const result = await db.examResult.update({
//         where: { id: existing.id },
//         data: {
//           marks: body.marks,
//           grade: body.grade,
//           comments: body.comments,
//         },
//         include: {
//           student: {
//             select: { firstName: true, lastName: true },
//           },
//           subject: {
//             select: { name: true },
//           },
//         },
//       })
//       return NextResponse.json({ result })
//     }

//     // Create new result
//     const result = await db.examResult.create({
//       data: {
//         examId: body.examId,
//         studentId: body.studentId,
//         subjectId: body.subjectId,
//         marks: body.marks,
//         grade: body.grade,
//         comments: body.comments,
//       },
//       include: {
//         student: {
//           select: { firstName: true, lastName: true },
//         },
//         subject: {
//           select: { name: true },
//         },
//       },
//     })

//     return NextResponse.json({ result }, { status: 201 })
//   } catch (error) {
//     console.error("POST /api/exams/results error:", error)
//     return NextResponse.json(
//       { error: "Failed to save result" },
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
      examId: string
      studentId: string
      subjectId: string
      marks: number
      grade: string
      comments?: string
    }

    // Check if result already exists
    const existing = await tenantDb.examResult.findFirst({
      where: {
        examId: body.examId,
        studentId: body.studentId,
        subjectId: body.subjectId,
      },
    })

    if (existing) {
      const result = await tenantDb.examResult.update({
        where: { id: existing.id },
        data: {
          marks: body.marks,
          grade: body.grade,
          comments: body.comments,
        },
        include: {
          student: {
            select: { firstName: true, lastName: true },
          },
          subject: {
            select: { name: true },
          },
        },
      })
      return NextResponse.json({ result })
    }

    const result = await tenantDb.examResult.create({
      data: {
        examId: body.examId,
        studentId: body.studentId,
        subjectId: body.subjectId,
        marks: body.marks,
        grade: body.grade,
        comments: body.comments,
      },
      include: {
        student: {
          select: { firstName: true, lastName: true },
        },
        subject: {
          select: { name: true },
        },
      },
    })

    return NextResponse.json({ result }, { status: 201 })
  } catch (error: any) {
    console.error("POST /api/exams/results error:", error)
    return NextResponse.json(
      { error: error.message ?? "Failed to save result" },
      { status: 500 }
    )
  }
}