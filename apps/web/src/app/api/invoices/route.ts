// import { NextRequest, NextResponse } from "next/server"
// import { db } from "@/lib/db"
// import { auth } from "@/lib/auth"

// // GET /api/invoices

// export async function GET(request: NextRequest) {
//   try {
//     const session = await auth.api.getSession({
//       headers: request.headers,
//     })

//     if (!session) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const invoices = await db.invoice.findMany({
//       where: { tenantId: session.user.id },
//       orderBy: { createdAt: "desc" },
//       include: {
//         student: true, // ✅ THIS IS THE FIX
//       },
//     })

//     // ✅ Map student data into invoice
//     const formatted = invoices.map((inv) => ({
//       ...inv,
//       studentName: inv.student
//         ? `${inv.student.firstName} ${inv.student.lastName}`
//         : "Unknown",
//       gradeLevel: inv.student?.gradeLevel ?? "",
//     }))

//     return NextResponse.json({ invoices: formatted })
//   } catch (error) {
//     console.error("GET /api/invoices error:", error)
//     return NextResponse.json(
//       { error: "Failed to fetch invoices" },
//       { status: 500 }
//     )
//   }
// }
// // POST /api/invoices


// export async function POST(request: NextRequest) {
//   try {
//     const session = await auth.api.getSession({
//       headers: request.headers,
//     })

//     if (!session) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const body = await request.json() as {
//       studentId: string
//       studentName: string
//       gradeLevel: string
//       term: string
//       academicYear: string
//       dueDate: string
//       items: { description: string; amountUsd: number }[]
//       totalAmountUsd: number
//     }

//     const invoice = await db.invoice.create({
//       data: {
//         tenantId: session.user.id,
//         studentId: body.studentId,
//         academicYear: body.academicYear,
//         term: body.term,
//         items: body.items,
//         totalAmountUsd: body.totalAmountUsd,
//         totalAmountZig: body.totalAmountUsd * 35,
//         status: "UNPAID",
//         dueDate: new Date(body.dueDate),
//       },
//     })

//     return NextResponse.json({ invoice }, { status: 201 })
//   } catch (error) {
//     console.error("POST /api/invoices error:", error)
//     return NextResponse.json(
//       { error: "Failed to create invoice" },
//       { status: 500 }
//     )
//   }
// }


// // PATCH /api/invoices - mark as paid
// export async function PATCH(request: NextRequest) {
//   try {
//     const session = await auth.api.getSession({
//       headers: request.headers,
//     })

//     if (!session) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const body = await request.json() as { invoiceId: string }

//     const invoice = await db.invoice.update({
//       where: { id: body.invoiceId },
//       data: { status: "PAID" },
//     })

//     return NextResponse.json({ invoice })
//   } catch (error) {
//     console.error("PATCH /api/invoices error:", error)
//     return NextResponse.json(
//       { error: "Failed to update invoice" },
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

// GET /api/invoices
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tenantDb = await getTenantDbForUser(session.user.id)

    const invoices = await tenantDb.invoice.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        student: true,
      },
    })

    const formatted = invoices.map((inv) => ({
      ...inv,
      studentName: inv.student
        ? `${inv.student.firstName} ${inv.student.lastName}`
        : "Unknown",
      gradeLevel: inv.student?.gradeLevel ?? "",
    }))

    return NextResponse.json({ invoices: formatted })
  } catch (error: any) {
    console.error("GET /api/invoices error:", error)
    return NextResponse.json(
      { error: error.message ?? "Failed to fetch invoices" },
      { status: 500 }
    )
  }
}

// POST /api/invoices
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
      studentId: string
      term: string
      academicYear: string
      dueDate: string
      items: { description: string; amountUsd: number }[]
      totalAmountUsd: number
    }

    // Verify student exists in tenant DB
    const student = await tenantDb.student.findUnique({
      where: { id: body.studentId },
    })
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    const invoice = await tenantDb.invoice.create({
      data: {
        studentId: body.studentId,
        academicYear: body.academicYear,
        term: body.term,
        items: body.items,
        totalAmountUsd: body.totalAmountUsd,
        totalAmountZig: body.totalAmountUsd * 35,
        status: "UNPAID",
        dueDate: new Date(body.dueDate),
      },
    })

    return NextResponse.json({ invoice }, { status: 201 })
  } catch (error: any) {
    console.error("POST /api/invoices error:", error)
    return NextResponse.json(
      { error: error.message ?? "Failed to create invoice" },
      { status: 500 }
    )
  }
}

// PATCH /api/invoices - mark as paid
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tenantDb = await getTenantDbForUser(session.user.id)

    const body = await request.json() as {
      invoiceId: string
      amountPaid?: number
    }

    // Verify invoice exists in this tenant
    const existing = await tenantDb.invoice.findUnique({
      where: { id: body.invoiceId },
    })
    if (!existing) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
    }

    const invoice = await tenantDb.invoice.update({
      where: { id: body.invoiceId },
      data: {
        status: "PAID",
        paidAt: new Date(),
        amountPaid: body.amountPaid ?? existing.totalAmountUsd,
      },
    })

    return NextResponse.json({ invoice })
  } catch (error: any) {
    console.error("PATCH /api/invoices error:", error)
    return NextResponse.json(
      { error: error.message ?? "Failed to update invoice" },
      { status: 500 }
    )
  }
}