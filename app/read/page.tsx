"use client";

import React, { Suspense } from 'react';
import { BookSection } from './BookSection';

const ReadPageContent: React.FC = () => {
  return (
      <div className="min-h-screen w-full sm:top-15 md:top-15 pt-15 sm:p-4 md:p-4 text-black grid grid-cols-1 sm:grid-cols-[2fr_1fr] md:grid-cols-[2fr_1fr] gap-0 max-w-7xl mx-auto relative z-0">
      {/* WordTable (left column) */}
      <div className="z-10">
        <BookSection />
      </div>

      {/* WordInfo (right column) */}
      <div className="flex mt-5 sm:mt-0 md:mt-0 lg:mt-0 sticky top-25 self-start z-20 flex-col items-center w-full">
        <p>Test</p>
      </div>
    </div>
  );
};

export default function ReadPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReadPageContent />
    </Suspense>
  );
}
