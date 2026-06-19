// import { NextRequest, NextResponse } from "next/server"
// import { db } from "@/lib/db"
// import { auth } from "@/lib/auth"

// export async function GET(request: NextRequest) {
//   try {
//     const session = await auth.api.getSession({
//       headers: request.headers,
//     })

//     if (!session) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const { searchParams } = new URL(request.url)
//     const query = searchParams.get("q") ?? ""

//     const students = await db.student.findMany({
//       where: {
//         tenantId: session.user.id,
//         OR: [
//           { firstName: { contains: query } },
//           { lastName: { contains: query } },
//         ],
//       },
//       select: {
//         id: true,
//         firstName: true,
//         lastName: true,
//         gradeLevel: true,
//       },
//       take: 10,
//     })

//     return NextResponse.json({ students })
//   } catch (error) {
//     console.error("GET /api/students/search error:", error)
//     return NextResponse.json(
//       { error: "Failed to search students" },
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

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tenantDb = await getTenantDbForUser(session.user.id)

    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") ?? ""

    const students = await tenantDb.student.findMany({
      where: {
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
  } catch (error: any) {
    console.error("GET /api/students/search error:", error)
    return NextResponse.json(
      { error: error.message ?? "Failed to search students" },
      { status: 500 }
    )
  }
}