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

//     const subjects = await db.subject.findMany({
//       where: { tenantId: session.user.id },
//       orderBy: { name: "asc" },
//     })

//     return NextResponse.json({ subjects })
//   } catch (error) {
//     console.error("GET /api/subjects error:", error)
//     return NextResponse.json(
//       { error: "Failed to fetch subjects" },
//       { status: 500 }
//     )
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     const session = await auth.api.getSession({
//       headers: request.headers,
//     })

//     if (!session) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const body = await request.json() as {
//       name: string
//       code: string
//       gradeLevel: string
//     }

//     const subject = await db.subject.create({
//       data: {
//         tenantId: session.user.id,
//         name: body.name,
//         code: body.code,
//         gradeLevel: body.gradeLevel,
//       },
//     })

//     return NextResponse.json({ subject }, { status: 201 })
//   } catch (error) {
//     console.error("POST /api/subjects error:", error)
//     return NextResponse.json(
//       { error: "Failed to create subject" },
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

    const subjects = await tenantDb.subject.findMany({
      orderBy: { name: "asc" },
    })

    return NextResponse.json({ subjects })
  } catch (error: any) {
    console.error("GET /api/subjects error:", error)
    return NextResponse.json(
      { error: error.message ?? "Failed to fetch subjects" },
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

    const tenantDb = await getTenantDbForUser(session.user.id)

    const body = await request.json() as {
      name: string
      code: string
      gradeLevel: string
    }

    // Check for duplicate code in this tenant
    const existing = await tenantDb.subject.findFirst({
      where: { code: body.code },
    })
    if (existing) {
      return NextResponse.json(
        { error: "A subject with this code already exists" },
        { status: 400 }
      )
    }

    const subject = await tenantDb.subject.create({
      data: {
        name: body.name,
        code: body.code,
        gradeLevel: body.gradeLevel,
      },
    })

    return NextResponse.json({ subject }, { status: 201 })
  } catch (error: any) {
    console.error("POST /api/subjects error:", error)
    return NextResponse.json(
      { error: error.message ?? "Failed to create subject" },
      { status: 500 }
    )
  }
}