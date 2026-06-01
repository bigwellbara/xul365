import { PrismaClient as MothershipPrismaClient } from "../generated/mothership";

const globalForMothership = globalThis as unknown as {
  mothership: MothershipPrismaClient | undefined;
};

export const mothershipDb =
  globalForMothership.mothership ??
  new MothershipPrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForMothership.mothership = mothershipDb;
}