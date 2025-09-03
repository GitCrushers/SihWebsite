import React from 'react'
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const navItems = [
        { label: "Home", path: "/" },
        { label: "Dashboard", path: "/dashboard" },
        { label: "Team", path: "/team" },
        { label: "About", path: "/about" },
      ];
    
  return (
    <>
        <header className="fixed top-10 left-1/2 -translate-x-1/2 flex items-center justify-between w-[95%] md:w-[90%] px-4 md:px-8 py-4 z-50">
        <nav className="flex absolute w-[40%] max-w-5xl border border-[#E4FF9A]/60 left-1/2 -translate-x-1/2 items-center space-x-12 backdrop-blur-md justify-center py-3 rounded-full px-5 text-white font-medium">
    {navItems.map((item, index) => (
      <button
        key={index}
        onClick={() => navigate(item.path)}
        style={{ color: `${"white"}` }}
        className="relative group space-x-12 px-5 text-lg tracking-wide"
      >
        {item.label}
        <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-yellow-400 transition-all group-hover:w-full"></span>
      </button>
    ))}
  </nav>
        </header>
    </>
  )
}

export default Navbar