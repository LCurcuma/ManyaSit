"use client";

import { useState , useEffect} from "react";

export default function SitAnim() {
    const [frame, setFrame] = useState(1);
  let [clicks, setClicks] = useState(0);
  const [token, setToken] = useState(null);
  

  useEffect(() => {
    const t = localStorage.getItem("token");
    setToken(t);

    if (!t) return;

    async function loadUser() {
      const res = await fetch("/api/user", {
        headers: {
          Authorization: `Bearer ${t}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setClicks(data.clicks);
      }
    }

    loadUser();
  }, []);

  async function changeFrame() {
    const token = localStorage.getItem("token");
    
    const res = await fetch("/api/click", {
      method: "POST",
      headers: { 
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`, // обов'язково Bearer
    },
    });

    const data = await res.json();
      setClicks(data.clicks);
      
        setFrame(2);
        setTimeout(() => {
            setFrame(3);

            setTimeout(() => {
                setFrame(1);
            }, 50);
        },50)
    }

    return (
      <div onClick={changeFrame}>
        {frame === 1 && <img src="/sit1.png" />}
        {frame === 2 && <img src="/sit.png" />}
            {frame === 3 && <img src="/sit2.png" />}
            
            <p>{clicks}</p>
        </div>
    );

}