import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { studentId, admissionFee, monthlyFee, examFee, hostelFee, discount, totalFee } = req.body;

    console.log(req.body); // ডাটা চেক করার জন্য লগ

    // ✅ যদি অন্তত ১টি ফি থাকে তাহলে সাবমিট হবে
    if (!studentId || (!admissionFee && !monthlyFee && !examFee && !hostelFee)) {
      return res.status(400).json({
        success: false,
        error: "অন্তত একটি ফি অবশ্যই পাঠাতে হবে!",
      });
    }

    try {
      const newFeeSetup = await prisma.studentFee.create({
        data: {
          studentId: Number(studentId),
          admissionFee: admissionFee ? Number(admissionFee) : null,
          monthlyFee: monthlyFee ? Number(monthlyFee) : null,
          examFee: examFee ? Number(examFee) : null,
          hostelFee: hostelFee ? Number(hostelFee) : null,
          discount: discount ? Number(discount) : null,
          totalFee: totalFee ? Number(totalFee) : null,
        },
      });

      res.status(201).json({
        success: true,
        message: "✅ ফি সেটআপ সফল হয়েছে!",
        data: newFeeSetup,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error: "❌ ফি সেটআপে সমস্যা হয়েছে!",
      });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
