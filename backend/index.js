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

// -------------------------- Services ----------------------------
// GET all services
app.get("/api/services", async (req, res) => {
  try {
    const all = await Service.find();
    console.log("GET /api/services ->", all.length, "items");  
    res.json(all);
  } catch (err) {
    console.error("GET /api/services error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// ADD service
app.post("/api/services", async (req, res) => {
  try {
    console.log("POST /api/services body:", req.body);   
    const data = new Service(req.body);
    const saved = await data.save();
    console.log("Saved service:", saved);                
    res.json(saved);
  } catch (err) {
    console.error("Error saving service:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// DELETE service
app.delete("/api/services/:id", async (req, res) => {
  await Service.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// TOGGLE Active status
app.put("/api/services/toggle/:id", async (req, res) => {
  const service = await Service.findById(req.params.id);
  service.active = !service.active;
  await service.save();
  res.json(service);
});

// UPDATE service (very simple)
app.put("/api/services/:id", async (req, res) => {
  try {
    // find and update, return the updated document
    const updated = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.json(updated);
  } catch (err) {
    console.error("Update service error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.listen(3001,()=> {
    console.log("Server is runing")
})