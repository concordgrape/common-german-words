"use client";

import { useEffect } from "react";

export default function StickyFooterAd() {
  useEffect(() => {
    const ads = document.querySelectorAll("ins.adsbygoogle");
    ads.forEach((ad) => {
      if (!ad.getAttribute("data-adsbygoogle-status")) {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
          console.error("Adsense error", e);
        }
      }
    });
  }, []);

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-sm shadow-lg z-50">
      <div className="flex justify-center">
        <ins
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
