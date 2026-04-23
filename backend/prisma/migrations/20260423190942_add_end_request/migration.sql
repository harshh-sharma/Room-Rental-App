-- CreateEnum
CREATE TYPE "EndRequestStatus" AS ENUM ('NONE', 'PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Agreement" ADD COLUMN     "endRequestDate" TIMESTAMP(3),
ADD COLUMN     "endRequestStatus" "EndRequestStatus" NOT NULL DEFAULT 'NONE';
