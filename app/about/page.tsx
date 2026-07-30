// app/about/page.tsx
import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { kCOMMONWORDS_URL_WWW, kLANG_NAME_CAPITAL } from "../lib/constants";

export const metadata: Metadata = {
  alternates: {
    canonical: `${kCOMMONWORDS_URL_WWW}/about`,
  },
  title: `About Us | Common ${kLANG_NAME_CAPITAL} Words`,
  description: `Learn about Common ${kLANG_NAME_CAPITAL} Words and Common Words: our mission, how it works, and what we value.`,
};

export default function AboutPage() {
  return (
    <div className="pt-10 sm:pt-24 max-w-[1200px] m-auto flex flex-col md:flex-row">
      <div className="w-full px-6 py-6 mt-4 pb-6 bg-white sm:border-1 sm:border-gray-200 dark:border-gray-700 dark:bg-[#0D1B2A]">
        <About />
      </div>
    </div>
  );
}

function About() {
  return (
    <main className="px-4 prose prose-gray dark:prose-invert max-w-none text-black dark:text-white">
      <h1 className="text-4xl font-bold">About Us</h1>

      <p>
        <strong>Common {kLANG_NAME_CAPITAL} Words</strong> helps you learn the
        most useful {kLANG_NAME_CAPITAL} vocabulary—fast. We focus on
        frequency-based lists, clean design, and quick practice so you can build
        real reading and listening confidence without fluff.
      </p>

      <h2 className="mt-4 text-2xl font-semibold">Our Mission</h2>
      <p>
        Make language learning simple, focused, and motivating by highlighting
        the most common words and giving you lightweight tools to practice
        daily.
      </p>

      <h2 className="mt-4 text-2xl font-semibold">What We Do</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          Collect millions of real sentences from popular TV shows in your
          target language.
        </li>
        <li>
          Identify and rank the most frequently spoken words from those shows.
        </li>
        <li>
          Provide clear definitions and example sentences drawn from authentic
          dialogue and curated examples we create.
        </li>
        <li>
          Offer tools to save words, mark them as “known,” and review at your
          own pace.
        </li>
      </ul>

      <h2 className="mt-4 text-2xl font-semibold">How It Works</h2>
      <p>
        We take millions of sentences from your favorite TV shows in the
        language you want to learn. Then we choose the words you hear the most.
        For each word, we give you an easy-to-understand definition and example
        sentences. Some are taken from the shows, and others are written to
        sound like real, everyday speech, so learning new words feels simple and
        natural.
      </p>

      <h2 className="mt-4 text-2xl font-semibold">Feature Requests</h2>
      <p>
        We love suggestions and may implement ideas you share. Navigate to our
        survey by clicking{" "}
        <a
          className="text-blue-500 hover:underline"
          href="https://forms.gle/5Y2QAkXmtiQtgmjT8"
          target="_blank"
        >
          here
        </a>
      </p>

      <h2 className="mt-4 text-2xl font-semibold">Questions?</h2>
      <p>
        Reach us at{" "}
        <a
          href="mailto:hi@skyroth.com"
          className="text-blue-500 hover:underline"
        >
          hi@skyroth.com
        </a>
        .
      </p>

      <hr className="my-8 border-gray-300 dark:border-gray-600" />

      <p className="text-sm">
        Helpful links:{" "}
        <Link href="/terms" className="text-blue-500 hover:underline">
          Terms &amp; Conditions
        </Link>{" "}
        ·{" "}
        <Link href="/privacy" className="text-blue-500 hover:underline">
          Privacy Policy
        </Link>{" "}
        ·{" "}
        <Link href="/cookies" className="text-blue-500 hover:underline">
          Cookie Policy
        </Link>
      </p>
    </main>
  );
}
