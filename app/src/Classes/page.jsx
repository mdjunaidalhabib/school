"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";

const AcademicClassManagement = () => {
  const [newClassName, setNewClassName] = useState("");
  const [selectedDivisionId, setSelectedDivisionId] = useState("");
  const [editingClassId, setEditingClassId] = useState(null);
  const [editedClassName, setEditedClassName] = useState("");

  // একাডেমিক ডিভিশন লোড করা
  const { data: divisions, refetch: refetchDivisions } = useQuery({
    queryKey: ["academicDivisions"],
    queryFn: async () => {
      const response = await axios.get("/api/academicDivisions");
      return response.data;
    },
  });

  // একাডেমিক ক্লাস লোড করা
  const { data: classes, refetch: refetchClasses } = useQuery({
    queryKey: ["academicClasses"],
    queryFn: async () => {
      const response = await axios.get("/api/academicClasses");
      return response.data;
    },
  });

  // নতুন ক্লাস তৈরি করা
  const createClassMutation = useMutation({
    mutationFn: async (data) => {
      await axios.post("/api/academicClasses", data);
    },
    onSuccess: () => {
      refetchClasses();
      setNewClassName("");
      setSelectedDivisionId("");
    },
  });

  // ক্লাস আপডেট করা
  const editClassMutation = useMutation({
    mutationFn: async (data) => {
      await axios.put(`/api/academicClasses/${data.id}`, data);
    },
    onSuccess: () => {
      refetchClasses();
      setEditingClassId(null);
      setEditedClassName("");
    },
  });

  // ক্লাস ডিলিট করা
  const deleteClassMutation = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`/api/academicClasses/${id}`);
    },
    onSuccess: () => {
      refetchClasses();
    },
  });

  // নতুন ক্লাস তৈরি করার ফাংশন
  const handleCreateClass = () => {
    if (!newClassName || !selectedDivisionId) {
      alert("অনুগ্রহ করে ক্লাসের নাম এবং ডিভিশন নির্বাচন করুন");
      return;
    }
    createClassMutation.mutate({ name: newClassName, academicDivisionId: selectedDivisionId }); // ✅ ঠিক করা হয়েছে
  };

  // ক্লাস এডিট মোড চালু করা
  const handleEditClass = (id, name) => {
    setEditingClassId(id);
    setEditedClassName(name);
  };

  // ক্লাস আপডেট সংরক্ষণ করা
  const handleSaveEditClass = () => {
    if (editedClassName) {
      editClassMutation.mutate({ id: editingClassId, name: editedClassName });
    }
  };

  // ক্লাস এডিট বাতিল করা
  const handleCancelEditClass = () => {
    setEditingClassId(null);
    setEditedClassName("");
  };

  // ক্লাস ডিলিট করা
  const handleDeleteClass = (id) => {
    if (window.confirm("আপনি কি নিশ্চিত যে এই ক্লাসটি মুছে ফেলতে চান?")) {
      deleteClassMutation.mutate(id);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">একাডেমিক ক্লাস ম্যানেজমেন্ট</h1>

      {/* নতুন ক্লাস তৈরি করার ফর্ম */}
      <div className="mb-4">
        <select
          value={selectedDivisionId}
          onChange={(e) => setSelectedDivisionId(e.target.value)}
          className="w-full p-3 border rounded mb-2"
        >
          <option value="">ডিভিশন নির্বাচন করুন</option>
          {divisions?.map((division) => (
            <option key={division.id} value={division.id}>
              {division.name}
            </option>
          ))}
        </select>
        <input
  type="text"
  value={newClassName}
  onChange={(e) => setNewClassName(e.target.value)}
  className="w-full p-3 border rounded mb-2"
  placeholder="নতুন ক্লাস নাম"
  disabled={!selectedDivisionId} // একাডেমিক ডিভিশন না সিলেক্ট করলে ডিজেবল থাকবে
/>
        <button
  onClick={handleCreateClass}
  className={`px-4 py-2 rounded transition ${
    !newClassName || !selectedDivisionId
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-blue-500 hover:bg-blue-600 text-white"
  }`}
  disabled={!newClassName || !selectedDivisionId} // শর্ত অনুযায়ী ডিজেবল
>
  তৈরি করুন
</button>
      </div>

      {/* একাডেমিক ক্লাস লিস্ট */}
      <div>
        <h2 className="text-xl font-bold mb-4">ক্লাসসমূহ</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2">ডিভিশন</th>
              <th className="border p-2">ক্লাস নাম</th>
              <th className="border p-2">অপারেশন</th>
            </tr>
          </thead>
          <tbody>
            {classes?.map((cls) => (
              <tr key={cls.id}>

                <td className="border p-2">
                  {cls.academicDivision?.name || "N/A"} {/* ✅ ঠিক করা হয়েছে */}
                </td>


                <td className="border p-2">
                  {editingClassId === cls.id ? (
                    <input
                      type="text"
                      value={editedClassName}
                      onChange={(e) => setEditedClassName(e.target.value)}
                      className="p-2 border rounded"
                    />
                  ) : (
                    cls.name
                  )}
                </td>




                <td className="border p-2">
                  {editingClassId === cls.id ? (
                    <>
                      <button
                        onClick={handleSaveEditClass}
                        className="px-2 py-1 bg-green-500 text-white rounded mr-2"
                      >
                        সংরক্ষণ
                      </button>
                      <button
                        onClick={handleCancelEditClass}
                        className="px-2 py-1 bg-gray-500 text-white rounded"
                      >
                        বাতিল
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditClass(cls.id, cls.name)}
                        className="px-2 py-1 bg-yellow-500 text-white rounded mr-2"
                      >
                        এডিট
                      </button>
                      <button
                        onClick={() => handleDeleteClass(cls.id)}
                        className="px-2 py-1 bg-red-500 text-white rounded"
                      >
                        ডিলিট
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AcademicClassManagement;
