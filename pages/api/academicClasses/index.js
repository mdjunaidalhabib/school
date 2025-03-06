import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, academicDivisionId } = req.body; // divisionId এর পরিবর্তে academicDivisionId

    if (!name || !academicDivisionId) {
      return res.status(400).json({ error: 'ক্লাসের নাম ও একাডেমিক ডিভিশনের আইডি প্রয়োজন' });
    }

    try {
      const newClass = await prisma.academicClass.create({
        data: {
          name,
          academicDivisionId: parseInt(academicDivisionId, 10),
        },
      });
      return res.status(201).json(newClass);
    } catch (error) {
      console.error("Error Creating Class:", error);
      return res.status(500).json({ error: 'ক্লাস তৈরি করতে সমস্যা হয়েছে' });
    }
  } 
  
  else if (req.method === 'GET') {
    try {
      const classes = await prisma.academicClass.findMany({
        include: { academicDivision: true }, // division নয়, এটি academicDivision হবে
      });
      return res.status(200).json(classes);
    } catch (error) {
      console.error("Error Fetching Classes:", error);
      return res.status(500).json({ error: 'ক্লাসগুলি লোড করতে সমস্যা হয়েছে' });
    }
  } 
  
  else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
