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

//     const exams = await db.exam.findMany({
//       where: { tenantId: session.user.id },
//       orderBy: { createdAt: "desc" },
//       include: {
//         results: {
//           include: {
//             student: {
//               select: {
//                 firstName: true,
//                 lastName: true,
//               },
//             },
//             subject: {
//               select: {
//                 name: true,
//               },
//             },
//           },
//         },
//       },
//     })

//     return NextResponse.json({ exams })
//   } catch (error) {
//     console.error("GET /api/exams error:", error)
//     return NextResponse.json(
//       { error: "Failed to fetch exams" },
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
//       academicYear: string
//       term: string
//       gradeLevel: string
//       startDate: string
//       endDate: string
//     }

//     const exam = await db.exam.create({
//       data: {
//         tenantId: session.user.id,
//         name: body.name,
//         academicYear: body.academicYear,
//         term: body.term,
//         gradeLevel: body.gradeLevel,
//         startDate: new Date(body.startDate),
//         endDate: new Date(body.endDate),
//       },
//     })

//     return NextResponse.json({ exam }, { status: 201 })
//   } catch (error) {
//     console.error("POST /api/exams error:", error)
//     return NextResponse.json(
//       { error: "Failed to create exam" },
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

    const exams = await tenantDb.exam.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        results: {
          include: {
            student: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
            subject: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json({ exams })
  } catch (error: any) {
    console.error("GET /api/exams error:", error)
    return NextResponse.json(
      { error: error.message ?? "Failed to fetch exams" },
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
      academicYear: string
      term: string
      gradeLevel: string
      startDate: string
      endDate: string
    }

    const exam = await tenantDb.exam.create({
      data: {
        name: body.name,
        academicYear: body.academicYear,
        term: body.term,
        gradeLevel: body.gradeLevel,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
      },
    })

    return NextResponse.json({ exam }, { status: 201 })
  } catch (error: any) {
    console.error("POST /api/exams error:", error)
    return NextResponse.json(
      { error: error.message ?? "Failed to create exam" },
      { status: 500 }
    )
  }
}