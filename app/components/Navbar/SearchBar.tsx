'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FaX, FaMagnifyingGlass } from 'react-icons/fa6';

export default function SearchBar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [search, setSearch] = useState('');

  // Load initial value from URL
  useEffect(() => {
    const initialSearch = searchParams.get('search') || '';
    setSearch(initialSearch);
  }, [searchParams]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && search.trim()) {
      router.push(`/browse?search=${encodeURIComponent(search.trim())}`);
    }
  };

  const clearSearch = () => {
    setSearch('');
    router.push('/browse');
  };

  return (
    <div className="relative hidden sm:flex w-[300px] md:w-[350px] lg:w-[400px] flex-shrink-0 z-10 ml-5">
      <input
        type="text"
        placeholder="Search words..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleKeyDown}
        className="pl-9 w-full pr-8 py-2 rounded-sm bg-[#F2F2F2] dark:bg-[#3E3F53] text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-200 dark:focus:ring-gray-600 border border-gray-200 dark:border-gray-700"
      />
      <span className="absolute left-3 top-[10px] text-gray-400">
        <FaMagnifyingGlass className="h-4 w-4" />
      </span>
      {search && (
        <button
          onClick={clearSearch}
          className="absolute right-3 top-[10px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          aria-label="Clear search"
        >
          <FaX className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
