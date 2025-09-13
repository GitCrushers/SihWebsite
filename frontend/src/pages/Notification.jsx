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

// NOTE: These URLs should be configured via environment variables in a real application
const API_BASE_URL = "https://sihwebsite-a2hp.onrender.com/api/v3";
const ALERT_URL = "https://alert-api-60gy.onrender.com/alerts";
const GOOGLE_TRANSLATE_API_URL = "https://translation.googleapis.com/language/translate/v2";
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY; // Placeholder for API key

const Notification = () => {
  const [alerts, setAlerts] = useState([]);
  const [latestStatus, setLatestStatus] = useState({});
  const [error, setError] = useState(null);
  // Load saved language or default to English
const [language, setLanguage] = useState(() => {
  return localStorage.getItem("preferredLanguage") || "en";
});

// Update localStorage whenever language changes
useEffect(() => {
  localStorage.setItem("preferredLanguage", language);
}, [language]);

  const [isLoading, setIsLoading] = useState(false);

  // Hardcoded values as per request to remove custom alerts
  const deviceId = "device123";
  const toPhoneNumber = "+917404648978";

  // Convert UTC timestamp to IST
  const formatToIST = (utcString) => {
    if (!utcString) return "";
    const utcDate = new Date(utcString);
    const istOffset = 5.5 * 60 * 60 * 1000;
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

  // Translate text using Google Translate API
  const translateText = async (text, targetLang) => {
    // If the target language is the same as the original, no need to translate
    if (targetLang === "en") return text;
    try {
      const res = await axios.post(
        GOOGLE_TRANSLATE_API_URL,
        {},
        {
          params: {
            q: text,
            target: targetLang,
            key: GOOGLE_API_KEY,
          },
        }
      );
      return res.data.data.translations[0].translatedText;
    } catch (err) {
      console.error("Translation failed:", err);
      // Fallback to original text on error
      return text;
    }
  };

  // Fetch alerts from the public API and from our database
  const fetchAndTranslateAlerts = async () => {
    setIsLoading(true);
    try {
      // Fetch the latest status from the external API
      const res = await axios.get(ALERT_URL);
      const data = res.data.latest_status;
      if (!data) return;

      setLatestStatus({
        device_id: data.device_id,
        timestamp: data.timestamp,
      });

      // Fetch all historical alerts stored in our database
      const dbRes = await axios.get(`${API_BASE_URL}/devices/${data.device_id}/alerts`);
      let storedAlerts = dbRes.data.alerts || [];
      
      // Filter for unique alerts based on the message content
      const seenMessages = new Set();
      const uniqueAlerts = storedAlerts.filter(alert => {
        if (seenMessages.has(alert.message)) {
          return false;
        } else {
          seenMessages.add(alert.message);
          return true;
        }
      });

      // Translate alerts for display
      const translatedAlerts = await Promise.all(
        uniqueAlerts.map(async (alert) => ({
          ...alert,
          message: await translateText(alert.message, language),
        }))
      );
      
      // Update the UI with all historical alerts
      setAlerts(translatedAlerts);

      // Check for new alerts from the external API and send SMS if needed
      if (data.alerts && data.alerts.length > 0) {
        for (let alertText of data.alerts) {
          const isAlreadyStored = storedAlerts.some(
            (a) => a.message === alertText
          );

      // inside fetchAndTranslateAlerts
if (!isAlreadyStored) {
  try {
    // Translate alert text before sending to backend
    const translated = await translateText(alertText, language);

    await axios.post(`${API_BASE_URL}/send-alert`, {
      to: toPhoneNumber,
      message: translated,   // already translated
      device_id: data.device_id,
      language: language,    // still pass for record
    });
    
    console.log("SMS sent for new microgrid data alert.");

              // After a successful send, re-fetch all alerts to update the UI
              const updatedDbRes = await axios.get(`${API_BASE_URL}/devices/${data.device_id}/alerts`);
              let updatedStoredAlerts = updatedDbRes.data.alerts || [];

              // Filter for unique alerts again
              const updatedSeenMessages = new Set();
              const updatedUniqueAlerts = updatedStoredAlerts.filter(alert => {
                if (updatedSeenMessages.has(alert.message)) {
                  return false;
                } else {
                  updatedSeenMessages.add(alert.message);
                  return true;
                }
              });

              const updatedTranslatedAlerts = await Promise.all(
                updatedUniqueAlerts.map(async (alert) => ({
                  ...alert,
                  message: await translateText(alert.message, language),
                }))
              );
              setAlerts(updatedTranslatedAlerts);

            } catch (smsErr) {
              console.error("Failed to send SMS for microgrid data:", smsErr);
              setError("Failed to send SMS.");
            }
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch alerts:", err);
      setError("Failed to fetch alerts.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAndTranslateAlerts();
    const interval = setInterval(fetchAndTranslateAlerts, 60 * 1000); // poll every 60s
    return () => clearInterval(interval);
  }, [language]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black via-black to-[#548F77] flex justify-center items-start pt-24 px-4">
      <div className="w-full max-w-5xl bg-black/30 border border-white/20 h-auto rounded-2xl p-6 backdrop-blur-md mt-10">
        <h1 className="text-3xl sm:text-4xl bg-gradient-to-r from-white to-[#D98484] bg-clip-text text-transparent font-bold text-center mb-6">
          Notifications / Updates
        </h1>

        {/* Language selector */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0">
          <label className="text-white text-lg">Select Language:</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="p-2 rounded-lg bg-gray-800 text-white"
          >
            {INDIAN_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* Device ID and Phone number display */}
        <div className="mb-4 space-y-2 text-gray-300">
          <p>Device ID: {deviceId}</p>
          <p>To Phone Number: {toPhoneNumber}</p>
        </div>

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
          <div className="bg-red-800 text-white p-4 rounded-lg mb-4">{error}</div>
        )}
        
        {isLoading ? (
          <div className="text-center text-white">Loading alerts...</div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {alerts.length > 0 ? (
              alerts.map((alert, index) => (
                <div
                  key={index}
                  className={`${
                    alert.message.includes("✅")
                      ? "from-green-800 to-green-600"
                      : "from-red-800 to-red-600"
                  } bg-gradient-to-b rounded-2xl border border-white/30 p-4 shadow-lg`}
                >
                  <p className="text-white font-semibold">{alert.message}</p>
                  {alert.sentAt && (
                    <p className="text-gray-300 text-xs mt-1">
                      {formatToIST(alert.sentAt)}
                    </p>
                  )}
                </div>
              ))
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
