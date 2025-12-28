import { useState } from "react";
import {
  Droplets,
  Zap,
  Car,
  Home,
  Scissors,
  Laptop,
  Camera,
  Trash2,
  Tv,
  Hammer,
  Utensils,
  Dumbbell,
  Music,
  BookOpen,
  ShoppingBag,
  Briefcase,
  Heart,
  Baby,
  PawPrint,
  AirVent,
  Gift,
  PaintRoller,
  EyeClosed,
  Truck,
  Factory,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ---------------- Services Data ---------------- */
const services = [
  { icon: Tv, name: "Electronics", category: "Tech", color: "from-blue-500 to-blue-600" },
  { icon: Droplets, name: "Plumbing", category: "Home", color: "from-cyan-500 to-cyan-600" },
  { icon: PaintRoller, name: "Painting", category: "Home", color: "from-purple-500 to-purple-600" },
  { icon: Zap, name: "Electrician", category: "Home", color: "from-yellow-500 to-yellow-600" },
  { icon: Car, name: "Mechanic", category: "Auto-Repair", color: "from-red-500 to-red-600" },
  { icon: Home, name: "Cleaning", category: "Home", color: "from-green-500 to-green-600" },
  { icon: Scissors, name: "Landscaping", category: "Outdoor", color: "from-emerald-500 to-emerald-600" },
  { icon: Laptop, name: "Tech Support", category: "Tech", color: "from-indigo-500 to-indigo-600" },
  { icon: Camera, name: "Photography", category: "Creative", color: "from-pink-500 to-pink-600" },
  { icon: Hammer, name: "Carpenter", category: "Home", color: "from-orange-500 to-orange-600" },
  { icon: Trash2, name: "Junk Removal", category: "Home", color: "from-gray-500 to-gray-600" },
  { icon: EyeClosed, name: "Body Care", category: "Beauty", color: "from-violet-500 to-violet-600" },
  { icon: Utensils, name: "Catering", category: "Creative", color: "from-rose-500 to-rose-600" },
  { icon: Dumbbell, name: "Fitness Trainer", category: "Outdoor", color: "from-lime-500 to-lime-600" },
  { icon: Music, name: "Music Teacher", category: "Creative", color: "from-fuchsia-500 to-fuchsia-600" },
  { icon: BookOpen, name: "Tutoring", category: "Creative", color: "from-sky-500 to-sky-600" },
  { icon: ShoppingBag, name: "Personal Shopper", category: "Creative", color: "from-violet-500 to-violet-600" },
  { icon: Briefcase, name: "Business Consulting", category: "Tech", color: "from-stone-500 to-stone-600" },
  { icon: Heart, name: "Healthcare", category: "Home", color: "from-red-400 to-red-500" },
  { icon: Baby, name: "Babysitting", category: "Home", color: "from-pink-400 to-pink-500" },
  { icon: PawPrint, name: "Pet Care", category: "Outdoor", color: "from-amber-500 to-amber-600" },
  { icon: AirVent, name: "AC Repair", category: "Home", color: "from-blue-400 to-blue-500" },
  { icon: Gift, name: "Event Planning", category: "Creative", color: "from-indigo-400 to-indigo-500" },
  { icon: Truck, name: "Delivery", category: "Outdoor", color: "from-green-400 to-green-500" },
  { icon: Factory, name: "Industrial Services", category: "Outdoor", color: "from-slate-400 to-slate-500" },
];

const categories = ["All", "Home", "Outdoor", "Tech", "Creative", "Beauty", "Auto-Repair"];

/* ---------------- Component ---------------- */
const ServiceCategories = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();

  const handleServiceClick = (serviceName) => {
    setSelectedService(serviceName);
    navigate("/workers", { state: { profession: serviceName } });
  };

  const filteredServices =
    selectedCategory === "All"
      ? services
      : services.filter((s) => s.category === selectedCategory);

  return (
    <section className="w-full bg-gradient-to-b from-gray-50 to-gray-100 py-10 sm:py-16 overflow-x-hidden">
      <div className="px-4 sm:px-8">

        {/* ---------------- Header ---------------- */}
        <div className="text-center mb-10 sm:mb-16">
          <h2
            className="
              text-3xl sm:text-4xl md:text-5xl lg:text-6xl
              font-extrabold tracking-tight
              bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500
              bg-clip-text text-transparent
              drop-shadow-sm mb-4
            "
          >
            All Services
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover trusted professionals across multiple categories near you.
          </p>
        </div>

        {/* ---------------- Category Filter ---------------- */}
        <div className="flex gap-3 sm:gap-4 mb-8 sm:mb-10 overflow-x-auto sm:overflow-visible justify-start sm:justify-center scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`
                whitespace-nowrap
                px-4 sm:px-6 py-2
                rounded-full
                text-xs sm:text-base font-semibold
                transition-all duration-300
                ${
                  selectedCategory === cat
                    ? "bg-blue-500 text-white shadow-md scale-105"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ---------------- Service Grid ---------------- */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.name}
              onClick={() => handleServiceClick(service.name)}
              className={`
                group cursor-pointer
                rounded-2xl
                p-4 sm:p-6
                text-center
                bg-white/90 backdrop-blur-md
                border border-gray-200
                transition-all duration-300
                hover:-translate-y-2 hover:shadow-xl
                active:scale-95
                ${
                  selectedService === service.name
                    ? "ring-2 ring-blue-500 shadow-lg"
                    : ""
                }
              `}
            >
              <div
                className={`
                  w-12 h-12 sm:w-16 sm:h-16
                  mx-auto mb-3 sm:mb-4
                  rounded-2xl
                  bg-gradient-to-r ${service.color}
                  flex items-center justify-center
                  shadow-md
                  group-hover:scale-110
                  transition-transform
                `}
              >
                <service.icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>

              <h3 className="text-sm sm:text-base font-semibold group-hover:text-blue-600 transition-colors">
                {service.name}
              </h3>
            </div>
          ))}
        </div>

        {/* ---------------- Back Button ---------------- */}
        <div className="mt-8 sm:mt-10 flex justify-center">
          <button
            onClick={() => navigate(-1)}
            className="
              px-5 py-2.5
              text-sm sm:text-base
              bg-blue-500
              text-white
              rounded-full
              shadow-lg
              hover:scale-105
              active:scale-95
              transition-all duration-300
            "
          >
            ← Back
          </button>
        </div>

      </div>
    </section>
  );
};

export default ServiceCategories;
