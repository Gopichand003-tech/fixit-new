import React, { useState, useContext, useEffect, useRef } from "react";
import { Bell, Menu, User, LogOut, Briefcase } from "lucide-react";
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
  const [scrollToId, setScrollToId] = useState(null);
  const dropdownRef = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll helper with header offset
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80; // height of fixed header
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    } else {
      toast.info("Section is loading or not found");
    }
    setMobileMenuOpen(false);
  };

  // Scroll after dashboard renders
  useEffect(() => {
    if (scrollToId) {
      const timeout = setTimeout(() => {
        scrollToSection(scrollToId);
        setScrollToId(null);
      }, 500); // wait for component to render
      return () => clearTimeout(timeout);
    }
  }, [scrollToId]);

  // Navigation handler
  const handleNavClick = (label) => {
    const idMap = {
      "find services": "servicecategories",
      "quick booking": "servicepage",
    };
    const slug = label.toLowerCase();

    if (slug === "home") {
      navigate("/dashboard");
      return;
    }
    if (slug === "testimonials") {
      navigate("/testimonials");
      setMobileMenuOpen(false);
      return;
    }

    const targetId = idMap[slug];
    if (!targetId) return;

    if (location.pathname !== "/dashboard") {
      setScrollToId(targetId);
      navigate("/dashboard");
    } else {
      scrollToSection(targetId);
    }
    setMobileMenuOpen(false);
  };

  const handleBecomeProvider = () => navigate("/become-provider");
  const handleLogout = () => {
    logoutUser();
    setDropdownOpen(false);
    navigate("/");
  };
const handleNotificationClick = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/notifications"); // adjust URL if needed
    const notifications = res.data;

    if (notifications.length > 0) {
      notifications.forEach((n) => {
        toast.info(`📢 ${n.message}`);
      });
    } else {
      toast.info("✅ No new notifications");
    }
  } catch (err) {
    console.error("Error fetching notifications:", err);
    toast.error("❌ Failed to load notifications");
  }
};
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/70 shadow-md border-b border-purple-300">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div
            className="flex items-center gap-4 cursor-pointer select-none flex-shrink-0"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className="w-14 h-14 bg-gradient-to-tr from-purple-500 to-pink-400 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-extrabold text-2xl">F</span>
            </div>
            <span className="text-4xl font-bold bg-gradient-to-tr from-purple-600 to-pink-500 bg-clip-text text-transparent">
              FIX-IT
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-10 items-center text-lg">
            {["Home", "Find Services", "Quick Booking", "Testimonials"].map((label, idx) => (
              <button
                key={idx}
                onClick={() => handleNavClick(label)}
                className="text-purple-700 hover:text-fuchsia-600 transition-all duration-200 font-medium"
              >
                {label}
              </button>
            ))}
            <Button
              onClick={handleBecomeProvider}
              className="flex items-center bg-gradient-to-tr from-pink-500 to-purple-600 text-white shadow-lg hover:scale-105 transition-transform px-5 py-3 rounded-full"
            >
              <Briefcase className="w-6 h-6 mr-2" /> Become a Provider
            </Button>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4 md:gap-6">
            <Button variant="ghost" size="icon" className="relative" onClick={handleNotificationClick}>
              <Bell className="w-6 h-6 text-purple-700" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-700 rounded-full animate-ping" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-700 rounded-full" />
            </Button>

            {/* Profile */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setDropdownOpen(prev => !prev); }}
                className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 transition"
              >
                {user ? (
                  user.avatar || user.profilePic ? (
                    <img src={user.avatar || user.profilePic} alt={user.name} className="w-10 h-10 rounded-full border-2 border-purple-500" />
                  ) : (
                    <span className="w-10 h-10 flex items-center justify-center bg-purple-500 text-white font-semibold rounded-full">
                      {user.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase() : "U"}
                    </span>
                  )
                ) : <User className="w-6 h-6 text-purple-700" />}
              </button>

              {dropdownOpen && user && (
                <div className="absolute right-0 mt-3 min-w-[18rem] bg-white/20 backdrop-blur-xl rounded-2xl shadow-xl p-5 space-y-4 z-50">
                  <p className="text-white font-semibold">{user.name}</p>
                  <p className="text-white/80 text-sm">{user.email}</p>
                  <button onClick={() => navigate("/update-profile")} className="w-full px-5 py-3 bg-purple-500 text-white rounded-xl">Update Profile</button>
                  <button onClick={handleLogout} className="w-full px-5 py-3 bg-red-500 text-white rounded-xl flex items-center justify-center gap-2">
                    <LogOut className="w-5 h-5" /> Sign Out
                  </button>
                </div>
              )}
            </div>

            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu className="w-6 h-6 text-purple-700" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-6 border-t border-zinc-200">
            <nav className="flex flex-col gap-5 text-lg">
              {["Find Services", "Quick Booking", "Testimonials"].map((label, idx) => (
                <button key={idx} onClick={() => handleNavClick(label)} className="text-left text-zinc-700 hover:text-indigo-600">{label}</button>
              ))}
              <Button onClick={handleBecomeProvider} className="bg-gradient-to-tr from-pink-500 to-purple-600 text-white px-5 py-3 rounded-full">
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
