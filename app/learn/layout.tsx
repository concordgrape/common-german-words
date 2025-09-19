import type { Metadata } from "next";
import { kCOMMONWORDS_URL_WWW, kDEFAULT_WORD_COUNT, kLANG_NAME_CAPITAL } from "../lib/constants";
import StickyFooterAd from "../components/Ads/StickyFooter";

export const metadata: Metadata = {
  metadataBase: new URL(kCOMMONWORDS_URL_WWW),
  title: `Learn & Practice Common ${kLANG_NAME_CAPITAL} Words – Flashcards & Quizzes | Common ${kLANG_NAME_CAPITAL} Words`,
  description:
    `Build ${kLANG_NAME_CAPITAL} vocabulary with customizable flashcards and quizzes. Practice your saved words or randomize from our ${kDEFAULT_WORD_COUNT}+ word library with CEFR filters and smart study modes`,
  keywords: [
    `learn ${kLANG_NAME_CAPITAL}`,
    `${kLANG_NAME_CAPITAL} flashcards`,
    `${kLANG_NAME_CAPITAL} quizzes`,
    `practice ${kLANG_NAME_CAPITAL} vocabulary`,
    `common ${kLANG_NAME_CAPITAL} words`,
    `CEFR ${kLANG_NAME_CAPITAL}`,
    `study ${kLANG_NAME_CAPITAL} words`,
    `random ${kLANG_NAME_CAPITAL} words`,
  ],
  alternates: {
    canonical: `${kCOMMONWORDS_URL_WWW}/learn`,
  },
  openGraph: {
    title: `Learn & Practice Common ${kLANG_NAME_CAPITAL} Words – Flashcards & Quizzes`,
    description:
      `Configure ${kLANG_NAME_CAPITAL} flashcards and quizzes, practice saved words, or pull random words from a ${kDEFAULT_WORD_COUNT}+ library. Fast, focused vocabulary learning`,
    url: `${kCOMMONWORDS_URL_WWW}/learn`,
    siteName: `Common ${kLANG_NAME_CAPITAL} Words`,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `Learn ${kLANG_NAME_CAPITAL} with flashcards and quizzes`,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Learn & Practice Common ${kLANG_NAME_CAPITAL} Words – Flashcards & Quizzes`,
    description:
      `Customize flashcards and quizzes to study your saved ${kLANG_NAME_CAPITAL} words or randomized sets from our ${kDEFAULT_WORD_COUNT}+ library`,
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

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>
  {children}
  <StickyFooterAd />
  </>;
}
