"use client";

import { useState } from "react";

export default function AvatarUploadPage() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  async function uploadAvatar(e) {
    e.preventDefault();
    if (!file) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Ви не авторизовані.");
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
      setMessage("Аватар успішно змінено!");
    } else {
      setMessage(data.error || "Помилка завантаження.");
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Завантаження аватару</h1>

      <form onSubmit={uploadAvatar}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <br />
        <br />
        <button type="submit">Завантажити</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}
