"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { useToast } from "../hooks/useToast";
import { useGoNavigation } from "../lib/navigation";
import { auth } from "@/lib/firebaseClient";
import {
  deleteUser,
  GoogleAuthProvider,
  reauthenticateWithPopup,
  updateEmail,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { FaTrash } from "react-icons/fa6";
import { ImExit } from "react-icons/im";
import {
  deleteFirestoreDoc,
  fetchKnownWordMetadata,
  fetchSavedWordMetadata,
} from "../helpers/userWordLibrary";
import { kCOUNTRY_LANG_CODE, kLANG_NAME_CAPITAL } from "../lib/constants";

const ProfileContentPage: React.FC = () => {
  const { user, theme, setTheme, loading } = useUser();
  const [email, setEmail] = useState("");
  const [totalSavedWords, setTotalSavedWords] = useState<number>(-1);
  const [totalKnownWords, setTotalKnownWords] = useState<number>(-1);
  const toast = useToast();
  const { go } = useGoNavigation();

  useEffect(() => {
    if (!user && !loading) {
      go("/signin");
    }
  }, [user, loading]);

  useEffect(() => {
    if (!user?.uid) return;

    const loadSavedData = async () => {
      const savedWords = await fetchSavedWordMetadata(user.uid, 9000);
      setTotalSavedWords(savedWords.length);
    };

    const loadKnownData = async () => {
      const knownWords = await fetchKnownWordMetadata(user.uid, 9000);
      setTotalKnownWords(knownWords.length);
    };

    loadSavedData();
    loadKnownData();
  }, [user?.uid]);

  const handleSaveChanges = () => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      toast({
        title: "Account error",
        subtitle: "Your account cannot be found, please try again later",
        variant: "error",
      });
      return;
    }

    if (!currentUser.email || email === "" || email === currentUser.email) {
      toast({
        title: "No changes made",
        subtitle: "Your email address is the same as before",
        variant: "info",
      });
      return;
    }

    updateEmail(currentUser, email)
      .then(() => {
        toast({ title: "Email updated successfully", variant: "success" });
      })
      .catch(async (error: unknown) => {
        console.error("Error updating email:", error);

        if (error instanceof FirebaseError) {
          if (
            error.code === "auth/requires-recent-login" ||
            error.code === "auth/operation-not-allowed"
          ) {
            try {
              await sendEmailVerification(currentUser);
              toast({
                title: "Verification required",
                subtitle:
                  "Check your inbox to verify and then sign in again to update your email.",
                variant: "info",
              });
            } catch (verifyError) {
              console.error("Error sending verification email:", verifyError);
              toast({
                title: "Unable to send verification email",
                subtitle: "Please try again later or contact support.",
                variant: "error",
              });
            }
          } else if (error.code === "auth/email-already-in-use") {
            toast({
              title: "Email already in use",
              subtitle:
                "This email address is already associated with another account.",
              variant: "error",
            });
          } else {
            toast({
              title: "Unable to update email",
              subtitle: "Please try again later or contact support",
              variant: "error",
            });
          }
        }
      });
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        window.location.reload();
      })
      .catch((error: Error) => {
        console.error("Unhandler error: ", error);
      });
  };

  return (
    <div className="min-h-screen pt-25 lg:pt-30 w-full flex justify-center p-4 text-black">
      <div className="flex flex-col w-full max-w-[800px]">
        <div className="flex w-full items-center">
          <div>
            <h1 className="text-left text-2xl font-bold text-black dark:text-white">
              Profile
            </h1>
            <h4 className="text-left text-sm text-black dark:text-white mb-4">
              Settings for your <i>Common {kLANG_NAME_CAPITAL} Words</i> account
            </h4>
          </div>
          <div className="ml-auto">
            <button
              disabled={email == "" ? true : false}
              className="text-black dark:text-white text-xs px-1 py-2 rounded-lg mr-2 hover:underline disabled:hidden"
            >
              Cancel
            </button>
            <button
              disabled={email == "" ? true : false}
              onClick={handleSaveChanges}
              className="cursor-pointer bg-blue-500 ml-1 text-white text-xs px-2 lg:px-3 py-2 rounded-lg disabled:cursor-not-allowed disabled:opacity-50"
            >
              Save Changes
            </button>
          </div>
        </div>
        <div className="w-full p-4 bg-[#FFFFFF] dark:bg-[#0D1B2A] border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="flex items-center p-4">
            <div className="w-100">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Email address
              </label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder={user?.email ? user?.email : "john.doe@company.com"}
                required
              />
            </div>
          </div>
          <div className="flex items-center p-4">
            <div className="w-65 sm:w-70">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Your saved words
              </label>
              <button
                disabled={totalSavedWords == -1}
                onClick={() =>
                  deleteFirestoreDoc({
                    uid: user?.uid ?? "",
                    languageCode: kCOUNTRY_LANG_CODE,
                    docId: "saved",
                  })
                }
                className={`${totalSavedWords == -1 ? "skeleton opacity/50" : ""} cursor-pointer bg-gray-50 hover:bg-gray-100 border font-mono border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:hover:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 flex`}
              >
                <FaTrash className="mt-[2px] mr-2" />
                Delete{" "}
                <span className="text-orange-500 font-bold px-2">
                  SAVED
                </span>{" "}
                Words ({totalSavedWords == -1 ? 0 : totalSavedWords})
              </button>
              <button
                disabled={totalKnownWords == -1}
                onClick={() =>
                  deleteFirestoreDoc({
                    uid: user?.uid ?? "",
                    languageCode: kCOUNTRY_LANG_CODE,
                    docId: "known",
                  })
                }
                className={`${totalKnownWords == -1 ? "skeleton opacity/50" : ""} mt-2 cursor-pointer bg-gray-50 hover:bg-gray-100 border font-mono border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:hover:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 flex`}
              >
                <FaTrash className="mt-[2px] mr-2" />
                Delete{" "}
                <span className="text-green-600 font-bold px-2">
                  KNOWN
                </span>{" "}
                Words ({totalKnownWords == -1 ? 0 : totalKnownWords})
              </button>
            </div>
          </div>
          <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700" />

          <div className="p-4">
            <h2 className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Appearance
            </h2>
            <select
              value={theme}
              onChange={(e) =>
                setTheme(e.target.value as "light" | "dark" | "system")
              }
              className="w-60 px-3 py-2 h-10 rounded-md bg-gray-100 dark:bg-[#262839] text-sm border border-gray-200 dark:border-gray-600 text-black dark:text-white"
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          <div className="p-4">
            <h2 className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Account
            </h2>
            <button
              onClick={handleLogout}
              className="w-30 cursor-pointer bg-gray-50 hover:bg-gray-100 border font-mono border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:hover:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 flex items-center justify-center gap-2"
            >
              <ImExit className="text-base" />
              Logout
            </button>
          </div>
        </div>
        <DeleteAccountPrompt />
      </div>
    </div>
  );
};

