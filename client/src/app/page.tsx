"use client";
import { useState } from "react";

export default function Home() {
  const [form, setForm] = useState({
    name: "",
    studentName: "",
    branch: "",
    reason: ""
  });

  const handleSubmit = async () => {
    const res = await fetch("http://localhost:5000/suggest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    alert(data.message);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Suggest a Company</h1>

      <input placeholder="Company Name"
        onChange={(e)=>setForm({...form, name:e.target.value})} />

      <input placeholder="Your Name"
        onChange={(e)=>setForm({...form, studentName:e.target.value})} />

      <input placeholder="Branch"
        onChange={(e)=>setForm({...form, branch:e.target.value})} />

      <textarea placeholder="Reason"
        onChange={(e)=>setForm({...form, reason:e.target.value})} />

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}