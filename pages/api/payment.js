import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { studentId, amount } = await req.json();

    if (!studentId || !amount) {
      return Response.json({ success: false, message: "Invalid data" }, { status: 400 });
    }

    const studentFee = await prisma.studentFee.findUnique({
      where: { studentId },
    });

    if (!studentFee) {
      return Response.json({ success: false, message: "Student not found" }, { status: 404 });
    }

    const updatedFee = await prisma.studentFee.update({
      where: { studentId },
      data: {
        totalPaid: studentFee.totalPaid + amount,
        totalDue: studentFee.totalDue - amount,
        status: studentFee.totalDue - amount <= 0 ? "paid" : "partial",
      },
    });

    return Response.json({ success: true, data: updatedFee });
  } catch (error) {
    console.error("Payment error:", error);
    return Response.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
