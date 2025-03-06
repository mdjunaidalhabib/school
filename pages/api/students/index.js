import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id, page = 1, limit = 10 } = req.query; // `limit` যোগ করা হলো

  try {
    if (req.method === "GET") {
        const students = await prisma.student.findMany({
        orderBy: { createdAt: "desc" },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      });
      return res.status(200).json(students);
    }

    if (req.method === "PUT") {
      if (!id) {
        return res.status(400).json({ error: "Student ID is required for updating" });
      }

      // `id` কে সংখ্যা হিসাবে নিতে হবে
      const studentId = parseInt(id);
      if (isNaN(studentId)) {
        return res.status(400).json({ error: "Invalid student ID format" });
      }

      // নিশ্চিত হওয়া যে `req.body`-তে ডাটা আছে
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: "No data provided for update" });
      }

      const updatedStudent = await prisma.student.update({
        where: { id: studentId },
        data: req.body,
      });

      return res.status(200).json(updatedStudent);
    }

    if (req.method === "DELETE") {
      if (!id) {
        return res.status(400).json({ error: "Student ID is required for deletion" });
      }

      const studentId = parseInt(id);
      if (isNaN(studentId)) {
        return res.status(400).json({ error: "Invalid student ID format" });
      }

      await prisma.student.delete({ where: { id: studentId } });
      return res.status(200).json({ message: "Student deleted successfully" });
    }

    // Unsupported methods
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