const DeleteAccountPrompt: React.FC = () => {
  const toast = useToast();
  const { go } = useGoNavigation();

  const handleDeleteAccount = async () => {
    const user = auth.currentUser;
    if (!user) return;

    if (
      !confirm(
        "Are you sure you want to delete your account? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      // Detect the sign-in method
      const providerId = user.providerData[0]?.providerId;

      if (providerId === "google.com") {
        // Google
        const provider = new GoogleAuthProvider();
        await reauthenticateWithPopup(user, provider);
      } else {
        toast({
          title: "Error deleting account",
          subtitle:
            "Please contact support to continue with your account deletion",
          variant: "error",
        });
      }

      await deleteUser(user);

      toast({
        title: "Account deleted",
        subtitle: "Account successfully deleted. You will be logged out",
        variant: "success",
      });

      go("/signin");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast({
        title: "Error deleting account",
        subtitle: "Please try again later or contact support",
        variant: "error",
      });
    }
  };

  return (
    <div className="w-full m-auto bg-red-100 mt-5 px-8 py-6 rounded-lg grid grid-cols-[auto_1fr_auto] items-center gap-4">
      {/* Trash Icon (left-aligned) */}
      <div className="flex items-start">
        <FaTrash className="text-red-500 text-2xl" />
      </div>

      {/* Text content (left-aligned) */}
      <div className="text-left">
        <h1 className="font-mono font-bold">Delete your account?</h1>
        <p className="text-xs font-mono">
          Once your account is deleted, we cannot get it back. All data will be
          removed from our database
        </p>
      </div>

      {/* Delete Button (right-aligned) */}
      <div className="flex justify-end">
        <button
          onClick={handleDeleteAccount}
          className="cursor-pointer px-6 py-4 bg-red-400 rounded-lg text-red-800 font-mono font-bold hover:bg-red-500 hover:text-red-900"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default function ProfilePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfileContentPage />
    </Suspense>
  );
}
