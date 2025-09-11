import React, { useEffect, useState } from "react";
import axios from "axios";

const Notification = () => {
  const [alerts, setAlerts] = useState([]);
  const [latestSolar, setLatestSolar] = useState(0);
  const [forecastSolar, setForecastSolar] = useState(0);

  useEffect(() => {
    async function fetchAlerts() {
      try {
        // 1️⃣ Today's solar
        const liveRes = await axios.get(
          "https://sihwebsite-a2hp.onrender.com/api/v2/latestTelemetry"
        );
        const todaySolar =
          liveRes.data.telemetry?.solar?.power_w || liveRes.data.solar?.power_w || 0;
        setLatestSolar(todaySolar);

        // 2️⃣ Tomorrow's forecast
        const forecastRes = await axios.get(
          "https://fixed-gridly.onrender.com/predict?city=sydney"
        );
        const predicted_kWh = forecastRes.data.predicted_energy_kWh || 0;
        const tomorrowSolar = predicted_kWh * 12000; // multiply as per request
        setForecastSolar(tomorrowSolar);

        // 3️⃣ Generate alert if tomorrow < today
        if (tomorrowSolar < todaySolar) {
          setAlerts((prev) => [
            ...prev,
            `⚠️ Alert! Tomorrow's predicted solar (${tomorrowSolar.toFixed(
              0
            )} W) is lower than today's (${todaySolar} W).`,
          ]);
        }
      } catch (err) {
        console.error("Error fetching alerts:", err);
      }
    }

    fetchAlerts();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black via-black to-[#548F77] flex justify-center items-start pt-24 px-4">
      <div className="w-full max-w-5xl bg-black/30 border border-white/20 h-auto rounded-2xl p-6 backdrop-blur-md mt-10">
        <h1 className="text-3xl sm:text-4xl bg-gradient-to-r from-white to-[#D98484] bg-clip-text text-transparent font-bold text-center mb-6">
          Notifications / Updates
        </h1>

        <div className="grid grid-cols-1 gap-6">
          {alerts.length > 0 ? (
            alerts.map((alert, index) => (
              <div
                key={index}
                className="bg-gradient-to-b from-red-800 to-red-600 rounded-2xl border border-white/30 p-4 shadow-lg"
              >
                <p className="text-white font-semibold">{alert}</p>
              </div>
            ))
          ) : (
            <div className="bg-gradient-to-b from-[#1e1e1e] to-[#0f2d2b] rounded-2xl border border-white/30 p-4 shadow-lg">
              <p className="text-gray-300">No alerts yet...</p>
            </div>
          )}

          {/* Input for sending manual messages */}
          <div className="bg-gradient-to-b from-[#1e1e1e] to-[#0f2d2b] rounded-2xl border border-white/30 p-4 shadow-lg">
            <input
              type="text"
              placeholder="Type your message .."
              className="mt-2 w-full px-4 py-2 rounded-xl bg-gray-800/60 text-gray-200 placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
