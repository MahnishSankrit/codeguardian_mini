// Central API configuration and utilities
const API_BASE = {
  REPO_SERVICE: import.meta.env.VITE_REPO_SERVICE_URL || "http://localhost:5001/api",
  AI_REVIEW_SERVICE: import.meta.env.VITE_AI_REVIEW_SERVICE_URL || "http://localhost:5002/api",
  METRICS_SERVICE: import.meta.env.VITE_METRICS_SERVICE_URL || "http://localhost:5003/api",
  NOTIFICATION_SERVICE: import.meta.env.VITE_NOTIFICATION_SERVICE_URL || "http://localhost:5004/notify",
  INSIGHT_SERVICE: import.meta.env.VITE_INSIGHT_SERVICE_URL || "http://localhost:5005/api",
};

const apiCall = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      throw new Error(`HTTP error! status: ${response.status} — ${errorText}`);
    }

    try {
      return await response.json();
    } catch {
      return {};
    }
  } catch (error) {
    console.error("❌ API call failed:", error);
    throw error;
  }
};

const api = async (path, service = "REPO_SERVICE", options = {}) => {
  const base = API_BASE[service];
  if (!base) throw new Error(`Unknown service: ${service}`);
  const fullUrl = path.startsWith("http") ? path : `${base}${path}`;
  return apiCall(fullUrl, options);
};

export default {
  API_BASE,
  apiCall,
  api,
};
