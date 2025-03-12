"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function StudentProfile() {
  const params = useParams();
  const id = params?.id;
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState(""); 
  const [alertType, setAlertType] = useState(""); 
  const [alert, setAlert] = useState(null);
  const [fade, setFade] = useState(false);

  const [editedData, setEditedData] = useState({
    name: "",
    email: "",
    phone: "",
    // add other fields here
  });

  const [editableField, setEditableField] = useState(null); // Track the editable field
  const [editMode, setEditMode] = useState(false);

  // Fetch student data once the component is mounted
  useEffect(() => {
    if (!id) return;

    axios
      .get(`/api/students/${id}`)
      .then((response) => {
        if (response.data) {
          setStudent(response.data);
          setEditedData(response.data); 
        }
      })
      .catch((error) => console.error("Error fetching student:", error))
      .finally(() => setLoading(false));
  }, [id]);

  // Handle change in editable fields
  const handleChange = (key, value) => {
    setEditedData({
      ...editedData,
      [key]: value,
    });
  };

  // Handle alert fade-in and fade-out
  useEffect(() => {
    if (alertMessage) {
      setFade(true);

      const timer = setTimeout(() => {
        setFade(false);
        setTimeout(() => setAlert(null), 500); 
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  // Handle save action
const handleSave = (field) => {
  const updatedField = { [field.toLowerCase()]: editedData[field.toLowerCase()] }; // শুধুমাত্র পরিবর্তিত ফিল্ড পাঠানো হবে

  axios
    .put(`/api/students/${id}`, updatedField) 
    .then((response) => {
      setStudent((prevStudent) => ({
        ...prevStudent,
        ...updatedField, // আপডেট হওয়া ডাটা সেট করা
      }));
      setAlertMessage(`${field} updated successfully.`);
      setAlertType("success");
      setEditableField(null);
      setEditMode(false);

           // Alert মুছে ফেলার জন্য টাইমার সেট করা
      setTimeout(() => {
        setAlertMessage("");
      }, 3000);

    })

    
    .catch((error) => {
      console.error("Error updating student:", error);
      setAlertMessage("Failed to update student.");
      setAlertType("error");
    });
};


  // Handle cancel action
  const handleCancel = () => {
    setEditedData(student);
    setEditMode(false);
    setEditableField(null);
  };

  // Handle delete action
  const handleDelete = () => {
    axios
      .delete(`/api/students/${id}`)
      .then((response) => {
        setAlertMessage("Student deleted successfully.");
        setAlertType("success");
      })
      .catch((error) => {
        setAlertMessage("Failed to delete student.");
        setAlertType("error");
      });
  };

  if (loading) return <p>Loading...</p>;

  if (!student) return <p className="text-center text-red-500">Student not found</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Student Profile</h2>

      {alertMessage && (
        <div
          className={`fixed top-4 left-4 right-4 p-1 rounded-md text-center text-white shadow-md transition-all duration-500 ${
            fade ? "opacity-100" : "opacity-0"
          } ${alertType === "success" ? "bg-green-500" : "bg-red-500"}`}
        >
          {alertMessage}
        </div>
      )}

      <div className="border p-4 rounded-lg shadow">
        <div className="flex justify-end">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 mt-4">


          {student.name && (
            <div className="flex items-center justify-between mb-3">
              <label className="font-semibold capitalize">Name:</label>
              <div className="flex items-center">
                {editableField === "name" ? (
                  <input
                    type="text"
                    value={editedData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="border p-2 rounded-md"
                  />
                ) : (
                  <span>{student.name}</span>
                )}
                {editMode && editableField !== "name" && (
                  <FaEdit
                    className="ml-2 text-blue-500 cursor-pointer"
                    onClick={() => setEditableField("name")}
                  />
                )}
              </div>
              {editableField === "name" && (
                <div className="flex items-center ml-2">
                  <button
                    className="bg-green-500 text-white px-4 py-1 rounded-md"
                    onClick={() => handleSave("Name")}
                  >
                    Save
                  </button>
                  <button
                    className="bg-gray-500 text-white px-4 py-1 rounded-md ml-2"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}





          {student.phone && (
            <div className="flex items-center justify-between mb-3">
              <label className="font-semibold capitalize">Phone:</label>
              <div className="flex items-center">
                {editableField === "phone" ? (
                  <input
                    type="text"
                    value={editedData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="border p-2 rounded-md"
                  />
                ) : (
                  <span>{student.phone}</span>
                )}
                {editMode && editableField !== "phone" && (
                  <FaEdit
                    className="ml-2 text-blue-500 cursor-pointer"
                    onClick={() => setEditableField("phone")}
                  />
                )}
              </div>
              {editableField === "phone" && (
                <div className="flex items-center ml-2">
                  <button
                    className="bg-green-500 text-white px-4 py-1 rounded-md"
                    onClick={() => handleSave("Phone")}
                  >
                    Save
                  </button>
                  <button
                    className="bg-gray-500 text-white px-4 py-1 rounded-md ml-2"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

        <div className="flex justify-end mt-4">
     <button
  className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
  onClick={() => {
    setEditMode(true);
    setEditableField(null); // নিশ্চিত করা যেন আগে কোনো ফিল্ড খোলা না থাকে
  }}
>
  Edit
</button>

        </div>
      </div>
    </div>
  );
}
