# 🏥 OneCare – Hospital Management System (MERN)

A full-stack **Hospital Management System** built using the **MERN Stack**, with three separate user roles:

- 👨‍💼 **Admin**
- 👨‍⚕️ **Doctor**
- 🧑‍🦰 **Patient**

This project is your **OneCare – Hospital_Managment_System_OneCare** app, with dashboards, appointments, services, and billing.

---

## ✨ Features

### 🔷 Admin Panel

- 📊 Dashboard overview (Total Patients, Doctors, Appointments, Revenue – if added)
- 👥 Manage Patients (Add / View / Delete)
- 🩺 Manage Doctors (Add / View / Delete)
- 📅 Manage Appointments (Create / View / Delete)
- 🧾 Manage Services & Billing Records (from your friend’s part)
- ⚙ Settings page (if configured)
- 🧭 Modern sidebar + navbar UI (OneCare branding)

---

### 🩺 Doctor Panel

- 🔐 Login via doctor route
- 📊 Doctor Dashboard with stats
- 📅 View Today’s & Upcoming Appointments
- 👥 View assigned Patients
- 📆 FullCalendar integration to see bookings
- 🧭 Same theme layout as Admin (sidebar + navbar), but **isolated access**

---

### 🧑‍🦰 Patient Panel

- 🔐 Patient login & dashboard
- 📅 Patient can **book appointments**
- 📆 Calendar view of their appointments
- 🔎 Filter appointments by:
  - Date
  - Status (Booked / Upcoming / Completed / Cancelled)
  - Doctor
- 📄 View appointment history
- 🧭 Sidebar + top bar same theme as other roles

---

## 🛠 Tech Stack

| Layer      | Technology                          |
|-----------|--------------------------------------|
| Frontend  | React (Vite), React Router DOM       |
| UI        | Bootstrap, React Icons               |
| Calendar  | FullCalendar (dayGrid + timeGrid)    |
| Backend   | Node.js, Express.js                  |
| Database  | MongoDB with Mongoose                |
| HTTP      | Axios                                |

---

## 📂 Project Structure (High Level)

```bash
Hospital_Managment_System_OneCare/
├── backend/
│   ├── Models/
│   │   ├── User.js
│   │   ├── Patient.js
│   │   ├── Doctor.js
│   │   └── Appointment.js
│   ├── index.js
│   └── package.json
└── frontend/
    ├── admin/
    │   ├── Admin-dashboard.jsx
    │   ├── Patients.jsx
    │   ├── Doctors.jsx
    │   ├── AddPatient.jsx
    │   ├── AddDoctor.jsx
    │   ├── Appointments.jsx
    │   ├── Services.jsx
    │   ├── BillingRecords.jsx
    │   └── Settings.jsx
    ├── doctor/
    │   ├── Doctordashboard.jsx
    │   ├── DoctorPatients.jsx
    │   ├── DoctorAppointments.jsx
    │   └── DoctorServices.jsx
    ├── Patient/
    │   ├── Patient-Dashboard.jsx
    │   ├── PatientAppointments.jsx
    │   └── (future: PatientBooking.jsx)
    ├── layouts/
    │   ├── AdminLayout.jsx
    │   ├── DoctorLayout.jsx
    │   └── PatientLayout.jsx
    ├── shared/
    │   └── SharedDoctors.jsx
    ├── styles/
    ├── App.jsx
    └── main.jsx
⚙ Backend – API Overview
🔑 Auth

POST /signup – Register a user (name, email, password, role)

POST /login – Login and return user info + role

🧑‍🦰 Patients

POST /patients – Add a new patient

GET /patients – List all patients

DELETE /patients/:id – Delete patient by ID

👨‍⚕️ Doctors

POST /doctors – Add a new doctor

GET /doctors – List all doctors

DELETE /doctors/:id – Delete doctor by ID

📅 Appointments

POST /appointments – Create appointment

GET /appointments – List appointments with optional filters:

Query params:

date – filter by date (YYYY-MM-DD)

clinic – filter by clinic name

patient – filter by patientName

doctor – filter by doctorName

status – booked / upcoming / completed / cancelled

DELETE /appointments/:id – Delete appointment by ID

📊 Dashboard Stats

GET /dashboard-stats – returns:

{
  "totalPatients": 0,
  "totalDoctors": 0,
  "totalAppointments": 0
}

🧩 Frontend – Main Routes

In App.jsx, you have routes like:

/ signup              → Signup
/ login               → Login

/ admin-dashboard     → AdminDashboard
/ patients            → Patients
/ AddPatient          → AddPatient
/ Doctors             → Doctors
/ AddDoctor           → AddDoctor
/ Appointments        → Appointments
/ Services            → Services
/ BillingRecords      → BillingRecords
/ Settings            → Settings

/ doctor/dashboard    → DoctorDashboard
/ doctor/patients     → DoctorPatients
/ doctor/appointments → DoctorAppointments
/ doctor/services     → DoctorServices

/ patient/dashboard   → PatientDashboard
/ patient/appointments→ PatientAppointments

🚀 Getting Started
1️⃣ Clone the Repository
git clone https://github.com/YOUR_GITHUB_USERNAME/Hospital_Managment_System_OneCare.git
cd Hospital_Managment_System_OneCare

2️⃣ Backend Setup
cd backend
npm install
node index.js   # or nodemon index.js


Default backend URL: http://localhost:3001

MongoDB connection: mongodb://localhost:27017/User (in your code)

3️⃣ Frontend Setup
cd ../frontend
npm install
npm run dev


Default frontend URL (Vite): http://localhost:5173

Make sure your Axios calls use:
http://localhost:3001 as backend base URL (you already did this).

🖼 Screenshots (You can add later)

You can create a screenshots/ folder and then add some PNGs:

![Admin Dashboard](./screenshots/admin-dashboard.png)
![Doctor Dashboard](./screenshots/doctor-dashboard.png)
![Patient Dashboard](./screenshots/patient-dashboard.png)

🧠 Roadmap / Future Ideas

🔐 JWT-based authentication and protected routes

📨 Email / SMS reminders for upcoming appointments

💳 Online payment integration for billing

📱 Fully responsive mobile-first UI

🧾 Export billing as PDF invoices

📊 Advanced analytics (appointments per doctor, per day, etc.)

🙌 Credits

Developer: Bhargav Karande
🎓 E&TC Engineering | MERN | Projects with OneCare

If this project helps you or looks good on your resume,
⭐ Star the repo on GitHub: Hospital_Managment_System_OneCare
and feel free to improve it further!
