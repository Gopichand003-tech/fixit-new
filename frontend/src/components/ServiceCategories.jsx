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
  { icon: Tv, name: "Electronics",  category: "Tech", color: "from-blue-500 to-blue-600" },
  { icon: Droplets, name: "Plumbing",  category: "Home", color: "from-cyan-500 to-cyan-600" },
  { icon: PaintRoller, name: "Painting",  category: "Home", color: "from-purple-500 to-purple-600" },
  { icon: Zap, name: "Electrician",  category: "Home", color: "from-yellow-500 to-yellow-600" },
  { icon: Car, name: "Mechanic",  category: "Auto-Repair", color: "from-red-500 to-red-600" },
  { icon: Home, name: "Cleaning",  category: "Home", color: "from-green-500 to-green-600" },
  { icon: Scissors, name: "Landscaping",  category: "Outdoor", color: "from-emerald-500 to-emerald-600" },
  { icon: Laptop, name: "TechSupport",  category: "Tech", color: "from-indigo-500 to-indigo-600" },
  { icon: Camera, name: "Photography",  category: "Creative", color: "from-pink-500 to-pink-600" },
  { icon: Hammer, name: "Carpenter",  category: "Home", color: "from-orange-500 to-orange-600" },
  { icon: Trash2, name: "Junk Removal",  category: "Home", color: "from-gray-500 to-gray-600" },
  { icon: EyeClosed, name: "Bodycare",  category: "Beauty", color: "from-violet-500 to-violet-600" },
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
      className="relative w-full py-16 sm:py-24 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

       {/* ---------------- Header ---------------- */}
<div className="text-center mb-16">
  <h2
    className="
      text-3xl sm:text-4xl md:text-5xl lg:text-6xl
      font-extrabold tracking-tight
      bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500
      bg-clip-text text-transparent
      drop-shadow-sm
      mb-4
    "
  >
    Popular Services
  </h2>

  <p
    className="
      text-sm sm:text-base md:text-lg
      text-gray-600
      max-w-3xl mx-auto
      leading-relaxed
    "
  >
    Discover the most requested services near you.
    <span className="hidden sm:inline">
      {" "}All providers are verified and highly rated.
    </span>
  </p>
</div>


        {/* ---------------- Categories ---------------- */}
        <div className="mb-14">
          <div className="
            flex gap-3 sm:gap-4
            overflow-x-auto sm:overflow-visible
            no-scrollbar
            justify-start sm:justify-center
            px-1
          ">
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
                  focus:outline-none focus:ring-2 focus:ring-indigo-400
                  ${
                    selectedCategory === cat
                      ? "bg-blue-500 text-white shadow-md scale-105"
                      : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-indigo-50"
                  }
                `}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ---------------- Services Grid ---------------- */}
        <div className="
          grid grid-cols-2
          sm:grid-cols-3
          md:grid-cols-4
          lg:grid-cols-6
          gap-4 sm:gap-7
        ">
          {filteredServices.map((service) => (
            <div
              key={service.name}
              role="button"
              tabIndex={0}
              onClick={() =>
                navigate("/workers", { state: { profession: service.name } })
              }
              onKeyDown={(e) =>
                e.key === "Enter" &&
                navigate("/workers", { state: { profession: service.name } })
              }
              className="
                group cursor-pointer
                rounded-3xl p-3 sm:p-6 text-center
                bg-white
                border border-gray-200
                shadow-[0_15px_40px_rgba(0,0,0,0.08)]
                hover:shadow-[0_25px_60px_rgba(0,0,0,0.12)]
                hover:-translate-y-1
                active:scale-95
                transition-all duration-300
              "
            >
              <div
                className={`
                  w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4
                  rounded-2xl
                  bg-gradient-to-r ${service.color}
                  flex items-center justify-center
                  shadow-lg
                  group-hover:scale-110
                  transition-transform
                `}
              >
                <service.icon className="w-8 h-8 text-white" />
              </div>

              <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-1">
                {service.name}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500">
                {service.count}
              </p>

              <span className="
                hidden lg:block
                opacity-0 group-hover:opacity-100
                mt-2 text-xs text-blue-500 font-medium
                transition-opacity
              ">
                View providers →
              </span>
            </div>
          ))}
        </div>

        {/* ---------------- View All ---------------- */}
        <div className="flex justify-center mt-16">
          <button
            onClick={() => navigate("/other-services")}
            className="
              px-9 py-3.5
              rounded-full
              font-semibold text-white
              bg-blue-600 hover:bg-indigo-500
              shadow-lg hover:shadow-xl
              active:scale-95
              transition-all duration-300
            "
          >
            View All Services
          </button>
        </div>

      </div>
    </section>
  );
};

export default ServiceCategories;
