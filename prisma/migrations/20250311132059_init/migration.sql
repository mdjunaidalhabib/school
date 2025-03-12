/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Teacher` table. All the data in the column will be lost.
  - You are about to drop the `Image` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Student" DROP COLUMN "imageUrl",
ALTER COLUMN "photo" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Teacher" DROP COLUMN "imageUrl",
ADD COLUMN     "photo" TEXT;

-- DropTable
DROP TABLE "Image";
