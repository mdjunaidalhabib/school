/*
  Warnings:

  - You are about to drop the column `photo` on the `Teacher` table. All the data in the column will be lost.
  - Added the required column `imageUrl` to the `Teacher` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "Teacher" DROP COLUMN "photo",
ADD COLUMN     "imageUrl" TEXT NOT NULL;
