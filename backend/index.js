const express = require("express")
const mongoose =  require("mongoose")
const cors = require("cors");
const UserModel = require('./Models/User');
const Patients = require('./Models/Patient');
const DoctorModel = require("./Models/Doctor");
const AppointmentModel = require("./Models/Appointment");
const BillingModel = require("./Models/Billing");
const Service = require("./Models/Service");

const app = express()
app.use(express.json())
app.use(cors())

//Connection url
mongoose.connect("mongodb://localhost:27017/User")

// Signup 

app.post('/signup',(req, res) => {
     const { name, email, password, role } = req.body;
    UserModel.create(req.body)
    .then(user => res.json(user ,{ message: "Signup successful", user }))
    .catch(err => res.json(err))
})

//Login

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  UserModel.findOne({ email })
    .then((user) => {
      if (user) {
        if (user.password === password) {
       
        return res.json({
          status: "Success",
          user: {
            name: user.name,
            email: user.email,
            role: user.role, 
          },
        });
        } else {
          res.json("Wrong Password");
        }
      } else {
        res.json("No record exist");
      }
    })
    .catch((err) => res.status(500).json("Server error: " + err));
});


// AddPatient Api
const PatientModel = require("./Models/Patient");

app.post("/patients", async (req, res) => {
  try {
    console.log(" Incoming patient data:", req.body);
    const patient = await PatientModel.create(req.body);
    res.json({ message: "Patient added", data: patient });
  } catch (err) {
    console.error(" Error saving patient:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

    // Patients get request code

    app.get("/patients", (req, res) => {
  PatientModel.find()
    .then((patients) => res.json(patients))
    .catch((err) => res.status(500).json(err));
});

  // for Patients to delete

  app.delete("/patients/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await PatientModel.findByIdAndDelete(id);
    res.json({ message: "Patient deleted successfully" });
  } catch (err) {
    console.error(" Error deleting patient:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Dashboard count widget data api 

app.get("/dashboard-stats", async (req, res) => {
  try {
    const [totalPatients , totalDoctors ,totalAppointments] = await Promise.all([
      PatientModel.countDocuments(),
      DoctorModel.countDocuments(),
      AppointmentModel.countDocuments()
    ]);

     res.json({totalDoctors , totalPatients , totalAppointments});
  } catch (err) {
    console.error(" Error fetching dashboard stats:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Docotor Related stuff here
app.post("/doctors", async (req, res) => {
  try {
    console.log(" Incoming doctor data:", req.body);
    const doctor = await DoctorModel.create(req.body);
    res.json({ message: "Doctor added", data: doctor });
  } catch (err) {
    console.error(" Error saving doctor:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

//  Get All Doctors
app.get("/doctors", async (req, res) => {
  try {
    const doctors = await DoctorModel.find();
    res.json(doctors);
  } catch (err) {
    console.error(" Error fetching doctors:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

//  Delete Doctor
app.delete("/doctors/:id", async (req, res) => {
  try {
    await DoctorModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Doctor deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting doctor", error: err.message });
  }
});

// -------------------------Appointment----------------

// create appointment
app.post("/appointments", async (req, res) => {
  try {
    const doc = await AppointmentModel.create(req.body);
    res.json({ message: "Appointment created", data: doc });
  } catch (err) {
    console.error("Error creating appointment:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// list appointments with optional filters (query params)
app.get("/appointments", async (req, res) => {
  try {
    const q = {};
    // simple filtering - treat date as YYYY-MM-DD string
    if (req.query.date) q.date = req.query.date;
    if (req.query.clinic) q.clinic = { $regex: req.query.clinic, $options: "i" };
    if (req.query.patient) q.patientName = { $regex: req.query.patient, $options: "i" };
    if (req.query.doctor) q.doctorName = { $regex: req.query.doctor, $options: "i" };
    if (req.query.status) q.status = req.query.status;

    // add pagination later (limit/skip) if needed
    const list = await AppointmentModel.find(q).sort({ createdAt: -1 }).limit(500);
    res.json(list);
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// DELETE appointment
app.delete("/appointments/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await AppointmentModel.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({ message: "Appointment deleted successfully" });
  } catch (err) {
    console.error("Error deleting appointment:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// -------------------------- BILLING ----------------------------

// Create Bill
app.post("/bills", async (req, res) => {
  try {
    const bill = await BillingModel.create(req.body);
    res.json({ message: "Bill created successfully", data: bill });
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
});

// Get All Bills
app.get("/bills", async (req, res) => {
  try {
    const bills = await BillingModel.find().sort({ createdAt: -1 });
    res.json(bills);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching bills", error: err.message });
  }
});

// Get Single Bill
app.get("/bills/:id", async (req, res) => {
  try {
    const bill = await BillingModel.findById(req.params.id);
    res.json(bill);
  } catch (err) {
    res.status(500).json({ message: "Error fetching bill" });
  }
});

// Update Bill
app.put("/bills/:id", async (req, res) => {
  try {
    const updated = await BillingModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ message: "Bill updated", data: updated });
  } catch (err) {
    res.status(500).json({ message: "Error updating bill" });
  }
});

// Delete Bill
app.delete("/bills/:id", async (req, res) => {
  try {
    await BillingModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Bill deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting bill" });
  }
});

// 👉 Get all services
app.get("/api/services", async (req, res) => {
  try {
    const services = await Service.find()
      .populate("doctorId", "name") // to get doctor name
      .sort({ createdAt: -1 });

    // format doctorName for frontend convenience
    const formatted = services.map((s) => ({
      ...s.toObject(),
      doctorName: s.doctorId ? s.doctorId.name : "",
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Error fetching services", err);
    res.status(500).json({ error: "Server error" });
  }
});

// 👉 Create new service
app.post("/api/services", async (req, res) => {
  try {
    const newService = await Service.create(req.body);
    res.status(201).json(newService);
  } catch (err) {
    console.error("Error creating service", err);
    res.status(400).json({ error: "Failed to create service" });
  }
});

// 👉 Update service (for status/edit)
app.put("/api/services/:id", async (req, res) => {
  try {
    const updated = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error("Error updating service", err);
    res.status(400).json({ error: "Failed to update service" });
  }
});

<<<<<<< Updated upstream
// Cancel appointment (mark status Cancelled)
app.put("/appointments/:id/cancel", async (req, res) => {
  try {
    const { id } = req.params;

    const appt = await AppointmentModel.findByIdAndUpdate(
      id,
      { status: "cancelled" },
      { new: true }
    );

    if (!appt) return res.status(404).json({ message: "Appointment not found" });

    res.json({ message: "Appointment cancelled", data: appt });
  } catch (err) {
    console.error("Cancel error", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

=======
// 👉 Delete service
app.delete("/api/services/:id", async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: "Service deleted" });
  } catch (err) {
    console.error("Error deleting service", err);
    res.status(400).json({ error: "Failed to delete service" });
  }
});

// 👉 Get doctors list for dropdown
app.get("/api/doctors", async (req, res) => {
  try {
    const doctors = await DoctorModel.find({}, "name"); // only id + name
    res.json(doctors);
  } catch (err) {
    console.error("Error fetching doctors", err);
    res.status(500).json({ error: "Server error" });
  }
});


>>>>>>> Stashed changes
app.listen(3001,()=> {
    console.log("Server is runing")
})