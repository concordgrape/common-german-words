import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Top 500 German Adjectives – Common German Words",
  description:
    "Discover the top 500 most frequently used German adjectives with meanings, usage examples, and pronunciation guides. Ideal for building advanced vocabulary skills with flashcards, quizzes, and real-world sentences",
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
    title: "Top 500 German Adjectives – Common German Words",
    description:
      "Learn the 500 most important German adjectives with clear definitions, example sentences, and interactive study tools to master vocabulary faster",
    url: "https://commongermanwords.com/top-500-words/adjectives",
    type: "website",
    siteName: "Common German Words",
  },
  twitter: {
    card: "summary_large_image",
    title: "Top 500 German Adjectives – Common German Words",
    description:
      "Master German adjectives with our list of the top 500 most used words, complete with examples, pronunciation, and quizzes",
  },
};

export default function AdjectivesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
