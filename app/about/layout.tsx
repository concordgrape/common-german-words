import type { Metadata } from "next";
import { kCOMMONWORDS_URL_WWW, kLANG_NAME_CAPITAL } from "../lib/constants";

export const metadata: Metadata = {
  metadataBase: new URL(kCOMMONWORDS_URL_WWW),
  title: `About Us – Common ${kLANG_NAME_CAPITAL} Words`,
  description:
    `Learn more about Common ${kLANG_NAME_CAPITAL} Words, our mission to make learning ${kLANG_NAME_CAPITAL} vocabulary simple and effective, and how we help learners master the most frequently used German words.`,
  keywords: [
    `about Common ${kLANG_NAME_CAPITAL} Words`,
    `learn ${kLANG_NAME_CAPITAL} vocabulary`,
    `${kLANG_NAME_CAPITAL} flashcards`,
    `${kLANG_NAME_CAPITAL} quizzes`,
    `${kLANG_NAME_CAPITAL} word frequency list`,
    `language learning tools`,
  ],
  alternates: {
    canonical: "https://www.commongermanwords.com/about",
  },
  openGraph: {
    title: `About Us – Common ${kLANG_NAME_CAPITAL} Words`,
    description:
      `Discover our mission to make learning ${kLANG_NAME_CAPITAL} faster and easier through word frequency lists, flashcards, quizzes, and CEFR-based study tools.`,
    url: "https://www.commongermanwords.com/about",
    siteName: `Common ${kLANG_NAME_CAPITAL} Words`,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `About Common ${kLANG_NAME_CAPITAL} Words`,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `About Us – Common ${kLANG_NAME_CAPITAL} Words`,
    description:
      `Learn more about Common ${kLANG_NAME_CAPITAL} Words, our mission, and how we help ${kLANG_NAME_CAPITAL} learners with curated vocabulary tools.`,
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

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
