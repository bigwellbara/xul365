// // // ============================================
// // // TEACHERS API ROUTE
// // // GET - fetch all teachers for a tenant
// // // POST - create a new teacher
// // // ============================================

// // import { NextRequest, NextResponse } from "next/server"
// // import { db } from "@/lib/db"
// // import { auth } from "@/lib/auth"

// // // GET /api/teachers
// // export async function GET(request: NextRequest) {
// //   try {
// //     const session = await auth.api.getSession({
// //       headers: request.headers,
// //     })

// //     if (!session) {
// //       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
// //     }

// //     const teachers = await db.teacher.findMany({
// //       where: { tenantId: session.user.id },
// //       orderBy: { joinedAt: "desc" },
// //     })

// //     return NextResponse.json({ teachers })
// //   } catch {
// //     return NextResponse.json(
// //       { error: "Failed to fetch teachers" },
// //       { status: 500 }
// //     )
// //   }
// // }

// // // POST /api/teachers
// // export async function POST(request: NextRequest) {
// //   try {
// //     const session = await auth.api.getSession({
// //       headers: request.headers,
// //     })

// //     console.log("SESSION:", JSON.stringify(session, null, 2))

// //     if (!session) {
// //       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
// //     }

// //     const body = await request.json() as {
// //       firstName: string
// //       lastName: string
// //       email: string
// //       phone: string
// //       subjects: string[]
// //     }

// //     // Check email is not already taken
// //     const existing = await db.teacher.findFirst({
// //       where: {
// //         tenantId: session.user.id,
// //         email: body.email,
// //       },
// //     })

// //     if (existing) {
// //       return NextResponse.json(
// //         { error: "A teacher with this email already exists" },
// //         { status: 400 }
// //       )
// //     }

// //     const teacher = await db.teacher.create({
// //       data: {
// //         tenantId: session.user.id,
// //         firstName: body.firstName,
// //         lastName: body.lastName,
// //         email: body.email,
// //         phone: body.phone,
// //         subjects: body.subjects,
// //         status: "ACTIVE",
// //       },
// //     })

// //     return NextResponse.json({ teacher }, { status: 201 })
// //   } catch {
// //     return NextResponse.json(
// //       { error: "Failed to create teacher" },
// //       { status: 500 }
// //     )
// //   }
// // }


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

//     const teachers = await db.teacher.findMany({
//       where: { tenantId: session.user.id },
//     })

//     return NextResponse.json({ teachers })
//   } catch (error) {
//     console.error("GET /api/teachers error:", error)
//     return NextResponse.json(
//       { error: "Failed to fetch teachers" },
//       { status: 500 }
//     )
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     const session = await auth.api.getSession({
//       headers: request.headers,
//     })

//     console.log("SESSION USER ID:", session?.user?.id)

//     if (!session) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const body = await request.json() as {
//       firstName: string
//       lastName: string
//       email: string
//       phone: string
//       subjects: string[]
//     }

//     console.log("CREATING TEACHER:", body)

//     const teacher = await db.teacher.create({
//       data: {
//         tenantId: session.user.id,
//         firstName: body.firstName,
//         lastName: body.lastName,
//         email: body.email,
//         phone: body.phone,
//         subjects: body.subjects,
//         status: "ACTIVE",
//       },
//     })

//     console.log("TEACHER CREATED:", teacher.id)

//     return NextResponse.json({ teacher }, { status: 201 })
//   } catch (error) {
//     console.error("POST /api/teachers error:", error)
//     return NextResponse.json(
//       { error: "Failed to create teacher" },
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
    const teachers = await tenantDb.teacher.findMany({
      orderBy: { joinedAt: "desc" },
    })
    return NextResponse.json({ teachers })
  } catch (error) {
    console.error("GET /api/teachers error:", error)
    return NextResponse.json(
      { error: "Failed to fetch teachers" },
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
      firstName: string
      lastName: string
      email: string
      phone: string
      subjects: string[]
    }

    // Check email not already taken
    const existing = await tenantDb.teacher.findFirst({
      where: { email: body.email },
    })
    if (existing) {
      return NextResponse.json(
        { error: "A teacher with this email already exists" },
        { status: 400 }
      )
    }

    const teacher = await tenantDb.teacher.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        subjects: body.subjects,
        status: "ACTIVE",
      },
    })
    return NextResponse.json({ teacher }, { status: 201 })
  } catch (error) {
    console.error("POST /api/teachers error:", error)
    return NextResponse.json(
      { error: "Failed to create teacher" },
      { status: 500 }
    )
  }
}
