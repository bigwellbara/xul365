// import { NextRequest, NextResponse } from "next/server"
// import { db } from "@/lib/db"
// import { auth } from "@/lib/auth"

// // GET /api/attendance
// export async function GET(request: NextRequest) {
//   try {
//     const session = await auth.api.getSession({
//       headers: request.headers,
//     })

//     if (!session) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const { searchParams } = new URL(request.url)
//     const date = searchParams.get("date")

//     const where = {
//       tenantId: session.user.id,
//       ...(date && {
//         date: {
//           gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
//           lte: new Date(new Date(date).setHours(23, 59, 59, 999)),
//         },
//       }),
//     }

//     const records = await db.attendanceRecord.findMany({
//       where,
//       include: {
//         student: {
//           select: {
//             firstName: true,
//             lastName: true,
//             gradeLevel: true,
//           },
//         },
//       },
//       orderBy: { createdAt: "desc" },
//     })

//     return NextResponse.json({ records })
//   } catch (error) {
//     console.error("GET /api/attendance error:", error)
//     return NextResponse.json(
//       { error: "Failed to fetch attendance" },
//       { status: 500 }
//     )
//   }
// }

// // POST /api/attendance
// export async function POST(request: NextRequest) {
//   try {
//     const session = await auth.api.getSession({
//       headers: request.headers,
//     })

//     if (!session) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const body = await request.json() as {
//       date: string
//       classId: string
//       records: {
//         studentId: string
//         status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED"
//       }[]
//     }

//     // Delete existing records for this date and class
//     await db.attendanceRecord.deleteMany({
//       where: {
//         tenantId: session.user.id,
//         classId: body.classId,
//         date: {
//           gte: new Date(new Date(body.date).setHours(0, 0, 0, 0)),
//           lte: new Date(new Date(body.date).setHours(23, 59, 59, 999)),
//         },
//       },
//     })

//     // Create new records
//     const records = await db.attendanceRecord.createMany({
//       data: body.records.map((r) => ({
//         tenantId: session.user.id,
//         studentId: r.studentId,
//         classId: body.classId,
//         date: new Date(body.date),
//         status: r.status,
//         recordedBy: session.user.id,
//       })),
//     })

//     return NextResponse.json({ count: records.count }, { status: 201 })
//   } catch (error) {
//     console.error("POST /api/attendance error:", error)
//     return NextResponse.json(
//       { error: "Failed to save attendance" },
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

// GET /api/attendance
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
    const date = searchParams.get("date")

    const records = await tenantDb.attendanceRecord.findMany({
      where: {
        ...(date && {
          date: {
            gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
            lte: new Date(new Date(date).setHours(23, 59, 59, 999)),
          },
        }),
      },
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
            gradeLevel: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ records })
  } catch (error: any) {
    console.error("GET /api/attendance error:", error)
    return NextResponse.json(
      { error: error.message ?? "Failed to fetch attendance" },
      { status: 500 }
    )
  }
}

// POST /api/attendance
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
      date: string
      classId: string
      records: {
        studentId: string
        status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED"
      }[]
    }

    // Delete existing records for this date and class
    await tenantDb.attendanceRecord.deleteMany({
      where: {
        classId: body.classId,
        date: {
          gte: new Date(new Date(body.date).setHours(0, 0, 0, 0)),
          lte: new Date(new Date(body.date).setHours(23, 59, 59, 999)),
        },
      },
    })

    // Create new records
    const records = await tenantDb.attendanceRecord.createMany({
      data: body.records.map((r) => ({
        studentId: r.studentId,
        classId: body.classId,
        date: new Date(body.date),
        status: r.status,
        recordedBy: session.user.id,
      })),
    })

    return NextResponse.json({ count: records.count }, { status: 201 })
  } catch (error: any) {
    console.error("POST /api/attendance error:", error)
    return NextResponse.json(
      { error: error.message ?? "Failed to save attendance" },
      { status: 500 }
    )
  }
}