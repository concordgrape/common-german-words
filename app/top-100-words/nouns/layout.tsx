import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Top 500 German Nouns – Common German Words",
  description: "Explore and learn the 500 most frequently used nouns in German. Save, mark known, and study with quizzes or flashcards.",
};

export default function NounsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
