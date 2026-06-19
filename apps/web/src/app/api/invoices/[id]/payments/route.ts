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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tenantDb = await getTenantDbForUser(session.user.id)

    const payments = await tenantDb.payment.findMany({
      where: { invoiceId: params.id },
      orderBy: { paidAt: "desc" },
    })

    const totalPaid = payments.reduce((sum, p) => sum + Number(p.amountPaid), 0)

    return NextResponse.json({ payments, totalPaid })
  } catch (error: any) {
    console.error("GET /api/invoices/[id]/payments error:", error)
    return NextResponse.json(
      { error: error.message ?? "Failed to fetch payments" },
      { status: 500 }
    )
  }
}