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
  const API = process.env.NEXT_PUBLIC_API_URL;

  const [adminKey, setAdminKey] = useState("");
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [activeTab, setActiveTab] = useState<
    "new" | "approved" | "rejected"
  >("new");

  const [toast, setToast] = useState<string>("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  // 🔐 LOGIN + LOAD
  const loadSuggestions = async () => {
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/admin/suggestions`, {
        headers: { "x-admin-key": adminKey },
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(" Invalid Admin Key");
        setLoading(false);
        return;
      }

      setSuggestions(data);
      setIsAuth(true);
      showToast(" Loaded successfully");
    } catch {
      showToast(" Server error");
    }

    setLoading(false);
  };

  // ✅ Accept
  const handleAccept = async (id: string) => {
    setLoading(true);
    await fetch(`${API}/api/admin/accept/${id}`, {
      method: "POST",
      headers: { "x-admin-key": adminKey },
    });
    showToast(" Accepted");
    loadSuggestions();
  };

  // ❌ Reject
  const handleReject = async (id: string) => {
    setLoading(true);
    await fetch(`${API}/api/admin/reject/${id}`, {
      method: "POST",
      headers: { "x-admin-key": adminKey },
    });
    showToast(" Rejected");
    loadSuggestions();
  };

  // 📥 Download
  const downloadFile = async (url: string, filename: string) => {
    const res = await fetch(url, {
      headers: { "x-admin-key": adminKey },
    });

    if (!res.ok) {
      showToast(" Unauthorized");
      return;
    }

    const blob = await res.blob();
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  // 🔍 Filter
  const filtered = suggestions.filter((s) => {
    if (activeTab === "new") {
      return s.status === "new" || s.status === "duplicate";
    }
    return s.status === activeTab;
  });

  return (
    <main style={styles.container}>
      <h1 style={styles.title}>📊 Admin Dashboard</h1>

      {/* 🔔 Toast */}
      {toast && <div style={styles.toast}>{toast}</div>}

      {/* 🔐 LOGIN */}
      {!isAuth && (
        <div style={styles.loginBox}>
          <input
            placeholder="Enter Admin Key"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            style={styles.input}
          />
          <button onClick={loadSuggestions} style={styles.button}>
            {loading ? "Loading..." : "Enter"}
          </button>
        </div>
      )}

      {/* 🧠 DASHBOARD */}
      {isAuth && (
        <>
          {/* 📥 Export */}
          <div style={styles.row}>
            <button
              style={styles.button}
              onClick={() =>
                downloadFile(
                  `${API}/api/admin/export/suggestions`,
                  "suggestions.xlsx"
                )
              }
            >
               Suggestions
            </button>

            <button
              style={styles.button}
              onClick={() =>
                downloadFile(
                  `${API}/api/admin/export/companies`,
                  "companies.xlsx"
                )
              }
            >
               Companies
            </button>
          </div>

          {/* 🧭 Tabs */}
          <div style={styles.tabs}>
            {["new", "approved", "rejected"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                style={{
                  ...styles.tab,
                  background:
                    activeTab === tab ? "#0070f3" : "#eaeaea",
                  color: activeTab === tab ? "white" : "black",
                }}
              >
                {tab === "new"
                  ? " New"
                  : tab === "approved"
                  ? " Accepted"
                  : " Rejected"}
              </button>
            ))}
          </div>

          {/* 📋 List */}
          <div style={styles.grid}>
            {filtered.length === 0 ? (
              <p>No data</p>
            ) : (
              filtered.map((item) => (
                <div key={item._id} style={styles.card}>
                  <h3>{item.companyName}</h3>
                  <p>
                    {item.studentName} • {item.branch}
                  </p>
                  <p>Status: {item.status}</p>

                  {item.status === "new" ||
                  item.status === "duplicate" ? (
                    <div style={styles.row}>
                      <button
                        style={styles.accept}
                        onClick={() => handleAccept(item._id)}
                      >
                        Accept
                      </button>
                      <button
                        style={styles.reject}
                        onClick={() => handleReject(item._id)}
                      >
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
        </>
      )}
    </main>
  );
}

//
// 🎨 STYLES
//
const styles: any = {
  container: {
    maxWidth: 900,
    margin: "40px auto",
    padding: 20,
    fontFamily: "Arial",
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
  },
  loginBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
  },
  input: {
    padding: 10,
    width: 250,
  },
  button: {
    padding: "8px 16px",
    cursor: "pointer",
    borderRadius: 6,
    border: "1px solid #ccc",
  },
  row: {
    display: "flex",
    gap: 10,
    marginBottom: 20,
  },
  tabs: {
    display: "flex",
    gap: 10,
    marginBottom: 20,
  },
  tab: {
    padding: "8px 16px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gap: 12,
  },
  card: {
    padding: 12,
    border: "1px solid #ddd",
    borderRadius: 8,
    background: "#fafafa",
  },
  accept: {
    background: "#4caf50",
    color: "white",
    padding: "6px 12px",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
  },
  reject: {
    background: "#f44336",
    color: "white",
    padding: "6px 12px",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
  },
  toast: {
    position: "fixed",
    top: 20,
    right: 20,
    background: "#333",
    color: "white",
    padding: "10px 16px",
    borderRadius: 6,
  },
};