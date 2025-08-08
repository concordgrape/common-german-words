import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GDPR Cookie Policy | Common German Words",
  description:
    "GDPR-compliant Cookie Policy for Common German Words and Verbuu – Common Words.",
};

const EFFECTIVE_DATE = "August 8, 2025";

export default function GDPRCookiePolicyPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto min-h-screen pt-30 bg-white sm:border sm:border-gray-200 dark:border-gray-700 dark:bg-[#0D1B2A]">
      <div className="mb-10">
        <GDPRCookiePolicy />
      </div>
    </div>
  );
}

function GDPRCookiePolicy() {
  return (
    <main className="px-4 prose prose-gray dark:prose-invert max-w-none text-black dark:text-white">
      <h1 className="text-3xl font-bold">GDPR Cookie Policy</h1>
      <p>
        <strong>Effective Date:</strong> {EFFECTIVE_DATE}
      </p>

      <p>
        This GDPR Cookie Policy explains how{" "}
        <strong>Common German Words</strong> (the “Website”) and{" "}
        <strong>Verbuu – Common Words</strong> (the “App”) use cookies and similar
        technologies in compliance with the{" "}
        <strong>General Data Protection Regulation (GDPR)</strong> and other
        applicable laws.
      </p>

      <h2 className="mt-8 text-2xl font-semibold">What Are Cookies?</h2>
      <p>
        Cookies are small text files placed on your device when you visit a
        website. They help us make our Services work, remember your preferences,
        and understand how you use our platform.
      </p>

      <h2 className="mt-8 text-2xl font-semibold">Types of Cookies We Use</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          <strong>Strictly Necessary Cookies</strong> – Required for the
          Services to function (e.g., authentication, security).
        </li>
        <li>
          <strong>Preference Cookies</strong> – Save your theme preference (light
          or dark mode) locally on your device. Not sent to our servers.
        </li>
        <li>
          <strong>Analytics Cookies</strong> – Set by Google Analytics and Vercel
          Analytics to collect anonymized data on site usage, including:
          <ul className="list-disc pl-6 space-y-1">
            <li>Pages visited and time spent</li>
            <li>Approximate location (country, state, city)</li>
            <li>Browser type and device</li>
          </ul>
        </li>
      </ul>

      <h2 className="mt-8 text-2xl font-semibold">Legal Basis for Processing</h2>
      <p>
        Under GDPR, we process your data using cookies based on:
      </p>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          <strong>Consent</strong> – For analytics cookies, given through our
          cookie consent banner.
        </li>
        <li>
          <strong>Legitimate Interest</strong> – For strictly necessary cookies
          that enable the Services to function.
        </li>
      </ul>

      <h2 className="mt-8 text-2xl font-semibold">Managing Cookies</h2>
      <p>
        You can change or withdraw your consent at any time using our{" "}
        <strong>Cookie Settings</strong> link in the footer, or by adjusting your
        browser settings to block or delete cookies.
      </p>

      <h2 className="mt-8 text-2xl font-semibold">Third-Party Cookies</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          <strong>Google Analytics</strong> –{" "}
          <a
            href="https://policies.google.com/technologies/cookies"
            className="text-blue-500 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            View policy
          </a>
        </li>
        <li>
          <strong>Vercel Analytics</strong> –{" "}
          <a
            href="https://vercel.com/legal/privacy-policy"
            className="text-blue-500 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            View policy
          </a>
        </li>
      </ul>

      <h2 className="mt-8 text-2xl font-semibold">Your GDPR Rights</h2>
      <p>Under GDPR, you have the right to:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Access the data we collect about you.</li>
        <li>Request correction or deletion of your data.</li>
        <li>Withdraw your consent for analytics cookies at any time.</li>
        <li>Complain to your local Data Protection Authority.</li>
      </ul>

      <h2 className="mt-8 text-2xl font-semibold">Consent</h2>
      <p>
        On your first visit to our Services, you will see a cookie consent banner
        that allows you to accept or reject non-essential cookies. We will only
        set analytics cookies if you give your consent.
      </p>

      <h2 className="mt-8 text-2xl font-semibold">Policy Updates</h2>
      <p>
        We may update this GDPR Cookie Policy from time to time. Any changes will
        be posted here with a new effective date.
      </p>

      <h2 className="mt-8 text-2xl font-semibold">Contact Us</h2>
      <p>
        For any GDPR-related questions or concerns, contact us at{" "}
        <a
          href="mailto:support@commonwords.app"
          className="text-blue-500 hover:underline"
        >
          support@commonwords.app
        </a>
        .
      </p>
    </main>
  );
}
