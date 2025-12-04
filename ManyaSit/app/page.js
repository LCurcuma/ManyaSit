"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.scss";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter(); // хук для редіректу
  const [time, setTime] = useState();

  // on mount: if already authenticated, redirect to /main unless user just logged out
  useEffect(() => {
    let d = new Date();
    let t = d.getHours();
    setTime(t);

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
      // If /api/me fails (expired token, user not found, server error),
      // clear the token and stay on register page so user can log in again.
      if (token && !user) {
        (async () => {
          try {
            const res = await fetch("/api/me", {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) {
              // Any error (401, 404, 500) means token is invalid or user doesn't exist.
              // Clear token and stay on register page for user to log in again.
              localStorage.removeItem("token");
              return;
            }

            const data = await res.json();
            if (data && data.id) {
              // Successfully restored user from server
              localStorage.setItem("user", JSON.stringify(data));
              router.push("/main");
            } else {
              // Response was 200 but no user data — clear token and stay
              localStorage.removeItem("token");
            }
          } catch (err) {
            console.warn("Failed to restore user from /api/me", err);
            // On network error, also clear the potentially invalid token
            localStorage.removeItem("token");
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
      setError("Пароль слишком короткий");
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
        setError(data.error || "Ошибка регистрации");
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
      setError("Ошибка с сервером");
      console.error(err);
    }
  };

  return (
    <>
      {time >= 0 && time < 6 && (
        <div className={styles.night}>
          <form onSubmit={handleRegister} className={styles.form}>
            <h1>Регистрация</h1>
            <input
              type="text"
              placeholder="Имя"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className={styles.input}
            />
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
            />
            <button type="submit" className={styles.button}>
              Зарегистрироваться
            </button>
            {error && <p style={{ color: "white" }}>{error}</p>}
            <a href="/login" className={styles.link}>
              Вход
            </a>
          </form>
        </div>
      )}

      {time >= 6 && time < 12 && (
        <div className={styles.morning}>
          <form onSubmit={handleRegister} className={styles.form}>
            <h1>Регистрация</h1>
            <input
              type="text"
              placeholder="Имя"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className={styles.input}
            />
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
            />
            <button type="submit" className={styles.button}>
              Зарегистрироваться
            </button>
            {error && <p style={{ color: "white" }}>{error}</p>}
            <a href="/login" className={styles.link}>
              Вход
            </a>
          </form>
        </div>
      )}

      {time >= 12 && time < 16 && (
        <div className={styles.day}>
          <form onSubmit={handleRegister} className={styles.form}>
            <h1>Регистрация</h1>
            <input
              type="text"
              placeholder="Имя"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className={styles.input}
            />
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
            />
            <button type="submit" className={styles.button}>
              Зарегистрироваться
            </button>
            {error && <p style={{ color: "white" }}>{error}</p>}
            <a href="/login" className={styles.link}>
              Вход
            </a>
          </form>
        </div>
      )}

      {time >= 16 && time < 22 && (
        <div className={styles.evening}>
          <form onSubmit={handleRegister} className={styles.form}>
            <h1>Регистрация</h1>
            <input
              type="text"
              placeholder="Имя"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className={styles.input}
            />
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
            />
            <button type="submit" className={styles.button}>
              Зарегистрироваться
            </button>
            {error && <p style={{ color: "white" }}>{error}</p>}
            <a href="/login" className={styles.link}>
              Вход
            </a>
          </form>
        </div>
      )}

      {time >= 0 && time < 6 && (
        <div className={styles.night}>
          <form onSubmit={handleRegister} className={styles.form}>
            <h1>Регистрация</h1>
            <input
              type="text"
              placeholder="Имя"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className={styles.input}
            />
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
            />
            <button type="submit" className={styles.button}>
              Зарегистрироваться
            </button>
            {error && <p style={{ color: "white" }}>{error}</p>}
            <a href="/login" className={styles.link}>
              Вход
            </a>
          </form>
        </div>
      )}

      {time >= 22 && time < 24 && (
        <div class={styles.night}>
          <form onSubmit={handleRegister} className={styles.form}>
            <h1>Регистрация</h1>
            <input
              type="text"
              placeholder="Имя"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className={styles.input}
            />
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
            />
            <button type="submit" className={styles.button}>
              Зарегистрироваться
            </button>
            {error && <p style={{ color: "white" }}>{error}</p>}
            <a href="/login" className={styles.link}>
              Вход
            </a>
          </form>
        </div>
      )}
    </>
  );
}
