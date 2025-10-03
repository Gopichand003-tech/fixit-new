import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

function ProtectedRoute({ children }) {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/admin/check-auth`,
          { withCredentials: true }
        );
        setAuth(res.data.authenticated);
      } catch (err) {
        console.error("Auth check failed:", err);
        setAuth(false);
      }
    };

    verifyAuth();
  }, []);

  if (auth === null) return <p>Checking authentication...</p>;
  if (!auth) return <Navigate to="/admin-login" replace />; // FIX

  return children;
}

export default ProtectedRoute;
