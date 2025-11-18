import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../layouts/AdminLayout";
import { FaSearch, FaSort, FaPen, FaTrash } from "react-icons/fa";
import "../styles/Services.css";

const Services = () => {
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    category: "",
    name: "",
    charges: "",
    clinic: "",
    doctorId: "",
    isTelemed: "No",
    duration: "",
    status: "Active",
    allowMultiSelection: "Yes",
  });

  // ---------- API ----------
  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3001/api/services");
      setServices(res.data || []);
    } catch (err) {
      console.error("Error fetching services", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/doctors");
      setDoctors(res.data || []);
    } catch (err) {
      console.error("Error fetching doctors", err);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchDoctors();
  }, []);

  // ---------- Handlers ----------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/api/services", formData);
      await fetchServices();
      setShowForm(false);
      setFormData({
        category: "",
        name: "",
        charges: "",
        clinic: "",
        doctorId: "",
        isTelemed: "No",
        duration: "",
        status: "Active",
        allowMultiSelection: "Yes",
      });
    } catch (err) {
      console.error("Error creating service", err);
      alert("Failed to create service");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    try {
      await axios.delete(`http://localhost:3001/api/services/${id}`);
      await fetchServices();
    } catch (err) {
      console.error("Error deleting service", err);
    }
  };

  const handleStatusToggle = async (service) => {
    try {
      const updatedStatus = service.status === "Active" ? "Inactive" : "Active";
      await axios.put(`http://localhost:3001/api/services/${service._id}`, {
        ...service,
        status: updatedStatus,
      });
      await fetchServices();
    } catch (err) {
      console.error("Error updating status", err);
    }
  };

  const filteredServices = services.filter((s) => {
    const text =
      `${s._id || ""} ${s.serviceId || ""} ${s.name || ""} ${s.category || ""} ${
        s.clinic || ""
      } ${s.doctorName || ""} ${s.charges || ""} ${s.status || ""}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  const getInitial = (name = "") =>
    name.trim().length > 0 ? name.trim()[0].toUpperCase() : "?";

  // ---------- UI ----------
  return (
    <AdminLayout>
      <div className="services-page container-fluid">
        {/* Header */}
        <div className="services-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold">Service List</h5>
          <div>
            <button className="btn btn-outline-primary btn-sm me-2 services-import-btn">
              Import data
            </button>
            <button
              className="btn btn-primary btn-sm services-add-btn"
              onClick={() => setShowForm((prev) => !prev)}
            >
              {showForm ? "Close form" : "+ Add Service"}
            </button>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="card services-form-card mt-3 mb-3">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label services-label">
                      Service category <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="form-control form-control-sm"
                      placeholder="Select service category"
                      required
                    />
                    <small className="text-primary">
                      Type and press enter to add new category
                    </small>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label services-label">
                      Service Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-control form-control-sm"
                      placeholder="Enter service name"
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label services-label">
                      Charges <span className="text-danger">*</span>
                    </label>
                    <div className="input-group input-group-sm">
                      <span className="input-group-text">$</span>
                      <input
                        type="number"
                        name="charges"
                        value={formData.charges}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Enter charges"
                        min="0"
                        required
                      />
                      <span className="input-group-text">/-</span>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label services-label">
                      Is this a telemed service?{" "}
                      <span className="text-danger">*</span>
                    </label>
                    <select
                      name="isTelemed"
                      value={formData.isTelemed}
                      onChange={handleChange}
                      className="form-select form-select-sm"
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label services-label">
                      Clinic <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="clinic"
                      value={formData.clinic}
                      onChange={handleChange}
                      className="form-control form-control-sm"
                      placeholder="Select clinic"
                      required
                    />
                    <div className="form-check mt-1">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="selectAllClinics"
                        disabled
                      />
                      <label
                        htmlFor="selectAllClinics"
                        className="form-check-label services-small-text"
                      >
                        Select all
                      </label>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label services-label">
                      Doctor <span className="text-danger">*</span>
                    </label>
                    <select
                      name="doctorId"
                      value={formData.doctorId}
                      onChange={handleChange}
                      className="form-select form-select-sm"
                      required
                    >
                      <option value="">Select doctor</option>
                      {doctors.map((doc) => (
                        <option key={doc._id} value={doc._id}>
                          {doc.name}
                        </option>
                      ))}
                    </select>
                    <div className="form-check mt-1">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="selectAllDoctors"
                        disabled
                      />
                      <label
                        htmlFor="selectAllDoctors"
                        className="form-check-label services-small-text"
                      >
                        Select all
                      </label>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label services-label">Duration</label>
                    <input
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      className="form-control form-control-sm"
                      placeholder="HH:MM"
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label services-label">
                      Status <span className="text-danger">*</span>
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="form-select form-select-sm"
                      required
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label services-label">
                      Allow multi selection while booking?{" "}
                      <span className="text-danger">*</span>
                    </label>
                    <select
                      name="allowMultiSelection"
                      value={formData.allowMultiSelection}
                      onChange={handleChange}
                      className="form-select form-select-sm"
                      required
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4 d-flex justify-content-end gap-2">
                  <button type="submit" className="btn btn-primary services-save-btn">
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary services-cancel-btn"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Search bar */}
        <div className="services-search-wrapper mb-2">
          <div className="input-group input-group-sm">
            <span className="input-group-text services-search-icon">
              <FaSearch size={12} />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control services-search-input"
              placeholder="Search services data by id, doctor, name, category, price  and status(active or inactive)"
            />
          </div>
        </div>

        {/* Table */}
        <div className="card services-table-card">
          <div className="card-body p-0">
            <table className="table table-sm mb-0 services-table">
              <thead>
                <tr>
                  <th className="services-checkbox-col">
                    <input type="checkbox" />
                  </th>
                  <th>
                    <span className="services-th-label">ID</span>{" "}
                    <FaSort className="services-sort-icon" />
                  </th>
                  <th>
                    <span className="services-th-label">Service ID</span>{" "}
                    <FaSort className="services-sort-icon" />
                  </th>
                  <th>
                    <span className="services-th-label">Name</span>{" "}
                    <FaSort className="services-sort-icon" />
                  </th>
                  <th>
                    <span className="services-th-label">Clinic Name</span>{" "}
                    <FaSort className="services-sort-icon" />
                  </th>
                  <th>
                    <span className="services-th-label">Doctor</span>{" "}
                    <FaSort className="services-sort-icon" />
                  </th>
                  <th>
                    <span className="services-th-label">Charges</span>{" "}
                    <FaSort className="services-sort-icon" />
                  </th>
                  <th>
                    <span className="services-th-label">Duration</span>{" "}
                    <FaSort className="services-sort-icon" />
                  </th>
                  <th>
                    <span className="services-th-label">Category</span>{" "}
                    <FaSort className="services-sort-icon" />
                  </th>
                  <th>
                    <span className="services-th-label">Status</span>{" "}
                    <FaSort className="services-sort-icon" />
                  </th>
                  <th className="text-center">
                    <span className="services-th-label">Action</span>
                  </th>
                </tr>

                {/* filter row */}
                <tr className="services-filter-row">
                  <th className="services-checkbox-col">
                    <input type="checkbox" disabled />
                  </th>
                  <th>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="ID"
                      disabled
                    />
                  </th>
                  <th>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Service ID"
                      disabled
                    />
                  </th>
                  <th>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Filter service by name"
                      disabled
                    />
                  </th>
                  <th>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Filter Encounter"
                      disabled
                    />
                  </th>
                  <th>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Filter service by doctor"
                      disabled
                    />
                  </th>
                  <th>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Filter Service by charges"
                      disabled
                    />
                  </th>
                  <th>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="HH:mm"
                      disabled
                    />
                  </th>
                  <th>
                    <select className="form-select form-select-sm" disabled>
                      <option>Filter service by name</option>
                    </select>
                  </th>
                  <th>
                    <select className="form-select form-select-sm" disabled>
                      <option>Filter by status</option>
                    </select>
                  </th>
                  <th />
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={11} className="text-center py-3">
                      Loading...
                    </td>
                  </tr>
                ) : filteredServices.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="text-center py-3">
                      No services found
                    </td>
                  </tr>
                ) : (
                  filteredServices.map((s, index) => (
                    <tr key={s._id || index}>
                      <td className="services-checkbox-col">
                        <input type="checkbox" />
                      </td>
                      <td>{s.displayId || s.id ||  index + 1}</td>
                      <td>{s.serviceId || "-"}</td>

                      {/* Name with circular initial */}
                      <td>
                        <div className="services-name-cell">
                          <div className="services-avatar">
                            {getInitial(s.name)}
                          </div>
                          <span>{s.name}</span>
                        </div>
                      </td>

                      <td>{s.clinic}</td>
                      <td>{s.doctorName || "-"}</td>
                      <td>$ {s.charges}/-</td>
                      <td>{s.duration || "-"}</td>
                      <td>{s.category}</td>

                      {/* Status switch + ACTIVE badge */}
                      <td>
                        <div
                          className="services-status-wrapper"
                          onClick={() => handleStatusToggle(s)}
                        >
                          <div
                            className={
                              "services-switch " +
                              (s.status === "Active" ? "on" : "off")
                            }
                          >
                            <div className="services-switch-thumb" />
                          </div>
                          <span
                            className={
                              "services-status-badge " +
                              (s.status === "Active"
                                ? "status-active"
                                : "status-inactive")
                            }
                          >
                            {s.status.toUpperCase()}
                          </span>
                        </div>
                      </td>

                      {/* Action buttons */}
                      <td className="text-center">
                        <button className="btn btn-sm services-icon-btn services-edit-btn me-1">
                          <FaPen size={12} />
                        </button>
                        <button
                          className="btn btn-sm services-icon-btn services-delete-btn"
                          onClick={() => handleDelete(s._id)}
                        >
                          <FaTrash size={12} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Services;
