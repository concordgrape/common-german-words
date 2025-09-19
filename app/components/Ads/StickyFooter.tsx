"use client";

import { useEffect, useRef } from "react";

export default function StickyFooterAd() {
  const insRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    // Remove old AdSense slots
    const removeAds = () => {
      document.querySelectorAll("ins.adsbygoogle").forEach((el) => el.remove());
      document.querySelectorAll("iframe[id^='aswift_']").forEach((el) => el.remove());
    };

    removeAds();

    // Give React time to render the new <ins>
    const timer = setTimeout(() => {
      if (insRef.current) {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
          console.error("Adsense error", e);
        }
      }
    }, 100); // slight delay so <ins> is in the DOM

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-sm shadow-lg z-50">
      <div className="flex justify-center">
        <ins
          ref={insRef}
          className="adsbygoogle"
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
