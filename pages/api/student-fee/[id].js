import { PrismaClient } from "@prisma/client";

const prisma = global.prisma || new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const student = await prisma.student.findUnique({
        where: { id: parseInt(id, 10) },
      });

      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      return res.status(200).json(student);
    } catch (error) {
      console.error("Error fetching student:", error); // Log error for debugging
      return res.status(500).json({ error: "Failed to fetch student data" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
