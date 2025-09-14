import React from 'react'

const AgencyDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Agency Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Data Form</h2>
            <p className="text-gray-600">Kelola data form yang masuk</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Laporan</h2>
            <p className="text-gray-600">Lihat laporan dan statistik</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Pengaturan</h2>
            <p className="text-gray-600">Konfigurasi sistem</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AgencyDashboard

