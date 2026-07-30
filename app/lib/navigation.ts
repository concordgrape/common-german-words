"use client";

import { useRouter } from "next/navigation";

export function useGoNavigation() {
  const router = useRouter();

  const go = (link: string) => {
    router.push(link);
  };

  return { go };
}
