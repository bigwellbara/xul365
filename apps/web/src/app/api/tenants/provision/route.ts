import { NextRequest, NextResponse } from "next/server";
import { mothershipDb } from "@/lib/mothership-db";
import { getTenantDb } from "@/lib/tenant-db";
import mysql from "mysql2/promise";
import { execSync } from "child_process";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { schoolName, subdomain, branding } = body;

    if (!schoolName || !subdomain) {
      return NextResponse.json(
        { error: "schoolName and subdomain are required" },
        { status: 400 }
      );
    }

    // Sanitize subdomain to use as database name
    const databaseName = `xul365_${subdomain.toLowerCase().replace(/[^a-z0-9]/g, "_")}`;

    // 1. Check subdomain not already taken
    const existing = await mothershipDb.tenant.findUnique({
      where: { subdomain },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Subdomain already taken" },
        { status: 409 }
      );
    }

    // 2. Create the MySQL database for this tenant
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST ?? "localhost",
      port: Number(process.env.MYSQL_PORT ?? 3306),
      user: process.env.MYSQL_USER ?? "root",
      password: process.env.MYSQL_PASSWORD ?? "",
    });

    await connection.execute(
      `CREATE DATABASE IF NOT EXISTS \`${databaseName}\``
    );
    await connection.end();

    // 3. Push the tenant schema into the new database
    const tenantDbUrl = `${process.env.TENANT_DATABASE_BASE_URL}/${databaseName}`;

    execSync(
      `npx prisma db push --schema=prisma/tenant.prisma --skip-generate`,
      {
        env: {
          ...process.env,
          TENANT_DATABASE_URL: tenantDbUrl,
        },
        cwd: process.cwd(),
        stdio: "pipe",
      }
    );

    // 4. Save the tenant in the mothership
    const tenant = await mothershipDb.tenant.create({
      data: {
        schoolName,
        subdomain,
        databaseName,
        branding: branding ?? {},
        subscriptionStatus: "TRIAL",
      },
    });

    return NextResponse.json({ success: true, tenant }, { status: 201 });
  } catch (error: any) {
    console.error("Provisioning error:", error);
    return NextResponse.json(
      { error: error.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}