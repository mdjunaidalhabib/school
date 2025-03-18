/*
  Warnings:

  - You are about to drop the column `monthlyOrTestFee` on the `FeeSetup` table. All the data in the column will be lost.
  - You are about to drop the column `discount` on the `StudentFee` table. All the data in the column will be lost.
  - You are about to drop the column `examFee` on the `StudentFee` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FeeSetup" DROP COLUMN "monthlyOrTestFee",
ADD COLUMN     "monthlyTermFee" DOUBLE PRECISION,
ADD COLUMN     "otherFee" DOUBLE PRECISION,
ADD COLUMN     "totalFee" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "StudentFee" DROP COLUMN "discount",
DROP COLUMN "examFee",
ADD COLUMN     "annualFee" DOUBLE PRECISION,
ADD COLUMN     "firstTermFee" DOUBLE PRECISION,
ADD COLUMN     "monthlyTermFee" DOUBLE PRECISION,
ADD COLUMN     "otherFee" DOUBLE PRECISION,
ADD COLUMN     "secondTermFee" DOUBLE PRECISION;
