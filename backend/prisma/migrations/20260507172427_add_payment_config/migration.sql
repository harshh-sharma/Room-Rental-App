-- CreateEnum
CREATE TYPE "PaymentMode" AS ENUM ('TEST', 'LIVE');

-- CreateTable
CREATE TABLE "PaymentConfig" (
    "id" SERIAL NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "razorpayEnabled" BOOLEAN NOT NULL DEFAULT false,
    "mode" "PaymentMode" NOT NULL DEFAULT 'TEST',
    "testKeyId" TEXT,
    "testKeySecret" TEXT,
    "liveKeyId" TEXT,
    "liveKeySecret" TEXT,

    CONSTRAINT "PaymentConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PaymentConfig_ownerId_key" ON "PaymentConfig"("ownerId");

-- AddForeignKey
ALTER TABLE "PaymentConfig" ADD CONSTRAINT "PaymentConfig_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
