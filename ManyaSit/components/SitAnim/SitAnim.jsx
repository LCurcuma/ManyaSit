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
  // Batching buffer and timer
  const clickBufferRef = useRef([]);
  const sendTimerRef = useRef(null);

  const BATCH_SIZE = 50; // send when buffer reaches this
  const SEND_INTERVAL = 2000; // ms - send buffered clicks at least every second
  const MAX_BATCH = 500; // server-side constraint (also enforced client-side)

  const DEVICE_ID_KEY = "deviceId";

  // Ensure a stable device id per browser/profile
  useEffect(() => {
    try {
      let did = localStorage.getItem(DEVICE_ID_KEY);
      if (!did) {
        // simple random id
        did = `${Date.now().toString(36)}-${Math.random()
          .toString(36)
          .slice(2, 10)}`;
        localStorage.setItem(DEVICE_ID_KEY, did);
      }
    } catch (e) {
      // ignore localStorage errors
    }
  }, []);

  // BroadcastChannel for tab-to-tab sync (prevent duplicate clicks from multiple tabs)
  const channelRef = useRef(null);
  const isPrimaryRef = useRef(true);

  useEffect(() => {
    if (typeof BroadcastChannel !== "undefined") {
      try {
        channelRef.current = new BroadcastChannel("sitAnim_clicks");
        channelRef.current.onmessage = (event) => {
          const { type, clicks, coins } = event.data || {};
          if (type === "click_applied") {
            // Another tab sent clicks; update local state
            setClicks(clicks);
            localClicksRef.current = clicks;
            if (onClickUpdate) onClickUpdate({ clicks, coins });
          } else if (type === "tab_register") {
            // Another tab started; we become secondary
            isPrimaryRef.current = false;
          }
        };
        // announce this tab as primary
        channelRef.current.postMessage({ type: "tab_register" });
        return () => {
          if (channelRef.current) channelRef.current.close();
        };
      } catch (e) {
        // BroadcastChannel not supported; continue with normal flow
      }
    }
  }, [onClickUpdate]);

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

      // Add timestamp to buffer
      const ts = Date.now();
      clickBufferRef.current.push(ts);

      // If buffer exceeds maximum allowed, drop extra and keep latest ones
      if (clickBufferRef.current.length > MAX_BATCH) {
        clickBufferRef.current = clickBufferRef.current.slice(-MAX_BATCH);
      }

      // If buffer reached BATCH_SIZE, send immediately
      if (clickBufferRef.current.length >= BATCH_SIZE) {
        flushClickBuffer();
      } else {
        // Ensure a send timer is set
        if (!sendTimerRef.current) {
          sendTimerRef.current = setTimeout(() => {
            flushClickBuffer();
          }, SEND_INTERVAL);
        }
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

  // Flush the click buffer to server
  const flushClickBuffer = async () => {
    if (!clickBufferRef.current.length) return;
    // Clear timer
    if (sendTimerRef.current) {
      clearTimeout(sendTimerRef.current);
      sendTimerRef.current = null;
    }

    const batch = clickBufferRef.current.splice(
      0,
      clickBufferRef.current.length
    );
    const token = localStorage.getItem("token");
    if (!token) return;

    // Only primary tab sends to server
    if (!isPrimaryRef.current) {
      // Secondary tab: just wait for primary to broadcast response
      return;
    }

    try {
      const deviceId = localStorage.getItem(DEVICE_ID_KEY) || null;
      const res = await fetch("/api/click", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ clicks: batch, deviceId }),
      });

      if (!res.ok) {
        // On server error, we could requeue or drop. For now, drop and log.
        console.error("Batch click send failed", res.status);
        return;
      }

      const data = await res.json();
      // Server returns authoritative clicks and coins
      if (data && data.clicks !== undefined) {
        setClicks(data.clicks);
        localClicksRef.current = data.clicks;
        if (onClickUpdate) onClickUpdate(data);
        // Broadcast to other tabs
        if (channelRef.current) {
          channelRef.current.postMessage({
            type: "click_applied",
            clicks: data.clicks,
            coins: data.coins,
          });
        }
      }
    } catch (err) {
      console.error("Failed to flush click buffer:", err);
    }
  };

  const getSitImage = () => {
    const baseImage =
      frame === 1 ? "/sit1.png" : frame === 2 ? "/sit.png" : "/sit2.png";
    return `${baseImage}?t=${imageKey}`;
  };
  // flush buffer on unmount or when page hides; use sendBeacon if available
  useEffect(() => {
    const handleUnload = () => {
      try {
        const buffer = clickBufferRef.current || [];
        if (buffer.length) {
          const token = localStorage.getItem("token");
          const deviceId = localStorage.getItem(DEVICE_ID_KEY) || null;
          const payload = JSON.stringify({ clicks: buffer, deviceId });
          if (token && navigator.sendBeacon) {
            // attempt synchronous send
            navigator.sendBeacon("/api/click", payload);
            // clear buffer locally
            clickBufferRef.current = [];
          }
        }
      } catch (e) {
        // ignore
      }
    };

    window.addEventListener("beforeunload", handleUnload);
    window.addEventListener("pagehide", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      window.removeEventListener("pagehide", handleUnload);
      // try to flush remaining clicks asynchronously
      if (sendTimerRef.current) {
        clearTimeout(sendTimerRef.current);
        sendTimerRef.current = null;
      }
      // best effort flush
      flushClickBuffer();
    };
  }, []);

  if (!isClient) {
    return <div className={styles.anim} style={{ opacity: 0 }} />;
  }

  return (
    <div onClick={changeFrame} className={styles.anim}>
      <img src={getSitImage()} className={styles.img} alt="Маня" />
    </div>
  );
}
// Add unload handler inside component lifecycle to flush buffer
// (placed after component declaration so it uses component refs)
// Note: we call flushClickBuffer on unmount and use sendBeacon for synchronous unload.
