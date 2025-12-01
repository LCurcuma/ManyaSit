"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.scss";

export default function AvatarUploadPage() {

  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [time, setTime] = useState();

  useEffect(() => {
  let d = new Date();
    let t = d.getHours();
    setTime(t);
  }, [])

  async function uploadAvatar(e) {
    e.preventDefault();
    if (!file) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Вы не авторизованы");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    const res = await fetch("/api/upload-avatar", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      setMessage("Аватар успешно изменен!");
    } else {
      setMessage(data.error || "Ошибка загрузки");
    }
  }

  return (
    <>
      {time >= 0 && time < 6 && (
        <div className={styles.avatar_main_container_night}>
          <h1 className={styles.h1}>Смена аватара</h1>

          <form onSubmit={uploadAvatar} className={styles.form}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <button type="submit">Завантажити</button>
          </form>

          {message && <p>{message}</p>}
          <a href="/main">Назад</a>
        </div>
      )}
      {time >= 6 && time < 12 && (
        <div className={styles.avatar_main_container_morning}>
          <h1 className={styles.h1}>Смена аватара</h1>

          <form onSubmit={uploadAvatar} className={styles.form}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <button type="submit">Завантажити</button>
          </form>

          {message && <p>{message}</p>}
          <a href="/main">Назад</a>
        </div>
      )}
      {time >= 12 && time < 16 && (
        <div className={styles.avatar_main_container_day}>
          <h1 className={styles.h1}>Смена аватара</h1>

          <form onSubmit={uploadAvatar} className={styles.form}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <button type="submit">Завантажити</button>
          </form>

          {message && <p>{message}</p>}
          <a href="/main">Назад</a>
        </div>
      )}
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
                alt="Preview"
                className={styles.preview_image}
              />
            )}
            <button type="submit" className={styles.submit_evening}>Завантажити</button>
          </form>

          {message && <p>{message}</p>}
          <a href="/main" className={styles.link}>Назад</a>
        </div>
      )}
      {time >= 22 && time < 24 && (
        <div className={styles.avatar_main_container_night}>
          <h1 className={styles.h1}>Смена аватара</h1>

          <form onSubmit={uploadAvatar} className={styles.form}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <button type="submit">Завантажити</button>
          </form>

          {message && <p>{message}</p>}
          <a href="/main">Назад</a>
        </div>
      )}
    </>
  );
}
