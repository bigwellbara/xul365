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

//     const tenant = await db.tenant.findFirst({
//       where: { id: session.user.id },
//     })

//     if (!tenant) {
//       return NextResponse.json({ error: "School not found" }, { status: 404 })
//     }

//     return NextResponse.json({ tenant })
//   } catch (error) {
//     console.error("GET /api/settings error:", error)
//     return NextResponse.json(
//       { error: "Failed to fetch settings" },
//       { status: 500 }
//     )
//   }
// }

// export async function PATCH(request: NextRequest) {
//   try {
//     const session = await auth.api.getSession({
//       headers: request.headers,
//     })

//     if (!session) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const body = await request.json() as {
//       schoolName?: string
//       location?: string
//       phone?: string
//       email?: string
//       academicYear?: string
//       primaryColor?: string
//       secondaryColor?: string
//       accentColor?: string
//     }

//     // Get existing tenant first
//     const existing = await db.tenant.findFirst({
//       where: { id: session.user.id },
//     })

//     if (!existing) {
//       // Create tenant record if it doesn't exist yet
//       const tenant = await db.tenant.create({
//         data: {
//           id: session.user.id,
//           schoolName: body.schoolName ?? "My School",
//           subdomain: session.user.id,
//           databaseName: `xul365_${session.user.id}`,
//           subscriptionStatus: "ACTIVE",
//           branding: {
//             logoUrl: null,
//             primaryColor: body.primaryColor ?? "#2563eb",
//             secondaryColor: body.secondaryColor ?? "#64748b",
//             accentColor: body.accentColor ?? "#f59e0b",
//             location: body.location ?? "",
//             phone: body.phone ?? "",
//             email: body.email ?? "",
//             academicYear: body.academicYear ?? "2025",
//           },
//         },
//       })
//       return NextResponse.json({ tenant })
//     }

//     const existingBranding = existing.branding as Record<string, unknown>

//     const tenant = await db.tenant.update({
//       where: { id: session.user.id },
//       data: {
//         schoolName: body.schoolName ?? existing.schoolName,
//         branding: {
//           ...existingBranding,
//           primaryColor: body.primaryColor ?? existingBranding.primaryColor,
//           secondaryColor: body.secondaryColor ?? existingBranding.secondaryColor,
//           accentColor: body.accentColor ?? existingBranding.accentColor,
//           location: body.location ?? existingBranding.location,
//           phone: body.phone ?? existingBranding.phone,
//           email: body.email ?? existingBranding.email,
//           academicYear: body.academicYear ?? existingBranding.academicYear,
//         },
//       },
//     })

//     return NextResponse.json({ tenant })
//   } catch (error) {
//     console.error("PATCH /api/settings error:", error)
//     return NextResponse.json(
//       { error: "Failed to save settings" },
//       { status: 500 }
//     )
//   }
// }


import { NextRequest, NextResponse } from "next/server"
import { mothershipDb } from "@/lib/mothership-db"
import { auth } from "@/lib/auth"

async function getTenantForUser(userId: string) {
  const user = await mothershipDb.user.findUnique({
    where: { id: userId },
  })

  if (!user?.tenantId) {
    throw new Error("User has no tenant assigned")
  }

  const tenant = await mothershipDb.tenant.findUnique({
    where: { id: user.tenantId },
  })

  if (!tenant) {
    throw new Error("Tenant not found")
  }

  return tenant
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tenant = await getTenantForUser(session.user.id)

    return NextResponse.json({ tenant })
  } catch (error: any) {
    console.error("GET /api/settings error:", error)
    return NextResponse.json(
      { error: error.message ?? "Failed to fetch settings" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json() as {
      schoolName?: string
      location?: string
      phone?: string
      email?: string
      academicYear?: string
      primaryColor?: string
      secondaryColor?: string
      accentColor?: string
    }

    const tenant = await getTenantForUser(session.user.id)
    const existingBranding = tenant.branding as Record<string, unknown>

    const updated = await mothershipDb.tenant.update({
      where: { id: tenant.id },
      data: {
        schoolName: body.schoolName ?? tenant.schoolName,
        branding: {
          ...existingBranding,
          primaryColor: body.primaryColor ?? existingBranding.primaryColor,
          secondaryColor: body.secondaryColor ?? existingBranding.secondaryColor,
          accentColor: body.accentColor ?? existingBranding.accentColor,
          location: body.location ?? existingBranding.location,
          phone: body.phone ?? existingBranding.phone,
          email: body.email ?? existingBranding.email,
          academicYear: body.academicYear ?? existingBranding.academicYear,
        },
      },
    })

    return NextResponse.json({ tenant: updated })
  } catch (error: any) {
    console.error("PATCH /api/settings error:", error)
    return NextResponse.json(
      { error: error.message ?? "Failed to save settings" },
      { status: 500 }
    )
  }
}