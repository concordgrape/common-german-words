"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link'; // Assuming you use Next.js Link for navigation

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // Ref to the dropdown container

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown if click occurs outside of it
  useEffect(() => {
    function handleClickOutside() {
      if (dropdownRef.current) {
        setIsDropdownOpen(false);
      }
    }

    // Attach the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo/Brand */}
        <Link href="/" className="text-white text-2xl font-bold">
            MyBrand
        </Link>

        {/* Navigation Links */}
        <div className="flex space-x-4">
          <Link href="/about" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
              About
          </Link>
          <Link href="/contact" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
              Contact
          </Link>

          {/* Dropdown Menu */}
          <div className="relative" ref={dropdownRef}> {/* Parent of dropdown, set to relative */}
            <button
              onClick={toggleDropdown}
              className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium focus:outline-none"
            >
              Services <span className="ml-1">&#9662;</span> {/* Down arrow */}
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <Link href="/services/web-dev" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Web Development
                </Link>
                <Link href="/services/mobile-apps" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Mobile Apps
                </Link>
                <Link href="/services/ui-ux" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    UI/UX Design
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;