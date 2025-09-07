import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useStore from "../store/store.jsx";

const Register = () => {
  const navigate = useNavigate();
  const register = useStore((state) => state.register);
  const [form, setForm] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const {loading} = useStore();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const res = await register({
      fullname: form.fullname,
      username: form.username,
      email: form.email,
      password: form.password,
    });

    if (res.success) {
      navigate("/login");
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="bg-gradient-to-b from-black via-black to-[#548F77] min-h-screen flex items-center justify-center px-4">
      <div className="bg-[#D9D9D933] border border-white/30 shadow-2xl rounded-3xl w-full max-w-md p-8 space-y-6 text-white">
        <h2 className="text-2xl sm:text-3xl font-bold text-center">
          Create an Account
        </h2>
        <p className="text-gray-300 text-center text-sm sm:text-base">
          Join us today by filling out the form below
        </p>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <input
            name="fullname"
            value={form.fullname}
            onChange={handleChange}
            type="text"
            placeholder="Full Name"
            className="w-full px-4 py-2 rounded-xl bg-black/40 border border-white/30 focus:outline-none focus:border-[#E4FF9A] focus:ring-1 focus:ring-[#E4FF9A] placeholder-gray-400"
          />
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            type="text"
            placeholder="Username"
            className="w-full px-4 py-2 rounded-xl bg-black/40 border border-white/30 focus:outline-none focus:border-[#E4FF9A] focus:ring-1 focus:ring-[#E4FF9A] placeholder-gray-400"
          />
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
          <input
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            type="password"
            placeholder="Confirm Password"
            className="w-full px-4 py-2 rounded-xl bg-black/40 border border-white/30 focus:outline-none focus:border-[#E4FF9A] focus:ring-1 focus:ring-[#E4FF9A] placeholder-gray-400"
          />

          <button
            type="submit"
            className="w-full py-2 rounded-xl bg-gradient-to-tr from-black via-black to-[#548F77] border-2 border-[#E4FF9A]/60 font-semibold text-lg hover:scale-105 transition-all duration-300"
          >
           {loading? "Registering" : "Register"}
          </button>
        </form>

        <p className="text-center text-gray-300 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-[#E4FF9A] hover:underline font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
