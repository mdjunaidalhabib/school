// pages/api/academicDivisions/[id].js

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "PUT") {
    // Update an academic division
    const { name } = req.body;
    try {
      const updatedDivision = await prisma.academicDivision.update({
        where: { id: parseInt(id) },
        data: {
          name,
        },
      });
      res.status(200).json(updatedDivision);
    } catch (error) {
      res.status(500).json({ error: "ডিভিশন আপডেট করতে সমস্যা হয়েছে" });
    }
  } else if (req.method === "DELETE") {
    // Delete an academic division
    try {
      await prisma.academicDivision.delete({
        where: { id: parseInt(id) },
      });
      res.status(200).json({ message: "ডিভিশন মুছে ফেলা হয়েছে" });
    } catch (error) {
      res.status(500).json({ error: "ডিভিশন মুছে ফেলতে সমস্যা হয়েছে" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
