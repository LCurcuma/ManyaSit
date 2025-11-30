"use client";

import { useState } from "react";

export default function SitAnim() {
    const [frame, setFrame] = useState(1);
    let [clicks, setClicks] = useState(0);

    function changeFrame() {
        setClicks(clicks + 1);
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