import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [adminData, setAdminData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch protected admin data using httpOnly cookie
    const fetchAdminData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/admin/adminDashboard`,
          { withCredentials: true } // sends cookie automatically
        );
        setAdminData(res.data.admin);
      } catch (err) {
        console.error("Error fetching admin data:", err);
        navigate("/admin-login"); // redirect if not authenticated
      }
    };

    fetchAdminData();
  }, [navigate]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">🔐 Admin Dashboard</h1>
      {adminData ? (
        <p>Welcome, {adminData.email}</p>
      ) : (
        <p>Loading admin data...</p>
      )}
    </div>
  );
};

export default AdminDashboard;
