import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

// GET /api/invoices

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const invoices = await db.invoice.findMany({
      where: { tenantId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        student: true, // ✅ THIS IS THE FIX
      },
    })

    // ✅ Map student data into invoice
    const formatted = invoices.map((inv) => ({
      ...inv,
      studentName: inv.student
        ? `${inv.student.firstName} ${inv.student.lastName}`
        : "Unknown",
      gradeLevel: inv.student?.gradeLevel ?? "",
    }))

    return NextResponse.json({ invoices: formatted })
  } catch (error) {
    console.error("GET /api/invoices error:", error)
    return NextResponse.json(
      { error: "Failed to fetch invoices" },
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

    const body = await request.json() as {
      studentId: string
      studentName: string
      gradeLevel: string
      term: string
      academicYear: string
      dueDate: string
      items: { description: string; amountUsd: number }[]
      totalAmountUsd: number
    }

    const invoice = await db.invoice.create({
      data: {
        tenantId: session.user.id,
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
  } catch (error) {
    console.error("POST /api/invoices error:", error)
    return NextResponse.json(
      { error: "Failed to create invoice" },
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

    const body = await request.json() as { invoiceId: string }

    const invoice = await db.invoice.update({
      where: { id: body.invoiceId },
      data: { status: "PAID" },
    })

    return NextResponse.json({ invoice })
  } catch (error) {
    console.error("PATCH /api/invoices error:", error)
    return NextResponse.json(
      { error: "Failed to update invoice" },
      { status: 500 }
    )
  }
}