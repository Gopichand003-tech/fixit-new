import { useState } from "react";
import {
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
  CupSoda,
  Bus,
  Factory,
  PartyPopper,
  Gift,
  PaintRoller,
  EyeClosed,
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
  { icon: EyeClosed, name: "Bodycare", count: "167+ providers", category: "Beauty", color: "from-violet-500 to-violet-600" },
  { icon: Utensils, name: "Catering", count: "72+ providers", category: "Creative", color: "from-rose-500 to-rose-600" },
  { icon: Dumbbell, name: "Fitness Trainer", count: "54+ providers", category: "Outdoor", color: "from-lime-500 to-lime-600" },
  { icon: Music, name: "MusicTeacher", count: "40+ providers", category: "Creative", color: "from-fuchsia-500 to-fuchsia-600" },
  { icon: BookOpen, name: "Tutoring", count: "65+ providers", category: "Creative", color: "from-sky-500 to-sky-600" },
  { icon: ShoppingBag, name: "Personal Shopper", count: "33+ providers", category: "Creative", color: "from-violet-500 to-violet-600" },
  { icon: Briefcase, name: "Business Consulting", count: "28+ providers", category: "Tech", color: "from-stone-500 to-stone-600" },
  { icon: Heart, name: "Healthcare", count: "59+ providers", category: "Home", color: "from-red-400 to-red-500" },
  { icon: Baby, name: "Babysitting", count: "38+ providers", category: "Home", color: "from-pink-400 to-pink-500" },
  { icon: PawPrint, name: "Pet Care", count: "45+ providers", category: "Outdoor", color: "from-amber-500 to-amber-600" },
  { icon: AirVent, name: "AC Repair", count: "50+ providers", category: "Home", color: "from-blue-400 to-blue-500" },
  { icon: Gift, name: "Event Planning", count: "29+ providers", category: "Creative", color: "from-indigo-400 to-indigo-500" },
  { icon: Bus, name: "Transport Service", count: "42+ providers", category: "Outdoor", color: "from-green-400 to-green-500" },
  { icon: Factory, name: "Industrial Services", count: "21+ providers", category: "Outdoor", color: "from-slate-400 to-slate-500" },
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
    <section className="w-screen bg-gray-100 py-16 overflow-x-hidden">
      <div className="px-4 sm:px-8">
        {/* Header */}
        <div className="text-center mb-8 px-2">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">All Services</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover the most requested services in your area. All our providers are verified and highly rated.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
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

        {/* Service Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 px-2">
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
              {service.count && <p className="text-sm text-gray-500">{service.count}</p>}
            </div>
          ))}
        </div>

          {/* Back Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-lg hover:scale-105 transform transition-all duration-300"
          >
            ← Back
          </button>
        </div>
      </div>
    </section>
  );
};
export default ServiceCategories;
