// ============================================
// TENANT CONNECTION MANAGER
// Resolves which database to connect to
// based on the school's subdomain
// ============================================

import { PrismaClient as MothershipClient } from "@xul365/database"

// Cache connections so we don't create a new
// connection on every single request
const connectionCache = new Map<string, PrismaClient>()

// We use a dynamic PrismaClient here because
// each tenant has a different database URL
import { PrismaClient } from "@prisma/client"

export class TenantConnectionManager {
  private mothershipClient: MothershipClient

  constructor() {
    this.mothershipClient = new MothershipClient({
      datasources: {
        db: { url: process.env.MOTHERSHIP_DATABASE_URL },
      },
    })
  }

  // Get a database connection for a specific tenant
  async getConnection(subdomain: string): Promise<PrismaClient> {
    // Return cached connection if it exists
    const cached = connectionCache.get(subdomain)
    if (cached) return cached

    // Look up the tenant in the mothership DB
    const tenant = await this.mothershipClient.tenant.findUnique({
      where: { subdomain },
    })

    if (!tenant) {
      throw new Error(`School not found: ${subdomain}`)
    }

    if (tenant.subscriptionStatus === "SUSPENDED") {
      throw new Error(`School account is suspended: ${subdomain}`)
    }

    // Build the tenant database URL
    const tenantDatabaseUrl = this.buildDatabaseUrl(tenant.databaseName)

    // Create a new Prisma client for this tenant
    const client = new PrismaClient({
      datasources: {
        db: { url: tenantDatabaseUrl },
      },
    })

    // Cache it for future requests
    connectionCache.set(subdomain, client)

    return client
  }

  // Get the mothership client directly
  getMothershipClient(): MothershipClient {
    return this.mothershipClient
  }

  // Build a MySQL connection URL for the tenant
  private buildDatabaseUrl(databaseName: string): string {
    const base = process.env.TENANT_DATABASE_BASE_URL
    if (!base) {
      throw new Error("TENANT_DATABASE_BASE_URL is not set")
    }
    // e.g. mysql://user:password@host:3306/xul365_schoolname
    return `${base}/${databaseName}`
  }

  // Call this when a school's subscription changes
  // so the next request gets a fresh connection
  invalidateConnection(subdomain: string): void {
    const client = connectionCache.get(subdomain)
    if (client) {
      client.$disconnect()
      connectionCache.delete(subdomain)
    }
  }

  // Clean up all connections gracefully
  async disconnectAll(): Promise<void> {
    const disconnects = Array.from(connectionCache.values()).map((client) =>
      client.$disconnect()
    )
    await Promise.all(disconnects)
    connectionCache.clear()
    await this.mothershipClient.$disconnect()
  }
}

// Singleton instance
export const tenantConnectionManager = new TenantConnectionManager()