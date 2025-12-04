"use client";
import { useState } from "react";

export default function AvatarUpload({ onUploaded }) {
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Upload the file using multipart/form-data so server route can read `formData.get('avatar')`
    try {
      const token = localStorage.getItem("token");
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

      if (!res.ok) {
        setError(data.error || "Upload error");
        return;
      }

      // server returns avatar_url (public link) — use it in onUploaded callback
      setPreview(URL.createObjectURL(file));
      if (onUploaded) onUploaded(data.avatar_url || null);
    } catch (err) {
      console.error(err);
      setError(err?.message || "Upload failed");
    }
  }

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFile} />

      {error && <p style={{ color: "white" }}>{error}</p>}

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
