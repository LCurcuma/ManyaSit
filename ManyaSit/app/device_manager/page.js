"use client";

import DeviceManager from "@/components/DeviceManager/DeviceManager";
import styles from "./page.module.scss";
import { useState, useEffect } from "react";

export default function DeviceManagment() {
        const [time, setTime] = useState();
    useEffect(() => {
        let d = new Date();
        let t = d.getHours();
        setTime(t);
    }, [])
    
    return (
      <div className={styles.bg}>
        {time >= 0 && time < 6 && (
          <div className={styles.night}>
            <div className={styles.dvmn}>
                        <DeviceManager />
            </div>
          </div>
        )}

        {time >= 6 && time < 12 && (
          <div className={styles.morning}>
            <div className={styles.dvmn}>
              <DeviceManager />
            </div>
          </div>
        )}

        {time >= 12 && time < 16 && (
          <div className={styles.day}>
            <div className={styles.dvmn}>
              <DeviceManager />
            </div>
          </div>
        )}

        {time >= 16 && time < 22 && (
          <div className={styles.evening}>
            <div className={styles.dvmn}>
              <DeviceManager />
            </div>
          </div>
        )}

        {time >= 22 && time < 24 && (
          <div className={styles.night}>
            <div className={styles.dvmn}>
              <DeviceManager />
            </div>
          </div>
        )}
      </div>
    );
}