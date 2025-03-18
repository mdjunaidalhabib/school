"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const StudentsList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [totalStudents, setTotalStudents] = useState(0);
  const [classId, setClassId] = useState("all"); // Default "All Students"
  const [studentId, setStudentId] = useState("");
  const [academicClasses, setAcademicClasses] = useState([]); // State for classes
  const studentsPerPage = 10;
  const [alertMessage, setAlertMessage] = useState("");
  const [totalPages, setTotalPages] = useState(1); // Added state for total pages

  useEffect(() => {
    // Load classes for the class dropdown
    const fetchClasses = async () => {
      try {
        const res = await fetch("/api/academicClasses");
        const data = await res.json();
        setAcademicClasses(data);
      } catch (err) {
        console.error("Error fetching classes:", err);
      }
    };

    fetchClasses();
  }, []);
  

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        let query = `/api/students?page=${page}&limit=${studentsPerPage}`;

        if (classId && classId !== "all") query += `&classId=${classId}`;
        if (studentId && studentId.trim() !== "")
          query += `&studentId=${studentId}`;

        const res = await fetch(query);
        if (!res.ok) throw new Error("Students data could not be fetched");

        const data = await res.json();
        setStudents(data.students);
        setTotalStudents(data.total);
        setTotalPages(Math.ceil(data.total / studentsPerPage));
        if (
          (studentId && data.students.length === 0) ||
          (classId !== "all" && data.students.length === 0)
        ) {
          setAlertMessage(`No student found with ID: ${studentId}`);
        } else {
          setAlertMessage(""); // Clear the alert if students found
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [page, classId, studentId, studentsPerPage]);

  const handleNextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Alert section */}
      {alertMessage && (
        <div className="bg-red-100 text-red-700 p-4 mb-4 rounded-lg flex items-center">
          <span className="material-icons mr-3">warning</span>
          <p className="font-semibold">{alertMessage}</p>
        </div>
      )}

      <div className="flex gap-4 mb-6">
        {/* Class Select */}
        <select
          value={classId}
          onChange={(e) => {
            setClassId(e.target.value);
            setStudentId(""); // Reset student ID when class changes
          }}
          disabled={!!studentId} // Disable class select when student ID is provided
          className="p-2 border rounded"
        >
          <option value="all">All Students</option>
          {academicClasses.map((classItem) => (
            <option key={classItem.id} value={classItem.id}>
              {classItem.name}
            </option>
          ))}
        </select>

        {/* Student ID Input */}
        <input
          type="number"
          value={studentId}
          onChange={(e) => {
            setStudentId(e.target.value);
            setClassId("all"); // Reset class to "All Students"
          }}
          disabled={classId !== "all"} // Disable input when class is selected
          placeholder="Enter Student ID"
          className="p-2 border rounded"
        />
      </div>

      {/* Total Students Display */}
      <div className="bg-blue-100 text-blue-700 text-center p-4 rounded-lg mb-6">
        <h2 className="text-2xl font-semibold">
          Total Students: {totalStudents}
        </h2>
      </div>

      <h1 className="text-2xl font-bold mb-4">All Students</h1>

      <div className="relative">
        {/* Table with loading overlay */}
        <table className="min-w-full table-auto border-collapse border border-gray-200 mb-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border-b text-left">ID</th>
              <th className="px-4 py-2 border-b text-left">Admission Year</th>
              <th className="px-4 py-2 border-b text-left">Name</th>
              <th className="px-4 py-2 border-b text-left">Division</th>
              <th className="px-4 py-2 border-b text-left">Current Class</th>
              <th className="px-4 py-2 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-b">
                <td className="px-4 py-2">{student.id}</td>
                <td className="px-4 py-2">{student.createdAt}</td>
                <td className="px-4 py-2">{student.name}</td>
                <td className="px-4 py-2">
                  {student.academicDivision?.name || "N/A"}
                </td>
                <td className="px-4 py-2">
                  {student.currentClass?.name || "N/A"}
                </td>
                <td className="px-4 py-2">
                  <Link href={`/students/${student.id}`}>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                      View Details
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-gray-500 opacity-50 flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-4 mr-4">
        <button
          onClick={handlePrevPage}
          disabled={page === 1}
          className={`px-4 py-2 rounded ${page === 1 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"} text-white`}
        >
          Previous
        </button>

        <button
          onClick={handleNextPage}
          disabled={page >= totalPages}
          className={`px-4 py-2 rounded ${page === totalPages ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"} text-white`}
        >
          Next
        </button>
      </div>

      {/* Current Page Display */}
      <div className="text-center mt-4">
        <p className="text-lg font-semibold">
          Page {page} of {totalPages}
        </p>
      </div>
    </div>
  );
};

export default StudentsList;
