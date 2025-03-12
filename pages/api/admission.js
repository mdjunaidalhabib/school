import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      console.log("📥 Received Data:", req.body); // এখানে চেক করো

      const {
        imageUrl,
        name,
        arabicName,
        nid,
        gender,
        dob,
        age,
        phone,
        selectedDivisionId,
        selectedPreviousClass,
        selectedCurrentClass,
        fatherName,
        fatherarabicName,
        fatherNid,
        fatherPhone,
        fatherOccupation,
        motherName,
        motherNid,
        motherPhone,
        motherOccupation,
        selectedDivision,
        selectedDistrict,
        selectedThana,
        village
      } = req.body;

      // ডেটা ভ্যালিডেশন (ঐচ্ছিক)
      if (!name || !nid || !phone || !dob) {
        return res.status(400).json({ success: false, message: 'অবশ্যই কিছু কিছু তথ্য প্রদান করুন' });
      }

      // Prisma দিয়ে স্টুডেন্ট তৈরি করা
      const admission = await prisma.student.create({
        data: {
          imageUrl,
          name,
          arabicName,
          nid,
          gender,
          dob,
          age,
          phone,
          academicDivisionId: selectedDivisionId,
          previousClassId: selectedPreviousClass,
          currentClassId: selectedCurrentClass,
          fatherName,
          fatherarabicName,
          fatherNid,
          fatherPhone,
          fatherOccupation,
          motherName,
          motherNid,
          motherPhone,
          motherOccupation,
          areaDivisionId: selectedDivision,
          districtId: selectedDistrict,
          thanaId: selectedThana,
          village,
        },
      });

      return res.status(201).json({ success: true, message: 'ভর্তি সফলভাবে সম্পন্ন হয়েছে', admission });
    } catch (error) {
      console.error("Error details:", error);
      return res.status(500).json({ success: false, message: 'সমস্যা হয়েছে, আবার চেষ্টা করুন', error: error.message });
    }
  }

  res.status(405).json({ success: false, message: 'Invalid Request Method' });
}