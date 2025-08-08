import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.commongermanwords.com"),
  title: "Browse the Most Common German Words – Word Library | Common German Words",
  description:
    "Explore 6,000+ of the most common German words. View definitions, examples, part of speech, gender, and pronunciation. Filter by CEFR level, length, or part of speech, and save or mark words as known. Study with flashcards and quizzes.",
  keywords: [
    "common German words",
    "most common German words",
    "German vocabulary list",
    "German frequency list",
    "German word library",
    "CEFR German",
    "learn German words",
    "German nouns verbs adjectives adverbs",
    "German flashcards",
    "German quizzes",
  ],
  alternates: {
    canonical: "https://www.commongermanwords.com/browse",
  },
  openGraph: {
    title: "Browse the Most Common German Words – 6,000+ Word Library",
    description:
      "Discover the full library of common German words with filters, saved/known tracking, and study tools like flashcards and quizzes.",
    url: "https://www.commongermanwords.com/browse",
    siteName: "Common German Words",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Common German Words Library" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Browse the Most Common German Words – 6,000+ Word Library",
    description:
      "Filter, save, and study from a library of 6,000+ common German words with definitions, examples, and CEFR tags.",
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
  return <>{children}</>;
}
