import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../styles/AdminLayout.css";

const AdminLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen((s) => !s);
  const closeSidebar = () => setIsOpen(false);

  
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [isOpen]);

  return (
    <div className="d-flex flex-column">

      <Navbar toggleSidebar={toggleSidebar} />


      <div className={`sidebar-drawer ${isOpen ? "open" : ""}`}>
        <Sidebar />
      </div>


      <div
        className={`backdrop ${isOpen ? "show" : ""}`}
        onClick={closeSidebar}
      />


      <div className="content-container p-4">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
