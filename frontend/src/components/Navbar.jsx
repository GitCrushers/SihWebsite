import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const navItems = [
    { label: "Home", path: "/" },
    { label: "Dashboard", path: "/dashboard" },
    { label: "Team", path: "/team" },
    { label: "About", path: "/about" },
  ];

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[75%] md:w-[25%] sm:w-[28%] z-60">
      <nav className="flex justify-center items-center border border-[#E4FF9A]/60 backdrop-blur-md py-2 px-4 sm:px-6 rounded-full text-white font-medium space-x-4 sm:space-x-6 md:space-x-10">
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
    </header>
  );
};

export default Navbar;
