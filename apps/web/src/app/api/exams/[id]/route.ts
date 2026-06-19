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

//     const exam = await db.exam.findFirst({
//       where: {
//         id: params.id,
//         tenantId: session.user.id,
//       },
//     })

//     if (!exam) {
//       return NextResponse.json({ error: "Exam not found" }, { status: 404 })
//     }

//     // Delete results first
//     await db.examResult.deleteMany({
//       where: { examId: params.id },
//     })

//     // Delete exam
//     await db.exam.delete({
//       where: { id: params.id },
//     })

//     return NextResponse.json({ success: true })
//   } catch (error) {
//     console.error("DELETE /api/exams/[id] error:", error)
//     return NextResponse.json(
//       { error: "Failed to delete exam" },
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

    const exam = await tenantDb.exam.findUnique({
      where: { id: params.id },
    })

    if (!exam) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 })
    }

    // Delete results first
    await tenantDb.examResult.deleteMany({
      where: { examId: params.id },
    })

    // Delete exam
    await tenantDb.exam.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("DELETE /api/exams/[id] error:", error)
    return NextResponse.json(
      { error: error.message ?? "Failed to delete exam" },
      { status: 500 }
    )
  }
}