import type { Metadata } from "next";
import { kCOMMONWORDS_URL_WWW, kLANG_NAME_CAPITAL } from "../lib/constants";

export const metadata: Metadata = {
  metadataBase: new URL(kCOMMONWORDS_URL_WWW),
  title: `Profile – Common ${kLANG_NAME_CAPITAL} Words`,
  description: `Manage your saved and known words, study preferences, theme, and account settings`,
  alternates: {
    canonical: `${kCOMMONWORDS_URL_WWW}/profile`,
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
      noimageindex: true,
    },
  },
  openGraph: {
    title: `Profile – Common ${kLANG_NAME_CAPITAL} Words`,
    description:
      "View and manage your saved words, study settings, and account preferences",
    url: `${kCOMMONWORDS_URL_WWW}/profile`,
    siteName: `Common ${kLANG_NAME_CAPITAL} Words`,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `Common ${kLANG_NAME_CAPITAL} Words`,
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `Profile – Common ${kLANG_NAME_CAPITAL} Words`,
    description: "Manage your vocabulary, preferences, and account settings",
    images: ["/og-image.jpg"],
  },
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
