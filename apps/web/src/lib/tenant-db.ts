import { PrismaClient as TenantPrismaClient } from "../generated/tenant";

const tenantClients = new Map<string, TenantPrismaClient>();

export function getTenantDb(databaseName: string): TenantPrismaClient {
  if (tenantClients.has(databaseName)) {
    return tenantClients.get(databaseName)!;
  }

  const client = new TenantPrismaClient({
    datasources: {
      db: {
        url: `${process.env.TENANT_DATABASE_BASE_URL}/${databaseName}`,
      },
    },
  });

  tenantClients.set(databaseName, client);
  return client;
}

export async function disconnectTenantDb(databaseName: string) {
  const client = tenantClients.get(databaseName);
  if (client) {
    await client.$disconnect();
    tenantClients.delete(databaseName);
  }
}