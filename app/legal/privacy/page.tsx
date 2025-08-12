import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Common German Words",
  description:
    "Privacy Policy for Common German Words and Verbuu – Common Words.",
};

const EFFECTIVE_DATE = "August 8, 2025";

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-10 sm:pt-15 sm:pt-20 sm:p-4 md:pt-20 max-w-[1200px] m-auto flex flex-col md:flex-row">
      <div className="w-full px-6 py-6 mt-4 pb-6 bg-white sm:border-1 sm:border-gray-200 dark:border-gray-700 dark:bg-[#0D1B2A]">
        <PrivacyPolicy />
      </div>
    </div>
  );
}

function PrivacyPolicy() {
  return (
    <main className="px-4 prose prose-gray dark:prose-invert max-w-none text-black dark:text-white">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p>
        <strong>Effective Date:</strong> {EFFECTIVE_DATE}
      </p>

      <p>
        This Privacy Policy explains how <strong>Common German Words</strong> (the
        “Website”) and <strong>Verbuu – Common Words</strong> (the “App”) collect,
        use, and protect your information when you use our services
        (“Services”). By using the Services, you agree to this policy.
      </p>

      <h2 className="mt-8 text-2xl font-semibold">Who We Are</h2>
      <p>
        The Services are operated by an individual based in Ontario, Canada
        (“we,” “us,” or “our”). Contact us at{" "}
        <a
          href="mailto:hi@skyroth.com"
          className="text-blue-500 hover:underline"
        >
          hi@skyroth.com
        </a>
        .
      </p>

      <h2 className="mt-8 text-2xl font-semibold">Information We Collect</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          **Account Information** – We collect your email address and display
          name when you create an account.
        </li>
        <li>
          **Learning Progress** – We store data about words you save, mark as
          “known,” or interact with in the app.
        </li>
        <li>
          **Analytics Data** – We use Google Analytics and Vercel Analytics to
          collect information such as your approximate location (country, state,
          city), device type, and how you interact with the Services.
        </li>
        <li>
          **Crash Reports** – When the Services crash or encounter an error, we
          collect technical information to improve stability and performance.
        </li>
        <li>
          **Local Preferences** – Theme settings (light or dark mode) are stored
          locally on your device and are not sent to our servers.
        </li>
      </ul>

      <h2 className="mt-8 text-2xl font-semibold">How We Use Your Information</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>To provide and maintain the Services.</li>
        <li>To track learning progress and personalize your experience.</li>
        <li>To monitor and improve performance, usability, and stability.</li>
        <li>To understand usage trends through analytics.</li>
      </ul>

      <h2 className="mt-8 text-2xl font-semibold">Cookies and Tracking</h2>
      <p>
        We use local storage for theme preferences. Google Analytics and Vercel
        Analytics may set cookies or use similar tracking technologies to
        collect analytics data as described above.
      </p>

      <h2 className="mt-8 text-2xl font-semibold">Data Storage and Security</h2>
      <p>
        All user data is stored in Google Firebase and Google Analytics. Data is
        encrypted at rest and in transit. We use secure authentication methods
        and industry-standard practices to protect your information.
      </p>

      <h2 className="mt-8 text-2xl font-semibold">Third-Party Services</h2>
      <p>
        We use the following third-party services:
      </p>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          **Google Firebase** – for user authentication, database storage, and
          data hosting.
        </li>
        <li>
          **Google Analytics** – for usage analytics and performance tracking.
        </li>
        <li>**Vercel Analytics** – for website performance metrics.</li>
        <li>
          **Google Text-to-Speech (TTS)** – to play pre-recorded or pre-generated
          audio of words and sentences.
        </li>
      </ul>
      <p>
        These services may collect and process data according to their own
        privacy policies.
      </p>

      <h2 className="mt-8 text-2xl font-semibold">Data Deletion</h2>
      <p>
        You can delete all data associated with your account at any time from
        your profile page. Deletion requests are processed automatically and
        permanently remove your stored account information, learning data, and
        preferences from our systems.
      </p>

      <h2 className="mt-8 text-2xl font-semibold">Children’s Privacy</h2>
      <p>
        The Services are intended for users aged 13 and older. We do not
        knowingly collect personal information from children under 13. If you
        believe we have inadvertently collected such data, please contact us for
        deletion.
      </p>

      <h2 className="mt-8 text-2xl font-semibold">Your Rights</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>Access the personal data we store about you.</li>
        <li>Request correction of inaccurate information.</li>
        <li>Request deletion of your account and all related data.</li>
      </ul>

      <h2 className="mt-8 text-2xl font-semibold">Policy Updates</h2>
      <p>
        We may update this Privacy Policy from time to time. Changes will be
        posted on this page with the updated effective date. Your continued use
        of the Services after updates constitutes acceptance of the changes.
      </p>

      <h2 className="mt-8 text-2xl font-semibold">Contact Us</h2>
      <p>
        For questions or concerns about this Privacy Policy, email us at{" "}
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
