"use client";

import { useEffect } from "react";

export function useDeleteAds() {
  useEffect(() => {
    const removeAds = () => {
      const ads = document.querySelectorAll("ins.adsbygoogle");
      ads.forEach((ad) => {
        ad.remove();
      });

      // Also remove any wrapping container if needed
      const iframes = document.querySelectorAll("iframe[id^='aswift_']");
      iframes.forEach((iframe) => {
        iframe.remove();
      });
    };

    removeAds(); // run once on mount

    return () => {
      removeAds(); // also run on unmount
    };
  }, []);
}
