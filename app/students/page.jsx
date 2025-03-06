"use client";

import { useEffect, useState } from "react";
import Link from 'next/link';

const StudentsList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); // Page state added for pagination
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch(`/api/students?page=${page}`);
        if (!res.ok) {
          throw new Error("Students data could not be fetched");
        }
        const data = await res.json();
        setStudents(data); // Set the students based on the current page
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [page]); // Refetch students when the page changes

  const handleNextPage = () => {
    setPage((prev) => prev + 1); // Increment page number for next page
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1); // Decrement page number for previous page
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">All Students</h1>

      <table className="min-w-full table-auto border-collapse border border-gray-200 mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border-b text-left">ID</th>
            <th className="px-4 py-2 border-b text-left">Admission Year</th>
            <th className="px-4 py-2 border-b text-left">Name</th>
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
              <td className="px-4 py-2">{student.currentClassId}</td>
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

      <div className="flex justify-center gap-4 mr-4">

        <div className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        <button onClick={handlePrevPage} disabled={page === 1}>Previous</button>
        </div>

        <div className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        <button onClick={handleNextPage}>Next</button>
        </div>

      </div>
    </div>
  );
};

export default StudentsList;
