/*
  Warnings:

  - You are about to drop the column `academicClassId` on the `StudentFee` table. All the data in the column will be lost.
  - You are about to drop the column `academicDivisionId` on the `StudentFee` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "StudentFee" DROP CONSTRAINT "StudentFee_academicClassId_fkey";

-- DropForeignKey
ALTER TABLE "StudentFee" DROP CONSTRAINT "StudentFee_academicDivisionId_fkey";

-- AlterTable
ALTER TABLE "StudentFee" DROP COLUMN "academicClassId",
DROP COLUMN "academicDivisionId";
