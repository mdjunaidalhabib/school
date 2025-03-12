/*
  Warnings:

  - You are about to drop the column `photo` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `photo` on the `Teacher` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Student" DROP COLUMN "photo",
ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "Teacher" DROP COLUMN "photo",
ADD COLUMN     "imageUrl" TEXT;
