import { useState } from "react";
import {
  Droplets,
  PaintRoller,
  Zap,
  Car,
  Home,
  Scissors,
  Laptop,
  Camera,
  Trash2,
  Tv,
  Hammer,
  EyeClosed,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ---------------- Services Data ---------------- */
const services = [
  { icon: Tv, name: "Electronics", count: "150+ providers", category: "Tech", color: "from-blue-500 to-blue-600" },
  { icon: Droplets, name: "Plumbing", count: "89+ providers", category: "Home", color: "from-cyan-500 to-cyan-600" },
  { icon: PaintRoller, name: "Painting", count: "120+ providers", category: "Home", color: "from-purple-500 to-purple-600" },
  { icon: Zap, name: "Electrician", count: "95+ providers", category: "Home", color: "from-yellow-500 to-yellow-600" },
  { icon: Car, name: "Mechanic", count: "67+ providers", category: "Auto-Repair", color: "from-red-500 to-red-600" },
  { icon: Home, name: "Cleaning", count: "200+ providers", category: "Home", color: "from-green-500 to-green-600" },
  { icon: Scissors, name: "Landscaping", count: "78+ providers", category: "Outdoor", color: "from-emerald-500 to-emerald-600" },
  { icon: Laptop, name: "TechSupport", count: "134+ providers", category: "Tech", color: "from-indigo-500 to-indigo-600" },
  { icon: Camera, name: "Photography", count: "56+ providers", category: "Creative", color: "from-pink-500 to-pink-600" },
  { icon: Hammer, name: "Carpenter", count: "43+ providers", category: "Home", color: "from-orange-500 to-orange-600" },
  { icon: Trash2, name: "Junk Removal", count: "88+ providers", category: "Home", color: "from-gray-500 to-gray-600" },
  { icon: EyeClosed, name: "Bodycare", count: "167+ providers", category: "Beauty", color: "from-violet-500 to-violet-600" },
];

const categories = ["All", "Home", "Outdoor", "Tech", "Creative", "Beauty", "Auto-Repair"];

/* ---------------- Component ---------------- */
const ServiceCategories = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();

  const filteredServices =
    selectedCategory === "All"
      ? services
      : services.filter((s) => s.category === selectedCategory);

  return (
    <section
      id="servicecategories"
      className="relative w-full py-16 sm:py-24 bg-gradient-to-b from-slate-50 via-white to-slate-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
            Popular Services
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
            Discover the most requested services near you. All providers are verified and highly rated.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 sm:px-6 py-2.5 rounded-full text-sm sm:text-base font-semibold transition-all duration-300
                ${
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-indigo-50 hover:border-indigo-300"
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 sm:gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.name}
              onClick={() =>
                navigate("/workers", { state: { profession: service.name } })
              }
              className="group cursor-pointer bg-white rounded-2xl p-5 sm:p-6 text-center
                         border border-gray-100 shadow-sm
                         hover:shadow-xl hover:-translate-y-1
                         transition-all duration-300"
            >
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 rounded-2xl
                bg-gradient-to-r ${service.color}
                flex items-center justify-center
                shadow-md group-hover:shadow-lg
                group-hover:scale-110 transition-transform`}
              >
                <service.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>

              <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-1">
                {service.name}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500">
                {service.count}
              </p>
            </div>
          ))}
        </div>

        {/* View All */}
        <div className="flex justify-center mt-14">
          <button
            onClick={() => navigate("/other-services")}
            className="px-8 py-3 rounded-full font-semibold text-white
                       bg-gradient-to-r from-blue-600 to-indigo-600
                       shadow-lg hover:shadow-xl hover:scale-105
                       transition-all duration-300"
          >
            View All Services
          </button>
        </div>

      </div>
    </section>
  );
};

export default ServiceCategories;
