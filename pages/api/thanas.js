import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { districtId } = req.query;

  if (req.method === "GET") {
    try {
      const thanas = await prisma.thana.findMany({
        where: { districtId: Number(districtId) },
      });
      return res.status(200).json(thanas);
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong" });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
