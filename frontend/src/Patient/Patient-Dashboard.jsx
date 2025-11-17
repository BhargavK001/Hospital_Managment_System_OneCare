// src/Patient/Patient-Dashboard.jsx
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import PatientLayout from "../layouts/PatientLayout";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const API_BASE = "http://localhost:3001";

// helper: convert "4:30 pm" + "2025-11-17" -> "2025-11-17T16:30:00"
function toISODateTime(dateStr, timeStr) {
  if (!dateStr) return null;
  if (!timeStr) return dateStr;
  const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(am|pm)/i);
  if (!match) return `${dateStr}T09:00:00`; // fallback
  let [, hh, mm, ampm] = match;
  let h = parseInt(hh, 10);
  ampm = ampm.toLowerCase();
  if (ampm === "pm" && h !== 12) h += 12;
  if (ampm === "am" && h === 12) h = 0;
  const hStr = String(h).padStart(2, "0");
  return `${dateStr}T${hStr}:${mm}:00`;
}

export default function PatientDashboard() {
  const calendarRef = useRef(null);

  const storedPatient = (() => {
    try {
      return JSON.parse(localStorage.getItem("patient") || "null");
    } catch {
      return null;
    }
  })();

  const patientName =
    storedPatient?.name ||
    (storedPatient?.firstName
      ? `${storedPatient.firstName} ${storedPatient.lastName || ""}`
      : "") ||
    "";

  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [errorEvents, setErrorEvents] = useState(null);

  const [upcoming, setUpcoming] = useState([]);
  const [loadingUpcoming, setLoadingUpcoming] = useState(true);

  // map DB document to FullCalendar event
  const mapAppointmentToEvent = (a) => {
    const id = a._id ?? a.id;
    const doctor = a.doctorName || "Doctor";
    const service = a.services || a.service || "Appointment";

    const startISO = toISODateTime(a.date, a.time);

    return {
      id,
      title: `${service} — ${doctor}`,
      start: startISO,
      allDay: false,
      backgroundColor: "#4e73df",
      borderColor: "#4e73df",
      extendedProps: { raw: a },
    };
  };

  // fetch events for calendar
  useEffect(() => {
    let mounted = true;

    const fetchEvents = async () => {
      setLoadingEvents(true);
      setErrorEvents(null);
      try {
        // show only this patient's appointments if we know their name
        const query = patientName
          ? `?patient=${encodeURIComponent(patientName)}`
          : "";
        const res = await axios.get(`${API_BASE}/appointments${query}`);

        const appointments = Array.isArray(res.data)
          ? res.data
          : res.data.data ?? [];

        const mapped = appointments.map(mapAppointmentToEvent);
        if (mounted) setEvents(mapped);
      } catch (err) {
        console.error("Patient calendar fetch error:", err);
        if (mounted)
          setErrorEvents("Failed to load calendar events. Check console.");
      } finally {
        if (mounted) setLoadingEvents(false);
      }
    };

    fetchEvents();
    return () => {
      mounted = false;
    };
  }, [patientName]);

  // fetch upcoming list (right-side small list; optional)
  useEffect(() => {
    let mounted = true;

    const fetchUpcoming = async () => {
      setLoadingUpcoming(true);
      try {
        const queryParts = [];
        if (patientName)
          queryParts.push(`patient=${encodeURIComponent(patientName)}`);
        queryParts.push("status=upcoming");
        const query = `?${queryParts.join("&")}`;

        const res = await axios.get(`${API_BASE}/appointments${query}`);
        const appointments = Array.isArray(res.data)
          ? res.data
          : res.data.data ?? [];

        if (mounted) setUpcoming(appointments.slice(0, 5));
      } catch (err) {
        console.error("Failed to fetch upcoming appointments:", err);
        if (mounted) setUpcoming([]);
      } finally {
        if (mounted) setLoadingUpcoming(false);
      }
    };

    fetchUpcoming();
    return () => {
      mounted = false;
    };
  }, [patientName]);

  const handleDateSelect = (selectInfo) => {
    const selectedDate = selectInfo.startStr;
    // go to booking screen with date pre-filled
    window.location.href = `/patient/book?date=${encodeURIComponent(
      selectedDate.split("T")[0]
    )}`;
    selectInfo.view.calendar.unselect();
  };

  const handleEventClick = (clickInfo) => {
    const ev = clickInfo.event;
    // later you can navigate to detail page
    // navigate(`/patient/appointments/${ev.id}`)
    console.log("Clicked event", ev.id, ev.title);
  };

  return (
    <PatientLayout>
      <div className="container-fluid py-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="fw-bold text-primary m-0">Appointment</h3>
        </div>

        {errorEvents && (
          <div className="alert alert-warning mb-3">
            {errorEvents} — open console/network to debug.
          </div>
        )}

        <div className="row g-4">
          <div className="col-lg-9">
            <div className="card shadow-sm p-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => calendarRef.current?.getApi().prev()}
                  >
                    ◀
                  </button>
                  <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => calendarRef.current?.getApi().next()}
                  >
                    ▶
                  </button>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => calendarRef.current?.getApi().today()}
                  >
                    Today
                  </button>
                </div>
                <div className="btn-group" role="group">
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() =>
                      calendarRef.current?.getApi().changeView("dayGridMonth")
                    }
                  >
                    Month
                  </button>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() =>
                      calendarRef.current?.getApi().changeView("timeGridWeek")
                    }
                  >
                    Week
                  </button>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() =>
                      calendarRef.current?.getApi().changeView("timeGridDay")
                    }
                  >
                    Day
                  </button>
                </div>
              </div>

              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={false}
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

          <div className="col-lg-3">
            <div className="card shadow-sm p-3">
              <h6 className="fw-bold mb-3">Upcoming Appointments</h6>
              {loadingUpcoming ? (
                <div className="text-muted small">Loading…</div>
              ) : upcoming.length === 0 ? (
                <div className="text-muted small">No upcoming appointments.</div>
              ) : (
                <ul className="list-unstyled small">
                  {upcoming.map((a) => (
                    <li key={a._id} className="mb-2">
                      <div className="fw-semibold">
                        {a.date} {a.time ? `• ${a.time}` : ""}
                      </div>
                      <div>{a.services || "Service"}</div>
                      <div className="text-muted">
                        with {a.doctorName || "Doctor"}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </PatientLayout>
  );
}
