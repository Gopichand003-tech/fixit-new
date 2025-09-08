import { useState } from "react";
import {
  Wrench,
  Droplets,
  PaintBucket,
  Zap,
  Car,
  Home,
  Scissors,
  Laptop,
  Camera,
  Trash2,
  Sparkles,
  Tv,
  Hammer,
  PaintRoller,
  EyeClosed
} from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  { icon: EyeClosed, name: "Bodycare", count: "167+ providers", category: "Beauty", color: "from-violet-500 to-violet-600" }
];

const categories = ["All", "Home", "Outdoor", "Tech", "Creative", "Beauty", "Auto-Repair"];

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
      : services.filter((service) => service.category === selectedCategory);

  return (
    <section
  id="servicecategories" // ✅ add this so Header can scroll to it
  className="w-screen bg-gray-100 py-16 overflow-x-hidden relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]"
>
  {/* Section Header */}
  <div className="text-center mb-8 px-4">
    <h2 className="text-4xl md:text-5xl font-bold mb-4">Popular Services</h2>
    <p className="text-lg text-gray-600 max-w-4xl mx-auto">
      Discover the most requested services in your area. All our providers are verified and highly rated.
    </p>
  </div>

  {/* Category Buttons */}
  <div className="flex flex-wrap justify-center gap-4 mb-10 px-4">
    {categories.map((cat) => (
      <button
        key={cat}
        onClick={() => setSelectedCategory(cat)}
        className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 transform 
          ${
            selectedCategory === cat
              ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg scale-105"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100 hover:shadow-md"
          }
        `}
      >
        {cat}
      </button>
    ))}
  </div>

  {/* Services Grid */}
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 px-4">
    {filteredServices.map((service) => (
      <div
        key={service.name}
        onClick={() => handleServiceClick(service.name)}
        className={`group cursor-pointer bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-2 ${
          selectedService === service.name
            ? "ring-2 ring-blue-500 shadow-lg transform -translate-y-1"
            : ""
        }`}
      >
        <div
          className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${service.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
        >
          <service.icon className="h-8 w-8 text-white" />
        </div>
        <h3 className="font-semibold mb-2 group-hover:text-blue-500 transition-colors">
          {service.name}
        </h3>
        <p className="text-sm text-gray-500">{service.count}</p>
      </div>
    ))}
  </div>

  {/* Other Services Button */}
  <div className="flex justify-center mt-12">
    <button
      onClick={() => navigate("/other-services")}
      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-lg hover:scale-105 transform transition-all duration-300"
    >
      View All Services
    </button>
  </div>
</section>

  );
};

export default ServiceCategories;
