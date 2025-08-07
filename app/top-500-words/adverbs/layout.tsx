import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Top 500 German Adverbs – Common German Words",
  description: "Explore and learn the 500 most frequently used adverbs in German. Save, mark known, and study with quizzes or flashcards.",
};

export default function AdverbsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
