"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";
import Error from "next/error";
import { useUser } from "@/app/context/UserContext";
import { FaCheck, FaRegBookmark, FaRegUser } from "react-icons/fa";
import { ImExit } from "react-icons/im";
import { useRouter } from "next/navigation";
import { FaBook, FaQuestionCircle } from "react-icons/fa";
import { FaChartLine } from "react-icons/fa6";
import Link from "next/link";

export default function AvatarDropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        window.location.reload();
      })
      .catch((error: Error) => {
        console.log("Logout error:", error);
      });
  };

  const { loading } = useUser();

  return (
    <div
      className={`relative mt-1 sm:mt-0 ${
        loading ? "max-w-sm animate-pulse" : ""
      }`}
      ref={dropdownRef}
    >
      <button
        onClick={() => {
          if (loading) return;
          setOpen(!open);
        }}
        className="flex items-center cursor-pointer justify-center w-10 h-10 bg-gray-100 dark:bg-blue-400 rounded-full overflow-hidden hover:shadow-md text-gray-500 dark:text-white border-1 border-gray-300 dark:border-blue-400 transition-colors"
      >
        <div className="block sm:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="cursor-pointer"
          >
            <rect x="3" y="6" width="18" height="2" rx="1" />
            <rect x="3" y="11" width="18" height="2" rx="1" />
            <rect x="3" y="16" width="18" height="2" rx="1" />
          </svg>
        </div>

        <div className="hidden sm:block">
          <svg
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {/* Below will display the hamburger icon on mobile if the user isn't logged on & display the 'person' icon if the user is logged in icon}
        {/*!loading && !user ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="cursor-pointer"
          >
            <rect x="3" y="6" width="18" height="2" rx="1" />
            <rect x="3" y="11" width="18" height="2" rx="1" />
            <rect x="3" y="16" width="18" height="2" rx="1" />
          </svg>
        ) : (
          <svg
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
        )*/}
      </button>
      <div
        className={`absolute top-full right-0 w-64 z-50 transition-all duration-200 ease-out transform 
          ${
            open
              ? "opacity-100 scale-100 translate-y-0 visible pointer-events-auto"
              : "opacity-0 scale-95 -translate-y-1 invisible pointer-events-none"
          }
        `}
      >
        <UserDropdown
          handleLogout={handleLogout}
          setOpen={setOpen}
        />
      </div>
    </div>
  );
}

interface UserDropdownProps {
  handleLogout: () => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserDropdown = ({
  handleLogout,
  setOpen,
}: UserDropdownProps) => {
  const router = useRouter();
  const { user } = useUser();

  return (
    <div
      className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50
                  transition-all duration-800 ease-out transform
                  opacity-100 scale-100 translate-y-0"
    >
      <div
        className={`${
          user ? "block" : "hidden"
        } px-4 py-3 border-b border-gray-200`}
      >
        <p className="text-base font-semibold text-gray-900 leading-tight">
          {user?.displayName || "User"}
        </p>
        <p className="text-sm text-gray-600 truncate">{user?.email || 'null@email.com'}</p>
      </div>
      <div className="block lg:hidden">
        <ul className="py-1 text-sm text-gray-700">
          <li>
            <button
              className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-100
                          hover:text-orange-500 transition-colors duration-800"
              onClick={() => {
                router.push("/browse");
                setOpen(false);
              }}
            >
              <FaQuestionCircle className="text-lg" />
              Browse
            </button>
          </li>
          <li>
            <button
              className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-100
                        hover:text-green-700 transition-colors duration-800"
              onClick={() => {
                router.push("/learn");
                setOpen(false);
              }}
            >
              <FaBook className="text-lg" />
              Learn
            </button>
          </li>
          <li>
            <button
              className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-100
                          hover:text-orange-500 transition-colors duration-800"
              onClick={() => {
                router.push("/progress");
                setOpen(false);
              }}
            >
              <FaChartLine className="text-lg" />
              Progress
            </button>
          </li>
        </ul>
        <hr className="h-px my-2 bg-gray-200 border-0" />
      </div>
      <ul className={`py-1 text-sm text-gray-700`}>
        <li>
          <button
            className={`${
              user ? "block" : "hidden"
            } w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-100
                        hover:text-orange-500 transition-colors duration-800`}
            onClick={() => {
              router.push("/word-lists/my-saved-words");
              setOpen(false);
            }}
          >
            <FaRegBookmark className="text-lg" /> {/* Profile Icon */}
            My Saved Words
          </button>
        </li>
        <li>
          <button
            className={`${
              user ? "block" : "hidden"
            } w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-100
                      hover:text-green-700 transition-colors duration-800`}
            onClick={() => {
              router.push("/word-lists/my-known-words");
              setOpen(false);
            }}
          >
            <FaCheck className="text-lg" /> {/* Profile Icon */}
            My Known Words
          </button>
        </li>
        <hr
          className={`${
            user ? "block" : "hidden"
          } h-px my-2 bg-gray-200 border-0`}
        />
        <li>
          {user ? (
            <button
              className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-100"
              onClick={() => {
                router.push("/profile");
                setOpen(false);
              }}
            >
              <FaRegUser className="text-lg" /> {/* Profile Icon */}
              My Profile
            </button>
          ) : (
            <button
              onClick={() => {
                setOpen(false);
              }}
            >
              <Link
                href="/signin"
                className={`flex items-center px-4 py-2 pb-4 text-sm text-black w-full justify-center`}
              >
                <svg
                  width="20px"
                  height="20px"
                  viewBox="0 0 24 24"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="#000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                >
                  <title id="happyFaceIconTitle">Happy Face</title>
                  <path d="M7.3,14 C8.07,15.76 9.99,17 12,17 C14,17 15.91,15.75 16.69,14" />
                  <line x1="9" y1="9" x2="9" y2="9" />
                  <line x1="15" y1="9" x2="15" y2="9" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
                <span className="pl-2">Sign In</span>
              </Link>
            </button>
          )}
        </li>
        <hr
          className={`${
            user ? "block" : "hidden"
          } h-px my-2 bg-gray-200 border-0`}
        />
        <li className={`${user ? "block" : "hidden"}`}>
          <button
            className="w-full text-red-800 flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-100 
                      hover:text-red-700 transition-colors duration-800"
            onClick={handleLogout}
          >
            <ImExit className="text-lg" />
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};
