import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useStore from "../store/store.jsx";

const Login = () => {
  const navigate = useNavigate();
  const login = useStore((state) => state.login);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const res = await login({ email: form.email, password: form.password });
    if (res.success) {
      navigate("/"); 
    } else {
      setError(res.message);
    }
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="bg-gradient-to-b from-black via-black to-[#548F77] min-h-screen flex items-center justify-center px-4">
      <div className="bg-[#D9D9D933] border border-white/30 shadow-2xl rounded-3xl w-full max-w-md p-8 space-y-6 text-white">
        <h2 className="text-2xl sm:text-3xl font-bold text-center">Welcome Back</h2>
        <p className="text-gray-300 text-center text-sm sm:text-base">
          Please login to your account
        </p>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 rounded-xl bg-black/40 border border-white/30 focus:outline-none focus:border-[#E4FF9A] focus:ring-1 focus:ring-[#E4FF9A] placeholder-gray-400"
          />
          <input
            name="password"
            value={form.password}
            onChange={handleChange}
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 rounded-xl bg-black/40 border border-white/30 focus:outline-none focus:border-[#E4FF9A] focus:ring-1 focus:ring-[#E4FF9A] placeholder-gray-400"
          />

<button
        type="submit"
        disabled={isLoading}
        className={`w-full py-2 rounded-xl font-semibold text-lg border-2 transition-all duration-300
          ${isLoading 
            ? "bg-gradient-to-tr from-gray-700 via-gray-800 to-[#6FAF97] border-[#E4FF9A]/30 cursor-not-allowed opacity-70" 
            : "bg-gradient-to-tr from-black via-black to-[#548F77] border-[#E4FF9A]/60 hover:scale-105"
          }`}
      >
         {isLoading ? "Logining..." : "Login"}
          </button>
        </form>

        <div className="text-right">
          <a href="/forgot-password" className="text-[#E4FF9A] hover:underline text-sm">
            Forgot Password?
          </a>
        </div>

        <p className="text-center text-gray-300 text-sm">
          Don’t have an account?{" "}
          <Link to="/register" className="text-[#E4FF9A] hover:underline font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
