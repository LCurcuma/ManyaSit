"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.scss";
import { supabase } from "../../lib/supabase"; // твій конфіг Supabase

export default function AvatarUploadPage({ setUser, user }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [time, setTime] = useState();

  useEffect(() => {
    let d = new Date();
    let t = d.getHours();
    setTime(t);
  }, []);

  async function uploadAvatar(e) {
    e.preventDefault();
    if (!file) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Вы не авторизованы");
      return;
    }

    try {
      // Build a safe filename for Supabase. If `user` is present use its id,
      // otherwise fall back to a random token so we don't crash when user is undefined.
      const uidPart =
        user && user.id
          ? `${user.id}_`
          : `${Math.random().toString(36).slice(2, 9)}_`;
      const fileName = `${uidPart}${Date.now()}_${file.name}`;

      // Завантаження безпосередньо в Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Отримуємо публічний URL
      const { data: urlData, error: urlError } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      if (urlError) throw urlError;

      const publicUrl = urlData.publicUrl;

      // Викликаємо API для збереження URL у базі
      const res = await fetch("/api/save-avatar-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        // do NOT rely on client-supplied userId. The server will determine
        // the user from the Authorization token (verifyToken).
        body: JSON.stringify({ avatar_url: publicUrl }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Помилка збереження аватара");
      }

      setMessage("Аватар успішно змінено!");

      // Оновлюємо локально avatar_url, щоб зразу показати
      try {
        // update React state if setter exists
        if (typeof setUser === "function") {
          setUser((prev) => ({ ...(prev || {}), avatar_url: publicUrl }));
        }

        // also persist to localStorage current user object if present
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          parsed.avatar_url = publicUrl;
          localStorage.setItem("user", JSON.stringify(parsed));
        }
      } catch (e) {
        console.warn("Could not update local user state/storage", e);
      }
    } catch (error) {
      console.error(error);
      setMessage(error.message || "Помилка завантаження");
    }
  }

  return (
    <>
      {/* ==== НІЧ ==== */}
      {time >= 0 && time < 6 && (
        <div className={styles.avatar_main_container_night}>
          <h1 className={styles.h1}>Смена аватара</h1>

          <form onSubmit={uploadAvatar} className={styles.form}>
            <label className={styles.upload_avatar_night}>
              Выбрать аватар
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className={styles.hide}
              />
            </label>

            {/* 🔥 PREVIEW */}
            {file && (
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                className={styles.preview_image}
              />
            )}

            <button type="submit" className={styles.submit_night}>
              Загрузить
            </button>
          </form>

          {message && <p>{message}</p>}
          <a href="/main" className={styles.link}>
            Назад
          </a>
        </div>
      )}

      {/* ==== РАНОК ==== */}
      {time >= 6 && time < 12 && (
        <div className={styles.avatar_main_container_morning}>
          <h1 className={styles.h1}>Смена аватара</h1>

          <form onSubmit={uploadAvatar} className={styles.form}>
            <label className={styles.upload_avatar_morning}>
              Выбрать аватар
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className={styles.hide}
              />
            </label>

            {file && (
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                className={styles.preview_image}
              />
            )}

            <button type="submit" className={styles.submit_morning}>
              Загрузить
            </button>
          </form>

          {message && <p>{message}</p>}
          <a href="/main" className={styles.link}>
            Назад
          </a>
        </div>
      )}

      {/* ==== ДЕНЬ ==== */}
      {time >= 12 && time < 16 && (
        <div className={styles.avatar_main_container_day}>
          <h1 className={styles.h1}>Смена аватара</h1>

          <form onSubmit={uploadAvatar} className={styles.form}>
            <label className={styles.upload_avatar_day}>
              Выбрать аватар
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className={styles.hide}
              />
            </label>

            {file && (
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                className={styles.preview_image}
              />
            )}

            <button type="submit" className={styles.submit_day}>
              Загрузить
            </button>
          </form>

          {message && <p>{message}</p>}
          <a href="/main" className={styles.link}>
            Назад
          </a>
        </div>
      )}

      {/* ==== ВЕЧІР ==== */}
      {time >= 16 && time < 22 && (
        <div className={styles.avatar_main_container_evening}>
          <h1 className={styles.h1}>Смена аватара</h1>

          <form onSubmit={uploadAvatar} className={styles.form}>
            <label className={styles.upload_avatar_evening}>
              Выбрать аватар
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className={styles.hide}
              />
            </label>

            {file && (
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                className={styles.preview_image}
              />
            )}

            <button type="submit" className={styles.submit_evening}>
              Загрузить
            </button>
          </form>

          {message && <p>{message}</p>}
          <a href="/main" className={styles.link}>
            Назад
          </a>
        </div>
      )}

      {/* ==== ЗНОВУ НІЧ ==== */}
      {time >= 22 && time < 24 && (
        <div className={styles.avatar_main_container_night}>
          <h1 className={styles.h1}>Смена аватара</h1>

          <form onSubmit={uploadAvatar} className={styles.form}>
            Выбрать аватар
            <label className={styles.upload_avatar_night}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className={styles.hide}
              />
            </label>
            {file && (
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                className={styles.preview_image}
              />
            )}
            <button type="submit" className={styles.submit_night}>
              Загрузить
            </button>
          </form>

          {message && <p>{message}</p>}
          <a href="/main" className={styles.link}>
            Назад
          </a>
        </div>
      )}
    </>
  );
}
