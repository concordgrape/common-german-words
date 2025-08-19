import React from "react";
import type { Metadata } from "next";
import { kLANG_NAME_CAPITAL } from "@/app/lib/constants";

export const metadata: Metadata = {
  title: `Terms & Conditions | Common ${kLANG_NAME_CAPITAL} Words`,
  description:
    `Terms and Conditions for Common ${kLANG_NAME_CAPITAL} Words and Verbuu – Common Words.`,
};

const EFFECTIVE_DATE = "August 8, 2025";

export default function TermsAndConditionsPage() {
  return (
    <div className="pt-10 sm:pt-15 sm:pt-20 sm:p-4 md:pt-20 max-w-[1200px] m-auto flex flex-col md:flex-row">
      <div className="w-full px-6 py-6 mt-4 pb-6 bg-white sm:border-1 sm:border-gray-200 dark:border-gray-700 dark:bg-[#0D1B2A]">
        <Policy />
      </div>
    </div>
  );
}

function Policy() {
  return (
    <main className="px-4 prose prose-gray dark:prose-invert max-w-none text-black dark:text-white">
      <h1 className="text-3xl font-bold">Terms &amp; Conditions</h1>
      <p className="mt-2">
        <strong>Effective Date:</strong> {EFFECTIVE_DATE}
      </p>

      <p>
        Welcome to <strong>Common {kLANG_NAME_CAPITAL} Words</strong> (the “Website”) and{" "}
        <strong>Verbuu – Common Words</strong> (the “App”). These Terms and
        Conditions (“Terms”) govern your access to and use of our website,
        applications, and related services (collectively, the “Services”). By
        using the Services, you agree to these Terms. If you do not agree, do
        not use the Services.
      </p>

      <h2 className="mt-8 text-2xl font-semibold">Who we are</h2>
      <p>
        The Services are operated by an individual based in Ontario, Canada
        (“we,” “us,” or “our”).
      </p>

      <h2 className="mt-8 text-2xl font-semibold">Eligibility</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>You must be at least 13 years old to use the Services.</li>
        <li>
          If you are below the age of majority in your jurisdiction, you must
          have permission from a parent or legal guardian.
        </li>
      </ul>

      <h2 className="mt-8 text-2xl font-semibold">Accounts</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>Users may create accounts to access certain features.</li>
        <li>
          You are responsible for keeping your login credentials confidential
          and for all activity under your account.
        </li>
        <li>
          You must provide accurate, current information and keep it updated.
        </li>
        <li>
          We may suspend or terminate accounts for violations of these Terms or
          to protect the Services or other users.
        </li>
      </ul>

      <h2 className="mt-8 text-2xl font-semibold">User Content</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>Users cannot upload, post, or share content through the Services.</li>
        <li>
          Any feedback, feature ideas, or suggestions you voluntarily provide
          (“Feedback”) may be used by us without obligation, attribution, or
          compensation to you. You grant us a perpetual, irrevocable,
          worldwide, royalty-free license to use, modify, and implement such
          Feedback in our products and Services.
        </li>
      </ul>

      <h2 className="mt-8 text-2xl font-semibold">Purchases and Subscriptions</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>We do not offer in-app purchases or paid subscriptions.</li>
        <li>Users cannot buy goods or services through the Services.</li>
      </ul>

      <h2 className="mt-8 text-2xl font-semibold">Contests and Sweepstakes</h2>
      <p>We do not plan to offer contests, sweepstakes, or similar promotions.</p>

      <h2 className="mt-8 text-2xl font-semibold">Intellectual Property</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          The Services, including all learning materials, text, graphics,
          interfaces, quizzes, and other content, are owned by us or our
          licensors and are protected by copyright and other laws.
        </li>
        <li>
          All trademarks, logos, and service marks displayed on the Services
          are our property or the property of third parties. You are not
          granted any rights or licenses to use them without prior written
          permission.
        </li>
        <li>
          You may access and use the Services for your personal, non-commercial
          use only. No other rights are granted.
        </li>
      </ul>

      <h2 className="mt-8 text-2xl font-semibold">Acceptable Use</h2>
      <p>You agree not to:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Access or use the Services in any unlawful manner;</li>
        <li>
          Attempt to interfere with, disrupt, or compromise the integrity or
          security of the Services;
        </li>
        <li>
          Reverse engineer, decompile, or attempt to extract source code except
          to the extent such restrictions are prohibited by applicable law;
        </li>
        <li>Use automated means (bots, scrapers) without our written consent;</li>
        <li>Impersonate any person or misrepresent your affiliation.</li>
      </ul>

      <h2 className="mt-8 text-2xl font-semibold">Privacy</h2>
      <p>
        Your use of the Services may involve the collection and use of personal
        information. Please review our Privacy Policy (when available) for
        details on how we handle your data.
      </p>

      <h2 className="mt-8 text-2xl font-semibold">Third-Party Services</h2>
      <p>
        The Services may link to or rely on third-party sites or services. We
        are not responsible for third-party content, policies, or practices.
        Your use of third-party services is at your own risk and subject to
        their terms.
      </p>

      <h2 className="mt-8 text-2xl font-semibold">Disclaimer of Warranties</h2>
      <p>
        The Services are provided on an “AS IS” and “AS AVAILABLE” basis without
        warranties of any kind, whether express, implied, or statutory,
        including (without limitation) warranties of merchantability, fitness
        for a particular purpose, and non-infringement. We do not warrant that
        the Services will be uninterrupted, secure, or error-free, or that
        content will be accurate or complete.
      </p>

      <h2 className="mt-8 text-2xl font-semibold">Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, we will not be liable for any
        indirect, incidental, consequential, special, punitive, or exemplary
        damages, or for any loss of profits, revenues, data, goodwill, or other
        intangible losses, arising out of or relating to your use of the
        Services. Our total liability for any claims relating to the Services
        will not exceed one hundred (100) CAD.
      </p>

      <h2 className="mt-8 text-2xl font-semibold">Indemnification</h2>
      <p>
        You agree to indemnify and hold us harmless from and against any claims,
        liabilities, damages, losses, and expenses (including reasonable legal
        fees) arising out of or in any way connected with your use of the
        Services or your violation of these Terms.
      </p>

      <h2 className="mt-8 text-2xl font-semibold">Termination</h2>
      <p>
        We may suspend or terminate your access to the Services at any time,
        with or without notice, for conduct that we believe violates these
        Terms, is harmful to other users, or to protect the Services. Upon
        termination, your right to use the Services will cease immediately.
      </p>

      <h2 className="mt-8 text-2xl font-semibold">Changes to the Services or Terms</h2>
      <p>
        We may update or modify the Services and these Terms from time to time.
        If we make material changes to the Terms, we will post the updated
        version with a new effective date. Your continued use of the Services
        after changes become effective constitutes acceptance of the revised
        Terms.
      </p>

      <h2 className="mt-8 text-2xl font-semibold">Governing Law</h2>
      <p>
        These Terms are governed by the laws of the Province of Ontario and the
        federal laws of Canada applicable therein, without regard to conflict of
        law principles. You agree to the exclusive jurisdiction and venue of the
        courts located in Ontario, Canada.
      </p>

      <h2 className="mt-8 text-2xl font-semibold">Contact</h2>
      <p>
        Questions or concerns? Email us at{" "}
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
        Website: <strong>https://commongermanwords.com</strong> &nbsp;|&nbsp;
        App: <strong>Verbuu – Common Words</strong>
      </p>
    </main>
  );
}
