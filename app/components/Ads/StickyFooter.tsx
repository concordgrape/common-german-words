"use client";

import { useEffect, useState } from "react";

export default function StickyFooterAd() {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const existing = document.querySelector("ins.adsbygoogle.cgw-stickyfooter");

    if (!existing) {
      setShouldRender(true);
      setTimeout(() => {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
          console.error("Adsense error", e);
        }
      }, 0);
    }
  }, []);

  if (!shouldRender) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white/80 dark:bg-white/20 backdrop-blur-sm shadow-lg z-50">
      <div className="flex justify-center">
        <ins
          className="adsbygoogle cgw-stickyfooter"
          style={{
            display: "block",
            margin: "0 auto",
            width: "100%",
            maxWidth: "970px",
            height: "90px",
          }}
          data-ad-client="ca-pub-7585653265358782"
          data-ad-slot="9960428411"
          data-full-width-responsive="false"
        ></ins>
      </div>
    </div>
  );
}
