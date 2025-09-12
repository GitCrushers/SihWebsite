import React, { useEffect, useState } from "react";
import axios from "axios";

const Notification = () => {
  const [alerts, setAlerts] = useState([]);
  const [latestStatus, setLatestStatus] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAlerts() {
      try {
        // Fetch latest device data from your API
        const res = await axios.get(
          "https://alert-api-60gy.onrender.com/alerts"
        );
        const data = res.data.latest_status;

        if (data) {
          setLatestStatus({
            device_id: data.device_id,
            timestamp: data.timestamp,
          });
        }

        // Fetch stored alerts from your backend DB
        const dbRes = await axios.get(
          `https://sihwebsite-a2hp.onrender.com/api/v3/devices/${data.device_id}/alerts`
        );
        const storedAlerts = dbRes.data.alerts.map((a) => a.message);

        const newAlerts = [];

        if (data.alerts && data.alerts.length > 0) {
          for (let alert of data.alerts) {
            if (!storedAlerts.includes(alert)) {
              // Send SMS via backend
              try {
                await axios.post("https://sihwebsite-a2hp.onrender.com/api/v3/send-alert", {
                  to: "+918837804432",
                  message: `⚠️ Alert from device ${data.device_id}: ${alert}`,
                  device_id: data.device_id, // must match MicrogridData.device_id
                });
                
                console.log(`SMS sent for alert: ${alert}`);
              } catch (smsErr) {
                console.error("Failed to send SMS:", smsErr);
              }
            }
            newAlerts.push(alert);
          }
        } else {
          newAlerts.push("✅ No alerts found");
          console.log("No alerts detected");
        }

        setAlerts(newAlerts);
      } catch (err) {
        console.error("Failed to fetch alerts:", err);
        setAlerts([]);
        setError("Failed to fetch alerts");
      }
    }

    fetchAlerts();
  }, []);

  // Format timestamp to IST
 // Convert UTC timestamp to IST reliably
const formatToIST = (utcString) => {
  if (!utcString) return "";
  const utcDate = new Date(utcString); // UTC date
  // IST = UTC + 5:30
  const istOffset = 6.5 * 60 * 60 * 1000; // 5 hours 30 minutes in ms
  const istDate = new Date(utcDate.getTime() + istOffset);

  return istDate.toLocaleString("en-IN", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black via-black to-[#548F77] flex justify-center items-start pt-24 px-4">
      <div className="w-full max-w-5xl bg-black/30 border border-white/20 h-auto rounded-2xl p-6 backdrop-blur-md mt-10">
        <h1 className="text-3xl sm:text-4xl bg-gradient-to-r from-white to-[#D98484] bg-clip-text text-transparent font-bold text-center mb-6">
          Notifications / Updates
        </h1>

        {latestStatus.device_id && (
          <div className="bg-gradient-to-b from-green-800 to-green-600 rounded-2xl border border-white/30 p-4 mb-6 shadow-lg">
            <p className="text-white font-semibold">
              Device ID: {latestStatus.device_id}
            </p>
            {latestStatus.timestamp && (
  <p className="text-gray-300 text-sm">
    Timestamp: {formatToIST(latestStatus.timestamp)}
  </p>
)}

          </div>
        )}

        {error && (
          <div className="bg-red-800 text-white p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6">
          {alerts.length > 0 &&
            alerts.map((alert, index) => (
              <div
                key={index}
                className={`${
                  alert.includes("✅")
                    ? "from-green-800 to-green-600"
                    : "from-red-800 to-red-600"
                } bg-gradient-to-b rounded-2xl border border-white/30 p-4 shadow-lg`}
              >
                <p className="text-white font-semibold">{alert}</p>
              </div>
            ))}

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
