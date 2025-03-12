/*
  Warnings:

  - Made the column `photo` on table `Teacher` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Teacher" ALTER COLUMN "photo" SET NOT NULL,
ALTER COLUMN "photo" SET DATA TYPE TEXT;
