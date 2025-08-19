import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import { Navbar } from "./components/Navbar/Navbar";
import { ToastProvider } from "./hooks/useToast";
import Footer from "./components/Footer/Footer";
import { UserProvider } from "./context/UserContext";
import { WordFormProvider } from "./context/WordFormContext";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from '@next/third-parties/google'
import { kCOMMONWORDS_URL_WWW, kLANG_NAME_CAPITAL } from "./lib/constants";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0D1B2A" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(kCOMMONWORDS_URL_WWW),
  applicationName: `Common ${kLANG_NAME_CAPITAL} Words`,
  title: `Common ${kLANG_NAME_CAPITAL} Words | Study the Most Frequent ${kLANG_NAME_CAPITAL} Words`,
  description:
    `Master the most common ${kLANG_NAME_CAPITAL} words with interactive flashcards, quizzes, and CEFR-level vocabulary lists. Perfect for beginners and advanced learners.`,
  keywords: [
    `${kLANG_NAME_CAPITAL} vocabulary`,
    `common ${kLANG_NAME_CAPITAL} words`,
    `learn ${kLANG_NAME_CAPITAL}`,
    `${kLANG_NAME_CAPITAL} flashcards`,
    `${kLANG_NAME_CAPITAL} quizzes`,
    `${kLANG_NAME_CAPITAL} verbs`,
    `${kLANG_NAME_CAPITAL} nouns`,
    `${kLANG_NAME_CAPITAL} adjectives`,
    `${kLANG_NAME_CAPITAL} adverbs`,
    `language learning`,
  ],
  category: "Education",
  authors: [{ name: `Common ${kLANG_NAME_CAPITAL} Words` }],
  creator: `Common ${kLANG_NAME_CAPITAL} Words`,
  publisher: `Common ${kLANG_NAME_CAPITAL} Words`,
  generator: "Next.js",
  alternates: {
    canonical: kCOMMONWORDS_URL_WWW,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: `Common ${kLANG_NAME_CAPITAL} Words | Study the Most Frequent ${kLANG_NAME_CAPITAL} Words`,
    description:
      `Learn the most frequently used ${kLANG_NAME_CAPITAL} words with definitions, example sentences, and pronunciation. Includes flashcards, quizzes, and CEFR-level lists.`,
    url: kCOMMONWORDS_URL_WWW,
    siteName: `Common ${kLANG_NAME_CAPITAL} Words`,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `Common ${kLANG_NAME_CAPITAL} Words - Learn Vocabulary Fast`,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Common ${kLANG_NAME_CAPITAL} Words | Study the Most Frequent ${kLANG_NAME_CAPITAL} Words`,
    description:
      `Master ${kLANG_NAME_CAPITAL} vocabulary with flashcards, quizzes, and CEFR-level word lists. Perfect for beginners and advanced learners.`,
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "icon",
        url: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/site.webmanifest" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
        (function () {
          try {
            var theme = localStorage.getItem("theme"); // "light" | "dark" | "system" | null
            var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            var shouldDark = theme === "dark" || ((theme === null || theme === "system") && prefersDark);
            document.documentElement.classList.toggle("dark", shouldDark);
          } catch (_) {}
        })();
                `,
          }}
        />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7585653265358782" crossOrigin="anonymous"></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-[#1B263B]`}
      >
        <Analytics />
        <GoogleAnalytics gaId="G-QD4M0YK0M8" />
        <UserProvider>
          <WordFormProvider>
            <Navbar />
            <ToastProvider>{children}</ToastProvider>
            <Footer />
          </WordFormProvider>
        </UserProvider>
      </body>
    </html>
  );
}
