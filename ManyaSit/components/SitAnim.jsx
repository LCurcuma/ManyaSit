"use client";

import { useState, useEffect } from "react";

export default function SitAnim({ onClickUpdate }) {
  const [frame, setFrame] = useState(1);
  const [clicks, setClicks] = useState(0);
  const [token, setToken] = useState(null);

  // Завантажуємо токен і дані користувача
  useEffect(() => {
    const t = localStorage.getItem("token");
    setToken(t);

    if (!t) return;

    async function loadUser() {
      try {
        const res = await fetch("/api/me", {
          headers: {
            Authorization: `Bearer ${t}`,
          },
        });

        if (!res.ok) return;

        const data = await res.json();
        setClicks(data.clicks);
      } catch (err) {
        console.error("Помилка /api/me:", err);
      }
    }

    loadUser();
  }, []);

  // Клік по персонажу
  async function changeFrame() {
    const t = localStorage.getItem("token");
    if (!t) return;

    try {
      const res = await fetch("/api/click", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${t}`,
        },
      });

      if (!res.ok) {
        const txt = await res.text();
        console.error("Помилка /api/click:", txt);
        return;
      }

      const data = await res.json();
      setClicks(data.clicks);

      // Оновлюємо рейтинг у MainPage
      if (onClickUpdate) onClickUpdate();

      // Анімація кадрів
      setFrame(2);
      setTimeout(() => {
        setFrame(3);
        setTimeout(() => {
          setFrame(1);
        }, 50);
      }, 50);
    } catch (err) {
      console.error("Помилка кліку:", err);
    }
  }

  return (
    <div onClick={changeFrame} style={{ cursor: "pointer" }}>
      {frame === 1 && <img src="/sit1.png" />}
      {frame === 2 && <img src="/sit.png" />}
      {frame === 3 && <img src="/sit2.png" />}

      <p>{clicks}</p>
    </div>
  );
}
