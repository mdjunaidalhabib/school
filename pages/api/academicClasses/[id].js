// pages/api/academicClasses/[id].js

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "PUT") {
    // Update an academic class
    const { name, divisionId } = req.body;
    try {
      const updatedClass = await prisma.academicClass.update({
        where: { id: parseInt(id) },
        data: {
          name,
          divisionId,
        },
      });
      res.status(200).json(updatedClass);
    } catch (error) {
      res.status(500).json({ error: "ক্লাস আপডেট করতে সমস্যা হয়েছে" });
    }
  } else if (req.method === "DELETE") {
    // Delete an academic class
    try {
      await prisma.academicClass.delete({
        where: { id: parseInt(id) },
      });
      res.status(200).json({ message: "ক্লাস মুছে ফেলা হয়েছে" });
    } catch (error) {
      res.status(500).json({ error: "ক্লাস মুছে ফেলতে সমস্যা হয়েছে" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
