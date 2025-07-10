import React from 'react'
import { Sparkles, Mail, Phone, MapPin, Twitter, Instagram, Facebook, Github } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-6 sm:w-8 h-6 sm:h-8 text-purple-400" />
              <span className="text-lg sm:text-xl font-bold text-white">TryOn Studio</span>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm">
              Experience the future of fashion with AI-powered virtual try-ons. 
              See how clothes look on you before you buy.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Product</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">Features</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">Pricing</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">API</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">Integrations</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">Press</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-xs sm:text-sm">
                <Mail className="w-4 h-4 text-purple-400" />
                <a href="mailto:support@tryonstudio.com" className="text-gray-400 hover:text-white transition-colors break-all">
                  support@tryonstudio.com
                </a>
              </li>
              <li className="flex items-center space-x-2 text-xs sm:text-sm">
                <Phone className="w-4 h-4 text-purple-400" />
                <a href="tel:+1-555-TRYON-AI" className="text-gray-400 hover:text-white transition-colors">
                  +1 (555) TRYON-AI
                </a>
              </li>
              <li className="flex items-start space-x-2 text-xs sm:text-sm">
                <MapPin className="w-4 h-4 text-purple-400 mt-0.5" />
                <span className="text-gray-400">
                  123 Fashion Ave<br className="hidden sm:inline" />
                  San Francisco, CA 94102
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-gray-400 text-xs sm:text-sm">
            © 2025 TryOn Studio. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center sm:justify-end space-x-4 sm:space-x-6">
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}