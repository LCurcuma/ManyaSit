"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter(); // хук для редіректу

  // on mount: if already authenticated, redirect to /main unless user just logged out
  useEffect(() => {
    try {
      const justLoggedOut = localStorage.getItem("justLoggedOut");
      if (justLoggedOut) {
        localStorage.removeItem("justLoggedOut");
        return;
      }

      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");

      // Only redirect when both token and user data are present. This
      // prevents redirecting to /main when the app has no account info
      // (which would render an empty main page).
      if (token && user) {
        router.push("/main");
        return;
      }

      // If token exists but user info is missing, attempt to restore via /api/me
      if (token && !user) {
        (async () => {
          try {
            const res = await fetch("/api/me", {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) {
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
      console.warn("Register mount check failed", e);
    }
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    // client-side password validation: require at least 4 chars
    if (String(password).length < 4) {
      setError("Пароль повинен бути не менше 4 символів");
      return;
    }
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Помилка реєстрації");
        return;
      }

      // Якщо сервер повернув токен — зберігаємо його і логінемо користувача автоматично
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // store returned user object as well (if available)
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // Після успішної реєстрації – редірект на MainPage
      router.push("/main"); // якщо твій MainPage.jsx знаходиться за шляхом /app/main/page.jsx
    } catch (err) {
      setError("Помилка з сервером");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h1>Реєстрація</h1>
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
      <button type="submit">Зареєструватися</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <a href="/login">Login</a>
    </form>
  );
}
