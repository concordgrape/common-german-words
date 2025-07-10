'use client';

import React, { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import Link from 'next/link';

import { useUser } from '@/app/context/UserContext';
import AvatarDropdown from './AvatarDropdown';

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const { user } = useUser();

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (isMenuOpen && menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeMenu();
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isMenuOpen]);

  return (
    <div className="">
      <nav className="fixed w-full z-100 px-4 py-3 lg:py-4 flex justify-between items-center bg-[#323944]">
        <Link className="text-3xl font-bold leading-none" href="/">
         <svg className="h-10 w-10" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" fill="#3B82F6" />
            <text x="50%" y="54%" textAnchor="middle" fontSize="36" fill="white" dy=".3em" fontFamily="Arial">MC</text>
          </svg>
        </Link>
        <div className="lg:hidden">
          <button onClick={toggleMenu} className="flex items-center text-white hover:text-gray-600 cursor-pointer p-3">
            <svg className="block h-4 w-4 fill-current" viewBox="0 0 20 20">
              <title>Mobile menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
          </button>
        </div>
        <ul className="hidden absolute text-white top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 lg:flex lg:mx-auto lg:items-center lg:w-auto lg:space-x-6">
          <li><a className="text-sm hover:text-gray-500" href="#">Home</a></li>
          <li className="text-gray-300">
            <svg fill="none" stroke="currentColor" className="w-4 h-4" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v0m0 7v0m0 7v0m0-13a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </li>
          <li><a className="text-sm font-bold" href="#">About Us</a></li>
          <li><a className="text-sm hover:text-gray-500" href="#">Services</a></li>
          <li><a className="text-sm hover:text-gray-500" href="#">Pricing</a></li>
          <li><a className="text-sm hover:text-gray-500" href="#">Contact</a></li>
        </ul>
        <div className="hidden lg:block">
          {user ? 
            <AvatarDropdown />
          :
            <a className="block border-2 border-gray-200 px-5 py-1 leading-loose text-sm text-white text-center font-semibold hover:bg-gray-800 rounded-xl" href="/signin">Sign In</a>
          }
        </div>
      </nav>

      <div
        ref={menuRef}
        className={clsx(
          'navbar-menu fixed top-0 left-0 bottom-0 z-200 w-5/6 max-w-xs py-6 px-6 bg-white border-r overflow-y-auto transition-transform duration-300 ease-in-out',
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div onClick={closeMenu} className="navbar-backdrop fixed inset-0 bg-white opacity-25" />
        <nav className="relative z-10">
          <div className="flex items-center mb-8">
            <a className="mr-auto text-3xl font-bold leading-none" href="#">
              <svg className="h-12 w-12" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" fill="#3B82F6" />
                <text x="50%" y="54%" textAnchor="middle" fontSize="36" fill="white" dy=".3em" fontFamily="Arial">MC</text>
              </svg>
            </a>
            <button onClick={closeMenu} className="navbar-close">
              <svg className="h-6 w-6 text-white cursor-pointer hover:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div>
            <ul>
              {['Home', 'About Us', 'Services', 'Pricing', 'Contact'].map((item) => (
                <li className="mb-1" key={item}>
                  <a className="block p-4 text-sm font-semibold text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded" href="#">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-auto">
            <div className="pt-6">
              <a className="block px-4 py-3 mb-3 leading-loose text-xs text-center font-semibold bg-gray-200 hover:bg-gray-100 rounded-xl" href="/signin">Sign In</a>
              <a className="block px-4 py-3 mb-2 leading-loose text-xs text-center text-white font-semibold bg-blue-600 hover:bg-blue-700 rounded-xl" href="#">Sign Up</a>
            </div>
            <p className="my-4 text-xs text-center text-gray-400">
              <span>Copyright © 2021</span>
            </p>
          </div>
        </nav>
      </div>
    </div>
  );
};
