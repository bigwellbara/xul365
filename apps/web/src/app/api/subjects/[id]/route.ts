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

//     const subject = await db.subject.findFirst({
//       where: {
//         id: params.id,
//         tenantId: session.user.id,
//       },
//     })

//     if (!subject) {
//       return NextResponse.json({ error: "Subject not found" }, { status: 404 })
//     }

//     // Delete exam results first
//     await db.examResult.deleteMany({
//       where: { subjectId: params.id },
//     })

//     // Delete subject
//     await db.subject.delete({
//       where: { id: params.id },
//     })

//     return NextResponse.json({ success: true })
//   } catch (error) {
//     console.error("DELETE /api/subjects/[id] error:", error)
//     return NextResponse.json(
//       { error: "Failed to delete subject" },
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

    const subject = await tenantDb.subject.findUnique({
      where: { id: params.id },
    })
    if (!subject) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 })
    }

    // Delete exam results first
    await tenantDb.examResult.deleteMany({
      where: { subjectId: params.id },
    })

    await tenantDb.subject.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("DELETE /api/subjects/[id] error:", error)
    return NextResponse.json(
      { error: error.message ?? "Failed to delete subject" },
      { status: 500 }
    )
  }
}