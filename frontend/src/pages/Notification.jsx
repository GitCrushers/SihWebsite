import React, { useEffect, useState } from "react";
import axios from "axios";

const INDIAN_LANGUAGES = [
  { name: "Hindi", code: "hi" },
  { name: "Bengali", code: "bn" },
  { name: "Tamil", code: "ta" },
  { name: "Telugu", code: "te" },
  { name: "Marathi", code: "mr" },
  { name: "Gujarati", code: "gu" },
  { name: "Kannada", code: "kn" },
  { name: "Malayalam", code: "ml" },
  { name: "Punjabi", code: "pa" },
  { name: "Odia", code: "or" },
  { name: "English", code: "en" },
];

const API_BASE_URL = "https://sihwebsite-a2hp.onrender.com/api/v3";
const ALERT_URL = "https://alert-api-60gy.onrender.com/alerts";
const LATEST_DATA_URL = "https://sihwebsite-a2hp.onrender.com/api/v2/data/latest";
const GOOGLE_TRANSLATE_API_URL = "https://translation.googleapis.com/language/translate/v2";
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

const Notification = () => {
  const [alerts, setAlerts] = useState([]);
  const [latestStatus, setLatestStatus] = useState({});
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fallbackDeviceId = "device123";
  const fallbackToPhoneNumber = "+917404648978";

  const [language, setLanguage] = useState(() => localStorage.getItem("preferredLanguage") || "en");
  useEffect(() => {
    localStorage.setItem("preferredLanguage", language);
  }, [language]);

  const formatToIST = (value) => {
    if (!value) return "";
    try {
      const d = new Date(value);
      return d.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (e) {
      return String(value);
    }
  };

  const translateText = async (text, targetLang) => {
    if (!text) return text;
    if (targetLang === "en") return text;
    try {
      const res = await axios.post(
        GOOGLE_TRANSLATE_API_URL,
        {},
        { params: { q: text, target: targetLang, key: GOOGLE_API_KEY } }
      );
      return res.data.data.translations[0].translatedText;
    } catch (err) {
      console.error("Translation failed:", err);
      return text;
    }
  };

  const fetchAndTranslateAlerts = async () => {
    setIsLoading(true);
    try {
      const latestRes = await axios.get(LATEST_DATA_URL);
      const latestData = latestRes.data || {};
      const deviceId = latestData.device_id || fallbackDeviceId;

      setLatestStatus({
        device_id: deviceId,
        timestamp: latestData.timestamp || null,
        toPhoneNumber: latestData.toPhoneNumber || fallbackToPhoneNumber,
      });

      let storedAlerts = [];
      try {
        const dbRes = await axios.get(`${API_BASE_URL}/devices/${deviceId}/alerts`);
        storedAlerts = dbRes.data.alerts || [];
      } catch (err) {
        console.warn("No historical alerts found.");
      }

      // Fetch new external alerts
      const externalRes = await axios.get(ALERT_URL);
      const externalAlerts = externalRes.data.latest_status?.alerts || [];

      // Filter only new alerts
      const newAlerts = externalAlerts
        .filter(text => !storedAlerts.some(a => a.message === text))
        .map(text => ({ message: text, sentAt: new Date(), smsStatus: "pending" }));

      // Add new alerts to UI immediately
      setAlerts(prev => [...prev, ...newAlerts]);

      // Batch send new alerts to backend
      if (newAlerts.length > 0) {
        try {
          await axios.post(`${API_BASE_URL}/send-alert-batch`, {
            to: latestData.toPhoneNumber || fallbackToPhoneNumber,
            device_id: deviceId,
            messages: newAlerts.map(a => a.message),
          });

          // Mark all as sent
          setAlerts(prev =>
            prev.map(a => (newAlerts.some(n => n.message === a.message) ? { ...a, smsStatus: "sent" } : a))
          );
        } catch (err) {
          console.error("Failed to send batch alerts:", err);
        }
      }

      // Translate all alerts
      const seen = new Set();
      const translatedAlerts = await Promise.all(
        [...storedAlerts, ...newAlerts]
          .filter(a => {
            if (seen.has(a.message)) return false;
            seen.add(a.message);
            return true;
          })
          .map(async (alert) => ({
            ...alert,
            message: await translateText(alert.message || "", language),
          }))
      );

      // Remove alerts older than 20 minutes
      const now = new Date();
      const filteredAlerts = translatedAlerts.filter(
        a => !a.sentAt || (now - new Date(a.sentAt) <= 20 * 60 * 1000)
      );

      setAlerts(filteredAlerts);

    } catch (err) {
      console.error("Failed to fetch alerts:", err);
      setError("Failed to fetch alerts.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAndTranslateAlerts();
    const interval = setInterval(fetchAndTranslateAlerts, 60 * 1000);
    return () => clearInterval(interval);
  }, [language]);

  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const now = new Date();
      setAlerts(prevAlerts =>
        prevAlerts.filter(a => !a.sentAt || (now - new Date(a.sentAt) <= 20 * 60 * 1000))
      );
    }, 60 * 1000);

    return () => clearInterval(cleanupInterval);
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black via-black to-[#548F77] flex justify-center items-start pt-24 px-4">
      <div className="w-full max-w-5xl bg-black/30 border border-white/20 h-auto rounded-2xl p-6 backdrop-blur-md mt-10">
        <h1 className="text-3xl sm:text-4xl bg-gradient-to-r from-white to-[#D98484] bg-clip-text text-transparent font-bold text-center mb-6">
          Notifications / Updates
        </h1>

        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0">
          <label className="text-white text-lg">Select Language:</label>
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            className="p-2 rounded-lg bg-gray-800 text-white"
          >
            {INDIAN_LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-4 space-y-2 text-gray-300">
          <p>Device ID: {latestStatus.device_id || "N/A"}</p>
          <p>To Phone Number: {latestStatus.toPhoneNumber || fallbackToPhoneNumber}</p>
        </div>

        {error && <div className="bg-red-800 text-white p-4 rounded-lg mb-4">{error}</div>}

        {isLoading ? (
          <div className="text-center text-white">Loading alerts...</div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {alerts.length > 0 ? (
              alerts.map((alert, i) => {
                let bgClass = "from-red-800 to-red-600";
                if (alert.smsStatus === "sent") bgClass = "from-green-800 to-green-600";
                if (alert.smsStatus === "pending") bgClass = "from-yellow-800 to-yellow-600";

                return (
                  <div
                    key={i}
                    className={`${bgClass} bg-gradient-to-b rounded-2xl border border-white/30 p-4 shadow-lg`}
                  >
                    <p className="text-white font-semibold">{alert.message}</p>
                    <p className="text-gray-300 text-xs mt-1">
                      {formatToIST(alert.sentAt)} | Status: {alert.smsStatus || "pending"}
                    </p>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-gray-400">No alerts to display.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notification;
