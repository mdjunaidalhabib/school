"use client";

import DivisionSelect from "../../components/DivisionSelect";
import DistrictSelect from "../../components/DistrictSelect";
import ThanaSelect from "../../components/ThanaSelect";
import { useState, useEffect, useRef } from "react";
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import axios from "axios";

const AdmissionForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    arabicName: "",
    nid: "",
    gender: "",
    dob: "",
    age: "",
    phone: "",
    fatherName: "",
    fatherarabicName: "",
    fatherNid: "",
    fatherPhone: "",
    fatherOccupation: "",
    motherName: "",
    motherNid: "",
    motherPhone: "",
    motherOccupation: "",
    village: "",
    imageUrl: "",
  });

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    return age;
  };

  const handleDobChange = (e) => {
    const dobValue = e.target.value;
    const birthDate = new Date(dobValue);
    const today = new Date();

    // বয়স গণনা
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // যদি জন্ম মাস ও দিন না পার হয়ে যায় তাহলে বয়স ১ বছর কমাতে হবে
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    // ফর্মের ডাটা আপডেট করা
    setFormData((prev) => ({
      ...prev,
      dob: dobValue, // জন্ম তারিখ সেট করা
      age: age.toString(), // বয়স সেট করা (string হিসেবে)
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [alert, setAlert] = useState(null);
  const [fade, setFade] = useState(false);
  useEffect(() => {
    console.log("Updated Alert:", alert);

    if (alert) {
      setFade(true); // এলার্ট দেখানোর সময় fade-in

      const timer = setTimeout(() => {
        setFade(false); // fade-out animation trigger
        setTimeout(() => setAlert(null), 500); // এলার্ট remove করার আগে একটু দেরি
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [alert]);

  const [selectedDivision, setSelectedDivision] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedThana, setSelectedThana] = useState(null);

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
        (cls) => cls.academicDivisionId === Number(selectedDivisionId), // একে সংখ্যায় রূপান্তর করেছি
      )
    : academicClasses; // এখন যদি বিভাগ না সিলেক্ট করা হয়, তবে সব ক্লাস দেখাবে

  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedFile(file);

    // Preview image
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadAndSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      alert("Please select an image first!");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Image Upload
      const formDataImage = new FormData();
      formDataImage.append("image", selectedFile);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formDataImage,
      });

      if (!uploadResponse.ok) {
        throw new Error(`HTTP error! status: ${uploadResponse.status}`);
      }

      const uploadData = await uploadResponse.json();
      console.log("Uploaded Image URL:", uploadData.imageUrl);

      // Step 2: Form Submission
      const formattedDob = formData?.dob
        ? new Date(formData.dob).toISOString()
        : null;

      const newFormData = {
        selectedDivisionId: Number(selectedDivisionId),
        selectedPreviousClass: Number(selectedPreviousClass),
        selectedCurrentClass: Number(selectedCurrentClass),
        selectedDivision: Number(selectedDivision),
        selectedDistrict: Number(selectedDistrict),
        selectedThana: Number(selectedThana),
        dob: formattedDob,
        imageUrl: uploadData.imageUrl, // আপলোড করা ইমেজ লিংক যোগ করা হলো
      };

      console.log("✅ ফর্ম সফলভাবে সাবমিট হয়েছে!", newFormData);
      console.log("✅ ফর্ম সফলভাবে সাবমিট হয়েছে!", formData);

      const response = await fetch("/api/admission", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData, // আগের ফর্ম ডাটা
          ...newFormData, // নতুন ফর্ম ডাটা
        }),
      });

      const result = await response.json();
      console.log(result); // এখানে কনসোল লগ করা হবে
      console.log("API Response:", result);

      if (result.success) {
        setAlert({ message: result.message, type: "success" });
        setFormData({
          name: "",
          arabicName: "",
          nid: "",
          gender: "",
          dob: "",
          age: "",
          phone: "",
          academicDivisionId: null,
          previousClassId: null,
          currentClassId: null,
          fatherName: "",
          fatherarabicName: "",
          fatherNid: "",
          fatherPhone: "",
          fatherOccupation: "",
          motherName: "",
          motherNid: "",
          motherPhone: "",
          motherOccupation: "",
          areaDivisionId: null,
          districtId: null,
          thanaId: null,
          village: "",
          imageUrl: "",
        });

        setSelectedDivision(null);
        setSelectedDistrict(null);
        setSelectedThana(null);
        setSelectedDivisionId(null);
        setSelectedPreviousClass(null);
        setSelectedCurrentClass(null);

        setSelectedFile(null); // Resetting file state
        setPreview(null); // Resetting the preview image
        fileInputRef.current.value = ""; // Resetting the file input field
      } else {
        setAlert({ message: result.message, type: "error" });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setAlert({
        message: "Something went wrong, please try again.",
        type: "error",
      });
    }
  };

  return (
    <div>
      <form
        onSubmit={handleUploadAndSubmit}
        className="space-y-8 p-6 border rounded-lg w-full max-w-6xl mx-auto"
      >
        {/* First Section: Student's Information */}
        <div className="bg-gray-100 px-6 rounded-md">
          <h2 className="text-xl font-semibold mb-4">Student's Information</h2>

          <div className="grid grid-cols-5 gap-4">
            <div
              className="w-48 h-48 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100 bg-cover bg-center"
              style={{
                backgroundImage: `url(${preview || "/upload-placeholder.png"})`,
              }}
              onClick={() => fileInputRef.current.click()}
            >
              {!preview && (
                <span className="text-gray-500">ছবি আপলোড করুন</span>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              className="hidden"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Student's Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Student's Arabic Name
              </label>
              <input
                type="text"
                name="arabicName"
                value={formData.arabicName}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Student's NID{" "}
              </label>
              <input
                type="number"
                name="nid"
                value={formData.nid}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleDobChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Age
              </label>
              <input
                type="text"
                name="age"
                value={formData.age}
                readOnly
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

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
          </div>
        </div>

        {/* Second Section: Parents' Information */}
        <div className="bg-gray-100 px-6 rounded-md mt-6">
          <h2 className="text-xl font-semibold mb-4">Parents' Information</h2>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Father's Name
              </label>
              <input
                type="text"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Father's Arabic Name
              </label>
              <input
                type="text"
                name="fatherarabicName"
                value={formData.fatherarabicName}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Father's NID
              </label>
              <input
                type="text"
                name="fatherNid"
                value={formData.fatherNid}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Father's Phone
              </label>
              <input
                type="text"
                name="fatherPhone"
                value={formData.fatherPhone}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Father's Occupation
              </label>
              <input
                type="text"
                name="fatherOccupation"
                value={formData.fatherOccupation}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mother's Name
              </label>
              <input
                type="text"
                name="motherName"
                value={formData.motherName}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mother's NID
              </label>
              <input
                type="text"
                name="motherNid"
                value={formData.motherNid}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mother's Phone
              </label>
              <input
                type="text"
                name="motherPhone"
                value={formData.motherPhone}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mother's Occupation
              </label>
              <input
                type="text"
                name="motherOccupation"
                value={formData.motherOccupation}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Third Section: Address Information */}
        <div className="bg-gray-100 px-6 rounded-md">
          <h2 className="text-xl font-semibold mb-4">Address Information</h2>
          <div className="grid grid-cols-5 gap-4">
            <div>
              <DivisionSelect
                onSelect={(division) => {
                  setSelectedDivision(division);
                  setSelectedDistrict(""); // বিভাগ পরিবর্তন হলে জেলা খালি হবে
                  setSelectedThana(""); // বিভাগ পরিবর্তন হলে থানা খালি হবে
                }}
              />
            </div>

            <div>
              <DistrictSelect
                divisionId={selectedDivision}
                onSelect={(district) => {
                  setSelectedDistrict(district);
                  setSelectedThana(""); // জেলা পরিবর্তন হলে থানা খালি হবে
                }}
                disabled={!selectedDivision}
                className="w-full p-3 border rounded mb-2"
              />
            </div>

            <div>
              <ThanaSelect
                districtId={selectedDistrict}
                onSelect={setSelectedThana}
                disabled={!selectedDistrict || !selectedDivision} // জেলা সিলেক্ট না করলে ডিজেবল
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                village Name
              </label>
              <input
                type="text"
                name="village"
                value={formData.village}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md"
          >
            Submit
          </button>
        </div>
      </form>

      {alert && (
        <div
          className={`fixed top-4 left-4 right-4 p-1 rounded-md text-center text-white shadow-md transition-all duration-500 ${fade ? "opacity-100" : "opacity-0"} ${
            alert?.type?.toLowerCase() === "success"
              ? "bg-green-500"
              : "bg-red-500"
          }`}
        >
          {alert.message}
        </div>
      )}
    </div>
  );
};

export default AdmissionForm;
