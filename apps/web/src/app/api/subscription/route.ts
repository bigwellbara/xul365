// import { NextRequest, NextResponse } from "next/server"
// import { mothershipDb } from "@/lib/mothership-db"
// import { auth } from "@/lib/auth"

// async function getTenantForUser(userId: string) {
//   const user = await mothershipDb.user.findUnique({
//     where: { id: userId },
//   })
//   if (!user?.tenantId) throw new Error("User has no tenant assigned")

//   const tenant = await mothershipDb.tenant.findUnique({
//     where: { id: user.tenantId },
//     include: { subscription: true },
//   })
//   if (!tenant) throw new Error("Tenant not found")

//   return tenant
// }

// export async function GET(request: NextRequest) {
//   try {
//     const session = await auth.api.getSession({ headers: request.headers })
//     if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

//     const tenant = await getTenantForUser(session.user.id)

//     return NextResponse.json({
//       subscription: tenant.subscription,
//       subscriptionStatus: tenant.subscriptionStatus,
//     })
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 })
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     const session = await auth.api.getSession({ headers: request.headers })
//     if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

//     const body = await request.json() as {
//       selectedFeatures: string[]
//       billingCycle: string
//       priceUsd: number
//     }

//     const tenant = await getTenantForUser(session.user.id)

//     const now = new Date()
//     const endDate = body.billingCycle === "annual"
//       ? new Date(now.getFullYear() + 1, now.getMonth(), now.getDate())
//       : new Date(now.getFullYear(), now.getMonth() + 1, now.getDate())

//     // Upsert subscription
//     const subscription = await mothershipDb.subscription.upsert({
//       where: { tenantId: tenant.id },
//       create: {
//         tenantId: tenant.id,
//         selectedFeatures: body.selectedFeatures,
//         billingCycle: body.billingCycle,
//         priceUsd: body.priceUsd,
//         startDate: now,
//         endDate,
//         status: "TRIAL",
//       },
//       update: {
//         selectedFeatures: body.selectedFeatures,
//         billingCycle: body.billingCycle,
//         priceUsd: body.priceUsd,
//         startDate: now,
//         endDate,
//       },
//     })

//     // Update tenant subscription status
//     await mothershipDb.tenant.update({
//       where: { id: tenant.id },
//       data: { subscriptionStatus: "TRIAL" },
//     })

//     return NextResponse.json({ subscription })
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 })
//   }
// }


import { NextRequest, NextResponse } from "next/server"
import { mothershipDb } from "@/lib/mothership-db"
import { auth } from "@/lib/auth"

async function getTenantForUser(userId: string) {
  const user = await mothershipDb.user.findUnique({
    where: { id: userId },
  })
  if (!user?.tenantId) throw new Error("User has no tenant assigned")
  const tenant = await mothershipDb.tenant.findUnique({
    where: { id: user.tenantId },
    include: { subscription: true },
  })
  if (!tenant) throw new Error("Tenant not found")
  return tenant
}

// GET /api/subscription
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const tenant = await getTenantForUser(session.user.id)
    return NextResponse.json({ subscription: tenant.subscription })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message ?? "Failed to fetch subscription" },
      { status: 500 }
    )
  }
}

// POST /api/subscription - create or update
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json() as {
      selectedFeatures: string[]
      billingCycle: string
      priceUsd: number
    }

    const tenant = await getTenantForUser(session.user.id)

    // Create or update subscription
    const subscription = await mothershipDb.subscription.upsert({
      where: { tenantId: tenant.id },
      update: {
        selectedFeatures: body.selectedFeatures,
        billingCycle: body.billingCycle,
        priceUsd: body.priceUsd,
        status: "ACTIVE",
      },
      create: {
        tenantId: tenant.id,
        selectedFeatures: body.selectedFeatures,
        billingCycle: body.billingCycle,
        priceUsd: body.priceUsd,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: "ACTIVE",
      },
    })

    return NextResponse.json({ subscription })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message ?? "Failed to save subscription" },
      { status: 500 }
    )
  }
}

// PATCH /api/subscription - update features only
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json() as {
      selectedFeatures: string[]
    }

    const tenant = await getTenantForUser(session.user.id)

    if (!tenant.subscription) {
      return NextResponse.json(
        { error: "No subscription found" },
        { status: 404 }
      )
    }

    const subscription = await mothershipDb.subscription.update({
      where: { tenantId: tenant.id },
      data: {
        selectedFeatures: body.selectedFeatures,
      },
    })

    return NextResponse.json({ subscription })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message ?? "Failed to update subscription" },
      { status: 500 }
    )
  }
}