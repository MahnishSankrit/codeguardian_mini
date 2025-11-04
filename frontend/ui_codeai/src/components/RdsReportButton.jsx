import React, { useState } from "react";

export default function RdsReportButton() {
  const [loading, setLoading] = useState(false);
  const [fileUrl, setFileUrl] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerateReport = async () => {
    setLoading(true);
    setError(null);
    setFileUrl(null);

    try {
      const response = await fetch(
        "https://8wcue9mmrf.execute-api.ap-south-1.amazonaws.com/default/rdsHealthMonitort"
      );

      const data = await response.json();

      if (response.ok) {
        setFileUrl(data.fileUrl);
      } else {
        setError(data.error || "Failed to generate report");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>📊 RDS Health Report</h2>
      <button
        onClick={handleGenerateReport}
        disabled={loading}
        style={{
          background: "#007bff",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        {loading ? "Generating..." : "Generate Report"}
      </button>

      {fileUrl && (
        <div style={{ marginTop: "20px" }}>
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "green", fontWeight: "bold" }}
          >
            📥 Download Latest Report
          </a>
        </div>
      )}

      {error && (
        <div style={{ marginTop: "20px", color: "red" }}>
          ❌ {error}
        </div>
      )}
    </div>
  );
}
