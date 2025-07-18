'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const [search, setSearch] = useState('');
  const router = useRouter();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && search.trim()) {
      router.push(`/browse?search=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <div className="relative flex left-5 sm:w-[300px] md:w-[400px] lg:w-[400px] max-w-[500px]">
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleKeyDown}
        className="pl-4 w-full pr-4 py-2 rounded-sm bg-[#F2F2F2] text-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-200 border border-gray-200 border-1"
      />
    </div>
  );
}