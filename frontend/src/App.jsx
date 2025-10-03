import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";
import { lazy, Suspense } from "react";
import Headersection from "./components/Header";
import Hero from "./components/Hero";
import Servicecategories from "./components/ServiceCategories";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/Adminprotected"; // cookie-based admin check

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
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

// Layout for authenticated users
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
        <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
          <Routes>
            {/* Public login/register */}
            <Route path="/" element={<LoginRegister />} />

            {/* User Dashboard */}
            <Route
              path="/dashboard"
              element={
                <ProtectedLayout>
                  <Dashboard />
                </ProtectedLayout>
              }
            />

            {/* Admin Dashboard */}
            <Route
              path="/adminDashbord"
              element={
                <AdminProtectedRoute>
                  <AdminDashboard />
                </AdminProtectedRoute>
              }
            />

            {/* Booking */}
            <Route
              path="/booking/:id"
              element={
                <ProtectedLayout>
                  <BookingPage />
                </ProtectedLayout>
              }
            />

            {/* Other pages */}
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
            <Route
              path="/workers"
              element={
                <ProtectedLayout>
                  <WorkersPage />
                </ProtectedLayout>
              }
            />
            <Route
              path="/mainpage"
              element={
                <ProtectedLayout>
                  <MainPage />
                </ProtectedLayout>
              }
            />
            <Route
              path="/testimonials"
              element={
                <ProtectedLayout>
                  <TestimonialsCRUD />
                </ProtectedLayout>
              }
            />
            <Route
              path="/become-provider"
              element={
                <ProtectedLayout>
                  <BecomeProvider />
                </ProtectedLayout>
              }
            />
            <Route
              path="/profilepage"
              element={
                <ProtectedLayout>
                  <ProfilePicUpload />
                </ProtectedLayout>
              }
            />
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
