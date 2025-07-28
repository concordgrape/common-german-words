'use client';

import { useState } from 'react';

export default function SearchBar() {
  const [search, setSearch] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && search.trim()) {
      window.location.href = `/browse?search=${encodeURIComponent(search.trim())}`;
    }
  };

  return (
    <div className="relative w-[300px] sm:w-[300px] md:w-[350px] lg:w-[400px] flex-shrink-0 z-10 ml-5">
      <input
        type="text"
        placeholder="Search words..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleKeyDown}
        className="pl-9 w-full pr-4 py-2 rounded-sm bg-[#F2F2F2] dark:bg-[#3E3F53] text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-200 dark:focus:ring-gray-600 border border-gray-200 dark:border-gray-700"
      />
      <span className="absolute left-3 top-[10px] text-gray-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          />
        </svg>
      </span>
    </div>
  );
}
