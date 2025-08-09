import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Top 100 German Nouns – Common German Words",
  description:
    "Learn the top 100 most common German nouns with meanings, usage examples, and pronunciation. Perfect for beginners and advanced learners to boost German vocabulary with flashcards, quizzes, and real-life sentences",
  keywords: [
    "German nouns",
    "top German nouns",
    "common German words",
    "German vocabulary",
    "learn German nouns",
    "German language learning",
    "German flashcards",
    "German quizzes",
    "study German",
    "most used German nouns"
  ],
  openGraph: {
    title: "Top 100 German Nouns – Common German Words",
    description:
      "Boost your German skills by learning the 100 most frequently used nouns. Includes definitions, examples, pronunciation, and interactive study tools",
    url: "https://commongermanwords.com/top-100-words/nouns",
    type: "website",
    siteName: "Common German Words",
  },
  twitter: {
    card: "summary_large_image",
    title: "Top 100 German Nouns – Common German Words",
    description:
      "Learn the most common German nouns with flashcards, quizzes, and example sentences to master your vocabulary",
  },
};

export default function NounsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
