"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.scss";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [time, setTime] = useState();

  // on mount: if user already has a token, redirect to /main
  useEffect(() => {
    let d = new Date();
    let t = d.getHours();
    setTime(t);

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
      // If /api/me fails (expired token, user not found, server error),
      // clear the token and stay on login page so user can log in again.
      if (token && !user) {
        (async () => {
          try {
            const res = await fetch("/api/me", {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) {
              // Any error (401, 404, 500) means token is invalid or user doesn't exist.
              // Clear token and stay on login page for user to log in again.
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
        setError(data.error || "Ошибка входа");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // редірект тільки після успішного логіну
      router.push("/main");
    } catch (err) {
      setError("Ошибка сервера");
      console.error(err);
    }
  };

  return (
    <>
      {time >= 0 && time < 6 && (
        <div className={styles.night}>
          <form onSubmit={handleLogin} className={styles.form}>
            <h1>Логин</h1>
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
              Войти
            </button>
            {error && <p style={{ color: "white" }}>{error}</p>}
          </form>
          <a href="/" className={styles.link}>
            Регистрация
          </a>
        </div>
      )}

      {time >= 6 && time < 12 && (
        <div className={styles.morning}>
          <form onSubmit={handleLogin} className={styles.form}>
            <h1>Логин</h1>
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
              Войти
            </button>
            {error && <p style={{ color: "white" }}>{error}</p>}
          </form>
          <a href="/" className={styles.link}>
            Регистрация
          </a>
        </div>
      )}

      {time >= 12 && time < 16 && (
        <div className={styles.day}>
          <form onSubmit={handleLogin} className={styles.form}>
            <h1>Логин</h1>
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
              Войти
            </button>
            {error && <p style={{ color: "white" }}>{error}</p>}
          </form>
          <a href="/" className={styles.link}>
            Регистрация
          </a>
        </div>
      )}

      {time >= 16 && time < 22 && (
        <div className={styles.evening}>
          <form onSubmit={handleLogin} className={styles.form}>
            <h1>Логин</h1>
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
              Войти
            </button>
            {error && <p style={{ color: "white" }}>{error}</p>}
          </form>
          <a href="/" className={styles.link}>
            Регистрация
          </a>
        </div>
      )}

      {time >= 22 && time < 24 && (
        <div className={styles.night}>
          <form onSubmit={handleLogin} className={styles.form}>
            <h1>Логин</h1>
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
              Войти
            </button>
            {error && <p style={{ color: "white" }}>{error}</p>}
          </form>
          <a href="/" className={styles.link}>
            Регистрация
          </a>
        </div>
      )}
    </>
  );
}
