"use client";

import { useRouter } from "next/navigation";
import styles from "./page.module.scss";

export default function LogoutButton({ onLogout } = {}) {
  const router = useRouter();

  function doLogout() {
    try {
      // mark that the user intentionally logged out so login/register
      // pages can avoid auto-redirecting back to /main
      localStorage.setItem("justLoggedOut", "1");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch (e) {
      console.warn("logout: localStorage operation failed", e);
    }

    if (typeof onLogout === "function") onLogout();

    // navigate to login screen (or home)
    router.push("/login");
  }

  return (
    <button
      onClick={doLogout}
      style={{ marginLeft: 12 }}
      className={styles.btn}
    >
      Выйти
    </button>
  );
}
