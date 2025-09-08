import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";
import LoginRegister from "./pages/LoginRegister";
import Dashboard from "./pages/Dashboard";
import Headersection from "./components/Header";
import Hero from "./components/Hero";
// import Mapsection from "./components/Mapsection";
import Servicecategories from "./components/ServiceCategories";
import Footer from "./components/Footer";
import ServicesPage from "./components/Servicepage";
import OtherServices from "./pages/Otherservices";
import WorkersPage from "./pages/Workerspage";
import MainPage from "./pages/Mainpage";
import BecomeProvider from "./pages/become-provider";
import UpdateProfile from "./pages/UpdateProfiled";
import TestimonialsCRUD from "./pages/Testimonials";
import ProfilePicUpload from "./pages/Profilepage";
import BookingPage from "./pages/BookingPage"; // ✅ Updated to use BookingPage
import ConfirmationPage from "./pages/confirmation";
// import Booking from "./pages/Bookings";

// Protected Route
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" replace />;
}

// Layout
function ProtectedLayout({ children }) {
  return (
    <ProtectedRoute>
      <div style={{ paddingTop: "64px" }}>
        <Toaster position="top-right" richColors />
        <Headersection />
        {children}
      </div>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public login/register */}
          <Route path="/" element={<LoginRegister />} />

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedLayout>
                <Dashboard />
              </ProtectedLayout>
            }
          />

          {/* Booking (dynamic worker ID) */}
          <Route
            path="/booking/:id"
            element={
              <ProtectedLayout>
                <BookingPage />
              </ProtectedLayout>
            }
          />

          {/* Other Services */}
          <Route
            path="/other-services"
            element={
              <ProtectedLayout>
                <OtherServices />
              </ProtectedLayout>
            }
          />
          <Route
            path="/confirmation"
            element={
              <ProtectedLayout>
                <ConfirmationPage />
              </ProtectedLayout>
            }
          />
          {/* <Route
            path="/Bookings"
            element={
              <ProtectedLayout>
                <Booking />
              </ProtectedLayout>
            }
          /> */}

          {/* Workers */}
          <Route
            path="/workers"
            element={
              <ProtectedLayout>
                <WorkersPage />
              </ProtectedLayout>
            }
          />

          {/* Main Page */}
          <Route
            path="/mainpage"
            element={
              <ProtectedLayout>
                <MainPage />
              </ProtectedLayout>
            }
          />

          {/* Testimonials */}
          <Route
            path="/testimonials"
            element={
              <ProtectedLayout>
                <TestimonialsCRUD />
              </ProtectedLayout>
            }
          />

          {/* Become Provider */}
          <Route
            path="/become-provider"
            element={
              <ProtectedLayout>
                <BecomeProvider />
              </ProtectedLayout>
            }
          />

          {/* Profile Page */}
          <Route
            path="/profilepage"
            element={
              <ProtectedLayout>
                <ProfilePicUpload />
              </ProtectedLayout>
            }
          />

          {/* Home with scroll sections */}
          <Route
            path="/home"
            element={
              <ProtectedLayout>
                <Hero />
                <section id="servicecategories">
                  <Servicecategories />
                </section>
                <section id="servicepage">
                  <ServicesPage />
                </section>
                {/* <Mapsection /> */}
                <Footer />
              </ProtectedLayout>
            }
          />

          {/* Update Profile */}
          <Route
            path="/update-profile"
            element={
              <ProtectedLayout>
                <UpdateProfile />
              </ProtectedLayout>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
