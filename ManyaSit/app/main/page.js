"use client";

import { useEffect, useState } from "react";
import SitAnim from "../../components/SitAnim";

export default function MainPage() {
  const [user, setUser] = useState(null);
  const [rating, setRating] = useState([]);
  const [myPlace, setMyPlace] = useState("-");

  // Функція для завантаження користувача і рейтингу
  async function loadMeAndRating() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Немає токена в localStorage");
        return;
      }

      // 1) Завантажуємо себе
      const meRes = await fetch("/api/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!meRes.ok) {
        const txt = await meRes.text();
        console.error("Error fetching /api/me:", meRes.status, txt);
        return;
      }

      const meData = await meRes.json();
      setUser(meData);

      // 2) Завантажуємо рейтинг
      const rateRes = await fetch("/api/rating", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!rateRes.ok) {
        const txt = await rateRes.text();
        console.error("Error fetching /api/rating:", rateRes.status, txt);
        return;
      }

      const rateData = await rateRes.json();
      setRating(rateData);

      // 3) Обчислюємо місце користувача
      const myPlaceRaw =
        rateData.findIndex((u) => String(u.id) === String(meData.id)) + 1;

      const place = myPlaceRaw > 0 ? myPlaceRaw : "Не в топі";
      setMyPlace(place);
    } catch (err) {
      console.error("Помилка завантаження рейтингу:", err);
    }
  }

  useEffect(() => {
    loadMeAndRating();
  }, []);

  return (
    <div>
      <h1>Головна</h1>

      {user && (
        <div>
          <h2>Ваш профіль</h2>
          <a href="/avatar">
            <img src={user.avatar_url} width="80" height="80" />
          </a>
          <p>Нік: {user.username}</p>
          <p>Кліків: {user.clicks}</p>
          <p>Місце в рейтингу: {myPlace}</p>
        </div>
      )}

      <SitAnim onClickUpdate={loadMeAndRating} />

      <h2>Рейтинг</h2>
      <ul>
        {rating.map((u, i) => (
          <li key={u.id}>
            #{i + 1} — <img height="80" src={u.avatar_url}/> {u.username} — {u.clicks} кліків
          </li>
        ))}
      </ul>
    </div>
  );
}
