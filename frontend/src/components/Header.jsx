import React, { useState, useContext, useEffect, useRef } from "react";
import { Bell, Menu, User, LogOut, Briefcase, User2, Ghost } from "lucide-react";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import axios from "axios";
import { Mail } from "lucide-react";

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
      console.log(user.profilePic);
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
    
   if (slug === "mybookings") {
  navigate("/MyBookings"); // Use the correct route casing
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
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/notifications`); // adjust URL if needed
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
              
{/* Site Logo & Name */}

  {/* Circular Logo */}
  <div className="w-20 h-20 rounded-full flex items-center justify-center  p-1">
    <img
      src="/FIXIT2.png"
      alt="FIXIT Logo"
 className="w-20 h-18 p-1 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-600 shadow-md flex items-center justify-center">
    </img>
  </div>


            <span className="text-4xl font-bold bg-gradient-to-tr from-purple-600 to-pink-500 bg-clip-text text-transparent">
              FIXIT
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-10 items-center text-lg">
            {["Home", "Find Services", "Quick Booking", "Testimonials","Mybookings"].map((label, idx) => (
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
    className="flex items-center justify-center w-12 h-12 rounded-full hover:shadow-lg transition-shadow duration-200"
  >
{user ? (
  user.profilePic ? (
    <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-purple-400 via-pink-500 to-indigo-500 shadow-md">
      <img
        src={user.profilePic}
        alt={user.name}
        className="w-full h-full rounded-full object-cover bg-white"
      />
    </div>
  ) : (
    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-tr from-purple-500 via-pink-500 to-indigo-600 shadow-md">
      <span className="text-white font-bold text-lg">
        {user.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase() : "U"}
      </span>
    </div>
  )
) : (
  <Ghost className="w-6 h-6 text-purple-700" />
)}

  </button>

  {dropdownOpen && user && (
    <div className="absolute right-0 mt-3 min-w-[20rem] bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl p-6 space-y-4 z-50 animate-fadeIn">
      <div className="space-y-1">
  <p className="flex items-center gap-2 text-purple-900 font-semibold text-lg hover:text-purple-700 transition-colors cursor-default">
    <User className="w-4 h-4 text-purple-700" />
    {user.name}
  </p>
  <p className="flex items-center gap-2 text-purple-900 font-semibold text-lg hover:text-purple-700 transition-colors cursor-default truncate">
    <Mail className="w-4 h-4 text-purple-700" />
    {user.email}
  </p>
</div>


      <button
        onClick={() => navigate("/update-profile")}
        className="w-full py-3 px-5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-2xl shadow-lg hover:scale-105 transition-transform duration-200"
      >
        Update Profile
      </button>

      <button
        onClick={handleLogout}
        className="w-full py-3 px-5 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:scale-105 transition-transform duration-200"
      >
        <LogOut className="w-5 h-5" /> Sign Out
      </button>
    </div>
  )}
</div>
</div>

{/* Mobile Menu Toggle */}
<Button
  variant="ghost"
  size="icon"
  className="md:hidden"
  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
>
  <Menu className="w-6 h-6 text-purple-700" />
</Button>
</div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-6 border-t border-zinc-200">
            <nav className="flex flex-col gap-5 text-lg">
              {["Find Services", "Quick Booking", "Testimonials","Mybookings"].map((label, idx) => (
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
