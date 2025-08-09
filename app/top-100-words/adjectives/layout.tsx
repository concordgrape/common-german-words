import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Top 100 German Adjectives – Common German Words",
  description:
    "Learn the top 100 most common German adjectives with meanings, usage examples, and pronunciation. Perfect for beginners and advanced learners to boost German vocabulary with flashcards, quizzes, and real-life sentences",
  keywords: [
    "German adjectives",
    "top German adjectives",
    "common German words",
    "German vocabulary",
    "learn German adjectives",
    "German language learning",
    "German flashcards",
    "German quizzes",
    "study German",
    "most used German adjectives"
  ],
  openGraph: {
    title: "Top 100 German Adjectives – Common German Words",
    description:
      "Boost your German skills by learning the 100 most frequently used adjectives. Includes definitions, examples, pronunciation, and interactive study tools",
    url: "https://commongermanwords.com/top-100-words/adjectives",
    type: "website",
    siteName: "Common German Words",
  },
  twitter: {
    card: "summary_large_image",
    title: "Top 100 German Adjectives – Common German Words",
    description:
      "Learn the most common German adjectives with flashcards, quizzes, and example sentences to master your vocabulary",
  },
};

export default function AdjectivesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
