import { kCOMMONWORDS_URL_WWW, kLANG_NAME_CAPITAL } from "@/app/lib/constants";
import { WordListStructuredData } from "@/app/components/StructuredData";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: `${kCOMMONWORDS_URL_WWW}/top-100-words/adverbs`,
  },
  title: `Top 100 ${kLANG_NAME_CAPITAL} Adverbs – Common ${kLANG_NAME_CAPITAL} Words`,
  description: `Master the 100 most frequently used ${kLANG_NAME_CAPITAL} adverbs with definitions, conjugations, usage examples, and pronunciation guides. Perfect for speaking and writing fluently`,
  keywords: [
    `${kLANG_NAME_CAPITAL} words`,
    `top ${kLANG_NAME_CAPITAL} adverbs`,
    `common ${kLANG_NAME_CAPITAL} adverbs`,
    `${kLANG_NAME_CAPITAL} vocabulary`,
    `learn ${kLANG_NAME_CAPITAL} adverbs`,
    `${kLANG_NAME_CAPITAL} language learning`,
    `${kLANG_NAME_CAPITAL} flashcards`,
    `${kLANG_NAME_CAPITAL} quizzes`,
    `study ${kLANG_NAME_CAPITAL}`,
    `most used ${kLANG_NAME_CAPITAL} adverbs`,
  ],
  openGraph: {
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `Common ${kLANG_NAME_CAPITAL} Words`,
      },
    ],
    title: `Top 100 ${kLANG_NAME_CAPITAL} Adverbs – Common ${kLANG_NAME_CAPITAL} Words`,
    description: `Boost your ${kLANG_NAME_CAPITAL} skills by learning the 100 most frequently used adverbs. Includes definitions, examples, pronunciation, and interactive study tools`,
    url: `${kCOMMONWORDS_URL_WWW}/top-100-words/adverbs`,
    type: "website",
    siteName: `Common ${kLANG_NAME_CAPITAL} Words`,
  },
  twitter: {
    images: ["/og-image.jpg"],
    card: "summary_large_image",
    title: `Top 100 ${kLANG_NAME_CAPITAL} Adverbs – Common ${kLANG_NAME_CAPITAL} Words`,
    description: `Learn the most common ${kLANG_NAME_CAPITAL} adverbs with flashcards, quizzes, and example sentences to master your vocabulary`,
  },
};

export default function AdverbsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <WordListStructuredData
        path="/top-100-words/adverbs"
        name={`Top 100 ${kLANG_NAME_CAPITAL} Adverbs – Common ${kLANG_NAME_CAPITAL} Words`}
        description={`Master the 100 most frequently used ${kLANG_NAME_CAPITAL} adverbs with definitions, conjugations, usage examples, and pronunciation guides. Perfect for speaking and writing fluently`}
      />
      {children}
    </>
  );
}
