import React, { useState, useContext, useEffect, useRef } from "react";
import {
  Bell,
  Menu,
  LogOut,
  Briefcase,
  Ghost,
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-xl border-b border-purple-200 shadow-sm ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between">

          {/* ---------------- Logo ---------------- */}
          <div
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-3 cursor-pointer select-none"
          >
            <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-full p-[3px]
  bg-gradient-to-br from-black via-yellow-400 to-black
  shadow-[0_0_20px_rgba(255,215,0,0.5)]
">
  <video
    src="/mainpage.mp4"
    autoPlay
    loop
    muted
    playsInline
    className="w-full h-full rounded-full object-cover bg-white"
  />
</div>

           <span className="text-xl sm:text-3xl font-extrabold tracking-wide">
  <span className="text-black">FIX</span>
  <span className="text-yellow-500 drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]">
    IT
  </span>
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
          <div className="flex items-center gap-2 sm:gap-4">

            {/* Become Provider */}
           <Button
  onClick={() => navigate("/become-provider")}
  className="
  hidden sm:flex items-center gap-2
  rounded-full px-4 py-3
  bg-gradient-to-br from-blue-600 via-white to-yellow-400
  text-gray-700 font-semibold
  shadow-lg shadow-blue-500/30
  hover:shadow-xl hover:scale-[1.05]
  transition-all duration-200
  md:translate-x-[-40px]
"
>
  <Briefcase className="w-4 h-4 text-blue-900" />
  Become a Provider
</Button>
 

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNotificationClick}
              className="rounded-full hover:bg-purple-100 transition md:translate-x-[-35px]"
            >
              <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
            </Button>

            {/* Profile */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="
                  w-9 h-9 sm:w-10 sm:h-10
                  rounded-full
                  flex items-center justify-center
                  hover:ring-2 hover:ring-yellow-300
                  hover:ring-offset-2
                  transition-all
                  md:translate-x-[-35px]
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
                  <Ghost className="w-5 h-5 text-purple-700" />
                )}
              </button>

              {/* ---------------- Profile Dropdown ---------------- */}
              {dropdownOpen && user && (
                <div
                  className="
                    absolute right-0 mt-3
                    w-64 sm:w-72 max-w-[92vw]
                    rounded-2xl
                    bg-white/90 backdrop-blur-xl
                    shadow-xl
                    border border-purple-100
                    p-4 sm:p-5
                    space-y-4
                    animate-fadeIn
                  "
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-10 rounded-full p-[2px] bg-gradient-to-tr from-purple-500 to-indigo-600">
                      <img
                        src={user.profilePic || "/default-avatar.png"}
                        alt={user.name}
                        className="w-full h-full rounded-full object-cover bg-white"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-purple-900 truncate">
                        {user.name}
                      </p>
                      <p className="text-sm text-purple-700 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="h-px bg-purple-100" />

                  <button
                    onClick={() => navigate("/update-profile")}
                    className="w-full rounded-xl py-2.5 text-purple-700 font-medium bg-purple-50 hover:bg-purple-100 transition"
                  >
                    Update Profile
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full rounded-xl py-2.5 text-rose-600 font-medium bg-rose-50 hover:bg-rose-100 transition flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
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
        
        {/* ---------------- Mobile Sidebar ---------------- */}
{mobileMenuOpen && (
  <>
    {/* Backdrop */}
    <div
      className="fixed inset-0 bg-black/40 z-40 md:hidden"
      onClick={() => setMobileMenuOpen(false)}
    />

    {/* Sidebar */}
    <div
      className="
        fixed top-0 right-0 h-full w-[80%] max-w-sm
        bg-white z-50 md:hidden
        shadow-2xl
        animate-slideIn
        flex flex-col
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b">
        <span className="text-lg font-bold text-purple-700">Menu</span>
        <button onClick={() => setMobileMenuOpen(false)}>
          <X className="w-6 h-6 text-purple-700" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-5 px-5 py-6 text-base">
        {["Home", "Find Services", "Quick Booking", "Testimonials", "Mybookings"].map(
          (label) => (
            <button
              key={label}
              onClick={() => {
                handleNavClick(label);
                setMobileMenuOpen(false);
              }}
              className="text-left font-medium text-zinc-700 hover:text-purple-600"
            >
              {label}
            </button>
          )
        )}
      </nav>

      {/* Footer CTA */}
      <div className="mt-auto px-5 pb-6">
        <Button
          onClick={() => {
            navigate("/become-provider");
            setMobileMenuOpen(false);
          }}
          className="
            w-full
            rounded-full
            py-3
            bg-gradient-to-r from-black via-yellow-400 to-yellow-500
            text-black font-semibold
            shadow-lg
          "
        >
          Become a Provider
        </Button>
      </div>
    </div>
  </>
)}
      </div>
    </header>
  );
};

export default Header;
