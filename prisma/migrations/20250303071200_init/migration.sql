-- CreateTable
CREATE TABLE "AreaDivision" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "AreaDivision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "District" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "areaDivisionId" INTEGER NOT NULL,

    CONSTRAINT "District_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Thana" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "districtId" INTEGER NOT NULL,

    CONSTRAINT "Thana_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AcademicDivision" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "AcademicDivision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AcademicClass" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "academicDivisionId" INTEGER NOT NULL,

    CONSTRAINT "AcademicClass_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "arabicName" TEXT NOT NULL,
    "nid" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "age" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "academicDivisionId" INTEGER,
    "previousClassId" INTEGER,
    "currentClassId" INTEGER,
    "fatherName" TEXT NOT NULL,
    "fatherarabicName" TEXT NOT NULL,
    "fatherNid" TEXT NOT NULL,
    "fatherPhone" TEXT NOT NULL,
    "fatherOccupation" TEXT NOT NULL,
    "motherName" TEXT NOT NULL,
    "motherNid" TEXT NOT NULL,
    "motherPhone" TEXT NOT NULL,
    "motherOccupation" TEXT NOT NULL,
    "areaDivisionId" INTEGER NOT NULL,
    "districtId" INTEGER NOT NULL,
    "thanaId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "village" TEXT NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teacher" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "arabicName" TEXT NOT NULL,
    "nid" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "age" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "academicDivisionId" INTEGER,
    "fatherName" TEXT NOT NULL,
    "fatherarabicName" TEXT NOT NULL,
    "fatherNid" TEXT NOT NULL,
    "fatherPhone" TEXT NOT NULL,
    "fatherOccupation" TEXT NOT NULL,
    "motherName" TEXT NOT NULL,
    "motherNid" TEXT NOT NULL,
    "motherPhone" TEXT NOT NULL,
    "motherOccupation" TEXT NOT NULL,
    "areaDivisionId" INTEGER NOT NULL,
    "districtId" INTEGER NOT NULL,
    "thanaId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "village" TEXT NOT NULL,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AreaDivision_name_key" ON "AreaDivision"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AcademicDivision_name_key" ON "AcademicDivision"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Student_nid_key" ON "Student"("nid");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_nid_key" ON "Teacher"("nid");

-- AddForeignKey
ALTER TABLE "District" ADD CONSTRAINT "District_areaDivisionId_fkey" FOREIGN KEY ("areaDivisionId") REFERENCES "AreaDivision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Thana" ADD CONSTRAINT "Thana_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicClass" ADD CONSTRAINT "AcademicClass_academicDivisionId_fkey" FOREIGN KEY ("academicDivisionId") REFERENCES "AcademicDivision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_academicDivisionId_fkey" FOREIGN KEY ("academicDivisionId") REFERENCES "AcademicDivision"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_previousClassId_fkey" FOREIGN KEY ("previousClassId") REFERENCES "AcademicClass"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_currentClassId_fkey" FOREIGN KEY ("currentClassId") REFERENCES "AcademicClass"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_areaDivisionId_fkey" FOREIGN KEY ("areaDivisionId") REFERENCES "AreaDivision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_thanaId_fkey" FOREIGN KEY ("thanaId") REFERENCES "Thana"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_academicDivisionId_fkey" FOREIGN KEY ("academicDivisionId") REFERENCES "AcademicDivision"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_areaDivisionId_fkey" FOREIGN KEY ("areaDivisionId") REFERENCES "AreaDivision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_thanaId_fkey" FOREIGN KEY ("thanaId") REFERENCES "Thana"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
