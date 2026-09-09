"use client";

import { useState, useRef, useEffect } from "react";
import { FaCheck, FaRegBookmark } from "react-icons/fa";
import { useGoNavigation } from "@/app/lib/navigation";
import { FaBook, FaQuestionCircle } from "react-icons/fa";
import { FaChartLine } from "react-icons/fa6";

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

  return (
    <div className="relative mt-1 sm:mt-0" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
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
        <UserDropdown setOpen={setOpen} />
      </div>
    </div>
  );
}

interface UserDropdownProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserDropdown = ({ setOpen }: UserDropdownProps) => {
  const { go } = useGoNavigation();

  return (
    <div
      className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50
                  transition-all duration-800 ease-out transform
                  opacity-100 scale-100 translate-y-0"
    >
      <div className="block lg:hidden">
        <ul className="py-1 text-sm text-gray-700">
          <li>
            <button
              className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-100"
              onClick={() => {
                go("/browse");
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
                go("/learn");
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
                go("/progress");
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
            className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-100
                        hover:text-orange-500 transition-colors duration-800"
            onClick={() => {
              go("/word-lists/my-saved-words");
              setOpen(false);
            }}
          >
            <FaRegBookmark className="text-lg" />
            My Saved Words
          </button>
        </li>
        <li>
          <button
            className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-100
                      hover:text-green-700 transition-colors duration-800"
            onClick={() => {
              go("/word-lists/my-known-words");
              setOpen(false);
            }}
          >
            <FaCheck className="text-lg" />
            My Known Words
          </button>
        </li>
      </ul>
    </div>
  );
};
