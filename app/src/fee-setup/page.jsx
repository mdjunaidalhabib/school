"use client";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function FeeSetupForm() {
  const [selectedDivisionId, setSelectedDivisionId] = useState("");
  const [selectedPreviousClass, setSelectedPreviousClass] = useState("");
  const [admissionFee, setAdmissionFee] = useState(0);
  const [monthlyFee, setMonthlyFee] = useState(0);
  const [firstTermFee, setFirstTermFee] = useState(0);
  const [secondTermFee, setSecondTermFee] = useState(0);
  const [annualFee, setAnnualFee] = useState(0);
  const [monthlyOrTestFee, setMonthlyOrTestFee] = useState(0);
  const [hostelFee, setHostelFee] = useState(0);
  const [editingId, setEditingId] = useState(null);

  const queryClient = useQueryClient();

  // 🔹 একাডেমিক ডিভিশন API থেকে লোড
  const { data: academicDivisions } = useQuery({
    queryKey: ["academicDivisions"],
    queryFn: async () => {
      const response = await axios.get("/api/academicDivisions");
      return response.data;
    },
  });

  // 🔹 একাডেমিক ক্লাস API থেকে লোড
  const { data: academicClasses } = useQuery({
    queryKey: ["academicClasses"],
    queryFn: async () => {
      const response = await axios.get("/api/academicClasses");
      return response.data;
    },
  });

  // 🔹 ফি সেটআপ ডাটা API থেকে লোড
  const { data: feeData } = useQuery({
    queryKey: ["feeSetup"],
    queryFn: async () => {
      const response = await axios.get("/api/fee-setup");
      return response.data;
    },
  });

  // 🔹 নতুন ফি সেটআপ মিউটেশন
  const mutation = useMutation({
    mutationFn: async (payload) => {
      if (editingId) {
        return axios.put("/api/fee-setup", { id: editingId, ...payload });
      } else {
        return axios.post("/api/fee-setup", payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["feeSetup"]);
      resetForm();
    },
  });

  // 🔹 ফি সেটআপ ডিলিট করা
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/fee-setup?id=${id}`);
      queryClient.invalidateQueries(["feeSetup"]);
    } catch (error) {
      console.error("ডিলিটে সমস্যা:", error);
    }
  };

  // 🔹 এডিট মোডে নেওয়া
  const handleEdit = (fee) => {
    setEditingId(fee.id);
    setSelectedDivisionId(fee.academicDivisionId);
    setSelectedPreviousClass(fee.academicClassId);
    setAdmissionFee(fee.admissionFee);
    setMonthlyFee(fee.monthlyFee);
    setFirstTermFee(fee.firstTermFee);
    setSecondTermFee(fee.secondTermFee);
    setAnnualFee(fee.annualFee);
    setMonthlyOrTestFee(fee.monthlyOrTestFee);
    setHostelFee(fee.hostelFee || 0);
  };

  // 🔹 ইনপুট রিসেট করা
  const resetForm = () => {
    setEditingId(null);
    setSelectedDivisionId("");
    setSelectedPreviousClass("");
    setAdmissionFee("");
    setMonthlyFee("");
    setFirstTermFee("");
    setSecondTermFee("");
    setAnnualFee("");
    setMonthlyOrTestFee("");
    setHostelFee("");
  };

  // 🔹 ফিল্টার করা ক্লাস লিস্ট
  const filteredClasses = useMemo(() => {
    return selectedDivisionId
      ? academicClasses?.filter((cls) => cls.academicDivisionId === Number(selectedDivisionId))
      : academicClasses;
  }, [selectedDivisionId, academicClasses]);

  // 🔹 নতুন ফি সেটআপ সাবমিট
  const handleSubmit = async (e) => {
    e.preventDefault();
    mutation.mutate({
      academicDivisionId: Number(selectedDivisionId),
      academicClassId: Number(selectedPreviousClass),
      admissionFee,
      monthlyFee,
      firstTermFee,
      secondTermFee,
      annualFee,
      monthlyOrTestFee,
      hostelFee,
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{editingId ? "ফি আপডেট করুন" : "নতুন ফি সেটআপ করুন"}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select value={selectedDivisionId} onChange={(e) => setSelectedDivisionId(e.target.value)} className="w-full p-3 border rounded">
          <option value="">বিভাগ নির্বাচন করুন</option>
          {academicDivisions?.map((division) => (
            <option key={division.id} value={division.id}>{division.name}</option>
          ))}
        </select>

        <select value={selectedPreviousClass} onChange={(e) => setSelectedPreviousClass(e.target.value)} className="w-full p-3 border rounded">
          <option value="">ক্লাস নির্বাচন করুন</option>
          {filteredClasses?.map((cls) => (
            <option key={cls.id} value={cls.id}>{cls.name}</option>
          ))}
        </select>

        <input 
        type="number" placeholder="ভর্তি ফি" value={admissionFee} 
        onChange={(e) => setAdmissionFee(parseFloat(e.target.value) || 0)} className="w-full p-2 border rounded" />

        <input 
        type="number" placeholder="মাসিক ফি" value={monthlyFee}
        onChange={(e) => setMonthlyFee(parseFloat(e.target.value) || 0)} className="w-full p-2 border rounded" />

        <input 
        type="number" placeholder="প্রথম সাময়িক ফি" value={firstTermFee} 
        onChange={(e) => setFirstTermFee(parseFloat(e.target.value) || 0)} className="w-full p-2 border rounded" />

        <input 
        type="number" placeholder="দ্বিতীয় সাময়িক ফি" value={secondTermFee} 
        onChange={(e) => setSecondTermFee(parseFloat(e.target.value) || 0)} className="w-full p-2 border rounded" />

        <input 
        type="number" placeholder="বার্ষিক ফি" value={annualFee} 
        onChange={(e) => setAnnualFee(parseFloat(e.target.value) || 0)} className="w-full p-2 border rounded" />

        <input 
        type="number" placeholder="মাসিক বা টেস্ট পরিক্ষা ফি" value={monthlyOrTestFee} 
        onChange={(e) => setMonthlyOrTestFee(parseFloat(e.target.value) || 0)} className="w-full p-2 border rounded" />

        <input 
        type="number" placeholder="রুম ফি" value={hostelFee} 
        onChange={(e) => setHostelFee(parseFloat(e.target.value) || 0)} className="w-full p-2 border rounded" />

        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">{mutation.isLoading ? "লোড হচ্ছে..." : (editingId ? "আপডেট করুন" : "সংরক্ষণ করুন")}</button>
      </form>

      {/* ফি ডেটা প্রদর্শন করা */}
      {feeData?.length > 0 && (
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">বিভাগ</th>
                <th className="px-4 py-2 border">ক্লাস</th>
                <th className="px-4 py-2 border">ভর্তি ফি</th>
                <th className="px-4 py-2 border">মাসিক ফি</th>
                <th className="px-4 py-2 border">প্রথম সাময়িক ফি</th>
                <th className="px-4 py-2 border">দ্বিতীয় সাময়িক ফি</th>
                <th className="px-4 py-2 border">বার্ষিক ফি</th>
                <th className="px-4 py-2 border">মাসিক বা টেস্ট পরিক্ষা ফি</th>
                <th className="px-4 py-2 border">রুম ফি</th>
                <th className="px-4 py-2 border">অপশন</th>
              </tr>
            </thead>
            <tbody>
              {feeData.map((fee) => (
                <tr key={fee.id} className="border-b">
                  <td className="px-4 py-2 border">{fee.academicDivision?.name || "নির্ধারিত হয়নি"}</td>
                  <td className="px-4 py-2 border">{fee.academicClass?.name || "নির্ধারিত হয়নি"}</td>
                  <td className="px-4 py-2 border">{fee.admissionFee ? fee.admissionFee : "নির্ধারিত হয়নি"}</td>
                  <td className="px-4 py-2 border">{fee.monthlyFee ? fee.monthlyFee : "নির্ধারিত হয়নি"}</td>
                  <td className="px-4 py-2 border">{fee.firstTermFee ? fee.firstTermFee : "নির্ধারিত হয়নি"}</td>
                  <td className="px-4 py-2 border">{fee.secondTermFee ? fee.secondTermFee : "নির্ধারিত হয়নি"}</td>
                  <td className="px-4 py-2 border">{fee.annualFee ? fee.annualFee : "নির্ধারিত হয়নি"}</td>
                  <td className="px-4 py-2 border">{fee.monthlyOrTestFee ? fee.monthlyOrTestFee : "নির্ধারিত হয়নি"}</td>
                  <td className="px-4 py-2 border">{fee.hostelFee ? fee.hostelFee : "নির্ধারিত হয়নি"}</td>
                  <td className="px-4 py-2 border">
                    <button onClick={() => handleEdit(fee)} className="bg-yellow-500 text-white p-2 rounded">এডিট করুন</button>
                    <button onClick={() => handleDelete(fee.id)} className="bg-red-500 text-white p-2 rounded ml-2">ডিলিট করুন</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
