import { OAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";
import { useGoNavigation } from "../lib/navigation";

function SignInWithApple() {
  const provider = new OAuthProvider("apple.com");
  const { go } = useGoNavigation();

  provider.addScope("email");
  provider.addScope("name");

  const signInHandler = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // The signed-in user info.
        const user = result.user;

        if (user) {
          go("/browse");
        }
      })
      .catch((error) => {
        console.error("Error signing in with Apple:", error);
      });
  };

  return (
    <button
      type="button"
      className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-900 transition-colors duration-200 w-full"
      onClick={signInHandler}
    >
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M16.365 1.43c0 1.14-.423 2.016-1.26 2.625-.693.54-1.503.855-2.445.81-.06-.99.345-1.905 1.095-2.55.72-.63 1.62-1.005 2.61-1.065zM20.25 17.505c-.555 1.29-1.32 2.46-2.295 3.495-1.05 1.095-2.205 1.665-3.465 1.71-.87 0-1.905-.255-3.105-.765-1.155-.48-2.16-.72-3.015-.72-.885 0-1.845.24-2.88.72-1.14.51-2.025.78-2.655.81-.945.03-1.875-.525-2.79-1.665C-.15 19.17-.45 17.34.48 15.495c.42-.795 1.095-1.53 2.025-2.205.96-.69 1.89-1.08 2.79-1.17.69 0 1.635.21 2.835.63 1.185.42 2.025.63 2.52.63.39 0 1.17-.21 2.34-.63 1.17-.42 2.1-.615 2.79-.585 1.965.15 3.42.975 4.365 2.475.39.645.675 1.32.855 2.025.09.36.135.705.135 1.035 0 .66-.15 1.26-.465 1.8z" />
      </svg>
      <span className="text-sm font-medium">Sign in with Apple</span>
    </button>
  );
}

export default SignInWithApple;
