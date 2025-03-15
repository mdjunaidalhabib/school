"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Cord1 from "../../components/idCordTem/Cord1";
import Cord2 from "../../components/idCordTem/Cord2";
import Cord3 from "../../components/idCordTem/Cord3";
import Cord4 from "../../components/idCordTem/Cord4";


const IdCardPage = () => {
  const [className, setClassName] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("default");

  useEffect(() => {
    if (className) {
      axios
        .get(`/api/students?className=${className}`)
        .then((response) => setStudents(response.data))
        .catch((error) => console.error("Error fetching students:", error));
    }
  }, [className]);

  // টেমপ্লেট সিলেক্ট করলে কম্পোনেন্ট পরিবর্তন হবে
  const getTemplateComponent = () => {
    switch (selectedTemplate) {
      case "Cord2":
        return Cord2;
      case "default":
      default:
        return Cord1;
      case "Cord3":
        return Cord3;
      case "Cord4":
        return Cord4;
    }
  };

  const TemplateComponent = getTemplateComponent();

  return (
    <div>
      <h2>ID Card Generator</h2>

      {/* ক্লাস সিলেক্ট অপশন */}
      <select onChange={(e) => setClassName(e.target.value)}>
        <option value="">Select Class</option>
        <option value="Class 1">Class 1</option>
        <option value="Class 2">Class 2</option>
      </select>

      {/* টেমপ্লেট সিলেক্ট */}
      <select onChange={(e) => setSelectedTemplate(e.target.value)}>
        <option value="Cord1">Default Template</option>
        <option value="Cord2">Cord2</option>
        <option value="Cord3">Cord3</option>
        <option value="Cord4">Cord4</option>
      </select>

      {/* আইডি কার্ড রেন্ডার */}
      <div className="id-card-container">
        {students.map((student) => (
          <TemplateComponent key={student.id} student={student} />
        ))}
      </div>
    </div>
  );
};

export default IdCardPage;
