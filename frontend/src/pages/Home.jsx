import React from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()
  return (
    <>
      <section
        id="content"
        className="relative bg-gradient-to-b from-black via-black to-[#548F77] md:min-h-screen sm:min-h-screen h-auto flex flex-col items-center gap-6 pt-24 sm:pt-32 md:pt-40 px-4 overflow-hidden"
      >
      
        <div className="font-bold text-2xl sm:text-3xl md:text-5xl text-center">
          Hola! User
        </div>

        <div className="text-center font-bold text-xl sm:text-2xl md:text-4xl lg:text-5xl bg-gradient-to-r from-[#51A8D4] to-[#E4FF9A] bg-clip-text text-transparent leading-tight max-w-full sm:max-w-[700px] md:max-w-[900px]">
          A powerful online engagement tool that’s intuitive and simple to use.
        </div>

        <div className="text-gray-400 text-base sm:text-lg md:text-2xl text-center">
          Curated by Team T- XXXX
        </div>

        <button
          onClick={() => navigate('/login')}
          className="bg-gradient-to-tr z-20 text-white from-black via-black to-[#548F77] cursor-pointer border-2 px-4 sm:px-6 py-2 rounded-xl sm:rounded-2xl border-[#E4FF9A]/60 text-sm sm:text-lg md:text-xl"
        >
          Get Started
        </button>

        
        <div className="relative object-cover sm:hidden h-[350px] z-50">
  <img
    src="/imageSolar.png"
    alt="Solar Icon"
    className=" h-full object-fill"
  />
 
</div>


       
        <img
          src="/one.png"
          className="absolute right-0 top-10 sm:top-20 hidden sm:block w-[250px] md:w-[400px] lg:w-[500px] h-auto"
          alt="Right decorative"
        />
        <img
          src="/two.png"
          className="absolute bottom-0 right-0 sm:right-10 md:right-170 hidden sm:block w-[400px] md:w-[800px] lg:w-[1200px] h-auto transform scale-x-[-1]"
          alt="Left decorative"
        />
      </section>

    
      <section
        id="second"
        className="bg-black flex flex-col md:flex-row items-center justify-around gap-8 py-10 px-4 md:px-8"
      >
        <div className="flex justify-center w-full md:w-auto">
          <img
            src="/globe.png"
            className="w-[220px] sm:w-[350px] md:w-[450px] lg:w-[500px] h-auto"
            alt="Globe"
          />
        </div>

        <div className="text-[#FFFFFFB2]/70 bg-[#D9D9D933] border border-white shadow-2xl rounded-3xl md:max-w-[600px] max-w-[300px] w-full space-y-4 px-4 sm:px-6 py-5">
          <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-center md:text-left">
            Explore the World
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-300 text-center md:text-left">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex iste
            quidem fuga enim. Quas perspiciatis corporis provident molestias
            harum fugiat amet veniam doloremque tenetur iusto, delectus pariatur
            voluptate ea illum odio dolorum repellat sint temporibus maxime aut
            iure aperiam ex laborum. Veritatis, ducimus dolorem quibusdam
            expedita asperiores quo sint amet!
          </p>
          <div className="flex justify-center md:justify-center">
            <button
              onClick={() => navigate('/register')}
              className="bg-gradient-to-tr text-white from-black via-black to-[#548F77] cursor-pointer border-2 px-4 sm:px-6 py-2 rounded-xl sm:rounded-2xl border-[#E4FF9A]/60 text-sm sm:text-lg md:text-xl"
            >
              Register Now!
            </button>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home
