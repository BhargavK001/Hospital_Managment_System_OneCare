// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

/* Auth */
import Signup from "./auth/Signup";
import Login from "./auth/Login";

/* Admin */
import AdminDashboard from "./admin/Admin-dashboard";
import AddPatient from "./admin/AddPatient";
import Patients from "./admin/Patients";
import Doctors from "./admin/Doctors";
import AddDoctor from "./admin/AddDoctor";
import Appointment from "./admin/Appointments";
import BillingRecords from "./admin/BillingRecords";  
import AddBill from "./admin/AddBill";
import EditBill from "./admin/EditBill";
import Services from "./admin/Services";

/* User (if you use it) */
import UserDashboard from "./user/User-dashboard";

/* Doctor */
import DoctorDashboard from "./doctor/Doctordashboard";
import DoctorPatients from "./doctor/DoctorPatients";
import DoctorAppointments from "./doctor/DoctorAppointments";
import DoctorServices from "./doctor/DoctorServices";

/* Patient */
import PatientDashboard from "./Patient/Patient-Dashboard";
import PatientAppointments from "./Patient/PatientAppointments";
import PatientBookAppointment from "./Patient/PatientBookAppointment";

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Admin main dashboards */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />

        {/* Admin – Patients */}
        <Route path="/patients" element={<Patients />} />
        {/* keep this because earlier code used navigate("/Patients") */}
        <Route path="/Patients" element={<Patients />} />
        <Route path="/AddPatient" element={<AddPatient />} />

        {/* Admin – Doctors */}
        <Route path="/Doctors" element={<Doctors />} />
        <Route path="/AddDoctor" element={<AddDoctor />} />

        {/* Admin – Appointments / billing / services / settings */}
        <Route path="/Appointments" element={<Appointment />} />
       

        {/* Doctor section */}
        
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
       
        <Route
          path="/doctor-dashboard"
          element={<Navigate to="/doctor/dashboard" replace />}
        />
        <Route path="/doctor/patients" element={<DoctorPatients />} />
        <Route path="/doctor/patients/:id" element={<DoctorPatients />} />
        <Route path="/doctor/appointments" element={<DoctorAppointments />} />
        <Route path="/doctor/appointments/:id" element={<DoctorAppointments />} />
        <Route path="/doctor/services" element={<DoctorServices />} />
        <Route path="/doctor/services/:id" element={<DoctorServices />} />

        {/* Patient section */}
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/patient/appointments" element={<PatientAppointments />} />
        <Route path="/patient/book" element={<PatientBookAppointment />} />

        {/*Billing section */}
        <Route path="/BillingRecords" element={<BillingRecords />} />
        <Route path="/AddBill" element={<AddBill />} />
        <Route path="/EditBill/:id" element={<EditBill />} />
        
          {/*Service section */}
          <Route path="/services" element={<Services />} />

        {/* Optional: default/fallback route – send unknown URLs to login or any page you want */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
