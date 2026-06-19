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
//     const classId = searchParams.get("classId")

//     const timetable = await db.timetable.findMany({
//       where: {
//         class: { tenantId: session.user.id },
//         ...(classId && { classId }),
//       },
//       include: {
//         class: {
//           select: { name: true, gradeLevel: true },
//         },
//         subject: {
//           select: { name: true, code: true },
//         },
//       },
//       orderBy: [
//         { dayOfWeek: "asc" },
//         { startTime: "asc" },
//       ],
//     })

//     return NextResponse.json({ timetable })
//   } catch (error) {
//     console.error("GET /api/timetable error:", error)
//     return NextResponse.json(
//       { error: "Failed to fetch timetable" },
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
//       classId: string
//       subjectId: string
//       dayOfWeek: string
//       startTime: string
//       endTime: string
//     }

//     // Check for time conflicts
//     const conflict = await db.timetable.findFirst({
//       where: {
//         classId: body.classId,
//         dayOfWeek: body.dayOfWeek,
//         OR: [
//           {
//             AND: [
//               { startTime: { lte: body.startTime } },
//               { endTime: { gt: body.startTime } },
//             ],
//           },
//           {
//             AND: [
//               { startTime: { lt: body.endTime } },
//               { endTime: { gte: body.endTime } },
//             ],
//           },
//         ],
//       },
//     })

//     if (conflict) {
//       return NextResponse.json(
//         { error: "Time slot conflicts with an existing lesson" },
//         { status: 400 }
//       )
//     }

//     const entry = await db.timetable.create({
//       data: {
//         classId: body.classId,
//         subjectId: body.subjectId,
//         dayOfWeek: body.dayOfWeek,
//         startTime: body.startTime,
//         endTime: body.endTime,
//       },
//       include: {
//         class: { select: { name: true, gradeLevel: true } },
//         subject: { select: { name: true, code: true } },
//       },
//     })

//     return NextResponse.json({ entry }, { status: 201 })
//   } catch (error) {
//     console.error("POST /api/timetable error:", error)
//     return NextResponse.json(
//       { error: "Failed to create timetable entry" },
//       { status: 500 }
//     )
//   }
// }

// export async function DELETE(request: NextRequest) {
//   try {
//     const session = await auth.api.getSession({
//       headers: request.headers,
//     })

//     if (!session) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const { searchParams } = new URL(request.url)
//     const id = searchParams.get("id")

//     if (!id) {
//       return NextResponse.json({ error: "ID is required" }, { status: 400 })
//     }

//     await db.timetable.delete({
//       where: { id },
//     })

//     return NextResponse.json({ success: true })
//   } catch (error) {
//     console.error("DELETE /api/timetable error:", error)
//     return NextResponse.json(
//       { error: "Failed to delete timetable entry" },
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
    const classId = searchParams.get("classId")

    const timetable = await tenantDb.timetable.findMany({
      where: {
        ...(classId && { classId }),
      },
      include: {
        class: {
          select: { name: true, gradeLevel: true },
        },
        subject: {
          select: { name: true, code: true },
        },
      },
      orderBy: [
        { dayOfWeek: "asc" },
        { startTime: "asc" },
      ],
    })

    return NextResponse.json({ timetable })
  } catch (error: any) {
    console.error("GET /api/timetable error:", error)
    return NextResponse.json(
      { error: error.message ?? "Failed to fetch timetable" },
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
      classId: string
      subjectId: string
      dayOfWeek: string
      startTime: string
      endTime: string
    }

    // Verify class and subject exist in this tenant
    const cls = await tenantDb.class.findUnique({
      where: { id: body.classId },
    })
    if (!cls) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 })
    }

    const subject = await tenantDb.subject.findUnique({
      where: { id: body.subjectId },
    })
    if (!subject) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 })
    }

    // Check for time conflicts
    const conflict = await tenantDb.timetable.findFirst({
      where: {
        classId: body.classId,
        dayOfWeek: body.dayOfWeek,
        OR: [
          {
            AND: [
              { startTime: { lte: body.startTime } },
              { endTime: { gt: body.startTime } },
            ],
          },
          {
            AND: [
              { startTime: { lt: body.endTime } },
              { endTime: { gte: body.endTime } },
            ],
          },
        ],
      },
    })
    if (conflict) {
      return NextResponse.json(
        { error: "Time slot conflicts with an existing lesson" },
        { status: 400 }
      )
    }

    const entry = await tenantDb.timetable.create({
      data: {
        classId: body.classId,
        subjectId: body.subjectId,
        dayOfWeek: body.dayOfWeek,
        startTime: body.startTime,
        endTime: body.endTime,
      },
      include: {
        class: { select: { name: true, gradeLevel: true } },
        subject: { select: { name: true, code: true } },
      },
    })

    return NextResponse.json({ entry }, { status: 201 })
  } catch (error: any) {
    console.error("POST /api/timetable error:", error)
    return NextResponse.json(
      { error: error.message ?? "Failed to create timetable entry" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tenantDb = await getTenantDbForUser(session.user.id)

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    const existing = await tenantDb.timetable.findUnique({
      where: { id },
    })
    if (!existing) {
      return NextResponse.json(
        { error: "Timetable entry not found" },
        { status: 404 }
      )
    }

    await tenantDb.timetable.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("DELETE /api/timetable error:", error)
    return NextResponse.json(
      { error: error.message ?? "Failed to delete timetable entry" },
      { status: 500 }
    )
  }
}