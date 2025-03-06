import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query; // `id` প্যারামিটারটি এখানে নেওয়া হচ্ছে

  try {
    if (req.method === "GET") {
      // Get student data
      const student = await prisma.student.findUnique({
        where: { id: parseInt(id) },
      });

      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      return res.status(200).json(student);
    }

    if (req.method === "PUT") {
      const { editedData } = req.body; // Edited data from the request body

      if (!editedData) {
        return res.status(400).json({ error: "No data to update" });
      }

      // Update the student data with the edited data
      const updatedStudent = await prisma.student.update({
        where: { id: parseInt(id) },
        data: editedData, // Use the editedData object to update
      });

      return res.status(200).json(updatedStudent); // Return the updated student
    }

    if (req.method === "DELETE") {
      // Delete student
      await prisma.student.delete({
        where: { id: parseInt(id) },
      });

      return res.status(200).json({ message: "Student deleted successfully" });
    }

    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
