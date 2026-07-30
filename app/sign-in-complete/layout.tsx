import type { Metadata } from "next";
import { kCOMMONWORDS_URL_WWW, kLANG_NAME_CAPITAL } from "@/app/lib/constants";

export const metadata: Metadata = {
  title: `Signing You In | Common ${kLANG_NAME_CAPITAL} Words`,
  description: "Completing your sign in.",
  alternates: {
    canonical: `${kCOMMONWORDS_URL_WWW}/sign-in-complete`,
  },
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function SignInCompleteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
