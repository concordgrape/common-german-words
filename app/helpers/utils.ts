'use client';

import { useState, useEffect } from "react";

export function useIsMobile(breakpoint: number = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < breakpoint);
    checkMobile(); // on mount
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [breakpoint]);

  return isMobile;
}

export function truncateString(str: string, maxLength = 30) {
  const textAfterColon = str.includes(':') ? str.split(':').pop()!.trim() : str;
  return textAfterColon.length > maxLength 
    ? textAfterColon.slice(0, maxLength - 3) + '...' 
    : textAfterColon;
}
