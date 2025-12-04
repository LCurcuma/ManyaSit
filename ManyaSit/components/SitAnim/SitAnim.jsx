"use client";

import { useState } from "react";
import styles from "./page.module.scss";

export default function SitAnim({ onClickUpdate }) {
  const [frame, setFrame] = useState(1);
  const [clicks, setClicks] = useState(0);

  async function changeFrame() {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (onClickUpdate) onClickUpdate(); // оновлюємо профіль після кліку

    const res = await fetch("/api/click", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) return;
    const data = await res.json();
    setClicks(data.clicks);

    setFrame(2);
    setTimeout(() => {
      setFrame(3);
      setTimeout(() => setFrame(1), 50);
    }, 50);
  }

  return (
    <div onClick={changeFrame} className={styles.anim}>
      {frame === 1 && <img src="/sit1.png" className={styles.img} />}
      {frame === 2 && <img src="/sit.png" className={styles.img} />}
      {frame === 3 && <img src="/sit2.png" className={styles.img} />}
    </div>
  );
}
