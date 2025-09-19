"use client";

import { useEffect, useRef, useState } from "react";
import { useDeleteAds } from "@/app/hooks/useDeleteAds";

export default function StickyFooterAd() {
  useDeleteAds(); // clean up old ads on mount/unmount

  const adRef = useRef<HTMLModElement>(null);
  const [hasAd, setHasAd] = useState(false);

  useEffect(() => {
    try {
      // Request ad
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("Adsense error", e);
    }

    // Watch for iframe insertion inside <ins>
    const observer = new MutationObserver(() => {
      if (adRef.current) {
        const iframe = adRef.current.querySelector("iframe");
        setHasAd(!!iframe);
      }
    });

    if (adRef.current) {
      observer.observe(adRef.current, { childList: true, subtree: true });
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 w-full z-50 transition-colors ${
        hasAd ? "bg-white/80 backdrop-blur-sm shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="flex justify-center">
        <ins
          ref={adRef}
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
