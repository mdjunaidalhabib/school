"use client";

import { useState } from "react";
import { useQuery } from '@tanstack/react-query';
import axios from "axios";

function AcademicForm() {
  const [selectedDivisionId, setSelectedDivisionId] = useState(null);
  const [selectedCurrentClass, setSelectedCurrentClass] = useState(null);
  const [selectedPreviousClass, setSelectedPreviousClass] = useState(null);

  // 🔹 একাডেমিক ডিভিশন লোড করা
  const { data: academicDivisions } = useQuery({
    queryKey: ["academicDivisions"],
    queryFn: async () => {
      const response = await axios.get("/api/academicDivisions");
      return response.data;
    },
  });

  // 🔹 একাডেমিক ক্লাস লোড করা
  const { data: academicClasses } = useQuery({
    queryKey: ["academicClasses"],
    queryFn: async () => {
      const response = await axios.get("/api/academicClasses");
      return response.data;
    },
  });

  // 🔹 ফিল্টার করা ক্লাস লিস্ট
  const filteredClasses = selectedDivisionId
    ? academicClasses?.filter(
        (cls) => cls.academicDivisionId === Number(selectedDivisionId) // একে সংখ্যায় রূপান্তর করেছি
      )
    : academicClasses; // এখন যদি বিভাগ না সিলেক্ট করা হয়, তবে সব ক্লাস দেখাবে

  // 🔹 ফর্ম সাবমিট হ্যান্ডলার
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      selectedDivisionId: Number(selectedDivisionId),  // সংখ্যা হিসেবে রূপান্তর
      selectedPreviousClass: Number(selectedPreviousClass),  // সংখ্যা হিসেবে রূপান্তর
      selectedCurrentClass: Number(selectedCurrentClass),  // সংখ্যা হিসেবে রূপান্তর
    };
    console.log(formData); // এখন সংখ্যায় আসবে

    // ফর্ম ডেটা রিসেট করা
    setSelectedDivisionId(null);
    setSelectedPreviousClass(null);
    setSelectedCurrentClass(null);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* একাডেমিক বিভাগ নির্বাচন */}
        <div className="mb-4">
          <label className="block font-semibold">একাডেমিক বিভাগ:</label>
          <select
            value={selectedDivisionId || ""}
            onChange={(e) => setSelectedDivisionId(e.target.value)}
            className="w-full p-3 border rounded"
          >
            <option value="">বিভাগ নির্বাচন করুন</option>
            {academicDivisions?.map((division) => (
              <option key={division.id} value={division.id}>
                {division.name}
              </option>
            ))}
          </select>
        </div>

        {/* পূর্বের ক্লাস নির্বাচন */}
        <div className="mb-4">
          <label className="block font-semibold">পূর্বের ক্লাস:</label>
          <select
            value={selectedPreviousClass || ""}
            onChange={(e) => setSelectedPreviousClass(e.target.value)}
            className="w-full p-3 border rounded"
            disabled={!selectedDivisionId} // 🔹 বিভাগ না সিলেক্ট করলে ডিজেবল
          >
            <option value="">পূর্বের ক্লাস নির্বাচন করুন</option>
            {filteredClasses?.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>

        {/* বর্তমান ক্লাস নির্বাচন */}
        <div className="mb-4">
          <label className="block font-semibold">বর্তমান ক্লাস:</label>
          <select
            value={selectedCurrentClass || ""}
            onChange={(e) => setSelectedCurrentClass(e.target.value)}
            className="w-full p-3 border rounded"
            disabled={!selectedDivisionId} // 🔹 বিভাগ না সিলেক্ট করলে ডিজেবল
          >
            <option value="">বর্তমান ক্লাস নির্বাচন করুন</option>
            {filteredClasses?.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">সাবমিট</button>
      </form>
    </div>
  );
}

export default AcademicForm;
