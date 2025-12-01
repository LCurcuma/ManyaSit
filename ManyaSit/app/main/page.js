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
      if (!token) return console.error("Немає токена");

      // Завантажуємо свій профіль
      const meRes = await fetch("/api/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!meRes.ok) {
        const txt = await meRes.text();
        return console.error("Error fetching /api/me:", meRes.status, txt);
      }

      const meData = await meRes.json();
      setUser(meData); // ключовий момент для оновлення аватара

      // Завантажуємо рейтинг
      const rateRes = await fetch("/api/rating", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!rateRes.ok) {
        const txt = await rateRes.text();
        return console.error(
          "Error fetching /api/rating:",
          rateRes.status,
          txt
        );
      }

      const rateData = await rateRes.json();
      setRating(rateData);

      // Обчислюємо місце користувача
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
            {user.avatar_url ? (
              <img
                key={user.avatar_url} // ключ змушує React оновити картинку
                src={user.avatar_url}
                alt="Аватар"
                width={80}
                height={80}
              />
            ) : (
              <div style={{ width: 80, height: 80, background: "#ccc" }} />
            )}
          </a>
          <p>Нік: {user.username}</p>
          <p>Кліків: {user.clicks}</p>
          <p>Місце в рейтингу: {myPlace}</p>
        </div>
      )}

      {/* Передаємо функцію оновлення у SitAnim */}
      <SitAnim onClickUpdate={loadMeAndRating} />

      <h2>Рейтинг</h2>
      <ul>
        {rating.map((u, i) => (
          <li key={u.id}>
            #{i + 1} —{" "}
            {u.avatar_url && (
              <img
                key={u.avatar_url}
                src={u.avatar_url}
                alt="Avatar"
                width={40}
                height={40}
                style={{ marginRight: 8 }}
              />
            )}{" "}
            {u.username} — {u.clicks} кліків
          </li>
        ))}
      </ul>
    </div>
  );
}
