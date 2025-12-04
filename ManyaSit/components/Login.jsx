"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // on mount: if user already has a token, redirect to /main
  useEffect(() => {
    try {
      const justLoggedOut = localStorage.getItem("justLoggedOut");
      if (justLoggedOut) {
        // clear the transient flag and do not redirect (user came from logout)
        localStorage.removeItem("justLoggedOut");
        return;
      }

      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");

      // Only redirect if we have both a token and stored user data.
      // If token exists but user data is missing, do not redirect to avoid
      // landing on an empty /main page.
      if (token && user) {
        router.push("/main");
        return;
      }

      // If we have a token but no stored user, try to restore user info
      // from the server (/api/me). If successful, save user and redirect.
      if (token && !user) {
        (async () => {
          try {
            const res = await fetch("/api/me", {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) {
              // invalid/expired token — remove it to avoid repeated attempts
              if (res.status === 401) localStorage.removeItem("token");
              return;
            }

            const data = await res.json();
            if (data && data.user) {
              localStorage.setItem("user", JSON.stringify(data.user));
              router.push("/main");
            }
          } catch (err) {
            console.warn("Failed to restore user from /api/me", err);
          }
        })();
      }
    } catch (e) {
      // ignore storage errors
      console.warn("Login mount check failed", e);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Помилка логіну");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // редірект тільки після успішного логіну
      router.push("/main");
    } catch (err) {
      setError("Помилка з сервером");
      console.error(err);
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <h1>Логін</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Увійти</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
      <a href="/">Registrate</a>
    </div>
  );
}
