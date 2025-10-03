import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

// Protected route using cookie verification
function ProtectedRoute({ children }) {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/check-auth`, {
          withCredentials: true, // include cookies
        });
        setAuth(res.data.authenticated); // backend returns true/false
      } catch (err) {
        console.error("Auth check failed:", err);
        setAuth(false);
      }
    };

    verifyAuth();
  }, []);

  if (auth === null) return <p>Checking authentication...</p>; // loading state
  if (!auth) return <Navigate to="/dashboard" replace />;

  return children;
}

export default ProtectedRoute;
