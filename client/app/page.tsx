"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [mode, setMode] = useState<"home" | "form">("home");

  return (
    <div style={styles.bg}>
      <div style={styles.container}>
        {mode === "home" ? (
          <>
            <h1 style={styles.title}>Company Portal</h1>
            <p style={styles.subtitle}>
              Suggest companies or manage requests
            </p>

            <div style={styles.cardGrid}>
              {/* Public */}
              <div
                style={styles.card}
                onClick={() => setMode("form")}
              >
                <h2>👨‍🎓 Suggest Company</h2>
                <p>Recommend companies for placements</p>
              </div>

              {/* Admin */}
              <div
                style={styles.card}
                onClick={() => router.push("/admin")}
              >
                <h2>👨‍💼 Admin Panel</h2>
                <p>Manage suggestions & export data</p>
              </div>
            </div>
          </>
        ) : (
          <FormView goBack={() => setMode("home")} />
        )}
      </div>
    </div>
  );
}

//
// 📄 FORM COMPONENT
//
function FormView({ goBack }: { goBack: () => void }) {
  const [form, setForm] = useState({
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

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!form.companyName || !form.studentName || !form.branch) {
      showToast("❌ Fill all required fields");
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
      showToast(data.message || "Submitted");

      setForm({
        companyName: "",
        studentName: "",
        branch: "",
        reason: "",
      });
    } catch {
      showToast("❌ Server error");
    }

    setLoading(false);
  };

  return (
    <div>
      {toast && <div style={styles.toast}>{toast}</div>}

      <button onClick={goBack} style={styles.backBtn}>
        ← Back
      </button>

      <h2 style={{ marginBottom: 20 }}>Suggest a Company</h2>

      <form onSubmit={handleSubmit} style={styles.formCard}>
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
          placeholder="Reason (optional)"
          value={form.reason}
          onChange={handleChange}
          style={styles.textarea}
        />

        <button style={styles.primaryBtn}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
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
    color: "white",
    // padding: 20,
    padding: "20px 12px"
  },
  container: {
    width: "100%",
    maxWidth: "1000px",
padding: "0 16px",
    textAlign: "center",
  },
title: {
  textAlign: "center",
  marginBottom: 30,
  fontSize: "clamp(20px, 4vw, 32px)",
  fontWeight: "bold",
},
  subtitle: {
    color: "#94a3b8",
    marginBottom: 30,
  },
cardGrid: {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 20,
},
  card: {
    background: "rgba(255,255,255,0.05)",
    padding: "14px 16px",
    borderRadius: 14,
    cursor: "pointer",
    transition: "0.3s",
  },
  // card: {
//   background: "rgba(255,255,255,0.05)",
//   padding: "14px 16px",
//   borderRadius: 12,
// },
formCard: {
  width: "100%",
  maxWidth: 500,
  margin: "0 auto",
  display: "grid",
  gap: 12,
},
  input: {
    padding: 10,
    borderRadius: 8,
    border: "none",
    width:'100%',
  },
  textarea: {
    padding: 10,
    borderRadius: 8,
    border: "none",
    minHeight: 80,
  },
  primaryBtn: {
    padding: 10,
    background: "#6366f1",
    border: "none",
    borderRadius: 8,
    color: "white",
    cursor: "pointer",
  },
  backBtn: {
    marginBottom: 20,
    background: "transparent",
    border: "none",
    color: "#94a3b8",
    cursor: "pointer",
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