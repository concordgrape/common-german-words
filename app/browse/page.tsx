"use client";

import React from 'react';

import { WordTable } from '@/app/components/WordTable';
import { WordInfo } from '@/app/components/WordInfo';

const MainWordPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 flex flex-col md:flex-row items-start justify-center space-y-4 md:space-y-0 md:space-x-4">
      {/* WordTable Component */}
      <WordTable /*onRowClick={setSelectedWord}*/ />

      {/* Information Display Component */}
      <div className='hidden md:block sm:block'>
        <WordInfo />
      </div>
    </div>
  );
};

export default MainWordPage;
