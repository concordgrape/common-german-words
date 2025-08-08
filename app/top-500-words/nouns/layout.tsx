import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Top 500 German Nouns – Common German Words",
  description:
    "Learn the 500 most frequently used German nouns with their meanings, gender, example sentences, and pronunciation. Ideal for learners wanting a strong vocabulary foundation",
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
    title: "Top 500 German Nouns – Common German Words",
    description:
      "Build your vocabulary with the 500 most common German nouns, complete with gender, examples, and interactive practice",
    url: "https://yourdomain.com/german/nouns-500",
    type: "website",
    siteName: "YourSiteName",
  },
  twitter: {
    card: "summary_large_image",
    title: "Top 500 German Nouns – Common German Words",
    description:
      "Master the 500 most important German nouns with definitions, examples, and interactive learning tools",
  },
};

export default function NounsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
