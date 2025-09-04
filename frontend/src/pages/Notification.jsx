import React from "react";

const Notification = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black via-black to-[#548F77] flex justify-center items-start pt-24 px-4">
      <div className="w-full max-w-5xl bg-black/30 border border-white/20 h-auto rounded-2xl p-6 backdrop-blur-md mt-10">
   
        <h1 className="text-3xl sm:text-4xl bg-gradient-to-r from-white to-[#D98484] bg-clip-text text-transparent font-bold text-center mb-6">
          Notifications / Updates
        </h1>

       
        <div className="grid grid-cols-1 gap-6">
     
          <div className="bg-gradient-to-b from-[#1e1e1e] to-[#0f2d2b] rounded-2xl border border-white/30 p-4 shadow-lg">
         
            <div className="flex items-center gap-3 mb-4">
           
              <span className="text-yellow-400 font-bold">Administrator</span>
              <span className="w-2 h-2 bg-green-400 rounded-full ml-2"></span>
            </div>

            <div className="bg-black/40 rounded-xl p-4 text-gray-300 h-40">
              <p>No updates yet...</p>
            </div>

            <input
              type="text"
              placeholder="Type your message .."
              className="mt-4 w-full px-4 py-2 rounded-xl bg-gray-800/60 text-gray-200 placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          
          <div className="bg-gradient-to-b from-[#1e1e1e] to-[#0f2d2b] rounded-2xl border border-white/30 p-4 shadow-lg">
          
            <div className="flex items-center gap-3 mb-4">
              <span className="text-white font-bold">Broadcasting</span>
            </div>

            <div className="bg-black/40 rounded-xl p-4 text-gray-300 h-40">
              <p>No broadcasts yet...</p>
            </div>

            <input
              type="text"
              placeholder="Type your message .."
              className="mt-4 w-full px-4 py-2 rounded-xl bg-gray-800/60 text-gray-200 placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
