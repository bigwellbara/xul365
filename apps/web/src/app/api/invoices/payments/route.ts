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
      invoiceId: string
      amountPaid: number
      currency: string
      method: string
      reference: string
    }

    // Verify invoice exists
    const invoice = await tenantDb.invoice.findUnique({
      where: { id: body.invoiceId },
      include: { payments: true },
    })
    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
    }

    // Check reference is unique
    const dupReference = await tenantDb.payment.findUnique({
      where: { reference: body.reference },
    })
    if (dupReference) {
      return NextResponse.json(
        { error: "Payment reference already exists" },
        { status: 400 }
      )
    }

    // Create the payment
    const payment = await tenantDb.payment.create({
      data: {
        invoiceId: body.invoiceId,
        amountPaid: body.amountPaid,
        currency: body.currency,
        method: body.method,
        reference: body.reference,
        status: "CONFIRMED",
      },
    })

    // Sum all payments including the new one
    const totalPaid = invoice.payments.reduce(
      (sum, p) => sum + Number(p.amountPaid),
      0
    ) + body.amountPaid

    const total = Number(invoice.totalAmountUsd)

    const newStatus =
      totalPaid >= total ? "PAID" :
      totalPaid > 0 ? "PARTIAL" :
      "UNPAID"

    // Update invoice status
    const updatedInvoice = await tenantDb.invoice.update({
      where: { id: body.invoiceId },
      data: { status: newStatus },
    })

    return NextResponse.json({ payment, invoice: updatedInvoice }, { status: 201 })
  } catch (error: any) {
    console.error("POST /api/invoices/payments error:", error)
    return NextResponse.json(
      { error: error.message ?? "Failed to post payment" },
      { status: 500 }
    )
  }
}