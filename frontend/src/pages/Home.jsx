import React from 'react'
import Globe from 'react-globe.gl';

const Home = () => {
  return (
    <>
  
      <section
        id="content"
        className="relative bg-gradient-to-b from-black via-black to-[#548F77] min-h-screen flex flex-col items-center gap-6 pt-40 overflow-hidden"
      >
        <div className="font-bold text-5xl">Hola! User</div>

        <div className="text-center font-bold text-5xl bg-gradient-to-r from-[#51A8D4] to-[#E4FF9A] bg-clip-text text-transparent max-w-[900px] leading-tight">
          A powerful online engagement tool that’s intuitive and simple to use.
        </div>

        <div className="text-gray-400 text-2xl">Curated by Team T- XXXX</div>

        <button className="bg-gradient-to-tr from-black via-black to-[#548F77] border-2 px-6 py-2.5 rounded-2xl border-[#E4FF9A]/60 text-xl">
          Get Started
        </button>

        <img
          src="/one.png"
          className="absolute right-0 top-30 w-[500px] h-auto"
          alt="Right decorative"
        />
        <img
          src="/two.png"
          className="absolute bottom-0 right-170 w-[1200px] h-auto transform scale-x-[-1]"
          alt="Left decorative"
        />
      </section>

     
      <section
        id="second"
        className="bg-black flex flex-col md:flex-row items-center justify-center gap-8 py-5 h-auto"
      >
       
        <div className="  ">
          <div className="w-[600px] h-[600px]">
          <Globe
  width={600}
  height={600}
  backgroundColor="rgba(0,0,0,0)"
  globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
  bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
/>


          </div>
        </div>

        <div className=" text-[#FFFFFFB2]/70 bg-gray-400 rounded-3xl max-w-[500px] space-y-4 px-6 py-5">
          <h2 className="text-4xl font-bold">Explore the World</h2>
          <p className="text-lg text-gray-300">
            This interactive 3D globe helps visualize global engagement,
            connections, and data with an immersive experience.
          </p>
          <button className="bg-gradient-to-tr from-[#51A8D4] to-[#E4FF9A] px-6 py-2 rounded-xl text-black font-semibold">
            Learn More
          </button>
        </div>
      </section>
    </>
  )
}

export default Home
