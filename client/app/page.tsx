"use client";

import { useState, ChangeEvent, FormEvent } from "react";

type FormData = {
  companyName: string;
  studentName: string;
  branch: string;
  reason: string;
};

export default function Home() {
  const [form, setForm] = useState<FormData>({
    companyName: "",
    studentName: "",
    branch: "",
    reason: "",
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.companyName || !form.studentName || !form.branch) {
      showToast(" Fill all required fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/suggestions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        showToast(" Failed to submit");
      } else {
        showToast(data.message || "✅ Submitted");

        setForm({
          companyName: "",
          studentName: "",
          branch: "",
          reason: "",
        });
      }
    } catch {
      showToast(" Server error");
    }

    setLoading(false);
  };

  return (
    <div style={styles.bg}>
      {/* 🔔 Toast */}
      {toast && <div style={styles.toast}>{toast}</div>}

      <div style={styles.container}>
        <h1 style={styles.title}>Suggest a Company</h1>

        <form onSubmit={handleSubmit} style={styles.card}>
          <input
            name="companyName"
            placeholder="Company Name *"
            value={form.companyName}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            name="studentName"
            placeholder="Your Name *"
            value={form.studentName}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            name="branch"
            placeholder="Branch *"
            value={form.branch}
            onChange={handleChange}
            style={styles.input}
          />

          <textarea
            name="reason"
            placeholder="Why should this company visit? (optional)"
            value={form.reason}
            onChange={handleChange}
            style={styles.textarea}
          />

          <button type="submit" style={styles.button}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
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
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    color: "white",
  },
  container: {
    width: "100%",
    maxWidth: 500,
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 28,
    fontWeight: "bold",
  },
  card: {
    backdropFilter: "blur(12px)",
    background: "rgba(255,255,255,0.05)",
    padding: 20,
    borderRadius: 14,
    display: "grid",
    gap: 12,
  },
  input: {
    padding: 10,
    borderRadius: 8,
    border: "none",
    outline: "none",
  },
  textarea: {
    padding: 10,
    borderRadius: 8,
    border: "none",
    outline: "none",
    minHeight: 80,
  },
  button: {
    padding: "10px",
    borderRadius: 8,
    border: "none",
    background: "#6366f1",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
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