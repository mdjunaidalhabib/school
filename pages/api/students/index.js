import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const page = parseInt(req.query.page) || 1; // বর্তমান পৃষ্ঠা (ডিফল্ট: 1)
    const limit = parseInt(req.query.limit) || 10; // প্রতি পৃষ্ঠায় কতজন (ডিফল্ট: 10)
    const skip = (page - 1) * limit; // কতজন স্কিপ করবে
    const studentId = req.query.studentId || ""; // studentId ফিল্টার
    const classId = req.query.classId || ""; // classId ফিল্টার

    // মোট ছাত্র সংখ্যা বের করা
    const totalStudents = await prisma.student.count({
      where: {
        AND: [
          studentId ? { id: parseInt(studentId) } : {},
          classId ? { currentClassId: parseInt(classId) } : {},
        ],
      },
    });

    // নির্দিষ্ট পৃষ্ঠার ছাত্রদের লিস্ট বের করা
    const students = await prisma.student.findMany({
      where: {
        AND: [
          studentId ? { id: parseInt(studentId) } : {},
          classId ? { currentClassId: parseInt(classId) } : {},
        ],
      },
      skip,
      take: limit,
      include: {
        academicDivision: { select: { name: true } }, // একাডেমিক বিভাগ
        currentClass: { select: { name: true } }, // বর্তমান ক্লাস
        district: { select: { name: true } }, // জেলা (District)
        thana: { select: { name: true } }, // থানা (Thana)
      },
      orderBy: { id: "desc" }, // নতুন ছাত্র আগে দেখাবে
    });

    return res.status(200).json({
      students,
      total: totalStudents, // মোট ছাত্র সংখ্যা ফেরত দিচ্ছে
      page,
      limit,
      totalPages: Math.ceil(totalStudents / limit), // মোট পৃষ্ঠা সংখ্যা
    });
  } catch (error) {
    console.error("Database Error:", error);
    return res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
}
