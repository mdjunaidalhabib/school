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
    firstTermFee: "",
    secondTermFee: "",
    annualFee: "",
    monthlyTermFee: "",
    otherFee: "",
    otherFee: "",
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
    const firstTermFee = selectedFees.includes("firstTermFee")
      ? parseFloat(formData.firstTermFee) || 0
      : 0;

    const secondTermFee = selectedFees.includes("secondTermFee")
      ? parseFloat(formData.secondTermFee) || 0
      : 0;

    const annualFee = selectedFees.includes("annualFee")
      ? parseFloat(formData.annualFee) || 0
      : 0;

    const monthlyTermFee = selectedFees.includes("monthlyTermFee")
      ? parseFloat(formData.monthlyTermFee) || 0
      : 0;

    const hostelFee = selectedFees.includes("hostelFee")
      ? parseFloat(formData.hostelFee) || 0
      : 0;

    const otherFee = selectedFees.includes("otherFee")
      ? parseFloat(formData.otherFee) || 0
      : 0;

    const discount = parseFloat(formData.discount) || 0;

    const total =
      admissionFee +
      monthlyFee +
      firstTermFee +
      secondTermFee +
      annualFee +
      monthlyTermFee +
      hostelFee +
      otherFee -
      discount;
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
          `/api/student-fee/${studentId}`
        );
        setStudent(studentResponse.data);

        // ✅ স্টুডেন্টের ডিভিশন ও ক্লাস অনুযায়ী ফি সেটআপ লোড করা
        const feeResponse = await axios.get(
          `/api/fee-setup?division=${studentResponse.data.academicDivisionId}&class=${studentResponse.data.currentClassId}`
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
        (fee) => fee.academicClassId === student.currentClassId
      );

      if (matchedFee) {
        console.log("Matched Fee Setup:", matchedFee);

        setFormData((prev) => ({
          ...prev,
          admissionFee: matchedFee.admissionFee || "",
          monthlyFee: matchedFee.monthlyFee || "",
          firstTermFee: matchedFee.firstTermFee || "",
          secondTermFee: matchedFee.secondTermFee || "",
          annualFee: matchedFee.annualFee || "",
          monthlyTermFee: matchedFee.monthlyTermFee || "",
          hostelFee: matchedFee.hostelFee || "",
          otherFee: matchedFee.otherFee || "",
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
        filteredData
      );

      if (response.data.success) {
        setMessage("✅ Student Fee Added Successfully!");
        setFormData({
          studentId: "",
          admissionFee: "",
          monthlyFee: "",
          firstTermFee: "",
          secondTermFee: "",
          annualFee: "",
          monthlyTermFee: "",
          otherFee: "",
          otherFee: "",
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
                  id="admissionFee"
                  type="checkbox"
                  name="admissionFee"
                  value="admissionFee"
                  onChange={() => handleFeeSelection("admissionFee")}
                  checked={selectedFees.includes("admissionFee")}
                />
                <label htmlFor="admissionFee" className="ml-2">
                  Admission Fee
                </label>
              </div>
              <div>
                <input
                  id="monthlyFee"
                  type="checkbox"
                  name="monthlyFee"
                  value="monthlyFee"
                  onChange={() => handleFeeSelection("monthlyFee")}
                  checked={selectedFees.includes("monthlyFee")}
                />
                <label htmlFor="monthlyFee" className="ml-2">
                  Monthly Fee
                </label>
              </div>
              <div>
                <input
                  id="firstTermFee"
                  type="checkbox"
                  name="firstTermFee"
                  value="firstTermFee"
                  onChange={() => handleFeeSelection("firstTermFee")}
                  checked={selectedFees.includes("firstTermFee")}
                />
                <label htmlFor="firstTermFee" className="ml-2">
                  firstTermFee
                </label>
              </div>
              <div>
                <input
                  id="secondTermFee"
                  type="checkbox"
                  name="secondTermFee"
                  value="secondTermFee"
                  onChange={() => handleFeeSelection("secondTermFee")}
                  checked={selectedFees.includes("secondTermFee")}
                />
                <label htmlFor="secondTermFee" className="ml-2">
                  secondTermFee
                </label>
              </div>
              <div>
                <input
                  id="annualFee"
                  type="checkbox"
                  name="annualFee"
                  value="annualFee"
                  onChange={() => handleFeeSelection("annualFee")}
                  checked={selectedFees.includes("annualFee")}
                />
                <label htmlFor="annualFee" className="ml-2">
                  annualFee
                </label>
              </div>

              <div>
                <input
                  id="monthlyTermFee"
                  type="checkbox"
                  name="monthlyTermFee"
                  value="monthlyTermFee"
                  onChange={() => handleFeeSelection("monthlyTermFee")}
                  checked={selectedFees.includes("monthlyTermFee")}
                />
                <label htmlFor="monthlyTermFee" className="ml-2">
                  monthlyTermFee
                </label>
              </div>
              <div>
                <input
                  id="hostelFee"
                  type="checkbox"
                  name="hostelFee"
                  value="hostelFee"
                  onChange={() => handleFeeSelection("hostelFee")}
                  checked={selectedFees.includes("hostelFee")}
                />
                <label htmlFor="hostelFee" className="ml-2">
                  Hostel Fee
                </label>
              </div>
              <div>
                <input
                  id="otherFee"
                  type="checkbox"
                  name="otherFee"
                  value="otherFee"
                  onChange={() => handleFeeSelection("otherFee")}
                  checked={selectedFees.includes("otherFee")}
                />
                <label htmlFor="otherFee" className="ml-2">
                  otherFee
                </label>
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
                  disabled
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
                  disabled
                />
              </div>
            )}

            {selectedFees.includes("firstTermFee") && (
              <div className="mb-4">
                <label className="block text-sm font-medium">
                  firstTermFee:
                </label>
                <input
                  type="number"
                  name="firstTermFee"
                  value={formData.firstTermFee}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  disabled
                />
              </div>
            )}

            {selectedFees.includes("secondTermFee") && (
              <div className="mb-4">
                <label className="block text-sm font-medium">
                  secondTermFee:
                </label>
                <input
                  type="number"
                  name="secondTermFee"
                  value={formData.secondTermFee}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  disabled
                />
              </div>
            )}

            {selectedFees.includes("annualFee") && (
              <div className="mb-4">
                <label className="block text-sm font-medium">annualFee:</label>
                <input
                  type="number"
                  name="annualFee"
                  value={formData.annualFee}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  disabled
                />
              </div>
            )}

            {selectedFees.includes("monthlyTermFee") && (
              <div className="mb-4">
                <label className="block text-sm font-medium">
                  monthlyTermFee:
                </label>
                <input
                  type="number"
                  name="monthlyTermFee"
                  value={formData.monthlyTermFee}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  disabled
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
                  disabled
                />
              </div>
            )}

            {selectedFees.includes("otherFee") && (
              <div className="mb-4">
                <label className="block text-sm font-medium">otherFee:</label>
                <input
                  type="number"
                  name="otherFee"
                  value={formData.otherFee}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  disabled
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
                className="w-full px-3 py-2 border-2 border-sky-300 rounded-md focus:outline-sky-500"
              />
            </div>

            {/* মোট ফি */}
            <div className="mb-4">
              <label className="block text-sm font-medium">Total Fee:</label>
              <input
                type="number"
                name="totalFee"
                value={calculateTotalFee()}
                disabled
                className="w-full px-3 py-2 border rounded-md bg-gray-100"
              />
            </div>

            {/* সাবমিট বাটন */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="text-white py-2 px-4 rounded-md bg-blue-600 text-white hover:bg-indigo-600"
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
