import type { Metadata } from "next";
import { kCOMMONWORDS_URL_WWW, kLANG_NAME_CAPITAL } from "../lib/constants";
import StickyFooterAd from "../components/ads/StickyFooter";

export const metadata: Metadata = {
  title: `Top 100 ${kLANG_NAME_CAPITAL} Words – Common ${kLANG_NAME_CAPITAL} Words`,
  description:
    `Master the 100 most frequently used ${kLANG_NAME_CAPITAL} words with definitions, conjugations, usage examples, and pronunciation guides. Perfect for speaking and writing fluently`,
  keywords: [
    `${kLANG_NAME_CAPITAL} words`,
    `top ${kLANG_NAME_CAPITAL} words`,
    `common ${kLANG_NAME_CAPITAL} words`,
    `${kLANG_NAME_CAPITAL} vocabulary`,
    `learn ${kLANG_NAME_CAPITAL} words`,
    `${kLANG_NAME_CAPITAL} language learning`,
    `${kLANG_NAME_CAPITAL} flashcards`,
    `${kLANG_NAME_CAPITAL} quizzes`,
    `study ${kLANG_NAME_CAPITAL}`,
    `most used ${kLANG_NAME_CAPITAL} words`
  ],
  openGraph: {
    title: `Top 100 ${kLANG_NAME_CAPITAL} Words – Common ${kLANG_NAME_CAPITAL} Words`,
    description:
      `Learn 100 essential ${kLANG_NAME_CAPITAL} words with conjugation examples, pronunciation, and interactive practice to boost fluency`,
    url: `${kCOMMONWORDS_URL_WWW}/top-100-words`,
    type: "website",
    siteName: `Common ${kLANG_NAME_CAPITAL} Words`,
  },
  twitter: {
    card: "summary_large_image",
    title: `Top 100 ${kLANG_NAME_CAPITAL} Words – Common ${kLANG_NAME_CAPITAL} Words`,
    description:
      `Boost your ${kLANG_NAME_CAPITAL} fluency by mastering the 100 most common words with examples, pronunciation, and quizzes`,
  },
};

export default function WordsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>
    {children}
    <StickyFooterAd />
  </>;
}
