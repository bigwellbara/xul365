// ============================================
// DATABASE PACKAGE - Public API
// Exports database clients for use in
// infrastructure and apps
// ============================================

// Mothership client - connects to central DB
export { PrismaClient as MothershipClient } from "./generated/mothership"

// Tenant client - connects to a school's DB
export { PrismaClient as TenantClient } from "./generated/tenant"