import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const divisions = await prisma.areaDivision.findMany({
        include: {
          districts: {
            include: {
              thanas: true, // থানাগুলোও লোড হবে
            },
          },
        },
      });
      res.status(200).json(divisions);
    } catch (error) {
      console.error("Error fetching divisions:", error);
      res.status(500).json({ error: 'Failed to fetch divisions' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
