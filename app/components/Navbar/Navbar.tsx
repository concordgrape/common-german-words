'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

import { useUser } from '@/app/context/UserContext';
import AvatarDropdown from './AvatarDropdown';
import { FaBook, FaHouse } from 'react-icons/fa6';
import { IoIosSchool } from "react-icons/io";
import { SlGraph } from "react-icons/sl";

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const pathname = usePathname();

  const { user, loading } = useUser();
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });
  const navRefs = useRef<Record<string, HTMLLIElement | null>>({}); 

const links = useMemo(() => [
  { href: '/', icon: <FaHouse size={18} />, label: 'Home' },
  { href: '/browse', icon: <FaBook size={18} />, label: 'Browse' },
  { href: '/learn', icon: <IoIosSchool size={18} />, label: 'Learn' },
  { href: '/progress', icon: <SlGraph size={18} />, label: 'Progress' },
], []);


  useEffect(() => {
    const activeLink = links.find(link => pathname === link.href);
    const ref = activeLink?.href ? navRefs.current[activeLink.href] : null;

    if (ref) {
      const { offsetLeft, offsetWidth } = ref;
      setUnderlineStyle({ left: offsetLeft, width: offsetWidth });
    }
}, [pathname]);


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
      <nav className="fixed w-full z-100 px-4 py-3 lg:py-4 flex justify-between items-center bg-white border-1 border-gray-200">
        <Link className="text-3xl font-bold leading-none flex" href="/">
          <Image src="/de.webp" alt="Logo" width={70} height={70} quality={100} unoptimized />
        </Link>
        <div className="lg:hidden flex gap-2">
          <div className='flex items-center space-x-4'>
            {(!user && !loading) ?
              <div className="flex items-center space-x-4">
                <Link href="/signin" className="flex px-4 py-2 text-sm font-regular text-black bg-clear border-1 border-gray-200 bg-gray-100 hover:border-gray-300 hover:shadow-sm rounded-sm">
                  <svg width="20px" height="20px" viewBox="0 0 24 24" role="img" xmlns="http://www.w3.org/2000/svg" aria-labelledby="happyFaceIconTitle" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" color="#000000"> <title id="happyFaceIconTitle">Happy Face</title> <path d="M7.3010863,14.0011479 C8.0734404,15.7578367 9.98813711,17 11.9995889,17 C14.0024928,17 15.913479,15.7546194 16.6925307,14.0055328"/> <line strokeLinecap="round" x1="9" y1="9" x2="9" y2="9"/> <line strokeLinecap="round" x1="15" y1="9" x2="15" y2="9"/> <circle cx="12" cy="12" r="10"/> </svg>
                  <span className='pl-2'>Sign In</span>
                </Link>
              </div>
              :
              <AvatarDropdown loading={loading} />
            }
          </div>
          <button onClick={toggleMenu} className="flex items-center text-black hover:text-gray-300 cursor-pointer p-3">
            <svg className="block h-6 w-6 fill-current" viewBox="0 0 20 20">
              <title>Mobile menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
          </button>
        </div>
<div className="hidden lg:block justify-end w-full mr-10 relative">
  <ul className="flex justify-end w-full lg:space-x-2 mr-10 relative">
    {/* Underline */}
    <span
      className="absolute bottom-0 h-0.5 bg-blue-600 transition-all duration-300"
      style={{
        left: underlineStyle.left,
        width: underlineStyle.width,
      }}
    />
    {links.map(({ href, icon, label }) => {
      const isActive = pathname === href;
      return (
        <li
          key={label}
ref={(el) => void (navRefs.current[href] = el)}
          className="relative flex items-center px-2 py-2"
        >
          <Link
            href={href}
            className={clsx(
              'text-sm flex items-center transition-colors duration-200',
              isActive ? 'text-blue-600' : 'text-gray-700 hover:text-gray-800'
            )}
          >
            {icon}
            <span className="sr-only">{label}</span>
          </Link>
        </li>
      );
    })}
  </ul>
</div>

        <div className="hidden lg:block">
          {(!user && !loading) ?
              <div className="flex items-center space-x-4">
                <Link href="/signin" className="flex px-4 py-2 text-sm font-regular text-black bg-clear border-1 border-gray-200 bg-gray-100 hover:border-gray-300 hover:shadow-sm rounded-sm">
                  <svg width="20px" height="20px" viewBox="0 0 24 24" role="img" xmlns="http://www.w3.org/2000/svg" aria-labelledby="happyFaceIconTitle" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" color="#000000"> <title id="happyFaceIconTitle">Happy Face</title> <path d="M7.3010863,14.0011479 C8.0734404,15.7578367 9.98813711,17 11.9995889,17 C14.0024928,17 15.913479,15.7546194 16.6925307,14.0055328"/> <line strokeLinecap="round" x1="9" y1="9" x2="9" y2="9"/> <line strokeLinecap="round" x1="15" y1="9" x2="15" y2="9"/> <circle cx="12" cy="12" r="10"/> </svg>
                  <span className='pl-2'>Sign In</span>
                </Link>
              </div>
              :
              <AvatarDropdown loading={loading} />}
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
          <div className="flex items-center mb-4">
            <a className="mr-auto text-3xl font-bold leading-none" href="#">
              <Image src="/de.webp" alt="Logo" width={70} height={70} quality={100} unoptimized />
            </a>
            <button onClick={closeMenu} className="navbar-close">
              <svg className="h-6 w-6 text-black cursor-pointer hover:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <span className="text-gray-700 text-lg"><b>Common German Words</b></span>
          <div className='mt-4'>
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
              <a className="block px-4 py-3 mb-2 leading-loose text-xs text-center text-black font-semibold bg-blue-600 hover:bg-blue-700 rounded-xl" href="#">Sign Up</a>
            </div>
            <p className="my-4 text-xs text-center text-gray-400">
              <span>Copyright © 2025</span>
            </p>
          </div>
        </nav>
      </div>
    </div>
  );
};
