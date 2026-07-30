import type { Metadata } from "next";
import { kCOMMONWORDS_URL_WWW, kLANG_NAME_CAPITAL } from "@/app/lib/constants";

export const metadata: Metadata = {
  title: `Flashcards | Common ${kLANG_NAME_CAPITAL} Words`,
  description: "Study with interactive flashcards and quizzes.",
  alternates: {
    canonical: `${kCOMMONWORDS_URL_WWW}/learn/cards`,
  },
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function CardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
