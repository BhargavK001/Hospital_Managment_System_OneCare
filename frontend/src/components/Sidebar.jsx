import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../images/Logo.png";
import { IoMdSettings } from "react-icons/io";
import {
  FaTachometerAlt,
  FaCalendarAlt,
  FaClinicMedical,
  FaUserInjured,
  FaUserMd,
  FaUsers,
  FaListAlt,
  FaCalendarCheck,
  FaMoneyBill,
  FaFileInvoice
} from "react-icons/fa";

const Sidebar = () => {
  return (
    <div
      className="d-flex flex-column vh-100 p-3"
      style={{
        width: "250px",
        backgroundColor: "#fff",
        borderRight: "1px solid #ddd",
      }}
    >
      {/* Logo side text */}
      <div className="d-flex align-items-center mb-4">
       <img src={logo} alt="Logo" width="30" height="30" />
        <h4 className="m-0 fw-bold text-primary">One Care</h4>
      </div>

      {/* href for sidebar */}
      <ul className="nav nav-pills flex-column">
        <li className="nav-item mb-2">
          <a href="./Admin-dashboard" className="nav-link active d-flex align-items-center gap-2">
            <FaTachometerAlt /> Dashboard
          </a>
        </li>
        <li className="nav-item mb-2">
          <a href="./Appointments" className="nav-link text-primary d-flex align-items-center gap-2">
            <FaCalendarAlt /> Appointments
          </a>
        </li>
        <li className="nav-item mb-2">
          <a href="#./Encounters" className="nav-link text-primary d-flex align-items-center gap-2">
            <FaCalendarCheck /> Encounters
          </a>
        </li>
        <li className="nav-item mb-2">
          <a href="./Clinic" className="nav-link text-primary d-flex align-items-center gap-2">
            <FaClinicMedical /> Clinic
          </a>
        </li>
        <li className="nav-item mb-2">
          <a href="./Patients" className="nav-link text-primary d-flex align-items-center gap-2">
            <FaUserInjured /> Patients
          </a>
        </li>
        <li className="nav-item mb-2">
          <a href="./Doctors" className="nav-link text-primary d-flex align-items-center gap-2">
            <FaUserMd /> Doctors
          </a>
        </li>
        <li className="nav-item mb-2">
          <a href="./Receptionist" className="nav-link text-primary d-flex align-items-center gap-2">
            <FaUsers /> Receptionist
          </a>
        </li>
        <li className="nav-item mb-2">
          <a href="./services" className="nav-link text-primary d-flex align-items-center gap-2">
            <FaListAlt /> Services
          </a>
        </li>
        <li className="nav-item mb-2">
          <a href="./Doctor Sessions" className="nav-link text-primary d-flex align-items-center gap-2">
            <FaCalendarCheck /> Doctor Sessions
          </a>
        </li>
        <li className="nav-item mb-2">
          <a href="./Taxes" className="nav-link text-primary d-flex align-items-center gap-2">
            <FaMoneyBill /> Taxes
          </a>
        </li>
        <li className="nav-item mb-2">
          <a href="/BillingRecords" className="nav-link text-primary d-flex align-items-center gap-2">
            <FaFileInvoice /> Billing Records
          </a>
        </li>
        <li className="nav-item mb-2">
          <a href="./Settings" className="nav-link text-primary d-flex align-items-center gap-2">
           <IoMdSettings /> Settings
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
