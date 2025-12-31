"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebaseClient";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { useGoNavigation } from "../lib/navigation";
import Link from "next/link";

export default function FinishSignIn() {
  const { go } = useGoNavigation();
  const [status, setStatus] = useState<"checking" | "success" | "error">(
    "checking",
  );

  useEffect(() => {
    const completeSignIn = async () => {
      try {
        const email = window.localStorage.getItem("emailForSignIn");
        if (!email || !isSignInWithEmailLink(auth, window.location.href)) {
          go("/signin");
          throw new Error("Invalid sign-in link.");
        }

        await signInWithEmailLink(auth, email, window.location.href);
        window.localStorage.removeItem("emailForSignIn");
        setStatus("success");
        go("/browse");
      } catch (error) {
        console.error("Error signing in:", error);
        setStatus("error");
      }
    };

    completeSignIn();
  }, []);

  return (
    <div className="min-h-screen w-full pt-15 pt-50 text-center items-center justify-center">
      <p className="text-gray-500">
        <span className="text-xl font-bold">Sign in Complete</span>
        <br />
        You will be redirected,{" "}
        <span className="font-semibold">
          click the button below if you haven&apos;t been redirected in 3
          seconds
        </span>
      </p>
      <Link href="/browse">
        <button
          disabled={status == "checking" || status == "error"}
          className="bg-blue-500 text-white font-bold font-mono p-4 rounded-2xl mt-5 cursor-pointer hover:shadow-lg"
        >
          &gt; Go Home &lt;
        </button>
      </Link>
    </div>
  );
}
