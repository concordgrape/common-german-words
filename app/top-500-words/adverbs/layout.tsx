import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Top 500 German Adverbs – Common German Words",
  description:
    "Explore the 500 most common German adverbs with meanings, real-life usage examples, and pronunciation. Perfect for expanding your vocabulary with interactive flashcards and quizzes",
  keywords: [
    "German adverbs",
    "top German adverbs",
    "common German words",
    "German vocabulary",
    "learn German adverbs",
    "German language learning",
    "German flashcards",
    "German quizzes",
    "study German",
    "most used German adverbs"
  ],
  openGraph: {
    title: "Top 500 German Adverbs – Common German Words",
    description:
      "Boost your fluency by learning the top 500 German adverbs, complete with usage examples, definitions, and pronunciation guides",
    url: "https://yourdomain.com/german/adverbs-500",
    type: "website",
    siteName: "YourSiteName",
  },
  twitter: {
    card: "summary_large_image",
    title: "Top 500 German Adverbs – Common German Words",
    description:
      "Learn 500 essential German adverbs with examples, pronunciation, and interactive tools for faster learning",
  },
};

export default function AdverbsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
