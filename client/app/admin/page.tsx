"use client";

import { useState } from "react";

type Suggestion = {
  _id: string;
  companyName: string;
  studentName: string;
  branch: string;
  reason: string;
  status: "new" | "duplicate" | "approved" | "rejected";
};

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [message, setMessage] = useState<string>("");
  const [activeTab, setActiveTab] = useState<
    "new" | "approved" | "rejected"
  >("new");

  //  Load suggestions
  const loadSuggestions = async () => {
    setMessage("Loading...");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/suggestions`,
        {
          headers: { "x-admin-key": adminKey },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Unauthorized");
        return;
      }

      setSuggestions(data);
      setMessage(`Loaded ${data.length} suggestions`);
    } catch (err) {
      setMessage("Failed to load suggestions");
    }
  };

  //  Accept
  const handleAccept = async (id: string) => {
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/accept/${id}`,
      {
        method: "POST",
        headers: { "x-admin-key": adminKey },
      }
    );
    loadSuggestions();
  };

  // Reject
  const handleReject = async (id: string) => {
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/reject/${id}`,
      {
        method: "POST",
        headers: { "x-admin-key": adminKey },
      }
    );
    loadSuggestions();
  };

  //  Filter logic
  const filtered = suggestions.filter((s) => {
    if (activeTab === "new") {
      return s.status === "new" || s.status === "duplicate";
    }
    return s.status === activeTab;
  });

  return (
    <main style={{ maxWidth: "900px", margin: "40px auto", padding: "20px" }}>
      <h1>Admin Dashboard</h1>

      {/* 🔑 Admin Key */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          placeholder="Enter admin key"
          value={adminKey}
          onChange={(e) => setAdminKey(e.target.value)}
        />
        <button onClick={loadSuggestions}>Load</button>
      </div>

      {/*  Export Buttons */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <button
          onClick={() =>
            window.open(
              `${process.env.NEXT_PUBLIC_API_URL}/api/admin/export/suggestions`,
              "_blank"
            )
          }
        >
           Export Suggestions
        </button>

        <button
          onClick={() =>
            window.open(
              `${process.env.NEXT_PUBLIC_API_URL}/api/admin/export/companies`,
              "_blank"
            )
          }
        >
           Export Companies
        </button>
      </div>

      {/*  Tabs */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button onClick={() => setActiveTab("new")}>🆕 New</button>
        <button onClick={() => setActiveTab("approved")}>✅ Accepted</button>
        <button onClick={() => setActiveTab("rejected")}>❌ Rejected</button>
      </div>

      {message && <p>{message}</p>}

      {/*  Suggestions List */}
      <div style={{ display: "grid", gap: "12px", marginTop: "20px" }}>
        {filtered.length === 0 ? (
          <p>No data found</p>
        ) : (
          filtered.map((item) => (
            <div
              key={item._id}
              style={{
                border: "1px solid #ccc",
                padding: "12px",
                borderRadius: "8px",
              }}
            >
              <h3>{item.companyName}</h3>
              <p>Student: {item.studentName}</p>
              <p>Branch: {item.branch}</p>
              <p>Status: {item.status}</p>
              <p>Reason: {item.reason || "N/A"}</p>

              {/* Actions */}
              {item.status === "new" || item.status === "duplicate" ? (
                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={() => handleAccept(item._id)}>
                     Accept
                  </button>

                  <button onClick={() => handleReject(item._id)}>
                     Reject
                  </button>
                </div>
              ) : (
                <p style={{ color: "green" }}>✔ Processed</p>
              )}
            </div>
          ))
        )}
      </div>
    </main>
  );
}