import type { Metadata } from "next";
import { kCOMMONWORDS_URL_WWW, kLANG_NAME_CAPITAL } from "@/app/lib/constants";

export const metadata: Metadata = {
  title: `Sign In | Common ${kLANG_NAME_CAPITAL} Words`,
  description:
    "Sign in to save words, track your progress, and sync your study history across devices.",
  alternates: {
    canonical: `${kCOMMONWORDS_URL_WWW}/signin`,
  },
};

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
