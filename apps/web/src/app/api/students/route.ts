// // ============================================
// // STUDENTS API ROUTE
// // GET - fetch all students for a tenant
// // POST - create a new student
// // ============================================

// import { NextRequest, NextResponse } from "next/server"
// import { db } from "@/lib/db"
// import { auth } from "@/lib/auth"

// // GET /api/students
// export async function GET(request: NextRequest) {
//   try {
//     const session = await auth.api.getSession({
//       headers: request.headers,
//     })

//     if (!session) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const students = await db.student.findMany({
//       where: { tenantId: session.user.id },
//       orderBy: { enrollmentDate: "desc" },
//     })

//     return NextResponse.json({ students })
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to fetch students" },
//       { status: 500 }
//     )
//   }
// }

// // POST /api/students
// export async function POST(request: NextRequest) {
//   try {
//     const session = await auth.api.getSession({
//       headers: request.headers,
//     })

//     if (!session) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const body = await request.json() as {
//       firstName: string
//       lastName: string
//       dateOfBirth: string
//       gender: string
//       gradeLevel: string
//       parentName: string
//       parentPhone: string
//       parentRelationship: string
//     }

//     const student = await db.student.create({
//       data: {
//         tenantId: session.user.id,
//         firstName: body.firstName,
//         lastName: body.lastName,
//         dateOfBirth: new Date(body.dateOfBirth),
//         gender: body.gender.toUpperCase(),
//         gradeLevel: body.gradeLevel,
//         status: "ACTIVE",
//         parentContact: {
//           name: body.parentName,
//           phone: body.parentPhone,
//           relationship: body.parentRelationship,
//           email: null,
//         },
//       },
//     })

//     return NextResponse.json({ student }, { status: 201 })
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to create student" },
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

// GET /api/students
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tenantDb = await getTenantDbForUser(session.user.id)

    const students = await tenantDb.student.findMany({
      orderBy: { enrollmentDate: "desc" },
    })

    return NextResponse.json({ students })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message ?? "Failed to fetch students" },
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

    const tenantDb = await getTenantDbForUser(session.user.id)

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

    // Generate a simple studentId
    const count = await tenantDb.student.count()
    const studentId = `STU${String(count + 1).padStart(4, "0")}`

    const student = await tenantDb.student.create({
     data: {
    firstName: body.firstName,
    lastName: body.lastName,
    dateOfBirth: new Date(body.dateOfBirth),
    gender: body.gender?.toUpperCase(),
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
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message ?? "Failed to create student" },
      { status: 500 }
    )
  }
}