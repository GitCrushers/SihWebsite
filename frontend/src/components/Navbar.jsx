import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "../store/store.jsx";
import { HiMenu, HiX } from "react-icons/hi";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, token, fetchUser, logout } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (token && !user) {
      fetchUser();
    }
  }, [token, user, fetchUser]);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMobileOpen(false);
  };

  // Links for the rounded navbar (including Home)
  const navItems = token
    ? [
        { label: "Home", path: "/" },
        { label: "Dashboard", path: "/dashboard" },
        { label: "Team", path: "/team" },
        { label: "About", path: "/about" },
      ]
    : [
        { label: "Home", path: "/" },
        { label: "Team", path: "/team" },
        { label: "About", path: "/about" },
      ];

  return (
    <header className="fixed top-6 w-full z-60 px-4 sm:px-6 flex flex-col items-center">
      {/* Desktop Navbar */}
      <div className="hidden md:flex justify-center items-center space-x-4 sm:space-x-6 md:space-x-10 w-full max-w-2xl">
        <nav className="flex justify-center items-center border border-[#E4FF9A]/60 backdrop-blur-md py-3 px-5 sm:px-6 rounded-full text-white font-medium space-x-4 sm:space-x-6 md:space-x-10 mx-auto">
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className="relative group text-sm sm:text-base md:text-lg tracking-wide"
            >
              {item.label}
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-yellow-400 transition-all group-hover:w-full"></span>
            </button>
          ))}
        </nav>

        {token && user && (
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        )}
      </div>

      {/* Mobile Navbar */}
      <div className="md:hidden flex justify-between items-center border border-[#E4FF9A]/60 backdrop-blur-md py-3 px-5 sm:px-6 rounded-full text-white font-medium w-full max-w-md">
        <button onClick={() => navigate("/")} className="text-white font-bold">
          Home
        </button>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white focus:outline-none">
          {mobileOpen ? <HiX size={28} /> : <HiMenu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="md:hidden mt-2 bg-black px-4 py-4 space-y-3 rounded-xl mx-auto max-w-md">
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
              className="block w-full text-left text-white font-medium py-2 px-3 rounded hover:bg-yellow-400/20 transition"
            >
              {item.label}
            </button>
          ))}

          {token && user && (
            <button
              onClick={handleLogout}
              className="block w-full text-left text-red-600 font-medium py-2 px-3 rounded hover:bg-red-600/20 transition"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
