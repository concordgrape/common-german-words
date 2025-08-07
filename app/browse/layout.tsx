import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Most Common German Words – Common German Words",
  description: "Explore and learn the most frequently used words in German. Save, mark known, and study with quizzes or flashcards. View our library of over 6000 words",
};

export default function AdjectivesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
