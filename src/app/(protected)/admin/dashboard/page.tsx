import React from 'react'

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Total Form</h2>
            <p className="text-3xl font-bold text-blue-600">1,234</p>
            <p className="text-gray-600">Form yang masuk</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Agency Aktif</h2>
            <p className="text-3xl font-bold text-green-600">45</p>
            <p className="text-gray-600">Agency terdaftar</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Pending</h2>
            <p className="text-3xl font-bold text-yellow-600">23</p>
            <p className="text-gray-600">Menunggu review</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Selesai</h2>
            <p className="text-3xl font-bold text-purple-600">1,211</p>
            <p className="text-gray-600">Form selesai</p>
          </div>
        </div>
        
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Data Form Terbaru</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="font-medium">Toko Barokah Ponorogo</p>
                <p className="text-sm text-gray-600">2 jam yang lalu</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <p className="font-medium">Warung Makan Sederhana</p>
                <p className="text-sm text-gray-600">4 jam yang lalu</p>
              </div>
              <div className="border-l-4 border-yellow-500 pl-4">
                <p className="font-medium">Kedai Kopi Mantap</p>
                <p className="text-sm text-gray-600">6 jam yang lalu</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Aksi Cepat</h2>
            <div className="space-y-3">
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                Lihat Semua Form
              </button>
              <button className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
                Export Data
              </button>
              <button className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700">
                Kelola Agency
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard