"use client";

import Link from 'next/link';
import React from 'react';

const App: React.FC = () => {
  return (
    <div className="bg-[#F2F2F2] text-white pt-30 flex flex-col md:flex-row items-start justify-center space-y-4 md:space-y-0 md:space-x-4">
      <Link href="/browse">
        <div className="text-black">
          Browse Words
        </div>
      </Link>
    </div>
  );
};

export default App;