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
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

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
      showToast(" Welcome Admin");
    } catch {
      showToast(" Server Error");
    }
    setLoading(false);
  };

  const handleAccept = async (id: string) => {
    await fetch(`${API}/api/admin/accept/${id}`, {
      method: "POST",
      headers: { "x-admin-key": adminKey },
    });
    showToast(" Accepted");
    loadSuggestions();
  };

  const handleReject = async (id: string) => {
    await fetch(`${API}/api/admin/reject/${id}`, {
      method: "POST",
      headers: { "x-admin-key": adminKey },
    });
    showToast(" Rejected");
    loadSuggestions();
  };

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
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  const filtered = suggestions.filter((s) => {
    if (activeTab === "new") {
      return s.status === "new" || s.status === "duplicate";
    }
    return s.status === activeTab;
  });

  return (
    <div style={styles.bg}>
      {/* Toast */}
      {toast && <div style={styles.toast}>{toast}</div>}

      <div style={styles.container}>
        <h1 style={styles.title}>Company Dashboard</h1>

        {!isAuth ? (
          <div style={styles.glassCard}>
            <input
              placeholder="Enter Admin Key"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              style={styles.input}
            />
            <button onClick={loadSuggestions} style={styles.primaryBtn}>
              {loading ? "Loading..." : "Enter"}
            </button>
          </div>
        ) : (
          <>
            {/* Export */}
            <div style={styles.row}>
              <button
                style={styles.secondaryBtn}
                onClick={() =>
                  downloadFile(
                    `${API}/api/admin/export/suggestions`,
                    "suggestions.xlsx"
                  )
                }
              >
                📥 Suggestions
              </button>

              <button
                style={styles.secondaryBtn}
                onClick={() =>
                  downloadFile(
                    `${API}/api/admin/export/companies`,
                    "companies.xlsx"
                  )
                }
              >
                📥 Companies
              </button>
            </div>

            {/* Tabs */}
            <div style={styles.tabs}>
              {["new", "approved", "rejected"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  style={{
                    ...styles.tab,
                    ...(activeTab === tab ? styles.activeTab : {}),
                  }}
                >
                  {tab === "new"
                    ? "New"
                    : tab === "approved"
                    ? "Accepted"
                    : "Rejected"}
                </button>
              ))}
            </div>

            {/* Cards */}
            <div style={styles.grid}>
              {filtered.length === 0 ? (
                <p style={{ color: "#aaa" }}>No data available</p>
              ) : (
                filtered.map((item) => (
                  <div key={item._id} style={styles.card}>
                    <h3>{item.companyName}</h3>
                    <p>
                      {item.studentName} • {item.branch}
                    </p>
                    <span style={styles.status}>{item.status}</span>

                    {(item.status === "new" ||
                      item.status === "duplicate") && (
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
                    )}
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

//
// 🎨 STYLES
//
const styles: any = {
  bg: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #0f172a, #1e293b, #020617)",
    color: "white",
    padding: 20,
  },
  container: {
    maxWidth: 1000,
    margin: "0 auto",
  },
  title: {
    textAlign: "center",
    marginBottom: 30,
    fontSize: 28,
    fontWeight: "bold",
  },
  glassCard: {
    backdropFilter: "blur(10px)",
    background: "rgba(255,255,255,0.05)",
    padding: 20,
    borderRadius: 12,
    display: "flex",
    gap: 10,
    justifyContent: "center",
  },
  input: {
    padding: 10,
    borderRadius: 8,
    border: "none",
    width: 250,
  },
  primaryBtn: {
    padding: "10px 18px",
    background: "#6366f1",
    border: "none",
    borderRadius: 8,
    color: "white",
    cursor: "pointer",
  },
  secondaryBtn: {
    padding: "8px 14px",
    borderRadius: 8,
    background: "#334155",
    border: "none",
    color: "white",
    cursor: "pointer",
  },
  tabs: {
    display: "flex",
    gap: 10,
    marginBottom: 20,
  },
  tab: {
    padding: "8px 16px",
    borderRadius: 20,
    background: "#334155",
    cursor: "pointer",
    border: "none",
  },
  activeTab: {
    background: "#6366f1",
  },
  grid: {
    display: "grid",
    gap: 16,
  },
  card: {
    background: "rgba(255,255,255,0.05)",
    padding: 16,
    borderRadius: 12,
    backdropFilter: "blur(6px)",
  },
  row: {
    display: "flex",
    gap: 10,
    marginTop: 10,
  },
  accept: {
    background: "#22c55e",
    border: "none",
    padding: "6px 12px",
    borderRadius: 6,
    color: "white",
    cursor: "pointer",
  },
  reject: {
    background: "#ef4444",
    border: "none",
    padding: "6px 12px",
    borderRadius: 6,
    color: "white",
    cursor: "pointer",
  },
  status: {
    fontSize: 12,
    opacity: 0.7,
  },
  toast: {
    position: "fixed",
    top: 20,
    right: 20,
    background: "#111827",
    padding: "10px 16px",
    borderRadius: 8,
  },
};