import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Top 500 German Adjectives – Common German Words",
  description: "Explore and learn the 500 most frequently used adjectives in German. Save, mark known, and study with quizzes or flashcards.",
};

export default function AdjectivesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
