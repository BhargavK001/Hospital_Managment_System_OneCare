// src/shared/SharedDoctors.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch, FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

/**
 * SharedDoctors
 * Props:
 *  - baseApi (optional) base URL like "http://localhost:3001"
 *  - onAdd (optional) callback when 'Add' clicked (admin uses navigate to AddDoctor)
 *  - canEdit (default true) show edit/delete buttons
 */
export default function SharedDoctors({ baseApi = "http://localhost:3001", onAdd, canEdit = true }) {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const API = baseApi.replace(/\/$/, "");
  const LIST_URL = `${API}/doctors`;

  // Fetch all doctors
  useEffect(() => {
    let mounted = true;
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const res = await axios.get(LIST_URL);
        if (!mounted) return;
        setDoctors(Array.isArray(res.data) ? res.data : res.data.data ?? []);
      } catch (error) {
        console.error(" Error fetching doctors:", error);
        if (mounted) setDoctors([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchDoctors();
    return () => (mounted = false);
  }, [LIST_URL]);

  // Delete a doctor
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;
    try {
      await axios.delete(`${LIST_URL}/${id}`);
      setDoctors((prev) => prev.filter((doc) => doc._id !== id));
      alert("Doctor deleted successfully!");
    } catch (error) {
      console.error("❌ Error deleting doctor:", error);
      alert("Error deleting doctor. Check console for details.");
    }
  };

  // Render filtered list
  const filtered = (doctors || []).filter((doctor) => {
    if (!searchTerm) return true;
    const text = searchTerm.toLowerCase();
    return (
      (doctor.firstName || "").toLowerCase().includes(text) ||
      (doctor.lastName || "").toLowerCase().includes(text) ||
      (doctor.email || "").toLowerCase().includes(text) ||
      (doctor.clinic || "").toLowerCase().includes(text) ||
      ((doctor.specialization || "")).toLowerCase().includes(text)
    );
  });

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold text-primary m-0">Doctors List</h4>
        <div>
          <button
            className="btn btn-primary d-flex align-items-center gap-2"
            onClick={() => {
              if (onAdd) return onAdd();
              navigate("/AddDoctor");
            }}
          >
            <FaPlus /> Add Doctor
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="card shadow-sm p-3 mb-4">
        <div className="input-group">
          <span className="input-group-text bg-white border-end-0">
            <FaSearch />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search doctor by name, email, clinic or specialization"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="card shadow-sm p-3">
        <div className="table-responsive">
          <table className="table table-hover align-middle text-center">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Clinic</th>
                <th>Email</th>
                <th>Specialization</th>
                <th>Status</th>
                {canEdit && <th>Action</th>}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={canEdit ? 7 : 6} className="text-muted">Loading…</td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map((doctor, index) => (
                  <tr key={doctor._id || doctor.id}>
                    <td>{index + 1}</td>
                    <td>{(doctor.firstName || "") + " " + (doctor.lastName || "")}</td>
                    <td>{doctor.clinic || "—"}</td>
                    <td>{doctor.email || "—"}</td>
                    <td>{doctor.specialization || "—"}</td>
                    <td>
                      <span className={`badge ${doctor.status === "Active" ? "bg-success" : "bg-secondary"}`}>
                        {doctor.status === "Active" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    {canEdit && (
                      <td>
                        <div className="d-flex justify-content-center gap-2">
                          <button className="btn btn-sm btn-outline-primary" title="Edit">
                            <FaEdit />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(doctor._id || doctor.id)}
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={canEdit ? 7 : 6} className="text-muted">
                    No doctors found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer (unchanged) */}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span>Rows per page: 10</span>
          <nav>
            <ul className="pagination pagination-sm m-0">
              <li className="page-item disabled">
                <button className="page-link">Prev</button>
              </li>
              <li className="page-item active">
                <button className="page-link">1</button>
              </li>
              <li className="page-item disabled">
                <button className="page-link">Next</button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
