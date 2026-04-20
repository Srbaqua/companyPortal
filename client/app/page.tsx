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

  const [message, setMessage] = useState<string>("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("Submitting...");

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
      setMessage(data.message);

      setForm({
        companyName: "",
        studentName: "",
        branch: "",
        reason: "",
      });
    } catch (error) {
      setMessage("Something went wrong");
    }
  };

  return (
    <main style={{ maxWidth: "600px", margin: "40px auto", padding: "20px" }}>
      <h1>Suggest a Company</h1>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "12px" }}>
        <input
          name="companyName"
          placeholder="Company Name"
          value={form.companyName}
          onChange={handleChange}
        />

        <input
          name="studentName"
          placeholder="Your Name"
          value={form.studentName}
          onChange={handleChange}
        />

        <input
          name="branch"
          placeholder="Branch"
          value={form.branch}
          onChange={handleChange}
        />

        <textarea
          name="reason"
          placeholder="Reason"
          value={form.reason}
          onChange={handleChange}
        />

        <button type="submit">Submit</button>
      </form>

      {message && <p style={{ marginTop: "16px" }}>{message}</p>}
    </main>
  );
}