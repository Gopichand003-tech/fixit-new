import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-screen bg-gradient-to-tr from-purple-100 via-white to-pink-100 text-gray-800 py-10 px-6 md:px-12 overflow-x-hidden relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* 1. Logo + Tagline */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-tr from-purple-500 to-pink-400 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-extrabold text-lg">F</span>
              </div>
              <span className="text-3xl font-bold bg-gradient-to-tr from-purple-800 to-pink-500 bg-clip-text text-transparent">
                FIX-IT
              </span>
            </div>
            <p className="text-sm text-gray-600 max-w-xs">
              Connecting you with trusted service providers — fast, simple, reliable.
            </p>
          </div>

          {/* 2. Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/other-services" className="hover:text-purple-600">Find Services</a></li>
              <li><a href="/become-provider" className="hover:text-purple-600">Become a Provider</a></li>
              <li><a href="/support" className="hover:text-purple-600">Support</a></li>
              <li><a href="/terms" className="hover:text-purple-600">Terms & Conditions</a></li>
            </ul>
          </div>

          {/* 3. Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" /> 
                <a href="mailto:chennapalligopichand@gmail.com" className="hover:underline">chennapalligopichand@gmail.com</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" /> 
                <a href="tel:+919154650262" className="hover:underline">+91 91546 50262</a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Kakinada, India
              </li>
            </ul>
          </div>

          {/* 4. Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
            <div className="flex gap-4">
              <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-purple-600">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/gopi_chand03/?hl=en" target="_blank" rel="noopener noreferrer" className="hover:text-purple-600">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://x.com/chennapalligopi" target="_blank" rel="noopener noreferrer" className="hover:text-purple-600">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Footer Text */}
        <div className="text-center text-sm text-gray-500 mt-10 border-t pt-4">
          © {new Date().getFullYear()} FIX-IT. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
