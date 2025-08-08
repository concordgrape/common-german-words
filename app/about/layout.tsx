import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.commongermanwords.com"),
  title: "About Us – Common German Words",
  description:
    "Learn more about Common German Words, our mission to make learning German vocabulary simple and effective, and how we help learners master the most frequently used German words.",
  keywords: [
    "about Common German Words",
    "learn German vocabulary",
    "German flashcards",
    "German quizzes",
    "German word frequency list",
    "language learning tools",
  ],
  alternates: {
    canonical: "https://www.commongermanwords.com/about",
  },
  openGraph: {
    title: "About Us – Common German Words",
    description:
      "Discover our mission to make learning German faster and easier through word frequency lists, flashcards, quizzes, and CEFR-based study tools.",
    url: "https://www.commongermanwords.com/about",
    siteName: "Common German Words",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "About Common German Words",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us – Common German Words",
    description:
      "Learn more about Common German Words, our mission, and how we help German learners with curated vocabulary tools.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
