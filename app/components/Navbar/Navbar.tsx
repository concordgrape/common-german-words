"use client"

import React, { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import Image from 'next/image';
import { FiMenu } from 'react-icons/fi';
import { AnimatePresence, motion } from 'framer-motion';
import { useUser } from '@/app/context/UserContext';

import SearchBar from './SearchBar';
import AvatarDropdown from './AvatarDropdown';
import { FaBook, FaQuestionCircle } from 'react-icons/fa';

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // mobile menu
  const menuRef = useRef<HTMLDivElement>(null);
  const desktopDropdownRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const { user, loading } = useUser();

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        closeMenu();
      }

      if (
        desktopDropdownRef.current &&
        !desktopDropdownRef.current.contains(e.target as Node)
      ) {
       closeMenu();
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isMenuOpen]);

  return (
    <div>
      <nav className="fixed w-full z-100 px-4 py-3 lg:py-4 flex items-center bg-white dark:bg-[#181922] border-1 border-gray-200 dark:border-gray-800">
        <div className="lg:max-w-[1000px] md:max-w-[800px] sm:max-w-[800px] w-full flex items-center justify-between mx-auto">
          {/* Left: Logo */}
          <div className="flex items-center gap-2">
            {/* Left: Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/de.webp"
                alt="Logo"
                width={70}
                height={70}
                quality={100}
                unoptimized
              />
            </Link>

            {/* Search Input */}
            <div className="hidden sm:flex items-center flex-nowrap">
              <SearchBar />
              {user && (
                <div
                  data-tip="Your daily streak"
                  className="tooltip tooltip-bottom bg-orange-400 px-4 py-1 ml-3 rounded-lg shadow-sm flex-shrink-0"
                >
                  <span className="text-2xl font-mono font-regular">{0}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4 relative">
            <div className="font-mono text-black dark:text-white text-sm hidden lg:flex space-x-6">
              <Link href="/browse" className="hover:underline flex items-center">
                <FaQuestionCircle className="mr-2" />
                <span>Browse</span>
              </Link>
              <Link href="/learn" className="hover:underline flex items-center">
                <FaBook className="mr-2" />
                <span>Learn</span>
              </Link>
            </div>
            <div className="w-[120px]">
              {(!user && !loading) ? (
                <Link
                  href="/signin"
                  className="flex items-center px-4 py-2 text-sm text-black border border-gray-200 bg-gray-100 hover:border-gray-300 hover:shadow-sm rounded-sm w-full justify-center"
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
              ) : (
                <div className="w-full flex justify-end">
                  <AvatarDropdown loading={loading} />
                </div>
              )}
            </div>
            {/* Desktop Dropdown (Hamburger Icon) */}
            <div className='hidden lg:hidden'>
              <HamburgerDropdown />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden flex items-center text-black dark:text-white hover:text-gray-300 cursor-pointer p-3"
            >
              <svg
                className="block h-6 w-6 fill-current"
                viewBox="0 0 20 20"
              >
                <title>Mobile menu</title>
                <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Slide-Out Menu */}
      <div
        ref={menuRef}
        className={clsx(
          'navbar-menu fixed top-0 left-0 bottom-0 z-200 w-5/6 max-w-xs py-6 px-6 bg-white dark:bg-[#181922] border-r dark:border-gray-800 overflow-y-auto transition-transform duration-300 ease-in-out',
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div
          onClick={closeMenu}
          className="navbar-backdrop fixed inset-0 bg-white dark:bg-[#181922] opacity-25"
        />
        <nav className="relative z-10">
          <div className="flex items-center mb-4">
            <a className="mr-auto text-3xl font-bold leading-none" href="#">
              <Image
                src="/de.webp"
                alt="Logo"
                width={70}
                height={70}
                quality={100}
                unoptimized
              />
            </a>
            <button onClick={closeMenu} className="navbar-close">
              <svg
                className="h-6 w-6 text-black dark:text-white cursor-pointer hover:text-gray-500 dark:hover:text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <span className="text-gray-700 dark:text-white text-lg font-bold">Common German Words</span>
          <div className="mt-4">
             <ul className="flex flex-col text-sm text-gray-700 dark:text-white">
              <li>
                <Link onClick={closeMenu} href="/browse" className="block py-3 px-2 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-800 font-bold">
                  <span className='pr-1'>💬</span> Browse
                  <br />
                  <span className='pr-1 text-gray-400 font-bold text-xs'>Browse 6000+ frequent words</span>
                </Link>
              </li>
              <li>
                <Link onClick={closeMenu} href="/learn" className="block py-3 px-2 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-800 font-bold">
                  <span className='pr-1'>📖</span> Learn
                  <br />
                  <span className='pr-1 text-gray-400 font-bold text-xs'>Generate flashcards & quizzes</span>
                </Link>
              </li>
              {/*<hr className="h-px my-2 bg-gray-200 border-0" />
              <li>
                <div className="flex items-center py-3 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 rounded-sm">
                  <input type="checkbox" className="mr-2" />
                  <span>Dark mode</span>
                </div>
              </li>*/}
              <hr className="h-px my-2 bg-gray-200 border-0" />
            </ul>
          </div>
          <div className="mt-auto">
            <div className="pt-6">
              <Link
                  href="/signin"
                  className="flex items-center px-4 py-2 text-sm text-black dark:text-white border border-gray-200 dark:border-blue-400 bg-gray-100 dark:bg-blue-500 hover:border-gray-300 dark:hover:border-blue-700 hover:shadow-sm rounded-sm w-full justify-center"
                >
                  <svg
                    width="20px"
                    height="20px"
                    viewBox="0 0 24 24"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    className="stroke-black dark:stroke-white"
                  >
                    <title id="happyFaceIconTitle">Happy Face</title>
                    <path d="M7.3,14 C8.07,15.76 9.99,17 12,17 C14,17 15.91,15.75 16.69,14" />
                    <line x1="9" y1="9" x2="9" y2="9" />
                    <line x1="15" y1="9" x2="15" y2="9" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  <span className="pl-2">Sign In</span>
                </Link>
              {/*<a className="block px-4 py-3 mb-2 leading-loose text-xs text-center text-black font-semibold bg-blue-600 hover:bg-blue-700 rounded-xl" href="#">
                Sign Up
              </a>*/}
            </div>
            <p className="my-4 text-xs text-center text-gray-400">
              <span>Copyright © Verbuu 2025</span>
            </p>
          </div>
        </nav>
      </div>
    </div>
  );
};




function HamburgerDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(prev => !prev);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
      >
        <FiMenu size={22} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-60 bg-white border border-gray-200 rounded-md shadow-lg z-50 origin-top-right"
          >
            <ul className="flex flex-col text-sm text-gray-700">
              <li>
                <Link href="/browse" onClick={() => setIsOpen(false)} className="block px-4 py-3 hover:bg-gray-100 font-bold">
                  <span className='pr-1'>💬</span> Browse
                  <br />
                  <span className='pr-1 text-gray-400 font-bold text-xs'>Browse 6000+ frequent words</span>
                </Link>
              </li>
              <li>
                <Link href="/learn" onClick={() => setIsOpen(false)} className="block px-4 py-3 hover:bg-gray-100 font-bold">
                  <span className='pr-1'>📖</span> Learn
                  <br />
                  <span className='pr-1 text-gray-400 font-bold text-xs'>Generate flashcards & quizzes</span>
                </Link>
              </li>
              <li>
                <Link href="/read" onClick={() => setIsOpen(false)} className="block px-4 py-3 hover:bg-gray-100 font-bold">
                  <span className='pr-1'>📖</span> Read
                  <br />
                  <span className='pr-1 text-gray-400 font-bold text-xs'>Read famous German books</span>
                </Link>
              </li>
              <hr className="h-px my-2 bg-gray-200 border-0" />
              <li>
                <div className="flex items-center px-4 py-3 hover:bg-gray-100">
                  <input type="checkbox" className="mr-2" />
                  <span>Dark mode</span>
                </div>
              </li>
              <hr className="h-px my-2 bg-gray-200 border-0" />
            </ul>
            <div className="px-4 py-2 text-xs text-gray-500 flex flex-wrap gap-2">
              <Link href="/examples">Examples</Link>
              <Link href="/pro">PRO membership</Link>
              <Link href="/about">About</Link>
              <Link href="/terms">Terms</Link>
              <Link href="/privacy">Privacy & Cookies</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}