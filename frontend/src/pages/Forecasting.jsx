import React, { useEffect, useState } from "react";
import axios from "axios";
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
import { motion } from "framer-motion";

const Forecasting = () => {
  const [latestSolar, setLatestSolar] = useState(0);
  const [latestTimestamp, setLatestTimestamp] = useState("");
  const [forecastEnergy, setForecastEnergy] = useState(0);
  const [solarHistory, setSolarHistory] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [tomorrowForecast, setTomorrowForecast] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch recent telemetry for graph
        const telemetryRes = await axios.get(
          "https://sihwebsite-a2hp.onrender.com/api/v2/telemetry"
        );
        const telemetryData = telemetryRes.data.telemetry || telemetryRes.data;

        // Format data for graph
        let formattedTelemetry = (Array.isArray(telemetryData)
          ? telemetryData
          : [telemetryData]
        ).map((d) => ({
          time: new Date(d.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          solar: d?.solar?.power_w || 0,
        }));

        const maxPoints = 12;
        if (formattedTelemetry.length > maxPoints) {
          const step = Math.floor(formattedTelemetry.length / maxPoints);
          formattedTelemetry = formattedTelemetry
            .filter((_, i) => i % step === 0)
            .slice(0, maxPoints);
        }

        setSolarHistory(formattedTelemetry);

        // Latest telemetry for card
        const latest = telemetryData[telemetryData.length - 1] || telemetryData;
        setLatestSolar(latest?.solar?.power_w || 0);
        setLatestTimestamp(latest.timestamp);

        // Forecast card (initial rough estimate)
        const forecastRes = await axios.get(
          "https://fixed-gridly.onrender.com/predict?city=sydney"
        );
        const predicted_kWh = forecastRes.data.predicted_energy_kWh || 0;
        const predictedW = predicted_kWh * 1000; // kWh -> W
        setForecastEnergy(predictedW * 24); // rough total for card
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }

    fetchData();
  }, []);

  // Fetch tomorrow forecast for modal
  const handleForecastClick = async () => {
    try {
      const res = await axios.get(
        "https://fixed-gridly.onrender.com/predict?city=sydney"
      );
      const predicted_kWh = res.data.predicted_energy_kWh || 0;
      const predictedW = predicted_kWh * 12000; // multiply by 12000
      setTomorrowForecast(predictedW);
      setModalOpen(true);
    } catch (err) {
      console.error("Error fetching tomorrow forecast:", err);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black via-black to-[#548F77] py-24 px-4 flex justify-center items-start">
      <motion.div
        className="w-full max-w-6xl bg-black/40 border mt-20 border-white/20 rounded-3xl p-8 backdrop-blur-lg shadow-2xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-extrabold text-center mb-10">
          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text">
            Energy Forecasting
          </span>
        </h1>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          <motion.div
            className="bg-gradient-to-br from-green-500 to-emerald-700 text-white rounded-2xl p-6 shadow-lg"
            whileHover={{ scale: 1.05 }}
          >
            <h3 className="font-semibold text-lg mb-2">⚡ Current Solar Generation</h3>
            <p className="text-3xl font-bold">{latestSolar} W</p>
            <p className="text-sm opacity-80">
              As of {latestTimestamp && new Date(latestTimestamp).toLocaleTimeString()}
            </p>
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

        {/* Graph */}
        <motion.div
          className="bg-gradient-to-br from-gray-800 via-gray-900 to-black h-96 rounded-2xl p-6 shadow-md"
          whileHover={{ scale: 1.01 }}
        >
          {solarHistory.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={solarHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="time" tick={{ fill: "white" }} />
                <YAxis tick={{ fill: "white" }} />
                <Tooltip contentStyle={{ backgroundColor: "#1f2937", color: "white" }} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="solar"
                  stroke="#22d3ee"
                  strokeWidth={2}
                  name="Solar Power (W)"
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-center">Loading live solar data...</p>
          )}
        </motion.div>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
            <div className="bg-black/90 p-6 rounded-2xl max-w-md w-full text-white shadow-xl">
              <h2 className="text-2xl font-bold mb-4">Tomorrow's Forecasted Power</h2>
              <div className="bg-gray-800 p-4 rounded mb-4 text-center">
                <p className="text-lg font-semibold">
                  {tomorrowForecast} W
                </p>
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
