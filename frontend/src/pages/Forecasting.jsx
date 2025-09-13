import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
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

const Forecasting = () => {
  const [telemetry, setTelemetry] = useState([]);
  
  const [latestTelemetry, setLatestTelemetry] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [tomorrowForecast, setTomorrowForecast] = useState(null);

  const formatToIST = (utcString) => {
    return new Date(utcString).toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    async function fetchTelemetry() {
      try {
        const res = await axios.get(
          "https://sihwebsite-a2hp.onrender.com/api/v2/data"
        );
        const data = res.data.data || [];

        let formatted = data.map((d) => ({
          timestamp: d.createdAt,
          solar_power_w: d.solar_power_w || 0,
          load_power_w: d.load_power_w || 0,
        }));

        // Limit to last 12 points
        if (formatted.length > 12) {
          formatted = formatted.slice(-12);
        }

        setTelemetry(formatted);

        // Latest telemetry
        
      } catch (err) {
        console.error("Error fetching telemetry:", err);
      }
    }

    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 10000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    async function fetchLatestTelemetry() {
      try {
        const res = await axios.get(
          "https://sihwebsite-a2hp.onrender.com/api/v2/data/latest"
        );
        const data = res.data.data; // single object
  
        setLatestTelemetry({
          timestamp: data.createdAt,
          solar_power_w: data.solar_power_w || 0,
          solar_current_a: data.solar_current_a || 0,
          solar_voltage_v: data.solar_voltage_v || 0,
          load_power_w: data.load_power_w || 0,
          battery_soc: data.battery_soc_percent || 0,
          battery_voltage: data.battery_voltage_v || 0,
          device_id: data.device_id,
        });
      } catch (err) {
        console.error("Error fetching latest telemetry:", err);
      }
    }
  
    fetchLatestTelemetry();
    const interval = setInterval(fetchLatestTelemetry, 10000);
    return () => clearInterval(interval);
  }, []);
  
  
  const handleForecastClick = async () => {
    try {
      const res = await axios.get(
        "https://fixed-gridly.onrender.com/predict?city=sydney"
      );
      const predicted_kWh = res.data.predicted_energy_kWh || 0;
      const predictedW = predicted_kWh * 12000; // scale factor
      setTomorrowForecast(predictedW);
      setModalOpen(true);
    } catch (err) {
      console.error("Error fetching forecast:", err);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black via-black to-[#548F77] py-24 px-4 flex justify-center items-start">
      <motion.div
        className="w-full max-w-6xl bg-black/40 border mt-15 border-white/20 rounded-3xl p-8 backdrop-blur-lg shadow-2xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-extrabold text-center mb-10">
          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text">
            Energy Forecasting
          </span>
        </h1>

        {/* Latest telemetry cards */}
        {latestTelemetry && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            <motion.div
              className="bg-gradient-to-br from-yellow-500 to-orange-600 text-white rounded-2xl p-6 shadow-lg"
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="font-semibold text-lg mb-2">☀️ Solar</h3>
              <p className="text-sm">Power: {latestTelemetry.solar_power_w} W</p>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-cyan-600 to-blue-700 text-white rounded-2xl p-6 shadow-lg"
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="font-semibold text-lg mb-2">⚡ Load</h3>
              <p className="text-sm">Power: {latestTelemetry.load_power_w} W</p>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-yellow-500 to-orange-600 text-white rounded-2xl p-6 shadow-lg flex flex-col justify-between"
              whileHover={{ scale: 1.05 }}
            >
              <button
                className="mt-4 w-full bg-white/20 hover:bg-white/30 text-white py-2 rounded-xl font-semibold"
                onClick={handleForecastClick}
              >
                Show Tomorrow Forecast
              </button>
            </motion.div>
          </div>
        )}

        {/* Graph */}
        <motion.div
          className="bg-gradient-to-br from-gray-800 via-gray-900 to-black h-96 rounded-2xl p-6 shadow-md mb-10"
          whileHover={{ scale: 1.01 }}
        >
          {telemetry.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
          <LineChart data={[...telemetry].reverse()}> {/* Reverse the array */}
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis
              dataKey="timestamp"
              tick={{ fill: "white", fontSize: 10 }}
              tickFormatter={(t) => formatToIST(t)}
            />
            <YAxis tick={{ fill: "white" }} />
            <Tooltip
              contentStyle={{ backgroundColor: "#1f2937", color: "white" }}
              labelFormatter={(t) =>
                new Date(t).toLocaleString("en-IN", {
                  timeZone: "Asia/Kolkata",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })
              }
            />
            <Legend />
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

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
            <div className="bg-black/90 p-6 rounded-2xl max-w-md w-full text-white shadow-xl">
              <h2 className="text-2xl font-bold mb-4">Tomorrow's Forecasted Power</h2>
              <div className="bg-gray-800 p-4 rounded mb-4 text-center">
                <p className="text-lg font-semibold">{tomorrowForecast} W</p>
              </div>
              <button
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl font-semibold"
                onClick={() => setModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Forecasting;
