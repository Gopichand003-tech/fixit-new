import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative w-full bg-gradient-to-br from-purple-50 via-white  text-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">

        {/* ---------------- Main Grid ---------------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-14">

          {/* ---------------- Brand ---------------- */}
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3 mb-4">
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

            <p className="text-sm leading-relaxed text-gray-600 max-w-sm mx-auto sm:mx-0">
              Connecting you with trusted service providers — fast, simple,
              and reliable. Built to make everyday services effortless.
            </p>
          </div>

          {/* ---------------- Quick Links ---------------- */}
          <div className="text-center sm:text-left">
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
          <div className="text-center sm:text-left">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              Contact
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center justify-center sm:justify-start gap-2">
                <Mail className="w-4 h-4 text-purple-600" />
                <a
                  href="mailto:chennapalligopichand@gmail.com"
                  className="hover:text-purple-600 transition-colors break-all"
                >
                  chennapalligopichand@gmail.com
                </a>
              </li>

              <li className="flex items-center justify-center sm:justify-start gap-2">
                <Phone className="w-4 h-4 text-purple-600" />
                <a
                  href="tel:+919154650262"
                  className="hover:text-purple-600 transition-colors"
                >
                  +91 91546 50262
                </a>
              </li>

              <li className="flex items-center justify-center sm:justify-start gap-2">
                <MapPin className="w-4 h-4 text-purple-600" />
                <span>Kakinada, India</span>
              </li>
            </ul>
          </div>

          {/* ---------------- Social ---------------- */}
          <div className="text-center sm:text-left">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              Follow Us
            </h3>

            <div className="flex justify-center sm:justify-start gap-4">
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
                  className="
                    w-11 h-11
                    rounded-full
                    bg-white
                    shadow-md
                    flex items-center justify-center
                    text-gray-600
                    hover:text-purple-600
                    hover:bg-purple-100
                    transition-all duration-200
                  "
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ---------------- Bottom Bar ---------------- */}
        <div className="mt-12 sm:mt-14 pt-5 border-t border-purple-200 text-center text-xs sm:text-sm text-gray-500">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-gray-700">FIX-IT</span>.  
          All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
