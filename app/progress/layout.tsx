import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.commongermanwords.com"),
  title: "Progress – Common German Words",
  description:
    "Track your German learning progress: words learned, words remaining, streaks, and study activity",
  alternates: {
    canonical: "https://www.commongermanwords.com/progress",
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      "max-image-preview": "none",
      "max-snippet": 0,
      "max-video-preview": 0,
      "noimageindex": true,
    },
  },
  openGraph: {
    title: "Progress – Common German Words",
    description:
      "Monitor words learned, remaining goals, study streaks, and CEFR-level coverage",
    url: "https://www.commongermanwords.com/progress",
    siteName: "Common German Words",
    images: [
      { url: "/og-image.jpg", width: 1200, height: 630, alt: "Common German Words Progress" },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Progress – Common German Words",
    description:
      "View your vocabulary growth, streaks, and CEFR coverage over time",
    images: ["/og-image.jpg"],
  },
};

export default function ProgressLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
