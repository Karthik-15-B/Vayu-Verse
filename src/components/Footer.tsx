
import { Mail, Phone, Instagram, Linkedin, Twitter, ExternalLink } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">EcoSphere</h3>
            <p className="text-gray-400 text-sm">
              Your complete AI-powered environmental platform for monitoring air quality, tracking carbon footprint, and making sustainable choices.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/live-aqi" className="text-gray-400 hover:text-white">Live AQI Updates</a></li>
              <li><a href="/aqi-insights" className="text-gray-400 hover:text-white">AQI Insights</a></li>
              <li><a href="/carbon-tracker" className="text-gray-400 hover:text-white">Carbon Tracker</a></li>
              <li><a href="/green-wallet" className="text-gray-400 hover:text-white">Green Wallet</a></li>
              <li><a href="/plant-designer" className="text-gray-400 hover:text-white">Plant Designer</a></li>
              <li><a href="/waste-scan" className="text-gray-400 hover:text-white">WasteScan AI</a></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="https://instagram.com/praneethinspires" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com/in/dspraneeth" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://x.com/DSPRANEETHREDDY" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://www.researchgate.net/profile/Sai-Praneeth-Reddy-Dhadi" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <ExternalLink className="w-5 h-5" />
              </a>
              <a href="https://medium.com/@spreddydhadi" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400">spreddydhadi@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400">+91 9876543210</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-4 text-center text-gray-400 text-sm">
          <p>&copy; 2024 EcoSphere. All rights reserved. Developed by Dhana Sri Reddy Soli & Team</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
