"use client";

import Link from 'next/link';
import React from 'react';

const App: React.FC = () => {
  return (
    <div className="bg-[#F2F2F2] dark:bg-[#262839] text-white pt-30 flex flex-col md:flex-row items-start justify-center space-y-4 md:space-y-0 md:space-x-4">
      <Link href="/browse">
        <div className="text-black dark:text-white">
          Browse Words
        </div>
      </Link>
      <Link href="/top-words/nouns">
        <div className="text-black dark:text-white">
          Top Nouns
        </div>
      </Link>
      <Link href="/top-words/adverbs">
        <div className="text-black dark:text-white">
          Top Adverbs
        </div>
      </Link>
      <Link href="/top-words/adjectives">
        <div className="text-black dark:text-white">
          Top Adjectives
        </div>
      </Link>
      <Link href="/top-words/verbs">
        <div className="text-black dark:text-white">
          Top Verbs
        </div>
      </Link>
    </div>
  );
};

export default App;