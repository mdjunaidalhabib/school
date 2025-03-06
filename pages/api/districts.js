import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { divisionId } = req.query;

  if (req.method === "GET") {
    try {
      const districts = await prisma.district.findMany({
        where: { divisionId: Number(divisionId) },
      });
      return res.status(200).json(districts);
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong" });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
