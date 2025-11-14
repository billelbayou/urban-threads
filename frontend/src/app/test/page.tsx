"use client";

import { useState } from "react";
import api from "@/lib/axios";

export default function Test() {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    try {
      // login the user
      await api.post("/api/auth/login", {
        email: "bayoubillel2004@gmail.com",
        password: "abc123",
      });

      // fetch current user
      const { data } = await api.get("/api/auth/me");
      setUser(data.user);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Test Backend API</h1>
      <button onClick={handleLogin}>Login & Fetch User</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {user && (
        <div>
          <h2>User Info:</h2>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
