import type { Metadata } from "next";
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
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});


export const metadata: Metadata = {
  metadataBase: new URL("https://www.verbuu.com"),
  title: "Verbuu | Master Languages with Flashcards & Quizzes",
  description:
    "Learn German, Spanish, French and more with Verbuu's AI-powered flashcards, quizzes, and vocabulary tools. Start your language journey today.",
  keywords:
    "language learning, flashcards, language quiz, German vocabulary, Spanish practice, French grammar, CEFR words, language app",
  openGraph: {
    title: "Verbuu | Master Languages with Flashcards & Quizzes",
    description:
      "Learn German, Spanish, French and more with Verbuu's AI-powered flashcards and quizzes. Built for fast, fun, and effective language learning.",
    url: "https://www.verbuu.com",
    siteName: "Verbuu",
    images: [
      {
        url: "https://www.verbuu.com/og-image.jpg", // replace with your real OG image URL
        width: 1200,
        height: 630,
        alt: "Verbuu - AI Language Learning",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Verbuu | Master Languages with Flashcards & Quizzes",
    description:
      "Boost your vocabulary and fluency in German, Spanish, French and more with Verbuu. Smart flashcards, fun quizzes, and CEFR support.",
    images: ["https://www.verbuu.com/og-image.jpg"], // same OG image
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  alternates: {
    canonical: "https://www.verbuu.com",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:[#1B263B]`}
      >
        <Analytics />
        <UserProvider>
          <WordFormProvider>
            <Navbar />
            <ToastProvider>
              {children}
            </ToastProvider>
          <Footer />
          </WordFormProvider>
        </UserProvider>
      </body>
    </html>
  );
}
