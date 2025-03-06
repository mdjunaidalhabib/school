"use client";

import EditIcon from '@mui/icons-material/Edit';
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";

// একাডেমিক ডিভিশন এডিট এবং ডিলিট ফিচার
const AcademicDivisionManagement = () => {
  const [newDivisionName, setNewDivisionName] = useState('');
  const [editingDivisionId, setEditingDivisionId] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [previousName, setPreviousName] = useState('');

  // একাডেমিক ডিভিশন এর ডেটা ফেচ
  const { data: divisions, refetch, isError, error } = useQuery({
    queryKey: ['academicDivisions'],
    queryFn: async () => {
      try {
        const response = await axios.get('/api/academicDivisions');
        return response.data;
      } catch (err) {
        throw new Error('ডিভিশনগুলি লোড করতে সমস্যা হয়েছে');
      }
    },
  });

  // নতুন ডিভিশন তৈরি করার জন্য মিউটেশন
  const createDivisionMutation = useMutation({
    mutationFn: async (name) => {
      try {
        await axios.post('/api/academicDivisions', { name });
      } catch (err) {
        throw new Error('ডিভিশন তৈরি করতে সমস্যা হয়েছে');
      }
    },
    onSuccess: () => {
      refetch();
      setNewDivisionName('');
    },
    onError: (error) => {
      alert(error.message); // API Error alert
    }
  });

  // ডিভিশন এডিট করার জন্য মিউটেশন
  const editDivisionMutation = useMutation({
    mutationFn: async (data) => {
      try {
        await axios.put(`/api/academicDivisions/${data.id}`, data);
      } catch (err) {
        throw new Error('ডিভিশন আপডেট করতে সমস্যা হয়েছে');
      }
    },
    onSuccess: () => {
      refetch();
      setEditingDivisionId(null);
      setEditedName('');
    },
    onError: (error) => {
      alert(error.message); // API Error alert
    }
  });

  // ডিভিশন ডিলিট করার জন্য মিউটেশন
  const deleteDivisionMutation = useMutation({
    mutationFn: async (id) => {
      try {
        await axios.delete(`/api/academicDivisions/${id}`);
      } catch (err) {
        throw new Error('ডিভিশন মুছে ফেলতে সমস্যা হয়েছে');
      }
    },
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      alert(error.message); // API Error alert
    }
  });

  const handleCreateDivision = () => {
    if (newDivisionName) {
      createDivisionMutation.mutate(newDivisionName);
    }
  };

  const handleEditDivision = (id, newName) => {
    setEditingDivisionId(id);
    setPreviousName(newName); // Save the original name before editing
    setEditedName(newName); // Set the current division name to be edited
  };

  const handleSaveEdit = () => {
    if (editedName) {
      editDivisionMutation.mutate({ id: editingDivisionId, name: editedName });
    }
  };

  const handleCancelEdit = () => {
    // Revert to the previous name and exit edit mode
    setEditingDivisionId(null);  // Exit edit mode
    setEditedName(previousName); // Revert to the original name
  };

  const handleDeleteDivision = (id) => {
    if (window.confirm("আপনি কি নিশ্চিত যে এই ডিভিশনটি মুছে ফেলতে চান?")) {
      deleteDivisionMutation.mutate(id);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">একাডেমিক ডিভিশন ম্যানেজমেন্ট</h1>
      
      {/* নতুন ডিভিশন তৈরি করার ফর্ম */}
      <div className="mb-4">
        <input 
          type="text"
          value={newDivisionName}
          onChange={(e) => setNewDivisionName(e.target.value)}
          className="w-full p-3 border rounded mb-2"
          placeholder="নতুন একাডেমিক ডিভিশন নাম"
        />
        <button 
          onClick={handleCreateDivision}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          তৈরি করুন
        </button>
      </div>
      
      {/* একাডেমিক ডিভিশন লিস্ট */}
      <div>
        <h2 className="text-xl font-bold mb-4">ডিভিশনসমূহ</h2>
        {isError && <div className="text-red-500 mb-4">{error.message}</div>} {/* Error message */}
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2">নাম</th>
              <th className="border p-2">অপারেশন</th>
            </tr>
          </thead>
          <tbody>
            {divisions?.map((division) => (
              <tr key={division.id}>
                <td className="border p-2">
                  {editingDivisionId === division.id ? (
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="p-2 border rounded"
                    />
                  ) : (
                    <div className="flex items-center">
                      {division.name}
                      {/* Edit Icon */}
                      <button 
                        onClick={() => handleEditDivision(division.id, division.name)}
                        className="ml-2 text-blue-500"
                      >
                        <EditIcon />
                      </button>
                    </div>
                  )}
                </td>
                <td className="border p-2">
                  {editingDivisionId === division.id ? (
                    <div className="flex space-x-2">
                      <button 
                        onClick={handleSaveEdit}
                        className="px-2 py-1 bg-green-500 text-white rounded"
                      >
                        সেভ
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-2 py-1 bg-gray-500 text-white rounded"
                      >
                        ক্যান্সেল
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleDeleteDivision(division.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded"
                    >
                      ডিলিট
                    </button>
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

export default AcademicDivisionManagement;
