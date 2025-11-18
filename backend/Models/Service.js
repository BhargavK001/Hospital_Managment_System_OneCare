// Models/Service.js
const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema(
  {
    category: { type: String, required: true },      
    name: { type: String, required: true },          
    charges: { type: Number, required: true },
    clinic: { type: String, required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" }, 
    isTelemed: { type: String, enum: ["Yes", "No"], default: "No" },
    duration: { type: String },                      // "HH:MM"
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    allowMultiSelection: {
      type: String,
      enum: ["Yes", "No"],
      default: "Yes",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", ServiceSchema);
