import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Top 500 German Verbs – Common German Words",
  description:
    "Master the 500 most frequently used German verbs with definitions, conjugations, usage examples, and pronunciation guides. Perfect for speaking and writing fluently",
  keywords: [
    "German verbs",
    "top German verbs",
    "common German words",
    "German vocabulary",
    "learn German verbs",
    "German language learning",
    "German flashcards",
    "German quizzes",
    "study German",
    "most used German verbs"
  ],
  openGraph: {
    title: "Top 500 German Verbs – Common German Words",
    description:
      "Learn 500 essential German verbs with conjugation examples, pronunciation, and interactive practice to boost fluency",
    url: "https://yourdomain.com/german/verbs-500",
    type: "website",
    siteName: "YourSiteName",
  },
  twitter: {
    card: "summary_large_image",
    title: "Top 500 German Verbs – Common German Words",
    description:
      "Boost your German fluency by mastering the 500 most common verbs with examples, pronunciation, and quizzes",
  },
};

export default function VerbsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
