import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const studentId = req.query.studentId
      ? parseInt(req.query.studentId)
      : null;

    if (!studentId) {
      return res.status(400).json({ error: "Student ID is required" });
    }

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        academicDivision: { select: { name: true } },
        currentClass: { select: { name: true } },
      },
    });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    return res.status(200).json({
      id: student.id,
      name: student.name,
      fatherName: student.fatherName,
      class: student.currentClass?.name || "N/A",
      dob: student.dob,
      district: student.district,
      policeStation: student.policeStation,
      bloodGroup: student.bloodGroup,
      mobile: student.mobile,
      photo: student.photo || "/default-photo.png",
    });
  } catch (error) {
    console.error("Database Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
