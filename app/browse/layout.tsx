import type { Metadata } from "next";
import {
  kCOMMONWORDS_URL_WWW,
  kDEFAULT_WORD_COUNT,
  kLANG_NAME_CAPITAL,
} from "../lib/constants";

export const metadata: Metadata = {
  metadataBase: new URL(kCOMMONWORDS_URL_WWW),
  title: `Browse the Most Common ${kLANG_NAME_CAPITAL} Words – Word Library | Common ${kLANG_NAME_CAPITAL} Words`,
  description: `Explore ${kDEFAULT_WORD_COUNT}+ of the most common ${kLANG_NAME_CAPITAL} words. View definitions, examples, part of speech, gender, and pronunciation. Filter by CEFR level, length, or part of speech, and save or mark words as known. Study with flashcards and quizzes.`,
  keywords: [
    `common ${kLANG_NAME_CAPITAL} words`,
    `most common ${kLANG_NAME_CAPITAL} words`,
    `${kLANG_NAME_CAPITAL} vocabulary list`,
    `${kLANG_NAME_CAPITAL} frequency list`,
    `${kLANG_NAME_CAPITAL} word library`,
    `CEFR ${kLANG_NAME_CAPITAL}`,
    `learn ${kLANG_NAME_CAPITAL} words`,
    `${kLANG_NAME_CAPITAL} nouns verbs adjectives adverbs`,
    `${kLANG_NAME_CAPITAL} flashcards`,
    `${kLANG_NAME_CAPITAL} quizzes`,
  ],
  alternates: {
    canonical: `${kCOMMONWORDS_URL_WWW}/browse`,
  },
  openGraph: {
    title: `Browse the Most Common ${kLANG_NAME_CAPITAL} Words – ${kDEFAULT_WORD_COUNT}+ Word Library`,
    description: `Discover the full library of common ${kLANG_NAME_CAPITAL} words with filters, saved/known tracking, and study tools like flashcards and quizzes.`,
    url: `${kCOMMONWORDS_URL_WWW}/browse`,
    siteName: `Common ${kLANG_NAME_CAPITAL} Words`,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `Common ${kLANG_NAME_CAPITAL} Words Library`,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Browse the Most Common ${kLANG_NAME_CAPITAL} Words – 6,000+ Word Library`,
    description: `Filter, save, and study from a library of 6,000+ common ${kLANG_NAME_CAPITAL} words with definitions, examples, and CEFR tags.`,
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export default function BrowseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}
