import { useEffect, useState } from "react";
import styles from "./DeviceManager.module.scss";

export default function DeviceManager() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentDeviceId, setCurrentDeviceId] = useState(null);

  // Get current device ID from localStorage
  useEffect(() => {
    const did = localStorage.getItem("deviceId");
    setCurrentDeviceId(did);
  }, []);

  // Fetch list of devices
  const fetchDevices = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/devices", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch devices");
      }

      const data = await res.json();
      setDevices(data.devices || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete a device
  const handleDeleteDevice = async (deviceId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/devices/${encodeURIComponent(deviceId)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Failed to delete device");
      }

      // Remove from local state
      setDevices((prev) => prev.filter((d) => d.device_id !== deviceId));
    } catch (err) {
      setError(err.message);
    }
  };

  // Format timestamp for display
  const formatTime = (isoString) => {
    if (!isoString) return "Unknown";
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Управление устройствами</h3>

      {error && <p className={styles.error}>{error}</p>}

      {loading ? (
        <p className={styles.loading}>Загрузка...</p>
      ) : devices.length === 0 ? (
        <p className={styles.empty}>Нет активных устройств</p>
      ) : (
        <ul className={styles.deviceList}>
          {devices.map((device) => {
            const isCurrent = device.device_id === currentDeviceId;
            return (
              <li key={device.device_id} className={styles.deviceItem}>
                <div className={styles.deviceInfo}>
                  <span className={styles.deviceId}>{device.device_id}</span>
                  {isCurrent && <span className={styles.badge}>Текущее</span>}
                  <span className={styles.lastSeen}>
                    Последний доступ: {formatTime(device.last_seen)}
                  </span>
                </div>
                {!isCurrent && (
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDeleteDevice(device.device_id)}
                  >
                    Удалить
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <div className={styles.btn_container}>
        <button className={styles.refreshBtn} onClick={fetchDevices}>
          Обновить
              </button>
              <a href="/main" className={styles.refreshBtn}>
                  Назад
              </a>
      </div>
    </div>
  );
}
