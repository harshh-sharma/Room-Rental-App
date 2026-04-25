/*
  Warnings:

  - Added the required column `calculationType` to the `Bill` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ReadingStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Agreement" ADD COLUMN     "lastPaidMonth" INTEGER,
ADD COLUMN     "lastPaidYear" INTEGER;

-- AlterTable
ALTER TABLE "Bill" ADD COLUMN     "calculationType" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "MeterReading" (
    "id" SERIAL NOT NULL,
    "agreementId" INTEGER NOT NULL,
    "units" DOUBLE PRECISION NOT NULL,
    "imageUrl" TEXT,
    "status" "ReadingStatus" NOT NULL DEFAULT 'PENDING',
    "rejectionReason" TEXT,
    "usedInBill" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MeterReading_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MeterReading_agreementId_status_idx" ON "MeterReading"("agreementId", "status");

-- AddForeignKey
ALTER TABLE "MeterReading" ADD CONSTRAINT "MeterReading_agreementId_fkey" FOREIGN KEY ("agreementId") REFERENCES "Agreement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
