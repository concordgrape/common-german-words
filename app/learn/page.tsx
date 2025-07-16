"use client";

import React, { Suspense } from 'react';

const LearnWordPage: React.FC = () => {
  return (
    <div className="w-full sm:top-15 md:top-15 p-2 sm:p-4 md:p-4 text-black max-w-7xl mx-auto">
        <div
        className={`min-h-[500px] w-full mx-auto max-w-[800px] mt-20 p-4 bg-[#FFFFFF] border-1 border-gray-200 mt-5`}
        >
            <h1 className='text-4xl font-extrabold text-center text-gray-800'>Learn</h1>
        </div>
    </div>
  );
};

export default function LearnPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LearnWordPage />
    </Suspense>
  );
}
