"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
  const router = useRouter();

  const [editedData, setEditedData] = useState({
    name: "",
    email: "",
    phone: "",
    arabicName: "",
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

    return () => clearTimeout(timer); // ক্লিন আপ ফাংশন
  }
}, [alertMessage]);


  // Handle save action
const handleSave = (field) => {
  const updatedField = {
    [field]: editedData[field],
  };
 // শুধুমাত্র পরিবর্তিত ফিল্ড পাঠানো হবে
    

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
    .then(() => {
      setAlertMessage("Student deleted successfully.");
      setAlertType("success");
      setTimeout(() => {
        router.push("/students"); // রিডাইরেকশন
      }, 2000);
    })
    .catch((error) => {
      setAlertMessage("Failed to delete student.");
      setAlertType("error");
    });
};


if (loading)
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
    </div>
  );


  if (!student)
    return <p className="text-center text-red-500">Student not found</p>;

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
            className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
            onClick={() => {
              setEditMode(true);
              setEditableField(null); // নিশ্চিত করা যেন আগে কোনো ফিল্ড খোলা না থাকে
            }}
          >
            Edit
          </button>

          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 mt-4">

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="font-semibold capitalize">Photo:</label>
              <div className="flex items-center">
                {student.imageUrl ? (
                  <img
                    src={student.imageUrl}
                    alt="Student"
                    className="w-20 h-20 rounded-md object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 flex items-center justify-center rounded-md bg-gray-200 text-gray-600 border">
                    Photo Not Available
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
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
                      onClick={() => handleSave("name")}
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

          <div>
            {student.arabicName && (
              <div className="flex items-center justify-between mb-3">
                <label className="font-semibold capitalize">arabicName:</label>
                <div className="flex items-center">
                  {editableField === "arabicName" ? (
                    <input
                      type="text"
                      value={editedData.arabicName}
                      onChange={(e) =>
                        handleChange("arabicName", e.target.value)
                      }
                      className="border p-2 rounded-md"
                    />
                  ) : (
                    <span>{student.arabicName}</span>
                  )}
                  {editMode && editableField !== "arabicName" && (
                    <FaEdit
                      className="ml-2 text-blue-500 cursor-pointer"
                      onClick={() => setEditableField("arabicName")}
                    />
                  )}
                </div>
                {editableField === "arabicName" && (
                  <div className="flex items-center ml-2">
                    <button
                      className="bg-green-500 text-white px-4 py-1 rounded-md"
                      onClick={() => handleSave("arabicName")}
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

          <div>
            {student.nid && (
              <div className="flex items-center justify-between mb-3">
                <label className="font-semibold capitalize">nid:</label>
                <div className="flex items-center">
                  {editableField === "nid" ? (
                    <input
                      type="text"
                      value={editedData.nid}
                      onChange={(e) => handleChange("nid", e.target.value)}
                      className="border p-2 rounded-md"
                    />
                  ) : (
                    <span>{student.nid}</span>
                  )}
                  {editMode && editableField !== "nid" && (
                    <FaEdit
                      className="ml-2 text-blue-500 cursor-pointer"
                      onClick={() => setEditableField("nid")}
                    />
                  )}
                </div>
                {editableField === "nid" && (
                  <div className="flex items-center ml-2">
                    <button
                      className="bg-green-500 text-white px-4 py-1 rounded-md"
                      onClick={() => handleSave("nid")}
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

        
          <div>
            {student.academicDivisionId && (
              <div className="flex items-center justify-between mb-3">
                <label className="font-semibold capitalize">
                  Academic Division:
                </label>
                <div className="flex items-center">
                  <span>{student.academicDivisionName}</span>{" "}
                </div>
              </div>
            )}
          </div>

          <div>
            {student.currentClassId && (
              <div className="flex items-center justify-between mb-3">
                <label className="font-semibold capitalize">
                  CurrentClass:
                </label>
                <div className="flex items-center">
                  <span>{student.currentClass}</span>{" "}
                </div>
              </div>
            )}
          </div>

          <div>
            {student.previousClassId && (
              <div className="flex items-center justify-between mb-3">
                <label className="font-semibold capitalize">
                  PreviousClass:
                </label>
                <div className="flex items-center">
                  <span>{student.previousClass}</span>{" "}
                </div>
              </div>
            )}
          </div>

          <div>
            {student.areaDivisionId && (
              <div className="flex items-center justify-between mb-3">
                <label className="font-semibold capitalize">
                  areaDivision:
                </label>
                <div className="flex items-center">
                  {editableField === "areaDivisionId" ? (
                    <input
                      type="text"
                      value={editedData.areaDivisionId}
                      onChange={(e) =>
                        handleChange("areaDivisionId", e.target.value)
                      }
                      className="border p-2 rounded-md"
                    />
                  ) : (
                    <span>{student.areaDivision}</span>
                  )}
                  {editMode && editableField !== "areaDivisionId" && (
                    <FaEdit
                      className="ml-2 text-blue-500 cursor-pointer"
                      onClick={() => setEditableField("areaDivisionId")}
                    />
                  )}
                </div>
                {editableField === "areaDivisionId" && (
                  <div className="flex items-center ml-2">
                    <button
                      className="bg-green-500 text-white px-4 py-1 rounded-md"
                      onClick={() => handleSave("areaDivisionId")}
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

          <div>
            {student.districtId && (
              <div className="flex items-center justify-between mb-3">
                <label className="font-semibold capitalize">district:</label>
                <div className="flex items-center">
                  {editableField === "areaDivisionId" ? (
                    <input
                      type="text"
                      value={editedData.districtId}
                      onChange={(e) =>
                        handleChange("districtId", e.target.value)
                      }
                      className="border p-2 rounded-md"
                    />
                  ) : (
                    <span>{student.districtName}</span>
                  )}
                  {editMode && editableField !== "districtId" && (
                    <FaEdit
                      className="ml-2 text-blue-500 cursor-pointer"
                      onClick={() => setEditableField("districtId")}
                    />
                  )}
                </div>
                {editableField === "districtId" && (
                  <div className="flex items-center ml-2">
                    <button
                      className="bg-green-500 text-white px-4 py-1 rounded-md"
                      onClick={() => handleSave("districtId")}
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

          <div>
            {student.thanaId && (
              <div className="flex items-center justify-between mb-3">
                <label className="font-semibold capitalize">thana:</label>
                <div className="flex items-center">
                  {editableField === "areaDivisionId" ? (
                    <input
                      type="text"
                      value={editedData.thanaId}
                      onChange={(e) => handleChange("thanaId", e.target.value)}
                      className="border p-2 rounded-md"
                    />
                  ) : (
                    <span>{student.thanaName}</span>
                  )}
                  {editMode && editableField !== "thanaId" && (
                    <FaEdit
                      className="ml-2 text-blue-500 cursor-pointer"
                      onClick={() => setEditableField("thanaId")}
                    />
                  )}
                </div>
                {editableField === "thanaId" && (
                  <div className="flex items-center ml-2">
                    <button
                      className="bg-green-500 text-white px-4 py-1 rounded-md"
                      onClick={() => handleSave("thanaId")}
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
        </div>

        <div className="flex justify-end mt-4"></div>
      </div>
    </div>
  );
}
