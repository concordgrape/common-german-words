import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | Common German Words",
  description:
    "Cookie Policy for Common German Words and Verbuu – Common Words.",
};

const EFFECTIVE_DATE = "August 8, 2025";

export default function CookiePolicyPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto min-h-screen pt-30 bg-white sm:border sm:border-gray-200 dark:border-gray-700 dark:bg-[#0D1B2A]">
      <div className="mb-10">
        <CookiePolicy />
      </div>
    </div>
  );
}

function CookiePolicy() {
  return (
    <main className="px-4 prose prose-gray dark:prose-invert max-w-none text-black dark:text-white">
      <h1 className="text-3xl font-bold">Cookie Policy</h1>
      <p>
        <strong>Effective Date:</strong> {EFFECTIVE_DATE}
      </p>

      <p>
        This Cookie Policy explains how <strong>Common German Words</strong> (the
        “Website”) and <strong>Verbuu – Common Words</strong> (the “App”) use
        cookies and similar technologies to provide, improve, and personalize our
        services (“Services”).
      </p>

      <h2 className="mt-8 text-2xl font-semibold">What Are Cookies?</h2>
      <p>
        Cookies are small text files stored on your device by your browser. They
        help websites remember your preferences, understand how you use the
        site, and improve functionality.
      </p>

      <h2 className="mt-8 text-2xl font-semibold">Types of Cookies We Use</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          <strong>Essential Cookies</strong> – Required for the Services to
          function properly (e.g., authentication, security).
        </li>
        <li>
          <strong>Preference Cookies</strong> – Store your theme preference
          (light or dark mode) locally on your device. These are not sent to our
          servers.
        </li>
        <li>
          <strong>Analytics Cookies</strong> – Set by Google Analytics and
          Vercel Analytics to understand how users interact with our Services.
          These may collect:
          <ul className="list-disc pl-6 space-y-1">
            <li>Pages visited</li>
            <li>Time spent on pages</li>
            <li>Approximate location (country, state, city)</li>
            <li>Browser and device type</li>
          </ul>
        </li>
      </ul>

      <h2 className="mt-8 text-2xl font-semibold">Third-Party Cookies</h2>
      <p>
        We use third-party services that may set cookies on your device:
      </p>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          <strong>Google Analytics</strong> – Tracks usage patterns and
          performance.{" "}
          <a
            href="https://policies.google.com/technologies/cookies"
            className="text-blue-500 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more
          </a>
          .
        </li>
        <li>
          <strong>Vercel Analytics</strong> – Measures site performance and
          usage trends.{" "}
          <a
            href="https://vercel.com/legal/privacy-policy"
            className="text-blue-500 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more
          </a>
          .
        </li>
      </ul>

      <h2 className="mt-8 text-2xl font-semibold">How to Manage Cookies</h2>
      <p>
        Most browsers allow you to manage cookies through their settings. You
        can:
      </p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Delete existing cookies from your device.</li>
        <li>Block all cookies or only certain types of cookies.</li>
        <li>Set your browser to notify you before accepting cookies.</li>
      </ul>
      <p>
        Please note: Disabling cookies may limit the functionality of some parts
        of the Services.
      </p>

      <h2 className="mt-8 text-2xl font-semibold">Consent</h2>
      <p>
        By using our Services, you consent to the use of cookies as described in
        this policy. If you do not agree, you should adjust your browser settings
        or discontinue using the Services.
      </p>

      <h2 className="mt-8 text-2xl font-semibold">Policy Updates</h2>
      <p>
        We may update this Cookie Policy from time to time. Any changes will be
        posted on this page with the updated effective date.
      </p>

      <h2 className="mt-8 text-2xl font-semibold">Contact Us</h2>
      <p>
        If you have any questions about this Cookie Policy, contact us at{" "}
        <a
          href="mailto:hi@skyroth.com"
          className="text-blue-500 hover:underline"
        >
          hi@skyroth.com
        </a>
        .
      </p>
    </main>
  );
}
