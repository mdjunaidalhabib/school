"use client";

import { useState, useRef } from "react";

const ImageUpload = () => {

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

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select an image first!");
      return;
    } 

    const formData = new FormData();
    formData.append("image", selectedFile); //   ✅ File object পাঠানো হবে

    setLoading(true);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Uploaded Image URL:", data.imageUrl);

      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <div
        className="w-48 h-48 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100 bg-cover bg-center"
        style={{ backgroundImage: `url(${preview || "/upload-placeholder.png"})` }}
        onClick={() => fileInputRef.current.click()}
      >
        {!preview && <span className="text-gray-500">ছবি আপলোড করুন</span>}
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        ref={fileInputRef}
        className="hidden"
      />

      <button
        onClick={handleUpload}
        className="mt-4 p-2 bg-blue-500 text-white rounded"
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload Image"}
      </button>
    </div>
  );
};

export default ImageUpload;
