// src/layouts/PatientLayout.jsx
import React, { useState } from "react";
import PatientSidebar from "../components/PatientSidebar";
import PatientNavbar from "../components/PatientNavbar";

const PatientLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="d-flex patient-layout">
      {/* Sidebar */}
      <PatientSidebar open={sidebarOpen} />

      {/* Main content */}
      <div className="flex-grow-1 d-flex flex-column">
        <PatientNavbar toggleSidebar={toggleSidebar} />
        <main className="patient-main flex-grow-1 p-3">{children}</main>
      </div>
    </div>
  );
};

export default PatientLayout;
