'use client';

import React, { Suspense } from 'react';
import { useUser } from '../context/UserContext';

const ProfileContentPage: React.FC = () => {

    const { user, isDarkMode, setIsDarkMode } = useUser();

  return (
<div className="min-h-screen pt-30 w-full flex justify-center p-4 text-black">
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
        <button className="text-black dark:text-white text-xs px-1 py-2 rounded-lg mr-2 hover:underline disabled:hidden">Cancel</button>
        <button className="cursor-pointer bg-blue-500 text-white text-xs px-1 py-2 rounded-lg disabled:cursor-not-allowed disabled:opacity-50">Save Changes</button>
    </div>
    </div>
    <div className="w-full p-4 bg-[#FFFFFF] dark:bg-[#0D1B2A] border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="flex items-center p-4">
        <div className="w-100">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email address</label>
            <input type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={user?.email ? user?.email : "john.doe@company.com"} required />
        </div> 
        
      </div>
              <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700" />

      <div className='p-4'>
      <h2 className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>Appearance</h2>

    <div className="flex items-center gap-2 text-black dark:text-white mt-2">
            <input
              type="checkbox"
              checked={isDarkMode}
              onChange={() => {setIsDarkMode(!isDarkMode)}}
              className="form-checkbox h-4 w-4"
            />
            <span>Dark Mode</span>
          </div>
      </div>


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
