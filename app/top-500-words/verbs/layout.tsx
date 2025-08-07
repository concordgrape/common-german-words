import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Top 500 German Verbs – Common German Words",
  description: "Explore and learn the 500 most frequently used verbs in German. Save, mark known, and study with quizzes or flashcards.",
};

export default function VerbsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
