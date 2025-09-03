import React from "react"

const Register = () => {
  return (
    <div className="bg-gradient-to-b from-black via-black to-[#548F77] min-h-screen flex items-center justify-center px-4">
      <div className="bg-[#D9D9D933] border border-white/30 shadow-2xl rounded-3xl w-full max-w-md mt-10 p-8 space-y-6 text-white">
     
        <h2 className="text-2xl sm:text-3xl font-bold text-center">
          Create an Account
        </h2>
        <p className="text-gray-300 text-center text-sm sm:text-base">
          Join us today by filling out the form below
        </p>

      
        <form className="space-y-5">
      
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full px-4 py-2 rounded-xl bg-black/40 border border-white/30 focus:outline-none focus:border-[#E4FF9A] focus:ring-1 focus:ring-[#E4FF9A] placeholder-gray-400"
            />
          </div>

       
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              placeholder="Choose a username"
              className="w-full px-4 py-2 rounded-xl bg-black/40 border border-white/30 focus:outline-none focus:border-[#E4FF9A] focus:ring-1 focus:ring-[#E4FF9A] placeholder-gray-400"
            />
          </div>

         
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-xl bg-black/40 border border-white/30 focus:outline-none focus:border-[#E4FF9A] focus:ring-1 focus:ring-[#E4FF9A] placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              className="w-full px-4 py-2 rounded-xl bg-black/40 border border-white/30 focus:outline-none focus:border-[#E4FF9A] focus:ring-1 focus:ring-[#E4FF9A] placeholder-gray-400"
            />
          </div>

         
          <div>
            <label className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Re-enter password"
              className="w-full px-4 py-2 rounded-xl bg-black/40 border border-white/30 focus:outline-none focus:border-[#E4FF9A] focus:ring-1 focus:ring-[#E4FF9A] placeholder-gray-400"
            />
          </div>

        
          <button
            type="submit"
            className="w-full py-2 rounded-xl bg-gradient-to-tr from-black via-black to-[#548F77] border-2 border-[#E4FF9A]/60 font-semibold text-lg hover:scale-105 transition-all duration-300"
          >
            Register
          </button>
        </form>

        <p className="text-center text-gray-300 text-sm">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-[#E4FF9A] hover:underline font-medium"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  )
}

export default Register
