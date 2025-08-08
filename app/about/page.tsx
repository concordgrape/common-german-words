// app/about/page.tsx
import React from "react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us | Common German Words",
  description:
    "Learn about Common German Words and Verbuu – Common Words: our mission, how it works, and what we value.",
};

export default function AboutPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto min-h-screen pt-30 bg-white sm:border sm:border-gray-200 dark:border-gray-700 dark:bg-[#0D1B2A]">
      <div className="mb-10">
        <About />
      </div>
    </div>
  );
}

function About() {
  return (
    <main className="px-4 prose prose-gray dark:prose-invert max-w-none text-black dark:text-white">
      <h1 className="text-3xl font-bold">About Us</h1>

      <p>
        <strong>Common German Words</strong> helps you learn the most
        useful German vocabulary—fast. We focus on frequency-based lists, clean
        design, and quick practice so you can build real reading and listening
        confidence without fluff.
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
        <li>
          Keep the interface fast, clean, and distraction-free with both light
          and dark mode support.
        </li>
      </ul>

      <h2 className="mt-4 text-2xl font-semibold">How It Works</h2>
      <p>
        We grab millions of sentences from your favourite TV shows in the native
        language you&apos;re trying to learn. Then we curate a list of the most
        frequently spoken words from those shows. From there, we generate
        definitions and example sentences—using both real-world examples from
        the source material and additional examples we create—so you can learn
        vocabulary in authentic, engaging contexts.
        <br />
        <br />
        Based on the words you save, we automatically create custom flashcards
        and quizzes to help you review and reinforce your learning over time.
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
          href="mailto:support@commonwords.app"
          className="text-blue-500 hover:underline"
        >
          support@commonwords.app
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
