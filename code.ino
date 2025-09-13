#include <WiFi.h>
#include <HTTPClient.h>
#include <Firebase_ESP_Client.h>
#include <TinyGsmClient.h>
#include <WebServer.h>
#include <ArduinoJson.h>
#include <time.h>

// ========== Wi-Fi credentials ==========
#define WIFI_SSID "HostelB"
#define WIFI_PASSWORD "hostelnet"

// ========== Firebase credentials ==========
#define API_KEY "AIzaSyA8ZOP9vZJJT1zR90C8LrAO6mZo-5KJGmE"
#define DATABASE_URL "sunshare-78ba8-default-rtdb.asia-southeast1.firebasedatabase.app"

// ========== Backend API endpoint ==========
#define API_URL "https://sihwebsite-a2hp.onrender.com/api/v2/data"

const long gmtOffset_sec = 19800; // IST +5:30
const int daylightOffset_sec = 0;
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;


// Get timestamp in ISO format
String getTimeStamp() {
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) return "1970-01-01T00:00:00Z";

  char buffer[30];
  strftime(buffer, sizeof(buffer), "%Y-%m-%dT%H:%M:%SZ", &timeinfo);
  return String(buffer);
}


// Send telemetry to backend
void sendTelemetry(float solar_current, float solar_voltage, float battery_soc,
                   float battery_volt, float load_power) {

  String payload = "{";
  payload += "\"device_id\":\"site-001\",";
  payload += "\"solar_current_a\":" + String(solar_current) + ",";
  payload += "\"solar_voltage_v\":" + String(solar_voltage) + ",";
  payload += "\"solar_power_w\":" + String(solar_current * solar_voltage) + ",";
  payload += "\"battery_soc_percent\":" + String(battery_soc) + ",";
  payload += "\"battery_voltage_v\":" + String(battery_volt) + ",";
  payload += "\"load_power_w\":" + String(load_power) + ",";
  payload += "\"firmware_version\":\"v1.2.0\",";
  payload += "\"location\":\"grid-node-12\"";
  payload += "}";

  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(API_URL);
    http.addHeader("Content-Type", "application/json");

    int httpResponseCode = http.POST(payload);
    if (httpResponseCode > 0) {
      Serial.printf("✅ Sent to backend, code: %d\n", httpResponseCode);
      Serial.println(http.getString());
    } else {
      Serial.printf("❌ HTTP Error: %s\n", http.errorToString(httpResponseCode).c_str());
    }
    http.end();
  }
}

// Send telemetry to Firebase
void sendFirebase(float solar_current, float solar_voltage, float battery_soc,
                  float battery_volt, float load_power, String timestamp) {
  FirebaseJson json;
  json.set("device_id", "site-001");
  json.set("timestamp", timestamp);
  json.set("solar/current_a", solar_current);
  json.set("solar/voltage_v", solar_voltage);
  json.set("solar/power_w", solar_current * solar_voltage);
  json.set("battery/soc_percent", battery_soc);
  json.set("battery/voltage_v", battery_volt);
  json.set("load/power_w", load_power);
  json.set("metadata/firmware_version", "v1.2.0");
  json.set("metadata/location", "grid-node-12");

  if (Firebase.RTDB.setJSON(&fbdo, "microgrid/data", &json)) {
    Serial.println("✅ Updated Firebase datapoint");
  } else {
    Serial.printf("❌ Firebase FAILED: %s\n", fbdo.errorReason().c_str());
  }
}

// =================== Setup ===================
void setup() {
  Serial.begin(115200);

  // Connect Wi-Fi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.println("✅ Wi-Fi Connected: " + WiFi.localIP().toString());

  // Initialize GSM
  setupGSM();

  // Setup server for alerts
  server.on("/receive-alerts", HTTP_POST, handleReceiveAlerts);
  server.begin();
  Serial.println("✅ ESP Server started");

  // Setup NTP
  configTime(gmtOffset_sec, daylightOffset_sec, "pool.ntp.org", "time.nist.gov");

  // Firebase setup
  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;
  if (Firebase.signUp(&config, &auth, "", "")) {
    Serial.println("✅ Firebase signUp successful");
  } else {
    Serial.printf("❌ Firebase signUp failed: %s\n", config.signer.signupError.message.c_str());
  }
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
}

// =================== Loop ===================
void loop() {
  server.handleClient(); // Handle incoming alert requests

  // Dummy telemetry
  float solar_current = random(50, 100) / 10.0;
  float solar_voltage = 220.0;
  float battery_soc = random(50, 100);
  float battery_volt = 52.0 + random(-5, 5) / 10.0;
  float load_power = random(800, 1500);
  String timestamp = getTimeStamp();

  // Send telemetry
  sendTelemetry(solar_current, solar_voltage, battery_soc, battery_volt, load_power);
  sendFirebase(solar_current, solar_voltage, battery_soc, battery_volt, load_power, timestamp);

  delay(5000); // Every 5 seconds
}
