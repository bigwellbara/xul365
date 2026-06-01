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

//     const teacher = await db.teacher.findFirst({
//       where: {
//         id: params.id,
//         tenantId: session.user.id,
//       },
//     })

//     if (!teacher) {
//       return NextResponse.json({ error: "Teacher not found" }, { status: 404 })
//     }

//     // Remove teacher from classes first
//     await db.class.updateMany({
//       where: { teacherId: params.id },
//       data: { teacherId: "" },
//     })

//     // Delete teacher
//     await db.teacher.delete({
//       where: { id: params.id },
//     })

//     return NextResponse.json({ success: true })
//   } catch (error) {
//     console.error("DELETE /api/teachers/[id] error:", error)
//     return NextResponse.json(
//       { error: "Failed to delete teacher" },
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

    const teacher = await tenantDb.teacher.findUnique({
      where: { id: params.id },
    })
    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 })
    }

    // Remove teacher from classes first
    await tenantDb.class.updateMany({
      where: { teacherId: params.id },
      data: { teacherId: "" },
    })

    await tenantDb.teacher.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/teachers/[id] error:", error)
    return NextResponse.json(
      { error: "Failed to delete teacher" },
      { status: 500 }
    )
  }
}