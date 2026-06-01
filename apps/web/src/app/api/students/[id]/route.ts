// import { NextRequest, NextResponse } from "next/server"
// import { db } from "@/lib/db"
// import { auth } from "@/lib/auth"

// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const session = await auth.api.getSession({
//       headers: request.headers,
//     })

//     if (!session) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const student = await db.student.findFirst({
//       where: {
//         id: params.id,
//         tenantId: session.user.id,
//       },
//       include: {
//         enrollments: true,
//       },
//     })

//     if (!student) {
//       return NextResponse.json({ error: "Student not found" }, { status: 404 })
//     }

//     // Delete enrollments first
//     await db.enrollment.deleteMany({
//       where: { studentId: params.id },
//     })

//     // Delete attendance records
//     await db.attendanceRecord.deleteMany({
//       where: { studentId: params.id },
//     })

//     // Delete invoices
//     await db.invoice.deleteMany({
//       where: { studentId: params.id },
//     })

//     // Delete student
//     await db.student.delete({
//       where: { id: params.id },
//     })

//     return NextResponse.json({ success: true })
//   } catch (error) {
//     console.error("DELETE /api/students/[id] error:", error)
//     return NextResponse.json(
//       { error: "Failed to delete student" },
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

  if (!user?.tenantId) {
    throw new Error("User has no tenant assigned")
  }

  const tenant = await mothershipDb.tenant.findUnique({
    where: { id: user.tenantId },
  })

  if (!tenant) {
    throw new Error("Tenant not found")
  }

  return getTenantDb(tenant.databaseName)
}

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

    const tenantDb = await getTenantDbForUser(session.user.id)

    // Check student exists
    const student = await tenantDb.student.findUnique({
      where: { id: params.id },
    })

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    // Delete related records first
    await tenantDb.enrollment.deleteMany({
      where: { studentId: params.id },
    })

    await tenantDb.attendanceRecord.deleteMany({
      where: { studentId: params.id },
    })

    await tenantDb.examResult.deleteMany({
      where: { studentId: params.id },
    })

    await tenantDb.invoice.deleteMany({
      where: { studentId: params.id },
    })

    // Delete student
    await tenantDb.student.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/students/[id] error:", error)
    return NextResponse.json(
      { error: "Failed to delete student" },
      { status: 500 }
    )
  }
}