import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Top 100 German Adverbs – Common German Words",
  description:
    "Learn the top 100 most common German adverbs with meanings, usage examples, and pronunciation. Perfect for beginners and advanced learners to boost German vocabulary with flashcards, quizzes, and real-life sentences",
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
    title: "Top 100 German Adverbs – Common German Words",
    description:
      "Boost your German skills by learning the 100 most frequently used adverbs. Includes definitions, examples, pronunciation, and interactive study tools",
    url: "https://yourdomain.com/german/adverbs",
    type: "website",
    siteName: "YourSiteName",
  },
  twitter: {
    card: "summary_large_image",
    title: "Top 100 German Adverbs – Common German Words",
    description:
      "Learn the most common German adverbs with flashcards, quizzes, and example sentences to master your vocabulary",
  },
};

export default function AdverbsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
