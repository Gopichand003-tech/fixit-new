import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative w-full bg-gradient-to-br from-purple-50 via-white to-pink-50 text-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

        {/* ---------------- Main Grid ---------------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-14">

          {/* ---------------- Brand ---------------- */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center shadow-md">
                <span className="text-white font-extrabold text-lg">F</span>
              </div>
              <span className="text-2xl font-extrabold bg-gradient-to-tr from-purple-700 to-pink-500 bg-clip-text text-transparent">
                FIX-IT
              </span>
            </div>

            <p className="text-sm leading-relaxed text-gray-600 max-w-sm">
              Connecting you with trusted service providers — fast, simple,
              and reliable. Built to make everyday services effortless.
            </p>
          </div>

          {/* ---------------- Quick Links ---------------- */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                { label: "Find Services", link: "/other-services" },
                { label: "Become a Provider", link: "/become-provider" },
                { label: "Support", link: "/support" },
                { label: "Terms & Conditions", link: "/terms" },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.link}
                    className="hover:text-purple-600 transition-colors duration-200"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ---------------- Contact ---------------- */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              Contact
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-600" />
                <a
                  href="mailto:chennapalligopichand@gmail.com"
                  className="hover:text-purple-600 transition-colors"
                >
                  chennapalligopichand@gmail.com
                </a>
              </li>

              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-purple-600" />
                <a
                  href="tel:+919154650262"
                  className="hover:text-purple-600 transition-colors"
                >
                  +91 91546 50262
                </a>
              </li>

              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-600" />
                <span>Kakinada, India</span>
              </li>
            </ul>
          </div>

          {/* ---------------- Social ---------------- */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              Follow Us
            </h3>

            <div className="flex gap-4">
              {[
                { icon: Facebook, link: "#", label: "Facebook" },
                {
                  icon: Instagram,
                  link: "https://www.instagram.com/gopi_chand03/?hl=en",
                  label: "Instagram",
                },
                {
                  icon: Twitter,
                  link: "https://x.com/chennapalligopi",
                  label: "Twitter",
                },
              ].map(({ icon: Icon, link, label }) => (
                <a
                  key={label}
                  href={link}
                  target={link !== "#" ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center 
                             text-gray-600 hover:text-purple-600 hover:bg-purple-100 
                             transition-all duration-200"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ---------------- Bottom Bar ---------------- */}
        <div className="mt-14 pt-6 border-t border-purple-200 text-center text-sm text-gray-500">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-gray-700">FIX-IT</span>.  
          All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
