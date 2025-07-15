"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";
import Error from "next/error";
import { useUser } from "@/app/context/UserContext";
import { FaRegUser } from "react-icons/fa";
import { ImExit } from "react-icons/im";
import { useRouter } from "next/navigation";

interface AvatarDropdownProps {
  loading?: boolean;
}

export default function AvatarDropdown({
  loading = false,
}: AvatarDropdownProps) {
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

  const { user } = useUser();

  return (
    <div
      className={`relative ${loading ? "max-w-sm animate-pulse" : ""}`}
      ref={dropdownRef}
    >
      <button
        onClick={() => {
          if (loading) return;
          if (user) {
            setOpen(!open);
          } else {
            window.location.href = "/signin";
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
        ) : (
          <></>
        )}
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
          userName={user?.displayName ?? "User"}
          userEmail={user?.email ?? "noemail@email.com"}
          handleLogout={handleLogout}
        />
      </div>
    </div>
  );
}

interface UserDropdownProps {
  userName: string;
  userEmail: string;
  handleLogout: () => void;
}

const UserDropdown = ({
  userName,
  userEmail,
  handleLogout,
}: UserDropdownProps) => {
  const router = useRouter();

  return (
    <div
      className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50
                  transition-all duration-800 ease-out transform
                  opacity-100 scale-100 translate-y-0"
    >
      <div className="px-4 py-3 border-b border-gray-200">
        <p className="text-base font-semibold text-gray-900 leading-tight">
          {userName}
        </p>
        <p className="text-sm text-gray-600 truncate">{userEmail}</p>
      </div>
      <ul className="py-1 text-sm text-gray-700">
        <li>
          <button
            className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-100"
            onClick={() => router.push("/profile")} // Assuming a profile route
          >
            <FaRegUser className="text-gray-700 text-lg" /> {/* Profile Icon */}
            My Profile
          </button>
        </li>
        <hr className="h-px my-2 bg-gray-200 border-0" />
        <li>
          <button
            className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-100 
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
