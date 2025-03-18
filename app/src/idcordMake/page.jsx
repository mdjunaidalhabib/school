"use client";

import React, { useState, useEffect } from "react";
import Cord1 from "../../components/idCordTem/Cord1";
import Cord2 from "../../components/idCordTem/Cord2";
import Cord3 from "../../components/idCordTem/Cord3";
import Cord4 from "../../components/idCordTem/Cord4";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const templates = { Cord1, Cord2, Cord3, Cord4 };

const IdCardPage = () => {
  const [selectedTemplate, setSelectedTemplate] = useState("Cord1");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [classId, setClassId] = useState("all");
  const [studentId, setStudentId] = useState("");
  const [academicClasses, setAcademicClasses] = useState([]);
  const studentsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);

  // Fetch class list
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await fetch("/api/academicClasses");
        if (!res.ok) throw new Error("Failed to fetch class data");

        const data = await res.json();
        setAcademicClasses(data);
      } catch (err) {
        console.error("Error fetching classes:", err);
      }
    };

    fetchClasses();
  }, []);

  // Fetch students based on filters
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        let query = `/api/students?page=${page}&limit=${studentsPerPage}`;
        if (classId && classId !== "all") query += `&classId=${classId}`;
        if (studentId) query += `&studentId=${studentId}`;

        const res = await fetch(query);
        if (!res.ok) throw new Error("Failed to fetch students");

        const data = await res.json();
        setStudents(data.students);
        setTotalPages(Math.ceil(data.total / studentsPerPage));
      } catch (err) {
        console.error("Error fetching students:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [page, classId, studentId]);

  const TemplateComponent = templates[selectedTemplate];

  const handleDownloadImage = async () => {
    const cardElement = document.getElementById("id-card");
    if (!cardElement) return;

    const canvas = await html2canvas(cardElement);
    const image = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = image;
    link.download = "id-card.png";
    link.click();
  };

  const handleDownloadPDF = async () => {
    const cardElement = document.getElementById("id-card");
    if (!cardElement) return;

    const canvas = await html2canvas(cardElement);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(imgData, "PNG", 10, 10, 90, 120);
    pdf.save("id-card.pdf");
  };

  return (
    <div>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">ID Card Generator</h2>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          {/* Class Filter */}
          <select
            value={classId}
            onChange={(e) => {
              setClassId(e.target.value);
              setStudentId("");
              setPage(1);
            }}
            className="p-2 border rounded"
          >
            <option value="all">All Classes</option>
            {academicClasses.map((classItem) => (
              <option key={classItem.id} value={classItem.id}>
                {classItem.name}
              </option>
            ))}
          </select>

          {/* Student ID Filter */}
          <input
            type="number"
            value={studentId}
            onChange={(e) => {
              setStudentId(e.target.value);
              setClassId("all");
            }}
            placeholder="Enter Student ID"
            className="p-2 border rounded"
          />
        </div>

        {/* Template Selection */}
        <select
          onChange={(e) => setSelectedTemplate(e.target.value)}
          className="p-2 border rounded mb-6"
        >
          {Object.keys(templates).map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>

        {/* Display Students */}
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
          </div>
        ) : students.length === 0 ? (
          <div className="flex justify-center items-center h-32">
            <p className="text-red-500">No students found.</p>
          </div>
        ) : (
          <>
            <div className="mb-12 flex justify-center gap-4">
              <button
                onClick={handleDownloadImage}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-indigo-600"
              >
                Download as Image
              </button>
              <button
                onClick={handleDownloadPDF}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Download as PDF
              </button>
            </div>

            <div id="id-card" className="grid grid-cols-5 gap-4">
              {students.map((student) => (
                <TemplateComponent key={student.id} student={student} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6 gap-4">
                {page > 1 && (
                  <button
                    onClick={() => setPage(page - 1)}
                    className="p-2 border rounded bg-blue-600 text-white hover:bg-indigo-600"
                  >
                    Previous
                  </button>
                )}
                <span className="p-2">
                  Page {page} of {totalPages}
                </span>
                {page < totalPages && (
                  <button
                    onClick={() => setPage(page + 1)}
                    className="p-2 border rounded bg-blue-600 text-white hover:bg-indigo-600"
                  >
                    Next
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default IdCardPage;
