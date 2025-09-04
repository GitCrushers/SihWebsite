import React from 'react'
import { Link } from 'react-router-dom'

const Surveliance = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black via-black to-[#548F77] flex justify-center items-start pt-24 px-4">
    <div className="w-full max-w-5xl bg-black/30 border border-white/20 min-h-screen rounded-2xl p-6 backdrop-blur-md mt-10">
    
      <h1 className="text-3xl sm:text-4xl bg-gradient-to-r from-[#47BDF9] to-[#4FBC39] bg-clip-text  text-transparent font-bold text-center mb-6">
      Surveillance
      </h1>
     
      <div className="grid grid-cols-1 md:grid-cols-2 mt-15 gap-4">
     
        <div className="md:col-span-3 bg-black h-104 border-2 border-white rounded-lg flex items-center justify-center">
          <p className="text-gray-400">Main Content (Video/Graphs)</p>
        </div>

        <div className="bg-gradient-to-br row-span-4 h-50 from-gray-800 to-gray-900 rounded-lg p-4 text-white">
          <h3 className="text-2xl font-bold text-cyan-300">XX | 30°</h3>
          <p className="text-yellow-400 mt-2 font-medium">Weather</p>
        </div>

        <div className="bg-gray-800 md:col-span-2 md:row-span-2 rounded-lg p-4 text-white flex items-center justify-center">
          <p className="text-cyan-400">&lt;Stats&gt;</p>
        </div>

        <Link to="/dashboard" className="bg-gray-800 md:row-span-2 rounded-lg p-4 md:col-span-2 text-gray-400 flex items-center justify-between">
          <span className="font-semibold">Dashboard</span>
          <span className="text-xl">→</span>
        </Link>

        <div className="md:col-span-2 md:row-span-2 bg-gray-800 rounded-lg p-4 text-white">
          Supportive Text
        </div>

        <div className="bg-gray-800 md:row-span-2 rounded-lg p-4 flex items-center justify-center">
        <Link to="/notifications" className="flex flex-col items-center">
            <span className="text-2xl">💬</span>
            <span className="text-xs mt-1 text-gray-300">Notifications</span>
          </Link>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Surveliance