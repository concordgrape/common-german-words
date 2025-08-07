import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learn Common German Words – Common German Words",
  description: "Learn the most frequently used words in German. Study with quizzes or flashcards. View our library of over 6000 words",
};

export default function AdjectivesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
