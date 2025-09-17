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


export function shuffle<T>(arr: T[], count?: number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }

  return typeof count === "number" ? a.slice(0, count) : a;
}

export function truncateAtCommaOrSemicolon(text: string, maxLength: number = 15): string {
  const commaIndex = text.indexOf(",");
  const semicolonIndex = text.indexOf(";");

  // Get the first occurring punctuation (comma or semicolon)
  const cutIndex = [commaIndex, semicolonIndex]
    .filter(index => index !== -1)
    .reduce((min, current) => (min === -1 || current < min ? current : min), -1);

  if (cutIndex !== -1) {
    return text.slice(0, cutIndex).trim();
  }

  if (text.length >= maxLength) {
    return text.slice(0, maxLength) + "...";
  }

  return text;
}