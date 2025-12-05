"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import styles from "./page.module.scss";

export default function SitAnim({ onClickUpdate }) {
  const [frame, setFrame] = useState(1);
  const [clicks, setClicks] = useState(0);
  const [imageKey, setImageKey] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const isAnimatingRef = useRef(false);
  const localClicksRef = useRef(0);

  // Ensure component only renders on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  const changeFrame = useCallback(
    async (e) => {
      // Prevent event bubbling to parent elements
      e.stopPropagation();
      e.preventDefault();

      // Prevent multiple rapid clicks from triggering multiple animations
      if (isAnimatingRef.current) return;
      isAnimatingRef.current = true;

      const token = localStorage.getItem("token");
      if (!token) {
        isAnimatingRef.current = false;
        return;
      }

      // Optimistic update: increment locally immediately for better feel
      localClicksRef.current += 1;
      setClicks((prev) => prev + 1);

      if (onClickUpdate) onClickUpdate(); // оновлюємо профіль після кліку

      // Send to server with no-cache and keep-alive
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

      try {
        const res = await fetch("/api/click", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "Connection": "keep-alive",
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
          // Revert optimistic update on error
          setClicks((prev) => Math.max(0, prev - 1));
          localClicksRef.current = Math.max(0, localClicksRef.current - 1);
          isAnimatingRef.current = false;
          return;
        }

        const data = await res.json();
        setClicks(data.clicks);
        localClicksRef.current = data.clicks;
      } catch (err) {
        console.error("Click error:", err);
        // Revert optimistic update
        setClicks((prev) => Math.max(0, prev - 1));
        localClicksRef.current = Math.max(0, localClicksRef.current - 1);
        isAnimatingRef.current = false;
        return;
      }

      setFrame(2);
      setImageKey((prev) => prev + 1);
      setTimeout(() => {
        setFrame(3);
        setTimeout(() => {
          setFrame(1);
          isAnimatingRef.current = false;
        }, 50);
      }, 50);
    },
    [onClickUpdate]
  );

  const getSitImage = () => {
    const baseImage =
      frame === 1 ? "/sit1.png" : frame === 2 ? "/sit.png" : "/sit2.png";
    return `${baseImage}?t=${imageKey}`;
  };

  if (!isClient) {
    return <div className={styles.anim} style={{ opacity: 0 }} />;
  }

  return (
    <div onClick={changeFrame} className={styles.anim}>
      <img src={getSitImage()} className={styles.img} alt="squat" />
    </div>
  );
}
