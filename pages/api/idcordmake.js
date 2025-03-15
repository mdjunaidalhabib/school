import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { className } = req.query;

  if (req.method === "GET") {
    try {
      const students = await prisma.student.findMany({
        where: { class: className },
      });
      res.status(200).json(students);
    } catch (error) {
      res.status(500).json({ error: "Database fetch error" });
    }
  }
}
