"use client";

import { useEffect, useState } from "react";
import SitAnim from "../../components/SitAnim";
import LogoutButton from "../../components/Logout";
import styles from "./page.module.scss";

export default function MainPage() {
  const [user, setUser] = useState(null);
  const [rating, setRating] = useState([]);
  const [myPlace, setMyPlace] = useState("-");
  const [time, setTime] = useState();

  // Функція для завантаження користувача і рейтингу
  async function loadMeAndRating() {
    try {
      const token = localStorage.getItem("token");
      if (!token) return console.error("Токен отсутствует");

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
      console.error("Ошибка загрузки рейтинга:", err);
    }
  }

  useEffect(() => {
    let d = new Date();
    let t = d.getHours();
    setTime(t);
    loadMeAndRating();
  }, []);

  return (
    <>
      {time >= 0 && time < 6 && (
        <div className={styles.night}>
          {user && (
            <div className={styles.profile_with_avatar}>
              <a href="/avatar" className={styles.avatar}>
                {user.avatar_url ? (
                  <img
                    key={user.avatar_url} // ключ змушує React оновити картинку
                    src={user.avatar_url}
                    alt="Аватар"
                    className={styles.profile_pic}
                  />
                ) : (
                  <div style={{ width: 80, height: 80, background: "#ccc" }} />
                )}
              </a>
              <div className={styles.profile_text}>
                <p>Нік: {user.username}</p>
                <p>Кліків: {user.clicks}</p>
                <p>Місце в рейтингу: {myPlace}</p>
              </div>

              {/* logout action clears localStorage and resets state */}
              <LogoutButton onLogout={() => setUser(null)} />
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
      )}

      {time >= 6 && time < 12 && (
        <div className={styles.morning}>
          {user && (
            <div className={styles.profile_with_avatar}>
              <a href="/avatar" className={styles.avatar}>
                {user.avatar_url ? (
                  <img
                    key={user.avatar_url} // ключ змушує React оновити картинку
                    src={user.avatar_url}
                    alt="Аватар"
                    className={styles.profile_pic}
                  />
                ) : (
                  <div style={{ width: 80, height: 80, background: "#ccc" }} />
                )}
              </a>
              <div>
                <p>Нік: {user.username}</p>
                <p>Кліків: {user.clicks}</p>
                <p>Місце в рейтингу: {myPlace}</p>
              </div>

              {/* logout action clears localStorage and resets state */}
              <LogoutButton onLogout={() => setUser(null)} />
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
      )}

      {time >= 12 && time < 16 && (
        <div className={styles.day}>
          {user && (
            <div className={styles.profile_with_avatar}>
              <a href="/avatar" className={styles.avatar}>
                {user.avatar_url ? (
                  <img
                    key={user.avatar_url} // ключ змушує React оновити картинку
                    src={user.avatar_url}
                    alt="Аватар"
                    className={styles.profile_pic}
                  />
                ) : (
                  <div style={{ width: 80, height: 80, background: "#ccc" }} />
                )}
              </a>
              <div>
                <p>Нік: {user.username}</p>
                <p>Кліків: {user.clicks}</p>
                <p>Місце в рейтингу: {myPlace}</p>
              </div>

              {/* logout action clears localStorage and resets state */}
              <LogoutButton onLogout={() => setUser(null)} />
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
                {u.username} — {u.clicks} приседаний
              </li>
            ))}
          </ul>
        </div>
      )}

      {time >= 16 && time < 22 && (
        <div className={styles.evening}>
          {user && (
            <div className={styles.profile_with_avatar}>
              <a href="/avatar" className={styles.avatar}>
                {user.avatar_url ? (
                  <img
                    key={user.avatar_url} // ключ змушує React оновити картинку
                    src={user.avatar_url}
                    alt="Аватар"
                    className={styles.profile_pic}
                  />
                ) : (
                  <div style={{ width: 80, height: 80, background: "#ccc" }} />
                )}
              </a>
              <div className={styles.profile_text}>
                <p>Имя: {user.username}</p>
                <p>Приседаний: {user.clicks}</p>
                <p>Место в рейтинге: {myPlace}</p>
              </div>

              {/* logout action clears localStorage and resets state */}
              <LogoutButton onLogout={() => setUser(null)} />
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
      )}

      {time >= 22 && time < 24 && (
        <div className={styles.night}>
          {user && (
            <div className={styles.profile_with_avatar}>
              <a href="/avatar" className={styles.avatar}>
                {user.avatar_url ? (
                  <img
                    key={user.avatar_url} // ключ змушує React оновити картинку
                    src={user.avatar_url}
                    alt="Аватар"
                    className={styles.profile_pic}
                  />
                ) : (
                  <div style={{ width: 80, height: 80, background: "#ccc" }} />
                )}
              </a>
              <div>
                <p>Имя: {user.username}</p>
                <p>Приседания: {user.clicks}</p>
                <p>Место в рейтинге: {myPlace}</p>
              </div>

              {/* logout action clears localStorage and resets state */}
              <LogoutButton onLogout={() => setUser(null)} />
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
      )}
    </>
  );
}
