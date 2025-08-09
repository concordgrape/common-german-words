import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Top 500 German Words – Common German Words",
  description:
    "Master the 500 most frequently used German words with definitions, conjugations, usage examples, and pronunciation guides. Perfect for speaking and writing fluently",
  keywords: [
    "German words",
    "top German words",
    "common German words",
    "German vocabulary",
    "learn German words",
    "German language learning",
    "German flashcards",
    "German quizzes",
    "study German",
    "most used German words"
  ],
  openGraph: {
    title: "Top 500 German Words – Common German Words",
    description:
      "Learn 500 essential German words with conjugation examples, pronunciation, and interactive practice to boost fluency",
    url: "https://commongermanwords.com/top-500-words",
    type: "website",
    siteName: "Common German Words",
  },
  twitter: {
    card: "summary_large_image",
    title: "Top 500 German Words – Common German Words",
    description:
      "Boost your German fluency by mastering the 500 most common words with examples, pronunciation, and quizzes",
  },
};

export default function WordsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
