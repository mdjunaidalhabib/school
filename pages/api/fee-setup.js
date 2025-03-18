import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      // নতুন ফি সেটআপ তৈরি
      const {
        academicDivisionId,
        academicClassId,
        admissionFee,
        monthlyFee,
        firstTermFee,
        secondTermFee,
        annualFee,
        monthlyTermFee,
        hostelFee,
        otherFee,
        totalFee,
      } = req.body;

      const newFeeSetup = await prisma.feeSetup.create({
        data: {
          academicDivisionId: Number(academicDivisionId),
          academicClassId: Number(academicClassId),
          admissionFee: parseFloat(admissionFee),
          monthlyFee: parseFloat(monthlyFee),
          firstTermFee: parseFloat(firstTermFee),
          secondTermFee: parseFloat(secondTermFee),
          annualFee: parseFloat(annualFee),
          monthlyTermFee: parseFloat(monthlyTermFee),
          hostelFee: parseFloat(hostelFee),
          otherFee:  parseFloat(otherFee),
          totalFee:  parseFloat(totalFee),
        },
      });

      return res.status(201).json(newFeeSetup);
    }

    if (req.method === "GET") {
      // সব ফি সেটআপ রিটার্ন করা
      const feeSetups = await prisma.feeSetup.findMany({
        include: {
          academicDivision: true,
          academicClass: true,
        },
      });
      return res.status(200).json(feeSetups);
    }

    if (req.method === "PUT") {
      // ফি সেটআপ আপডেট করা
      const {
        id,
        academicDivisionId,
        academicClassId,
        admissionFee,
        monthlyFee,
        firstTermFee,
        secondTermFee,
        annualFee,
        monthlyTermFee,
        hostelFee,
        otherFee,
        totalFee,
      } = req.body;

      const updatedFeeSetup = await prisma.feeSetup.update({
        where: { id: Number(id) },
        data: {
          academicDivisionId: Number(academicDivisionId),
          academicClassId: Number(academicClassId),
          admissionFee: parseFloat(admissionFee),
          monthlyFee: parseFloat(monthlyFee),
          firstTermFee: parseFloat(firstTermFee),
          secondTermFee: parseFloat(secondTermFee),
          annualFee: parseFloat(annualFee),
          monthlyTermFee: parseFloat(monthlyTermFee),
          hostelFee: parseFloat(hostelFee),
          otherFee: parseFloat(otherFee),
          totalFee: parseFloat(totalFee),
        },
      });

      return res.status(200).json(updatedFeeSetup);
    }

    if (req.method === "DELETE") {
      // নির্দিষ্ট ফি সেটআপ ডিলিট করা
      const { id } = req.query;

      await prisma.feeSetup.delete({
        where: { id: Number(id) },
      });

      return res
        .status(200)
        .json({ message: "Fee setup deleted successfully" });
    }

    if (req.method === "GET" && req.query.division && req.query.class) {
      // Division ও Class অনুযায়ী ফি সেটআপ রিটার্ন করা
      const { division, class: classId } = req.query;

      const feeSetup = await prisma.feeSetup.findFirst({
        where: {
          academicDivisionId: Number(division),
          academicClassId: Number(classId),
        },
      });

      if (!feeSetup) {
        return res
          .status(404)
          .json({
            error: `No fee setup found for Division: ${division} and Class: ${classId}`,
          });
      }

      return res.status(200).json(feeSetup);
    }

    return res.status(405).json({ error: "Method Not Allowed" });
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
