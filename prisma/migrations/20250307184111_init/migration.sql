-- AlterTable
ALTER TABLE "FeeSetup" ALTER COLUMN "admissionFee" DROP NOT NULL,
ALTER COLUMN "monthlyFee" DROP NOT NULL;

-- AlterTable
ALTER TABLE "StudentFee" ALTER COLUMN "admissionFee" DROP NOT NULL,
ALTER COLUMN "monthlyFee" DROP NOT NULL;
