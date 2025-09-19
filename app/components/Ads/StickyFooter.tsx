"use client";

import { useEffect } from "react";

export default function StickyFooterAd() {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("Adsense error", e);
    }
  }, []);

  return (
    <div className="fixed bottom-0 left-0 w-full max-h-[90px] flex justify-center bg-white/80 dark:bg-white/20 backdrop-blur-sm shadow-lg z-50">
        <ins
            className="adsbygoogle"
            style={{ display: "block", width: "100%", height: "90px", maxHeight: '90px' }}
            data-ad-client="ca-pub-7585653265358782"
            data-ad-slot="9960428411"
            data-full-width-responsive="false"
        ></ins>
    </div>
  );
}
