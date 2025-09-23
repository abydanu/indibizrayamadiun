"use client"

import { Header } from '@/features/smartsync-dashboard/components/header'
import { Main } from '@/features/smartsync-dashboard/components/main'
import { ThemeSwitch } from '@/shared/components/theme-switch'
import { Button } from '@/shared/ui/button'
import { Users, Package } from 'lucide-react'
import Link from 'next/link'
import { ThemeLogo } from '@/shared/components/custom/ThemeLogo'
import { useState, useEffect } from 'react'

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2">
            <ThemeLogo 
              width={90}
              height={90}
              className="h-8 w-auto"
            />
          </div>
          <div className="flex items-center space-x-4">
            <ThemeSwitch />
          </div>
        </div>
      </Header>

      <Main className="flex items-center justify-center">
        <div className="max-w-4xl w-full mx-auto px-4 py-12">
          <div className={`text-center mb-12 transition-all duration-500 ease-in-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            
            <h1 className={`text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 transition-all duration-500 ease-in-out delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Selamat Datang di <span className="text-red-600 dark:text-red-500">Indibiz</span>
            </h1>
            
            <p className={`text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto transition-all duration-500 ease-in-out delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Sistem manajemen terintegrasi untuk mengelola data sales, agency, paket, dan promo Indibiz dengan mudah dan efisien.
            </p>
            
          </div>
          
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto transition-all duration-500 ease-in-out delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {[
              {
                icon: <Users className="h-8 w-8 text-red-600" />,
                title: "Kelola Data Sales",
                description: "Kelola data sales dengan mudah dan terstruktur.",
                href: "/admin/sales"
              },
              {
                icon: <Package className="h-8 w-8 text-red-600" />,
                title: "Manajemen Paket",
                description: "Kelola berbagai paket Indibiz yang tersedia.",
                href: "/admin/paket"
              }
            ].map((feature, index) => (
              <Link
                key={index}
                href={feature.href}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              >
                <div className="h-12 w-12 rounded-lg bg-red-50 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </Link>
            ))}
          </div>
          
          <div className={`mt-16 text-center text-sm text-gray-500 dark:text-gray-400 transition-opacity duration-500 ease-in-out delay-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
            <p>© {new Date().getFullYear()} Indibiz. All rights reserved.</p>
          </div>
        </div>
      </Main>
    </div>
  )
}