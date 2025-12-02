"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton({ onLogout } = {}) {
  const router = useRouter();

  function doLogout() {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch (e) {
      // ignore storage errors, still continue
      console.warn("logout: localStorage clear failed", e);
    }

    if (typeof onLogout === "function") onLogout();

    // navigate to login screen (or home)
    router.push("/login");
  }

  return (
    <button onClick={doLogout} style={{ marginLeft: 12 }}>
      Вийти
    </button>
  );
}
