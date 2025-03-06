"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function StudentProfile() {
  const params = useParams();
  const id = params?.id;
  const [student, setStudent] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState(""); // Alert message state
  const [alertType, setAlertType] = useState(""); // Define alertType state
  const [editableField, setEditableField] = useState(null); // Track which field is editable

  // Fetch student data once the component is mounted
  useEffect(() => {
    if (!id) return;

    axios
      .get(`/api/students/${id}`) // API call
      .then((response) => {
        if (response.data) {
          setStudent(response.data);
          setEditedData(response.data); // Initialize edited data to be the same as student data
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

    const [alert, setAlert] = useState(null);
    const [fade, setFade] = useState(false);
   useEffect(() => {
      if (alertMessage) {
      setFade(true); // এলার্ট দেখানোর সময় fade-in
      
      const timer = setTimeout(() => {
        setFade(false); // fade-out animation trigger
        setTimeout(() => setAlert(null), 500); // এলার্ট remove করার আগে একটু দেরি
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  // Handle save action
  const handleSave = () => {
    axios
      .put(`/api/students/${id}`, { editedData })
      .then((response) => {
        setStudent(editedData); // This ensures the UI updates with the new data
        setAlertMessage("Student updated successfully.");
        setAlertType("success");
        setEditMode(false); // Switch back to view mode
      })
      .catch((error) => {
        console.error("Error updating student:", error);
        setAlertMessage("Failed to update student.");
        setAlertType("error");
      });
  };


  // Handle cancel action
  const handleCancel = () => {
    setEditedData(student); // Revert to original data
    setEditMode(false);
  };

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
        <div className={`fixed top-4 left-4 right-4 p-1 rounded-md text-center text-white shadow-md transition-all duration-500 ${fade ? "opacity-100" : "opacity-0"} ${alertType === "success" ? "bg-green-500" : "bg-red-500"}`}>
          {alertMessage}
        </div>
      )}

      <div className="border p-4 rounded-lg shadow">
        <div className="flex justify-end">
          {!editMode && (
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
              onClick={() => setEditMode(true)}
            >
              Edit
            </button>
          )}
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 mt-4">
          {Object.keys(student).map((key) => {
            if (key === "id") return null; // Skip the "id" field

            const isEditable = editMode && editableField === key; // Only allow editing for the selected field
            return (
              <div key={key} className="flex items-center justify-between mb-3">
                <label className="font-semibold capitalize">{key}:</label>
                <div className="flex items-center">
                  {isEditable ? (
                    <input
                      type="text"
                      value={editedData[key] || ""}
                      onChange={(e) => handleChange(key, e.target.value)}
                      className="border p-2 rounded-md"
                    />
                  ) : (
                    <span>{student[key]}</span>
                  )}
                  {editMode && !isEditable && (
                    <FaEdit
                      className="ml-2 text-blue-500 cursor-pointer"
                      onClick={() => setEditableField(key)} // Set the field to be editable
                    />
                  )}
                </div>
                {isEditable && (
                  <div className="flex items-center ml-2">
                    <button
                      className="bg-green-500 text-white px-4 py-1 rounded-md"
                      onClick={handleSave}
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
            );
          })}
        </div>

        {editMode && !editableField && (
          <div className="flex justify-end mt-4">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
              onClick={handleSave}
            >
              Save All
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded-md"
              onClick={handleCancel}
            >
              Cancel All
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
