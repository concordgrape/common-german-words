"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";
import Error from "next/error";

interface AvatarDropdownProps {
  loading?: boolean;
}

export default function AvatarDropdown({ loading = false }: AvatarDropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    signOut(auth).then(() => {
        // Sign-out successful.
    }).catch((error: Error) => {
        console.log("Logout error:", error);
    });
  }

  return (
    <div className={`relative ${loading ? 'max-w-sm animate-pulse' : ''}`} ref={dropdownRef}>
        <button
            onClick={() => setOpen(!open)}
            className="flex items-center cursor-pointer justify-center w-8 h-8 bg-white rounded-full overflow-hidden hover:bg-gray-300 text-gray-500 transition-colors"
            >
            {!loading ? (
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
            ) : <></>}
        </button>

      {(open && !loading) && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50 dark:bg-gray-800 dark:border-gray-700">
          <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
            <li>
              <button className="w-full text-left block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
