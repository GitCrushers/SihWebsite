import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import useStore from '../store/store'


const Home = () => {
  const navigate = useNavigate()
  const token = useStore((state) => state.token)
  const user = useStore((state) => state.user)
  const fetchUser = useStore((state) => state.fetchUser)

  useEffect(() => {
    if (token && !user) {
      fetchUser();
    }
  }, [token, user, fetchUser]);

  return (
    <>
      <section
        id="content"
        className="relative bg-gradient-to-b from-black via-black to-[#548F77] md:min-h-screen sm:min-h-screen h-auto flex flex-col items-center gap-6 pt-24 sm:pt-32 md:pt-40 px-4 overflow-hidden"
      >
       
       <motion.div
  initial={{ opacity: 0, y: -30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
  className="font-bold text-3xl sm:text-3xl md:text-5xl text-center"
>
  { `Hola! ${user ? user.fullname : "Guest"}` }
</motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-center font-bold text-xl sm:text-2xl md:text-4xl lg:text-5xl bg-gradient-to-r from-[#51A8D4] to-[#E4FF9A] bg-clip-text text-transparent leading-tight max-w-full sm:max-w-[700px] md:max-w-[900px]"
        >
          A powerful online engagement tool that’s intuitive and simple to use.
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.6 }}
          className="text-gray-400 text-base sm:text-lg md:text-2xl text-center"
        >
          Curated by Team T- XXXX
        </motion.div>

       
        <motion.button
  onClick={() => navigate(user ? '/dashboard' : '/login')}
  whileHover={{ scale: 1.1, textShadow: "0px 0px 8px #E4FF9A" }}
  whileTap={{ scale: 0.95 }}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 1, delay: 0.9 }}
  className="bg-gradient-to-tr z-20 text-white from-black via-black to-[#548F77] hover:from-[#548F77] hover:to-black cursor-pointer border-2 px-6 sm:px-6 py-2 rounded-xl sm:rounded-2xl border-[#E4FF9A]/60 text-sm sm:text-lg md:text-xl transition-all duration-300"
>
  {user ? "Go to Dashboard" : "Get Started"}
</motion.button>

    
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 1.2 }}
          className="relative object-cover sm:hidden h-[350px] z-50"
        >
          <img
            src="/imageSolar.png"
            alt="Solar Icon"
            className="h-full object-fill"
          />
        </motion.div>

      
        <motion.img
          src="/one.png"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.5, delay: 1 }}
          className="absolute right-0 top-10 sm:top-20 hidden sm:block w-[250px] md:w-[400px] lg:w-[500px] h-auto"
          alt="Right decorative"
        />
        <motion.img
          src="/two.png"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.5, delay: 1.3 }}
          className="absolute bottom-0 right-0 sm:right-10 md:right-170 hidden sm:block w-[400px] md:w-[800px] lg:w-[1200px] h-auto transform scale-x-[-1]"
          alt="Left decorative"
        />
      </section>

      <section
        id="second"
        className="bg-black flex flex-col md:flex-row items-center justify-around gap-8 py-10 px-4 md:px-8"
      >
       
        <motion.div
          initial={{ opacity: 0, rotate: -20, scale: 0.8 }}
          whileInView={{ opacity: 1, rotate: 0, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="flex justify-center w-full md:w-auto"
        >
          <img
            src="/globe.png"
            className="w-[220px] sm:w-[350px] md:w-[450px] lg:w-[500px] h-auto"
            alt="Globe"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-[#FFFFFFB2]/70 bg-[#D9D9D933] border border-white shadow-2xl rounded-3xl md:max-w-[600px] max-w-[300px] w-full space-y-4 px-4 sm:px-6 py-5"
        >
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
            <motion.button
              onClick={() => navigate('/register')}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-tr text-white from-black via-black to-[#548F77] hover:from-[#548F77] hover:to-black cursor-pointer border-2 px-4 sm:px-6 py-2 rounded-xl sm:rounded-2xl border-[#E4FF9A]/60 text-sm sm:text-lg md:text-xl transition-all duration-300"
            >
              Register Now!
            </motion.button>
          </div>
        </motion.div>
      </section>
    </>
  )
}

export default Home
