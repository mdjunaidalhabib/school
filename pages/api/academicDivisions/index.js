// pages/api/academicDivisions/index.js

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "GET") {
    // Get all academic divisions
    try {
      const divisions = await prisma.academicDivision.findMany();
      res.status(200).json(divisions);
    } catch (error) {
      res.status(500).json({ error: "ডিভিশনগুলি লোড করতে সমস্যা হয়েছে" });
    }
  } else if (req.method === "POST") {
    // Create a new academic division
    const { name } = req.body;

    try {
      const newDivision = await prisma.academicDivision.create({
        data: {
          name,
        },
      });
      res.status(201).json(newDivision);
    } catch (error) {
      res.status(500).json({ error: "ডিভিশন তৈরি করতে সমস্যা হয়েছে" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
