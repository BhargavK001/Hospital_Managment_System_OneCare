// src/doctor/Doctor-dashboard.jsx
import React, { useEffect, useState, useRef } from "react";
import DoctorLayout from "../layouts/DoctorLayout";
import "../styles/DoctorDashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaUserInjured,
  FaCalendarAlt,
  FaCalendarCheck,
  FaListAlt,
} from "react-icons/fa";

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const calendarRef = useRef(null);

  const API_BASE = "http://localhost:3001";

  // ---------- STATS ----------
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalAppointments: 0,
    todayAppointments: 0,
    totalServices: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  // ---------- CALENDAR ----------
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [error, setError] = useState(null);

  // doctor info from localStorage (adjust if you store differently)
  const storedDoctor = (() => {
    try {
      return JSON.parse(localStorage.getItem("doctor") || "null");
    } catch {
      return null;
    }
  })();

  // this string is used to filter appointments by doctorName on backend
  const doctorName =
    storedDoctor?.name ||
    (storedDoctor?.firstName
      ? `${storedDoctor.firstName} ${storedDoctor.lastName || ""}`
      : "") ||
    "";

  // ---------- helper: "04-Nov-2025" + "4:30 pm"  → ISO datetime ----------
  function toISODateTime(dateStr, timeStr) {
    if (!dateStr) return null;
    if (!timeStr) return dateStr;
    const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(am|pm)/i);
    if (!match) return `${dateStr}T09:00:00`; // fallback 9am
    let [, hh, mm, ampm] = match;
    let h = parseInt(hh, 10);
    ampm = ampm.toLowerCase();
    if (ampm === "pm" && h !== 12) h += 12;
    if (ampm === "am" && h === 12) h = 0;
    const hStr = String(h).padStart(2, "0");
    return `${dateStr}T${hStr}:${mm}:00`;
  }

  // ---------- map DB appointment → FullCalendar event ----------
  const mapAppointmentToEvent = (a) => {
    const id = a._id || a.id;
    const patientName =
      a.patientName ||
      a.patient?.name ||
      (a.patient && `${a.patient.firstName} ${a.patient.lastName}`) ||
      "Patient";
    const serviceName =
      a.services ||
      a.serviceName ||
      a.service ||
      (a.service && a.service.name) ||
      "Appointment";

    // NEW: use date + time (like "4:30 pm") and convert to ISO
    const startISO = toISODateTime(a.date, a.time);
    let endISO = null;

    if (startISO) {
      const dt = new Date(startISO);
      dt.setMinutes(dt.getMinutes() + 30); // 30-min slot
      endISO = dt.toISOString();
    }

    return {
      id,
      title: `${patientName} — ${serviceName}`,
      start: startISO,
      end: endISO,
      allDay: false,
      backgroundColor: "#1560ff",
      borderColor: "#1560ff",
      extendedProps: { raw: a },
    };
  };

  // ---------- fetch stats (placeholder) ----------
  useEffect(() => {
    let mounted = true;

    const fetchStats = async () => {
      setLoadingStats(true);
      try {
        // you can reuse /dashboard-stats here later
        setStats((s) => ({ ...s, totalServices: 2 }));
      } catch (err) {
        console.error("Failed to fetch stats", err);
      } finally {
        if (mounted) setLoadingStats(false);
      }
    };

    fetchStats();
    return () => (mounted = false);
  }, []);

  // ---------- fetch appointments & map to events ----------
  useEffect(() => {
    let mounted = true;

    const fetchEvents = async () => {
      setLoadingEvents(true);
      setError(null);

      try {
        // IMPORTANT CHANGE:
        // backend /appointments supports ?doctor=, NOT ?doctorId=
        let url = `${API_BASE}/appointments`;
        if (doctorName) {
          url = `${API_BASE}/appointments?doctor=${encodeURIComponent(
            doctorName
          )}`;
        }

        const res = await axios.get(url);
        const appointments = Array.isArray(res.data)
          ? res.data
          : res.data.data ?? [];

        const mapped = appointments.map(mapAppointmentToEvent);

        if (mounted) setEvents(mapped);
      } catch (err) {
        console.error("Failed to fetch appointments for calendar:", err);
        if (mounted) {
          setError("Failed to load calendar events");
          setEvents([]);
        }
      } finally {
        if (mounted) setLoadingEvents(false);
      }
    };

    fetchEvents();
    return () => (mounted = false);
  }, [doctorName]);

  // ---------- calendar interactions ----------
  const handleDateSelect = (selectInfo) => {
    const d = selectInfo.startStr;
    navigate(`/doctor/appointments?date=${encodeURIComponent(d)}`);
    selectInfo.view.calendar.unselect();
  };

  const handleEventClick = (clickInfo) => {
    const ev = clickInfo.event;
    navigate(`/doctor/appointments/${ev.id}`);
  };

  return (
    <DoctorLayout>
      <div className="container-fluid py-4">
        <h3 className="fw-bold text-primary mb-3">Doctor Dashboard</h3>

        {/* Widgets Row */}
        <div className="row g-4">
          {/* Total Patients */}
          <div className="col-md-3">
            <div
              className="card shadow-sm border-0 p-3 text-center clickable"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/doctor/patients")}
            >
              <div className="d-flex justify-content-center align-items-center gap-3">
                <div className="bg-danger bg-opacity-10 text-danger rounded-circle p-3">
                  <FaUserInjured size={30} />
                </div>
                <div className="text-start">
                  <h6 className="text-muted mb-1">Total Patients</h6>
                  <h3 className="fw-bold mb-0">
                    {loadingStats ? "…" : stats.totalPatients}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* Total Appointments */}
          <div className="col-md-3">
            <div
              className="card shadow-sm border-0 p-3 text-center clickable"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/doctor/appointments")}
            >
              <div className="d-flex justify-content-center align-items-center gap-3">
                <div className="bg-primary bg-opacity-10 text-primary rounded-circle p-3">
                  <FaCalendarAlt size={30} />
                </div>
                <div className="text-start">
                  <h6 className="text-muted mb-1">Total Appointments</h6>
                  <h3 className="fw-bold mb-0">
                    {loadingStats ? "…" : stats.totalAppointments}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Appointments */}
          <div className="col-md-3">
            <div
              className="card shadow-sm border-0 p-3 text-center clickable"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/doctor/appointments")}
            >
              <div className="d-flex justify-content-center align-items-center gap-3">
                <div className="bg-success bg-opacity-10 text-success rounded-circle p-3">
                  <FaCalendarCheck size={30} />
                </div>
                <div className="text-start">
                  <h6 className="text-muted mb-1">Today's Appointments</h6>
                  <h3 className="fw-bold mb-0">
                    {loadingStats ? "…" : stats.todayAppointments}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* Total Services */}
          <div className="col-md-3">
            <div
              className="card shadow-sm border-0 p-3 text-center clickable"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/doctor/services")}
            >
              <div className="d-flex justify-content-center align-items-center gap-3">
                <div className="bg-warning bg-opacity-10 text-warning rounded-circle p-3">
                  <FaListAlt size={30} />
                </div>
                <div className="text-start">
                  <h6 className="text-muted mb-1">Total Services</h6>
                  <h3 className="fw-bold mb-0">
                    {loadingStats ? "…" : stats.totalServices}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="card shadow-sm p-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="m-0">Appointment</h5>
                <div>
                  <button className="btn btn-sm btn-outline-secondary me-2">
                    Apply filters
                  </button>
                  <span className="text-muted small">
                    {loadingEvents ? "Loading events…" : `${events.length} events`}
                  </span>
                </div>
              </div>

              {error && <div className="alert alert-warning">{error}</div>}

              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                selectable={true}
                selectMirror={true}
                select={handleDateSelect}
                events={events}
                eventClick={handleEventClick}
                height="auto"
                dayMaxEvents={3}
              />
            </div>
          </div>
        </div>
      </div>
    </DoctorLayout>
  );
}
