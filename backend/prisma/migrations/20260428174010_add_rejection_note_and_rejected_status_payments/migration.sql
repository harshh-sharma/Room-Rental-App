-- AlterEnum
ALTER TYPE "PaymentStatus" ADD VALUE 'REJECTED';

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "rejectionNote" TEXT;
