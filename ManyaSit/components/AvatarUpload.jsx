"use client";
import { useState } from "react";

export default function AvatarUpload({ onUploaded }) {
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Перетворюємо у base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result;

      const token = localStorage.getItem("token");

      const res = await fetch("/api/upload-avatar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ avatarBase64: base64 }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Upload error");
        return;
      }

      setPreview(base64);
      if (onUploaded) onUploaded(base64);
    };

    reader.readAsDataURL(file);
  }

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFile} />

      {error && <p style={{ color: "red" }}>{error}</p>}

      {preview && (
        <img
          src={preview}
          alt="avatar"
          style={{ width: 100, height: 100, borderRadius: "50%" }}
        />
      )}
    </div>
  );
}
