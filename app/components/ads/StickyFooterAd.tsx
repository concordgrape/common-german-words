"use client";

import { useEffect, useRef, useState } from "react";

export default function StickyFooterAd() {
  const [shouldRender, setShouldRender] = useState(false);
  const [hasFill, setHasFill] = useState(true); // track ad fill state
  const insRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    const existing = document.querySelector("ins.adsbygoogle.cgw-stickyfooter");

    if (!existing) {
      setShouldRender(true);

      // Let React mount <ins>, then request ad
      setTimeout(() => {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
          console.error("Adsense error", e);
        }
      }, 0);
    }
  }, []);

  useEffect(() => {
    if (!insRef.current) return;

    // Watch for AdSense injecting iframe
    const observer = new MutationObserver(() => {
      if (insRef.current) {
        const iframe = insRef.current.querySelector("iframe");
        if (iframe) {
          setHasFill(true); // ad loaded
        }
      }
    });

    observer.observe(insRef.current, { childList: true, subtree: true });

    // Fallback: after 3s, if still no iframe, assume no-fill
    const timer = setTimeout(() => {
      if (insRef.current && !insRef.current.querySelector("iframe")) {
        setHasFill(false);
      }
    }, 3000);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [shouldRender]);

  // If no ad slot is needed, or if fill failed → hide
  if (!shouldRender || !hasFill) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white/80 dark:bg-white/20 backdrop-blur-sm shadow-lg z-50">
      <div className="flex justify-center">
        <ins
          ref={insRef}
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
