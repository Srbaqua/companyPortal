"use client";
import { useEffect, useState } from "react";

export default function Admin() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/suggest/all")
      .then(res => res.json())
      .then(setData);
  }, []);

  return (
    <div>
      <h1>All Suggestions</h1>

      {data.map((s, i) => (
        <div key={i}>
          <h3>{s.name}</h3>
          <p>{s.studentName}</p>
          <p>Status: {s.status}</p>
        </div>
      ))}
    </div>
  );
}