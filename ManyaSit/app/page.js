"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter(); // хук для редіректу

  const handleRegister = async (e) => {
    e.preventDefault();
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
