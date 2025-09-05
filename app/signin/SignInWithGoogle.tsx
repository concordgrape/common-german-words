"use client"

import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useRouter } from "next/navigation";

import { auth } from "@/lib/firebaseClient";

function GoogleSignInButton() {
  const provider = new GoogleAuthProvider();
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const accessToken = credential?.accessToken; // ✅ This is the correct OAuth token

      if (accessToken) {
        localStorage.setItem("googleAccessToken", accessToken); // Store for later API calls
        router.push("/browse");
      } else {
        console.error("No access token received.");
      }

      if (result.user) {
      } else {
        console.error("No user information available after sign-in.");
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <div className="px-6 sm:px-0 max-w-sm">
      <button type="button" onClick={handleGoogleSignIn} className="cursor-pointer text-black dark:text-white w-full bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-700 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between mr-2 mb-2">
      <svg className="mr-2 -ml-1 w-4 h-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
        <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z">
        </path>
      </svg>
      Sign in with Google
      </button>
    </div>
  );
}

export default GoogleSignInButton;
