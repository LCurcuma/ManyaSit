"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SitAnim from "../../components/SitAnim/SitAnim";
import LogoutButton from "../../components/LogoutButton/Logout";
import styles from "./page.module.scss";

export default function MainPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [rating, setRating] = useState([]);
  const [myPlace, setMyPlace] = useState("-");
  const [time, setTime] = useState();

  // Функція для завантаження користувача і рейтингу
  async function loadMeAndRating() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Токен отсутствует");
        router.push("/login");
        return;
      }

      // Завантажуємо свій профіль
      const meRes = await fetch("/api/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!meRes.ok) {
        // Token is invalid, expired, or user not found
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        console.error("Error fetching /api/me:", meRes.status);
        // Redirect to login so user can re-authenticate
        router.push("/login");
        return;
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
          <div className={styles.snow_container}>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
          </div>
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

          <h2 className={styles.h2}>Рейтинг</h2>
          <ul className={styles.rating}>
            {rating.map((u, i) => (
              <li key={u.id} className={styles.li}>
                <span className={styles.number}>#{i + 1}</span>
                {u.avatar_url && (
                  <img
                    key={u.avatar_url}
                    src={u.avatar_url}
                    alt="Avatar"
                    width={40}
                    height={40}
                    style={{ marginRight: 8 }}
                  />
                )}
                <span className={styles.clicks}>
                  {u.username} — {u.clicks} приседаний
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {time >= 6 && time < 12 && (
        <div className={styles.morning}>
          <div className={styles.snow_container}>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
          </div>
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

          <h2 className={styles.h2}>Рейтинг</h2>
          <ul className={styles.rating}>
            {rating.map((u, i) => (
              <li key={u.id} className={styles.li}>
                <span className={styles.number}>#{i + 1}</span>
                {u.avatar_url && (
                  <img
                    key={u.avatar_url}
                    src={u.avatar_url}
                    alt="Avatar"
                    width={40}
                    height={40}
                    style={{ marginRight: 8 }}
                  />
                )}
                <span className={styles.clicks}>
                  {u.username} — {u.clicks} приседаний
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {time >= 12 && time < 16 && (
        <div className={styles.day}>
          <div className={styles.snow_container}>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
          </div>
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

          <h2 className={styles.h2}>Рейтинг</h2>
          <ul className={styles.rating}>
            {rating.map((u, i) => (
              <li key={u.id} className={styles.li}>
                <span className={styles.number}>#{i + 1}</span>
                {u.avatar_url && (
                  <img
                    key={u.avatar_url}
                    src={u.avatar_url}
                    alt="Avatar"
                    width={40}
                    height={40}
                    style={{ marginRight: 8 }}
                  />
                )}
                <span className={styles.clicks}>
                  {u.username} — {u.clicks} приседаний
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {time >= 16 && time < 22 && (
        <div className={styles.evening}>
          <div className={styles.snow_container}>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
          </div>
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

          <h2 className={styles.h2}>Рейтинг</h2>
          <ul className={styles.rating}>
            {rating.map((u, i) => (
              <li key={u.id} className={styles.li}>
                <span className={styles.number}>#{i + 1}</span>
                {u.avatar_url && (
                  <img
                    key={u.avatar_url}
                    src={u.avatar_url}
                    alt="Avatar"
                    width={40}
                    height={40}
                    style={{ marginRight: 8 }}
                  />
                )}
                <span className={styles.clicks}>
                  {u.username} — {u.clicks} приседаний
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {time >= 22 && time < 24 && (
        <div className={styles.night}>
          <div className={styles.snow_container}>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
            <div className={styles.snow}></div>
          </div>
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
                <p>Приседания: {user.clicks}</p>
                <p>Место в рейтинге: {myPlace}</p>
              </div>

              {/* logout action clears localStorage and resets state */}
              <LogoutButton onLogout={() => setUser(null)} />
            </div>
          )}

          {/* Передаємо функцію оновлення у SitAnim */}
          <SitAnim onClickUpdate={loadMeAndRating} />

          <h2 className={styles.h2}>Рейтинг</h2>
          <ul className={styles.rating}>
            {rating.map((u, i) => (
              <li key={u.id} className={styles.li}>
                <span className={styles.number}>#{i + 1}</span>
                {u.avatar_url && (
                  <img
                    key={u.avatar_url}
                    src={u.avatar_url}
                    alt="Avatar"
                    width={40}
                    height={40}
                    style={{ marginRight: 8 }}
                  />
                )}
                <span className={styles.clicks}>
                  {u.username} — {u.clicks} приседаний
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
