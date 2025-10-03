// components/AdminProtectedRoute.jsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const AdminProtectedRoute = ({ children }) => {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        console.log("Checking admin authentication...");
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/admin/check-auth`,
          { withCredentials: true } // ✅ make sure cookies are sent
        );
        console.log("Admin auth response:", res.data);

        if (res.data && typeof res.data.authenticated !== "undefined") {
          setAuth(res.data.authenticated);
        } else {
          console.warn("Unexpected response format:", res.data);
          setAuth(false);
        }
      } catch (err) {
        console.error("Error checking admin authentication:", err.response?.data || err.message);
        setAuth(false);
      }
    };

    verifyAuth();
  }, []);

  if (auth === null) return <p>Checking admin authentication...</p>;
  if (!auth) return <Navigate to="/" replace />;

  return children;
};

export default AdminProtectedRoute;
