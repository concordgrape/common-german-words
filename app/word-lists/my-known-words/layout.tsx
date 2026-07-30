import type { Metadata } from "next";
import { kCOMMONWORDS_URL_WWW, kLANG_NAME_CAPITAL } from "@/app/lib/constants";

export const metadata: Metadata = {
  title: `My Known Words | Common ${kLANG_NAME_CAPITAL} Words`,
  description: "The words you have marked as known.",
  alternates: {
    canonical: `${kCOMMONWORDS_URL_WWW}/word-lists/my-known-words`,
  },
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function KnownWordsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
