"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { useToast } from "../hooks/useToast";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebaseClient";
import { updateEmail, sendEmailVerification } from "firebase/auth";
import { FirebaseError } from "firebase/app";

const ProfileContentPage: React.FC = () => {
  const { user, theme, setTheme } = useUser();
  const [email, setEmail] = useState("");
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/signin");
    }
  }, [user, router]);

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

  return (
    <div className="min-h-screen pt-30 w-full flex justify-center p-4 text-black">
      <div className="flex flex-col w-full max-w-[800px]">
        <div className="flex w-full items-center">
          <div>
            <h1 className="text-left text-2xl font-bold text-black dark:text-white">
              Profile
            </h1>
            <h4 className="text-left text-sm text-black dark:text-white mb-4">
              Settings for your <i>Common German Words</i> account
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
              className="cursor-pointer bg-blue-500 text-white text-xs px-1 py-2 rounded-lg disabled:cursor-not-allowed disabled:opacity-50"
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
        </div>
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
