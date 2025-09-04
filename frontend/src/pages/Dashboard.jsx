import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useStore from "../store/store.jsx";

const Dashboard = () => {
  const navigate = useNavigate();
  const token = useStore((state) => state.token);
  const user = useStore((state) => state.user);
  const fetchUser = useStore((state) => state.fetchUser);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else if (!user) {
      fetchUser();
    }
  }, [token, user, fetchUser, navigate]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black via-black to-[#548F77] flex justify-center items-start pt-24 px-4">
      <div className="w-full max-w-5xl bg-black/30 border border-white/20 min-h-screen rounded-2xl p-6 backdrop-blur-md mt-10">
      
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6">
          <span className="text-cyan-400">User</span>{" "}
          <span className="text-white">Dashboard</span>
        </h1>

        <div className="bg-gradient-to-r from-blue-700 to-indigo-900 text-white rounded-lg p-4 flex justify-between items-center mb-6">
          <div>
            <h2 className="font-semibold text-lg">
              {user?.fullname || "Mark Louis"}
            </h2>
            <p className="text-sm">XYZ Organization</p>
          </div>
          <div className="text-right text-sm">
            <p>ID - 33XX67A</p>
            <p>Adarsh Nagar, Mohali</p>
          </div>
        </div>

       
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       
          <div className="md:col-span-3 bg-black h-94 border-2 border-white rounded-lg flex items-center justify-center">
            <p className="text-gray-400">Main Content (Video/Graphs)</p>
          </div>

          <div className="bg-gradient-to-br row-span-2 h-50 from-gray-800 to-gray-900 rounded-lg p-4 text-white">
            <h3 className="text-2xl font-bold text-cyan-300">XX | 30°</h3>
            <p className="text-yellow-400 mt-2 font-medium">Weather</p>
          </div>

          <div className="bg-gray-800 md:col-span-2 rounded-lg p-4 text-white flex items-center justify-center">
            <p className="text-cyan-400">&lt;Stats&gt;</p>
          </div>

          <div onClick={()=>navigate("/dashboard/surveliance")} className="bg-gray-800 rounded-lg p-4 md:col-span-2 text-gray-400 flex items-center justify-between">
            <span className="font-semibold">Surveillance</span>
            <span className="text-xl">→</span>
          </div>

          <div className="md:col-span-2 bg-gray-800 rounded-lg p-4 text-white">
            Supportive Text
          </div>

          <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-center">
            <Link to="/notifications" className="flex flex-col items-center">
              <span className="text-2xl">💬</span>
              <span className="text-xs mt-1 text-gray-300">Notifications</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
