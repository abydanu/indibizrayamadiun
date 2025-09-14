import React from 'react'
import { ChevronDown, Globe, Instagram, Youtube, Facebook, Twitter } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-100 relative overflow-hidden">
      <div className="relative z-10">
        <div className="max-w-5xl mx-auto px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-start justify-center md:justify-start">
                <img src="./logo_indibiz.svg" alt="indibiz" className='w-28 h-28' />
              </div>

            <div className="text-center md:text-left">
              <h3 className="text-md font-bold text-gray-800 mb-4">
                Cari Tahu Info Terbaru
              </h3>
              <div className="flex justify-center md:justify-start space-x-3">
                <a href="#" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center transition-colors shadow-sm border">
                  <Instagram className="w-4 h-4 text-white" />
                </a>
                <a href="#" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center transition-colors shadow-sm border">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
                <a href="#" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center transition-colors shadow-sm border">
                  <Youtube className="w-4 h-4 text-white" />
                </a>
                <a href="#" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center transition-colors shadow-sm border">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="#" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center transition-colors shadow-sm border">
                  <Facebook className="w-4 h-4 text-white" />
                </a>
              </div>
            </div>

            {/* Right Section - Navigation Links */}
            <div className="text-center md:text-right">
              <h3 className="text-md font-bold text-gray-800 mb-4">
                Lainnya
              </h3>
              <div className="space-y-2">
                <a href="#" className="block text-sm text-gray-700 hover:text-gray-900 transition-colors">
                  Bantuan
                </a>
                <a href="#" className="block text-sm text-gray-700 hover:text-gray-900 transition-colors">
                  Petunjuk Penggunaan
                </a>
                <a href="#" className="block text-sm text-gray-700 hover:text-gray-900 transition-colors">
                  Syarat & Ketentuan
                </a>
                <a href="#" className="block text-sm text-gray-700 hover:text-gray-900 transition-colors">
                  Kebijakan Privasi
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider Line */}
        <div className="border-t border-gray-200"></div>
      </div>
    </footer>
  )
}

export default Footer