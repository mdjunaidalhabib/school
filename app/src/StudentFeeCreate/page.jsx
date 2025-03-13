"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function StudentFeeCreate() {
  const [studentId, setStudentId] = useState("");
  const [student, setStudent] = useState(null);
  const [feeSetup, setFeeSetup] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    studentId: "",
    admissionFee: "",
    monthlyFee: "",
    examFee: "",
    hostelFee: "",
    discount: "",
    totalFee: "",
  });
  const [selectedFees, setSelectedFees] = useState([]);

  // চেকবক্স সিলেক্ট করা
  const handleFeeSelection = (feeType) => {
    setSelectedFees((prevSelectedFees) => {
      if (prevSelectedFees.includes(feeType)) {
        return prevSelectedFees.filter((item) => item !== feeType); // সিলেক্ট করা ফি ডিলিট হবে
      } else {
        return [...prevSelectedFees, feeType]; // নতুন ফি অ্যাড হবে
      }
    });
  };

  // ✅ Input Field Change Handle করা
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "studentId") {
      setStudentId(value);
    }
  };

  // মোট টাকা ক্যালকুলেট করার ফাংশন
  const calculateTotalFee = () => {
    const admissionFee = selectedFees.includes("admissionFee")
      ? parseFloat(formData.admissionFee) || 0
      : 0;
    const monthlyFee = selectedFees.includes("monthlyFee")
      ? parseFloat(formData.monthlyFee) || 0
      : 0;
    const examFee = selectedFees.includes("examFee")
      ? parseFloat(formData.examFee) || 0
      : 0;
    const hostelFee = selectedFees.includes("hostelFee")
      ? parseFloat(formData.hostelFee) || 0
      : 0;
    const discount = parseFloat(formData.discount) || 0;

    const total = admissionFee + monthlyFee + examFee + hostelFee - discount;
    return total.toFixed(2);
  };

  // ✅ Student Data & Fee Setup Fetch করার জন্য useEffect
  useEffect(() => {
    const fetchStudentData = async () => {
      if (!studentId) {
        setStudent(null);
        setFeeSetup([]);
        return;
      }

      setLoading(true);
      setMessage("");

      try {
        // ✅ স্টুডেন্টের তথ্য লোড করা
        const studentResponse = await axios.get(
          `/api/student-fee/${studentId}`,
        );
        setStudent(studentResponse.data);

        // ✅ স্টুডেন্টের ডিভিশন ও ক্লাস অনুযায়ী ফি সেটআপ লোড করা
        const feeResponse = await axios.get(
          `/api/fee-setup?division=${studentResponse.data.academicDivisionId}&class=${studentResponse.data.currentClassId}`,
        );

        if (feeResponse.data.length > 0) {
          setFeeSetup(feeResponse.data);
        } else {
          setFeeSetup([]);
          setMessage("⚠️ Fee setup not found for this student.");
        }
      } catch (error) {
        setStudent(null);
        setFeeSetup([]);
        setMessage("❌ Student not found");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
    setSelectedFees([]);
  }, [studentId]);

  // ✅ Fee Setup থেকে ফি ইনপুট ফিল্ডে অটো সেট করার জন্য useEffect
  useEffect(() => {
    if (feeSetup.length > 0 && student) {
      // ✅ Student এর currentClassId অনুযায়ী সঠিক ফি খুঁজে বের করা
      const matchedFee = feeSetup.find(
        (fee) => fee.academicClassId === student.currentClassId,
      );

      if (matchedFee) {
        console.log("Matched Fee Setup:", matchedFee);

        setFormData((prev) => ({
          ...prev,
          admissionFee: matchedFee.admissionFee || "",
          monthlyFee: matchedFee.monthlyFee || "",
          examFee: matchedFee.monthlyOrTestFee || "", // ✅ পরীক্ষার ফি
          hostelFee: matchedFee.hostelFee || "",
        }));
      } else {
        console.warn("⚠️ No matching fee setup found!");
      }
    }
  }, [feeSetup, student]);

  // ✅ Form Submit Handle করা
  const handleSubmit = async (e) => {
    e.preventDefault();

    // স্টুডেন্ট আইডি চেক
    if (!student) {
      setMessage("❌ Please enter a valid Student ID");
      return;
    }

    // কোন ফি সিলেক্ট করা হয়নি
    if (selectedFees.length === 0) {
      setMessage("❌ Please select at least one fee type.");
      return;
    }

    setLoading(true);
    setMessage("");

    // শুধু সিলেক্ট করা ফি গুলো নিয়ে ডাটা ফিল্টার করা
    let filteredData = {
      studentId: formData.studentId,
      discount: formData.discount || "0", // ডিসকাউন্ট যদি থাকে
      totalFee: calculateTotalFee(),
    };

    // সিলেক্ট করা ফি গুলোর জন্য ডাটা অ্যাড করা
    selectedFees.forEach((fee) => {
      filteredData[fee] = formData[fee] || "0"; // যদি সিলেক্ট না করা থাকে, "0" ধরা হবে
    });

    console.log("🔹 Submitting Data:", filteredData); // কনসোলে চেক করার জন্য

    try {
      const response = await axios.post(
        "/api/student-fee/create",
        filteredData,
      );

      if (response.data.success) {
        setMessage("✅ Student Fee Added Successfully!");
        setFormData({
          studentId: "",
          admissionFee: "",
          monthlyFee: "",
          examFee: "",
          hostelFee: "",
          discount: "",
          totalFee: "",
        });
        setStudentId("");
        setSelectedFees([]); // সব চেকবক্স আনচেক হয়ে যাবে
      } else {
        setMessage("❌ Failed to Add Fee.");
      }
    } catch (error) {
      console.error("❌ Submission Error:", error);
      setMessage("❌ Error Occurred!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-center mb-4">
        Create Student Fee
      </h2>

      {message && <p className="text-center text-sm mb-3">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Student ID:</label>
          <input
            type="number"
            name="studentId"
            value={studentId}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-200"
          />
        </div>

        {student && (
          <div className="mb-4 p-3 bg-gray-100 rounded">
            <p>
              <strong>Name:</strong> {student.name}
            </p>
            <p>
              <strong>Class:</strong> {student.currentClassId}
            </p>
            <p>
              <strong>Division:</strong> {student.academicDivisionId}
            </p>
          </div>
        )}

        {feeSetup.length > 0 ? (
          <>
            {/* চেকবক্স সিলেকশন */}
            <div className="mb-4">
              <label className="block mb-2">Select Fee Type:</label>
              <div>
                <input
                  type="checkbox"
                  name="admissionFee"
                  value="admissionFee"
                  onChange={() => handleFeeSelection("admissionFee")}
                  checked={selectedFees.includes("admissionFee")}
                />
                <label className="ml-2">Admission Fee</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  name="monthlyFee"
                  value="monthlyFee"
                  onChange={() => handleFeeSelection("monthlyFee")}
                  checked={selectedFees.includes("monthlyFee")}
                />
                <label className="ml-2">Monthly Fee</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  name="examFee"
                  value="examFee"
                  onChange={() => handleFeeSelection("examFee")}
                  checked={selectedFees.includes("examFee")}
                />
                <label className="ml-2">Exam Fee</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  name="hostelFee"
                  value="hostelFee"
                  onChange={() => handleFeeSelection("hostelFee")}
                  checked={selectedFees.includes("hostelFee")}
                />
                <label className="ml-2">Hostel Fee</label>
              </div>
            </div>

            {/* সিলেক্ট করা ফি ইনপুট */}
            {selectedFees.includes("admissionFee") && (
              <div className="mb-4">
                <label className="block text-sm font-medium">
                  Admission Fee:
                </label>
                <input
                  type="number"
                  name="admissionFee"
                  value={formData.admissionFee}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            )}

            {selectedFees.includes("monthlyFee") && (
              <div className="mb-4">
                <label className="block text-sm font-medium">
                  Monthly Fee:
                </label>
                <input
                  type="number"
                  name="monthlyFee"
                  value={formData.monthlyFee}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            )}

            {selectedFees.includes("examFee") && (
              <div className="mb-4">
                <label className="block text-sm font-medium">Exam Fee:</label>
                <input
                  type="number"
                  name="examFee"
                  value={formData.examFee}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            )}

            {selectedFees.includes("hostelFee") && (
              <div className="mb-4">
                <label className="block text-sm font-medium">Hostel Fee:</label>
                <input
                  type="number"
                  name="hostelFee"
                  value={formData.hostelFee}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            )}

            {/* ডিসকাউন্ট */}
            <div className="mb-4">
              <label className="block text-sm font-medium">Discount:</label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            {/* মোট ফি */}
            <div className="mb-4">
              <label className="block text-sm font-medium">Total Fee:</label>
              <input
                type="number"
                name="totalFee"
                value={calculateTotalFee()}
                readOnly
                className="w-full px-3 py-2 border rounded-md bg-gray-100"
              />
            </div>

            {/* সাবমিট বাটন */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded-md"
              >
                Submit Fee
              </button>
            </div>
          </>
        ) : (
          <p>No fee setup found for this student.</p>
        )}
      </form>
    </div>
  );
}
