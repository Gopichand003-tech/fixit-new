import React, { useState, useContext, useEffect, useRef } from "react";
import {
  Bell,
  Menu,
  User,
  LogOut,
  Briefcase,
  Ghost,
  Mail,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import axios from "axios";

const Header = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  /* ---------------- Close dropdown on outside click ---------------- */
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ---------------- Close dropdown on ESC ---------------- */
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setDropdownOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  /* ---------------- Close mobile menu on route change ---------------- */
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  /* ---------------- Navigation ---------------- */
  const handleNavClick = (label) => {
    const map = {
      "find services": "servicecategories",
      "quick booking": "servicepage",
    };

    const slug = label.toLowerCase();

    if (slug === "home") return navigate("/dashboard");
    if (slug === "testimonials") return navigate("/testimonials");
    if (slug === "mybookings") return navigate("/MyBookings");

    const id = map[slug];
    if (!id) return;

    if (location.pathname !== "/dashboard") {
      navigate("/dashboard");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 400);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  /* ---------------- Logout ---------------- */
  const handleLogout = () => {
    logoutUser();
    setDropdownOpen(false);
    navigate("/");
  };

  /* ---------------- Notifications ---------------- */
  const handleNotificationClick = async () => {
    toast.loading("Checking notifications...", { id: "notify" });
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/notifications`,
        { timeout: 4000 }
      );

      toast.dismiss("notify");
      res.data?.length
        ? res.data.forEach((n) => toast.info(`📢 ${n.message}`))
        : toast.success("No new notifications");
    } catch {
      toast.dismiss("notify");
      toast.error("Failed to load notifications");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-xl border-b border-purple-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between">

          {/* ---------------- Logo ---------------- */}
          <div
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-3 cursor-pointer select-none"
          >
            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full p-[2px] bg-gradient-to-tr from-purple-500 via-pink-500 to-indigo-600">
              <img
                src="/FIXIT2.png"
                alt="FIXIT"
                className="w-full h-full rounded-full bg-white object-contain"
              />
            </div>
            <span className="text-xl sm:text-2xl font-extrabold bg-gradient-to-tr from-purple-600 to-pink-500 bg-clip-text text-transparent">
              FIXIT
            </span>
          </div>

          {/* ---------------- Desktop Nav ---------------- */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-10 text-[15px] lg:text-base">
            {["Home", "Find Services", "Quick Booking", "Testimonials", "Mybookings"].map(
              (label) => (
                <button
                  key={label}
                  onClick={() => handleNavClick(label)}
                  className="text-purple-700 hover:text-fuchsia-600 font-medium transition-colors"
                >
                  {label}
                </button>
              )
            )}
          </nav>

          {/* ---------------- Right Actions ---------------- */}
          <div className="flex items-center gap-3 sm:gap-4">

            {/* Become Provider */}
            <Button
              onClick={() => navigate("/become-provider")}
              className="
                hidden sm:flex items-center gap-2
                rounded-full px-5 py-2.5
                bg-gradient-to-tr from-pink-500 to-purple-600
                text-white font-medium
                shadow-md hover:shadow-lg
                hover:scale-[1.04]
                transition-all duration-200
                translate-x-[-45px]
              "
            >
              <Briefcase className="w-4 h-4" />
              Become a Provider
            </Button>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNotificationClick}
              className="rounded-full hover:bg-purple-100 transition translate-x-[-39px]"
            >
              <Bell className="w-5 h-5 text-purple-700" />
            </Button>

            {/* Profile */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="
                  w-10 h-10 rounded-full
                  flex items-center justify-center
                  hover:ring-2 hover:ring-purple-300
                  hover:ring-offset-2
                  transition-all
                  translate-x-[-40px]
                "
              >
                {user?.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : user ? (
                  <div className="w-full h-full rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                ) : (
                  <Ghost className="w-6 h-6 text-purple-700" />
                )}
              </button>

             {/* Profile Dropdown */}
{dropdownOpen && user && (
  <div
    className="
      absolute right-0 mt-4
      w-72 max-w-[90vw]
      rounded-2xl
      bg-white/90 backdrop-blur-xl
      shadow-[0_20px_40px_rgba(0,0,0,0.12)]
      border border-purple-100
      p-5
      space-y-4
      animate-fadeIn
    "
  >
    {/* Profile Header */}
    <div className="flex items-center gap-4">
      {/* Profile Pic */}
      <div className="relative">
        <div className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-purple-500 to-indigo-600">
          <img
            src={user.profilePic || "/default-avatar.png"}
            alt={user.name}
            className="w-full h-full rounded-full object-cover bg-white"
          />
        </div>
        {/* Online dot */}
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
      </div>

      {/* Name & Email */}
      <div className="min-w-0">
        <p className="font-semibold text-purple-900 truncate">
          {user.name}
        </p>
        <p className="text-sm text-purple-700 truncate">
          {user.email}
        </p>
      </div>
    </div>

    {/* Divider */}
    <div className="h-px bg-purple-100" />

    {/* Actions */}
    <button
      onClick={() => navigate("/update-profile")}
      className="
        w-full flex items-center justify-center
        rounded-xl py-2.5
        text-purple-700 font-medium
        bg-purple-50 hover:bg-purple-100
        transition-all duration-200
      "
    >
      Update Profile
    </button>

    <button
      onClick={handleLogout}
      className="
        w-full flex items-center justify-center gap-2
        rounded-xl py-2.5
        text-rose-600 font-medium
        bg-rose-50 hover:bg-rose-100
        transition-all duration-200
      "
    >
      <LogOut className="w-4 h-4" />
      Sign Out
    </button>
  </div>
)}

            </div>

            {/* Mobile Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                setDropdownOpen(false);
              }}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-purple-700" />
              ) : (
                <Menu className="w-6 h-6 text-purple-700" />
              )}
            </Button>
          </div>
        </div>

        {/* ---------------- Mobile Menu ---------------- */}
        {mobileMenuOpen && (
          <div className="md:hidden py-6 border-t border-zinc-200 animate-slideDown">
            <nav className="flex flex-col gap-5 text-base">
              {["Find Services", "Quick Booking", "Testimonials", "Mybookings"].map(
                (label) => (
                  <button
                    key={label}
                    onClick={() => handleNavClick(label)}
                    className="text-left text-zinc-700 hover:text-indigo-600"
                  >
                    {label}
                  </button>
                )
              )}
              <Button
                onClick={() => navigate("/become-provider")}
                className="rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 text-white"
              >
                Become a Provider
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
