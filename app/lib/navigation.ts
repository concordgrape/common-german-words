"use client";

import { useRouter } from "next/navigation";
//import { useDeleteAds } from "../hooks/useDeleteAds";

export function useGoNavigation() {
  const router = useRouter();
  //useDeleteAds(); // sets up cleanup logic

  const go = (link: string) => {
    // clear ads immediately before navigating
   // document.querySelectorAll("ins.adsbygoogle").forEach((el) => el.remove());
   // document.querySelectorAll("iframe[id^='aswift_']").forEach((el) => el.remove());

    router.push(link);
  };

  return { go };
}
