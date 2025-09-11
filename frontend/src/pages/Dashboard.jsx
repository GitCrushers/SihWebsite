import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useStore from "../store/store.jsx";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { motion } from "framer-motion";

const Dashboard = () => {
  const navigate = useNavigate();
  const token = useStore((state) => state.token);
  const user = useStore((state) => state.user);
  const fetchUser = useStore((state) => state.fetchUser);

  const [telemetry, setTelemetry] = useState([]);
  const [latestTelemetry, setLatestTelemetry] = useState(null);

  // Check auth and fetch user
  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else if (!user) {
      fetchUser();
    }
  }, [token, user, fetchUser, navigate]);

  // Fetch telemetry history
  useEffect(() => {
    async function fetchTelemetry() {
      try {
        const res = await axios.get(
          "https://sihwebsite-a2hp.onrender.com/api/v2/telemetry"
        );
        const data = res.data.telemetry || res.data;

        let formatted = (Array.isArray(data) ? data : [data]).map((d) => ({
          timestamp: d.timestamp,
          load_power_w: d?.load?.power_w || 0,
          solar_power_w: d?.solar?.power_w || 0,
        }));

        // Reduce points to max 12
        const maxPoints = 12;
        if (formatted.length > maxPoints) {
          const step = Math.floor(formatted.length / maxPoints);
          formatted = formatted.filter((_, i) => i % step === 0).slice(0, maxPoints);
        }

        setTelemetry(formatted);
      } catch (err) {
        console.error("Error fetching telemetry:", err);
      }
    }

    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 10000); // 10s refresh
    return () => clearInterval(interval);
  }, []);

  // Fetch latest telemetry
  useEffect(() => {
    async function fetchLatest() {
      try {
        const res = await axios.get(
          "https://sihwebsite-a2hp.onrender.com/api/v2/latestTelemetry"
        );
        const d = res.data.telemetry || res.data;

        setLatestTelemetry({
          ...d,
          solar_power_w: d?.solar?.power_w || 0,
          solar_current_a: d?.solar?.current_a || 0,
          load_power_w: d?.load?.power_w || 0,
          battery_soc: d?.battery?.soc_percent || 0,
          battery_voltage: d?.battery?.voltage_v || 0,
        });
      } catch (err) {
        console.error("Error fetching latest telemetry:", err);
      }
    }

    fetchLatest();
    const interval = setInterval(fetchLatest, 5000); // 5s refresh
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black via-black to-[#548F77] py-24 px-4 flex justify-center items-start">
      <motion.div
        className="w-full max-w-6xl bg-black/40 border border-white/20 min-h-screen mt-10 rounded-3xl p-8 backdrop-blur-lg shadow-2xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-extrabold text-center mb-10">
          <span className="bg-gradient-to-r from-cyan-400 to-teal-500 text-transparent bg-clip-text">
            User Dashboard
          </span>
        </h1>

        {/* Metric Cards */}
        {latestTelemetry && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            {/* Solar */}
            <motion.div
              className="bg-gradient-to-br from-yellow-500 to-orange-600 text-white rounded-2xl p-6 shadow-lg"
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="font-semibold text-lg mb-2">☀️ Solar</h3>
              <p className="text-sm">Power: {latestTelemetry.solar_power_w} W</p>
              <p className="text-sm">Current: {latestTelemetry.solar_current_a} A</p>
            </motion.div>

            {/* Load */}
            <motion.div
              className="bg-gradient-to-br from-cyan-600 to-blue-700 text-white rounded-2xl p-6 shadow-lg"
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="font-semibold text-lg mb-2">⚡ Load</h3>
              <p className="text-sm">Power: {latestTelemetry.load_power_w} W</p>
            </motion.div>

            {/* Battery */}
            <motion.div
              className="bg-gradient-to-br from-green-500 to-emerald-700 text-white rounded-2xl p-6 shadow-lg"
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="font-semibold text-lg mb-2">🔋 Battery</h3>
              <p className="text-sm">SOC: {latestTelemetry.battery_soc}%</p>
              <p className="text-sm">Voltage: {latestTelemetry.battery_voltage} V</p>
            </motion.div>

            {/* Device */}
            <motion.div
              className="bg-gradient-to-br from-gray-600 to-gray-800 text-white rounded-2xl p-6 shadow-lg"
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="font-semibold text-lg mb-2">📟 Device</h3>
              <p className="text-sm">{latestTelemetry.device_id}</p>
              <p className="text-xs opacity-70">
                {new Date(latestTelemetry.timestamp).toLocaleString()}
              </p>
            </motion.div>
          </div>
        )}

        {/* Graph Section */}
        <motion.div
          className="bg-gradient-to-br from-gray-800 via-gray-900 to-black h-96 rounded-2xl p-6 shadow-md mb-10"
          whileHover={{ scale: 1.01 }}
        >
          {telemetry.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetry}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis
                  dataKey="timestamp"
                  tick={{ fill: "white", fontSize: 10 }}
                  tickFormatter={(t) => {
                    const date = new Date(t);
                    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
                  }}
                />
                <YAxis tick={{ fill: "white" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1f2937", color: "white" }}
                  labelFormatter={(t) => new Date(t).toLocaleString()}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="load_power_w"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  name="Load (W)"
                />
                <Line
                  type="monotone"
                  dataKey="solar_power_w"
                  stroke="#facc15"
                  strokeWidth={2}
                  name="Solar (W)"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-center">Loading Graph...</p>
          )}
        </motion.div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            onClick={() => navigate("/dashboard/surveliance")}
            className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 text-gray-300 flex items-center justify-between cursor-pointer shadow-md hover:text-white"
            whileHover={{ scale: 1.02 }}
          >
            <span className="font-semibold">Surveillance</span>
            <span className="text-xl">→</span>
          </motion.div>

          <Link
  to="/forecasting"
  className="bg-gradient-to-br from-gray-800 via-gray-900 to-black hover:from-gray-700 hover:to-gray-800 transition-colors duration-300 rounded-3xl p-6 flex flex-col justify-between shadow-2xl border border-white/20 hover:scale-105 transform transition-transform"
>
  <div>
    <h3 className="text-3xl font-extrabold text-cyan-400 mb-2">XX | 30°</h3>
    <p className="text-yellow-400 font-medium text-sm">
      Weather Forecasting & Energy Prediction
    </p>
  </div>
  <div className="mt-4">
    {/* Optional: small icon for weather */}
    <span className="text-4xl">🌤️</span>
  </div>
</Link>

          <motion.div
            className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 flex items-center justify-center shadow-md cursor-pointer hover:scale-105 transition"
            whileHover={{ scale: 1.1 }}
          >
            <Link to="/notifications" className="flex flex-col items-center">
              <span className="text-2xl">💬</span>
              <span className="text-xs mt-1 text-gray-300">Notifications</span>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
