import React from 'react'

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-black to-[#548F77] pt-40 text-white">
    <section class="flex flex-col md:flex-row items-center justify-between px-10 md:px-20 py-16">
     
      <div class="md:w-1/2">
        <h2 class="text-6xl font-bold">
    <span class="bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">About US</span>
  </h2>
        <p class="mt-9 text-gray-300 leading-relaxed">
          We design intelligent solutions that transform renewable microgrids into smarter, more reliable, and truly sustainable systems. By seamlessly integrating IoT-based monitoring, AI-driven forecasting, and computer vision diagnostics, our platform provides a complete view of energy generation, storage, and consumption. Operators gain real-time insights, anticipate future demand and supply with predictive analytics, and ensure system health through automated fault detection. This holistic approach empowers rural communities to reduce inefficiencies, lower costs, and achieve energy independence with clarity, efficiency, and confidence.
        </p>
      </div>
  
   
      <div class="md:w-1/2 flex justify-center mt-10 md:mt-0">
        <img src="/Energy_System_Renewable_Energy_Sustainable_Energy_PNG-removebg-preview 1.png" alt="About" class="w-80 md:w-96"/>
      </div>
    </section>
</div>
  )
}

export default About