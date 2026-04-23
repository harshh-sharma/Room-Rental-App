/*
  Warnings:

  - Added the required column `rent` to the `Agreement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `renterId` to the `Agreement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Agreement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Agreement" ADD COLUMN     "deposit" DOUBLE PRECISION,
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "rent" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "renterId" INTEGER NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "Agreement_roomId_isActive_idx" ON "Agreement"("roomId", "isActive");

-- AddForeignKey
ALTER TABLE "Agreement" ADD CONSTRAINT "Agreement_renterId_fkey" FOREIGN KEY ("renterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
