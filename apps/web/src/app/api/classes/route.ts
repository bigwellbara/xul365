// import { NextRequest, NextResponse } from "next/server"
// import { db } from "@/lib/db"
// import { auth } from "@/lib/auth"

// // GET /api/classes
// export async function GET(request: NextRequest) {
//   try {
//     const session = await auth.api.getSession({
//       headers: request.headers,
//     })

//     if (!session) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const classes = await db.class.findMany({
//       where: { tenantId: session.user.id },
//       include: {
//         teacher: {
//           select: {
//             firstName: true,
//             lastName: true,
//           },
//         },
//         enrollments: {
//           include: {
//             student: {
//               select: {
//                 id: true,
//                 firstName: true,
//                 lastName: true,
//                 gradeLevel: true,
//               },
//             },
//           },
//         },
//       },
//     })

//     return NextResponse.json({ classes })
//   } catch (error) {
//     console.error("GET /api/classes error:", error)
//     return NextResponse.json(
//       { error: "Failed to fetch classes" },
//       { status: 500 }
//     )
//   }
// }

// // POST /api/classes
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
//       gradeLevel: string
//       teacherId: string
//       academicYear: string
//       capacity: number
//     }

//     const cls = await db.class.create({
//       data: {
//         tenantId: session.user.id,
//         name: body.name,
//         gradeLevel: body.gradeLevel,
//         teacherId: body.teacherId,
//         academicYear: body.academicYear,
//         capacity: body.capacity,
//       },
//     })

//     return NextResponse.json({ class: cls }, { status: 201 })
//   } catch (error) {
//     console.error("POST /api/classes error:", error)
//     return NextResponse.json(
//       { error: "Failed to create class" },
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
    const classes = await tenantDb.class.findMany({
      include: {
        teacher: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        enrollments: {
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                gradeLevel: true,
              },
            },
          },
        },
      },
    })
    return NextResponse.json({ classes })
  } catch (error) {
    console.error("GET /api/classes error:", error)
    return NextResponse.json(
      { error: "Failed to fetch classes" },
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
      gradeLevel: string
      teacherId: string
      academicYear: string
      capacity: number
    }
    const cls = await tenantDb.class.create({
      data: {
        name: body.name,
        gradeLevel: body.gradeLevel,
        teacherId: body.teacherId,
        academicYear: body.academicYear,
        capacity: body.capacity,
      },
    })
    return NextResponse.json({ class: cls }, { status: 201 })
  } catch (error) {
    console.error("POST /api/classes error:", error)
    return NextResponse.json(
      { error: "Failed to create class" },
      { status: 500 }
    )
  }
}