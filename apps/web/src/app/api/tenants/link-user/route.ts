import { NextRequest, NextResponse } from "next/server"
import { mothershipDb } from "@/lib/mothership-db"

export async function POST(req: NextRequest) {
  try {
    const { userId, tenantId } = await req.json()

    if (!userId || !tenantId) {
      return NextResponse.json(
        { error: "userId and tenantId are required" },
        { status: 400 }
      )
    }

    await mothershipDb.user.update({
      where: { id: userId },
      data: { tenantId },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message ?? "Failed to link user" },
      { status: 500 }
    )
  }
}