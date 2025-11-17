import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../images/Logo.png";

import {
  FaHome,
  FaTachometerAlt,
  FaCalendarAlt,
  FaClipboardList,
  FaFileInvoice,
  FaChartBar,
} from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";

import "../styles/PatientSidebar.css";

const PatientSidebar = ({ open = true }) => {
  const [encountersOpen, setEncountersOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    isActive
      ? "nav-link active d-flex align-items-center gap-2"
      : "nav-link text-primary d-flex align-items-center gap-2";

  return (
    <div
      className={`patient-sidebar d-flex flex-column vh-100 p-3 ${
        open ? "open" : "closed"
      }`}
      style={{
        backgroundColor: "#fff",
        borderRight: "1px solid #ddd",
      }}
    >
      {/* Brand */}
      <div className="d-flex align-items-center mb-4 patient-brand">
        <img src={logo} alt="Logo" width="30" height="30" />
        {open && (
          <h4 className="m-0 fw-bold text-primary ms-2">OneCare</h4>
        )}
      </div>

      <ul className="nav nav-pills flex-column">
        <li className="nav-item mb-2">
          <NavLink to="/patient/home" className={linkClass}>
            <FaHome />
            {open && <span>Home</span>}
          </NavLink>
        </li>

        <li className="nav-item mb-2">
          <NavLink to="/patient/dashboard" className={linkClass}>
            <FaTachometerAlt />
            {open && <span>Dashboard</span>}
          </NavLink>
        </li>

        <li className="nav-item mb-2">
          <NavLink to="/patient/appointments" className={linkClass}>
            <FaCalendarAlt />
            {open && <span>Appointments</span>}
          </NavLink>
        </li>

        {/* Encounters (with small dropdown like doctor) */}
        <li className="nav-item mb-2">
          <button
            type="button"
            className={`nav-link ${
              open ? "" : "justify-center"
            } d-flex align-items-center gap-2 encounter-toggle`}
            onClick={() => setEncountersOpen((v) => !v)}
            style={{
              border: "none",
              background: "transparent",
              width: "100%",
              textAlign: "left",
            }}
          >
            <FaClipboardList />
            {open && (
              <>
                <span className="flex-grow-1">Encounters</span>
                <span style={{ marginLeft: "auto" }}>
                  {encountersOpen ? "▾" : "▸"}
                </span>
              </>
            )}
          </button>

          <ul
            className={`patient-encounter-submenu list-unstyled ps-3 mt-2 ${
              encountersOpen ? "open" : ""
            }`}
          >
            <li className="mb-1">
              <NavLink
                to="/patient/encounters"
                className={({ isActive }) =>
                  isActive ? "sub-link active" : "sub-link"
                }
              >
                {open ? "Encounter List" : "List"}
              </NavLink>
            </li>
          </ul>
        </li>

        <li className="nav-item mb-2">
          <NavLink to="/patient/billing" className={linkClass}>
            <FaFileInvoice />
            {open && <span>Billing records</span>}
          </NavLink>
        </li>

        <li className="nav-item mb-2">
          <NavLink to="/patient/reports" className={linkClass}>
            <FaChartBar />
            {open && <span>Reports</span>}
          </NavLink>
        </li>

        {/* Optional Settings at bottom */}
        <li className="nav-item mb-2 mt-auto">
          <NavLink to="/patient/settings" className={linkClass}>
            <IoMdSettings />
            {open && <span>Settings</span>}
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default PatientSidebar;
