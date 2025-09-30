import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";
import { lazy, Suspense } from "react";
import Headersection from "./components/Header";
import Hero from "./components/Hero";
import Servicecategories from "./components/ServiceCategories";
import Footer from "./components/Footer";

// Lazy-loaded pages
const LoginRegister = lazy(() => import("./pages/LoginRegister"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const OtherServices = lazy(() => import("./pages/Otherservices"));
const WorkersPage = lazy(() => import("./pages/Workerspage"));
const MainPage = lazy(() => import("./pages/Mainpage"));
const BecomeProvider = lazy(() => import("./pages/become-provider"));
const UpdateProfile = lazy(() => import("./pages/UpdateProfiled"));
const TestimonialsCRUD = lazy(() => import("./pages/Testimonials"));
const ProfilePicUpload = lazy(() => import("./pages/Profilepage"));
const BookingPage = lazy(() => import("./pages/BookingPage"));
const MyBookings = lazy(() => import("./pages/Mybookings"));
const BookingSubmitted = lazy(() => import("./pages/bookingsubmitted"));
const ServicesPage = lazy(() => import("./components/Servicepage"));

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
        {/* Wrap all lazy-loaded routes in Suspense */}
        <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
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
              path="/bookingsubmitted"
              element={
                <ProtectedLayout>
                  <BookingSubmitted />
                </ProtectedLayout>
              }
            />

            <Route
              path="/Mybookings"
              element={
                <ProtectedLayout>
                  <MyBookings />
                </ProtectedLayout>
              }
            />

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
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
