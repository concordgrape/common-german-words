import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.commongermanwords.com"),
  title: "Learn & Practice Common German Words – Flashcards & Quizzes | Common German Words",
  description:
    "Build German vocabulary with customizable flashcards and quizzes. Practice your saved words or randomize from our 6,000+ word library with CEFR filters and smart study modes",
  keywords: [
    "learn German",
    "German flashcards",
    "German quizzes",
    "practice German vocabulary",
    "common German words",
    "CEFR German",
    "study German words",
    "random German words",
  ],
  alternates: {
    canonical: "https://www.commongermanwords.com/learn",
  },
  openGraph: {
    title: "Learn & Practice Common German Words – Flashcards & Quizzes",
    description:
      "Configure German flashcards and quizzes, practice saved words, or pull random words from a 6,000+ library. Fast, focused vocabulary learning",
    url: "https://www.commongermanwords.com/learn",
    siteName: "Common German Words",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Learn German with flashcards and quizzes",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Learn & Practice Common German Words – Flashcards & Quizzes",
    description:
      "Customize flashcards and quizzes to study your saved German words or randomized sets from our 6,000+ library",
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
  return <>{children}</>;
}
