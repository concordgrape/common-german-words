import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import { Navbar } from "./components/Navbar/Navbar";
import { ToastProvider } from "./hooks/useToast";
import Footer from "./components/Footer/Footer";
import { UserProvider } from "./context/UserContext";
import { WordFormProvider } from "./context/WordFormContext";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";

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
  metadataBase: new URL("https://www.commongermanwords.com"),
  applicationName: "Common German Words",
  title: "Common German Words | Learn German Vocabulary Fast",
  description:
    "Master the most common German words with interactive flashcards, quizzes, and CEFR-level vocabulary lists. Perfect for beginners and advanced learners.",
  keywords: [
    "German vocabulary",
    "common German words",
    "learn German",
    "German flashcards",
    "German quizzes",
    "German verbs",
    "German nouns",
    "German adjectives",
    "German adverbs",
    "language learning",
  ],
  category: "Education",
  authors: [{ name: "Common German Words" }],
  creator: "Common German Words",
  publisher: "Common German Words",
  generator: "Next.js",
  alternates: {
    canonical: "https://www.commongermanwords.com",
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
    title: "Common German Words | Learn German Vocabulary Fast",
    description:
      "Learn the most frequently used German words with definitions, example sentences, and pronunciation. Includes flashcards, quizzes, and CEFR-level lists.",
    url: "https://www.commongermanwords.com",
    siteName: "Common German Words",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Common German Words - Learn Vocabulary Fast",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Common German Words | Learn German Vocabulary Fast",
    description:
      "Master German vocabulary with flashcards, quizzes, and CEFR-level word lists. Perfect for beginners and advanced learners.",
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
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            (function () {
              try {
                const theme = localStorage.getItem("theme");
                if (theme === "dark" || (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
                  document.documentElement.classList.add("dark");
                } else {
                  document.documentElement.classList.remove("dark");
                }
              } catch (_) {}
            })();
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-[#1B263B]`}
      >
        <Analytics />
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
