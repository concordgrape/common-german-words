"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";
import Error from "next/error";
import { useUser } from "@/app/context/UserContext";
import { FaPlus, FaCheck } from "react-icons/fa";
import { ImExit } from "react-icons/im";
import { useRouter } from "next/navigation";

interface AvatarDropdownProps {
  loading?: boolean;
}

export default function AvatarDropdown({ loading = false }: AvatarDropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

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
      window.location.reload()
    }).catch((error: Error) => {
        console.log("Logout error:", error);
    });
  }

  const { user } = useUser();

  return (
    <div className={`relative ${loading ? 'max-w-sm animate-pulse' : ''}`} ref={dropdownRef}>
        <button
            onClick={() => {
              if (loading) return;
              if (user) {
                setOpen(!open)
              } else {
                window.location.href = '/signin';
              }
            }}
            className="flex items-center cursor-pointer justify-center w-10 h-10 bg-gray-100 rounded-full overflow-hidden hover:shadow-md text-gray-500 border-1 border-gray-300 transition-colors"
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
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <ul className="py-1 text-sm text-gray-700">
            <li>
              <button
                className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-100"
                onClick={() => router.push('/saved')}
              >
                <FaPlus className="text-black" />
                My Saved Words
              </button>
            </li>
            <li>
              <button
                className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-100"
                onClick={() => router.push('/known')}
              >
                <FaCheck className="text-black" />
                My Known Words
              </button>
            </li>
            <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-200" />
            <li>
              <button
                className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-100"
                onClick={handleLogout}
              >
                Logout
                <ImExit className="w-5 right-0 text-right" />
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
