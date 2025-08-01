'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';

const ProfileContentPage: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

    const { user } = useUser();

useEffect(() => {
  const root = document.documentElement;

  const theme = localStorage.theme;

  if (isDarkMode) {
    root.classList.add("dark");
  } else if (theme === "light") {
    root.classList.remove("dark");
  } else {
    // fallback to system preference
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.classList.toggle("dark", prefersDark);
  }
}, [isDarkMode]);


  useEffect(() => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  setIsDarkMode(prefersDark);
}, []);

  return (
<div className="pt-30 w-full flex items-center justify-center p-4 text-black">
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
        <button className="text-white text-xs px-1 py-2 rounded-lg mr-2 hover:underline disabled:hidden">Cancel</button>
        <button className="cursor-pointer bg-blue-500 text-white text-xs px-1 py-2 rounded-lg disabled:cursor-not-allowed disabled:opacity-50">Save Changes</button>
    </div>
    </div>
    <div className="w-full p-4 bg-[#FFFFFF] dark:bg-[#0D1B2A] border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="flex items-center gap-x-3 p-4">
        <div className="mb-6 w-100">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email address</label>
            <input type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={user?.email ? user?.email : "john.doe@company.com"} required />
        </div> 
        
      </div>
      <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700" />
      <h2 className='mt-5 text-black dark:text-white text-xl font-bold'>Appearance</h2>

    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={isDarkMode}
        onChange={(e) => setIsDarkMode(e.target.checked)}
        className="sr-only peer"
      />
      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
      <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
        Toggle me
      </span>
    </label>

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
