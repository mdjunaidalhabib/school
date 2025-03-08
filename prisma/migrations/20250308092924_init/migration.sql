/*
  Warnings:

  - You are about to drop the column `examFee` on the `FeeSetup` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FeeSetup" DROP COLUMN "examFee",
ADD COLUMN     "annualFee" DOUBLE PRECISION,
ADD COLUMN     "firstTermFee" DOUBLE PRECISION,
ADD COLUMN     "monthlyOrTestFee" DOUBLE PRECISION,
ADD COLUMN     "secondTermFee" DOUBLE PRECISION;
