import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  // ID ভ্যালিড কিনা তা আগে যাচাই করা
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid student ID" });
  }

  try {
    if (req.method === "GET") {
      // ছাত্রের তথ্য বের করা
      const student = await prisma.student.findUnique({
        where: { id: parseInt(id) },
        include: {
          areaDivision: { select: { name: true } }, // বিভাগ (AreaDivision)
          district: { select: { name: true } }, // জেলা (District)
          thana: { select: { name: true } }, // থানা (Thana)
          academicDivision: { select: { name: true } }, // একাডেমিক বিভাগ (AcademicDivision)
          previousClass: { select: { name: true } }, 
          currentClass: { select: { name: true } }, // বর্তমান ক্লাস (AcademicClass)
        },
      });

      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      return res.status(200).json({
        ...student,
        areaDivision: student.areaDivision?.name || "N/A",
        districtName: student.district?.name || "N/A",
        thanaName: student.thana?.name || "N/A",
        academicDivisionName: student.academicDivision?.name || "N/A",
        previousClass: student.currentClass?.name || "N/A",
        currentClass: student.currentClass?.name || "N/A",
      });
    }

    if (req.method === "PUT") {
      console.log("Received Data for Update:", req.body); // API-তে ডাটা কীভাবে আসছে চেক করার জন্য

      // ক্লায়েন্ট থেকে পাঠানো সম্পূর্ণ ডাটা গ্রহণ
      const editedData = req.body;

      // চেক করা যে editedData সত্যিই একটি অবজেক্ট কিনা এবং খালি নয়
      if (
        !editedData ||
        typeof editedData !== "object" ||
        Object.keys(editedData).length === 0
      ) {
        return res.status(400).json({ error: "Invalid data to update" });
      }

      // ছাত্রের তথ্য আপডেট করা
      const updatedStudent = await prisma.student.update({
        where: { id: parseInt(id) },
        data: editedData,
      });

      console.log("Updated Student:", updatedStudent);
      return res.status(200).json(updatedStudent);
    }

    if (req.method === "DELETE") {
      // ছাত্রের তথ্য ডিলিট করা
      await prisma.student.delete({
        where: { id: parseInt(id) },
      });

      return res.status(200).json({ message: "Student deleted successfully" });
    }

    // যদি অ্যালাউড মেথড না হয়
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  } catch (error) {
    console.error("Database Error:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
}
