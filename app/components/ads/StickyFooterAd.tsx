"use client";

import { useEffect, useRef, useState } from "react";

export default function StickyFooterAd() {
  const [shouldRender, setShouldRender] = useState(false);
  const [hasFill, setHasFill] = useState(true);
  const [slotKey, setSlotKey] = useState(0); // unique key per attempt
  const [retryAttempted, setRetryAttempted] = useState(false);
  const insRef = useRef<HTMLModElement>(null);

  // Request an ad when slotKey changes
  useEffect(() => {
    if (!shouldRender) return;

    setTimeout(() => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("Adsense error", e);
      }
    }, 0);
  }, [slotKey, shouldRender]);

  // On first mount, show slot
  useEffect(() => {
    const existing = document.querySelector("ins.adsbygoogle.cgw-stickyfooter");
    if (!existing) setShouldRender(true);
  }, []);

  useEffect(() => {
    if (!insRef.current) return;

    const observer = new MutationObserver(() => {
      if (insRef.current?.querySelector("iframe")) {
        setHasFill(true); // ad loaded
      }
    });

    observer.observe(insRef.current, { childList: true, subtree: true });

    // Fallback: after 3s, if no iframe → assume no fill
    const timer = setTimeout(() => {
      if (insRef.current && !insRef.current.querySelector("iframe")) {
        if (!retryAttempted) {
          // retry once with a fresh <ins>
          setRetryAttempted(true);
          setHasFill(true); // keep container visible while retrying
          setSlotKey((prev) => prev + 1);
        } else {
          // second failure → hide ad
          setHasFill(false);
        }
      }
    }, 3000);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [shouldRender, slotKey, retryAttempted]);

  // If no ad slot is needed, or if fill failed twice → hide container
  if (!shouldRender || !hasFill) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white/80 dark:bg-white/20 backdrop-blur-sm shadow-lg z-50">
      <div className="flex justify-center">
        <ins
          key={slotKey} // force React to treat as new node on retry
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
        />
      </div>
    </div>
  );
}
