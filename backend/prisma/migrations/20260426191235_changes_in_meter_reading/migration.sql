/*
  Warnings:

  - You are about to drop the column `rejectionReason` on the `MeterReading` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "MeterReading_agreementId_status_idx";

-- AlterTable
ALTER TABLE "MeterReading" DROP COLUMN "rejectionReason",
ADD COLUMN     "rejectionNote" TEXT;

-- CreateIndex
CREATE INDEX "MeterReading_agreementId_createdAt_idx" ON "MeterReading"("agreementId", "createdAt");
