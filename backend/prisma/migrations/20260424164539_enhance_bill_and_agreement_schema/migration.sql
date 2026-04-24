/*
  Warnings:

  - You are about to drop the column `amount` on the `Bill` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[agreementId,billMonth,billYear]` on the table `Bill` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dueDay` to the `Agreement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `billMonth` to the `Bill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `billYear` to the `Bill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rentAmount` to the `Bill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalAmount` to the `Bill` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BillStatus" AS ENUM ('PENDING', 'PAID', 'OVERDUE');

-- AlterTable
ALTER TABLE "Agreement" ADD COLUMN     "dueDay" INTEGER NOT NULL,
ADD COLUMN     "electricityRate" DOUBLE PRECISION,
ADD COLUMN     "fixedCharges" JSONB;

-- AlterTable
ALTER TABLE "Bill" DROP COLUMN "amount",
ADD COLUMN     "billMonth" INTEGER NOT NULL,
ADD COLUMN     "billYear" INTEGER NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "electricityAmount" DOUBLE PRECISION,
ADD COLUMN     "electricityRate" DOUBLE PRECISION,
ADD COLUMN     "electricityUnits" DOUBLE PRECISION,
ADD COLUMN     "extraCharges" JSONB,
ADD COLUMN     "fixedCharges" JSONB,
ADD COLUMN     "rentAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "status" "BillStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "totalAmount" DOUBLE PRECISION NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Bill_agreementId_billMonth_billYear_key" ON "Bill"("agreementId", "billMonth", "billYear");
