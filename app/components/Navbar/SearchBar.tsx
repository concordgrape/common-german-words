'use client';

import { useEffect, useState } from 'react';
import { FaX } from 'react-icons/fa6';

export default function SearchBar() {
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const initialSearch = params.get('search') || '';
      setSearch(initialSearch);
    }
  }, []);

  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const newSearch = params.get('search') || '';
      setSearch(newSearch);
    };

    // Listen to back/forward navigation and manual pushState
    window.addEventListener('popstate', handleUrlChange);

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && search.trim()) {
      window.location.href = `/browse?search=${encodeURIComponent(search.trim())}`;
    }
  };

  const clearSearch = () => {
    setSearch('');
    window.location.href = `/browse`;
  };

  return (
    <div className="relative hidden sm:flex w-[300px] sm:w-[200px] md:w-[350px] lg:w-[400px] flex-shrink-0 z-10 ml-5">
      <input
        type="text"
        placeholder="Search words..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleKeyDown}
        className="pl-9 pr-9 w-full py-2 rounded-sm bg-[#F2F2F2] dark:bg-[#3E3F53] text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-200 dark:focus:ring-gray-600 border border-gray-200 dark:border-gray-700"
      />

      {/* Search icon */}
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

      {/* Clear (X) icon */}
      {search && (
        <button
          onClick={clearSearch}
          className="absolute right-3 top-[10px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          aria-label="Clear search"
        >
          <FaX className="h-4 w-4 mt-[2px]" />
        </button>
      )}
    </div>
  );
}
