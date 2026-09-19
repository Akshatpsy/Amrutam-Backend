/*
  Warnings:

  - A unique constraint covering the columns `[scope,key]` on the table `idempotency_keys` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[provider,providerRef]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `expiresAt` to the `idempotency_keys` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "IdempotencyStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'FAILED', 'EXPIRED');

-- DropIndex
DROP INDEX "idempotency_keys_key_key";

-- DropIndex
DROP INDEX "payments_providerRef_key";

-- AlterTable
ALTER TABLE "idempotency_keys" ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "status" "IdempotencyStatus" NOT NULL DEFAULT 'IN_PROGRESS';

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- CreateIndex
CREATE INDEX "bookings_patientId_scheduledStart_idx" ON "bookings"("patientId", "scheduledStart");

-- CreateIndex
CREATE INDEX "idempotency_keys_expiresAt_idx" ON "idempotency_keys"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "idempotency_keys_scope_key_key" ON "idempotency_keys"("scope", "key");

-- CreateIndex
CREATE UNIQUE INDEX "payments_provider_providerRef_key" ON "payments"("provider", "providerRef");

-- CreateIndex
CREATE INDEX "refresh_tokens_userId_revokedAt_idx" ON "refresh_tokens"("userId", "revokedAt");

-- CreateIndex
CREATE INDEX "refresh_tokens_expiresAt_idx" ON "refresh_tokens"("expiresAt");
