import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "../store/store.jsx";

const Dashboard = () => {
  const navigate = useNavigate();
  const { token, user, fetchUser } = useStore();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else if (!user) {
      fetchUser();
    }
  }, [token, user, fetchUser, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-black to-[#548F77] flex flex-col items-center justify-center text-white">
      <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
      {user ? (
        <p className="text-lg">Welcome, {user.fullname}!</p>
      ) : (
        <p className="text-lg">Loading user info...</p>
      )}
    </div>
  );
};

export default Dashboard;
