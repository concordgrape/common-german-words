'use client';

import React, { Suspense } from 'react';

const ProgressWordPage: React.FC = () => {
  return (
    <div className="sm:top-15 md:top-15 p-2 sm:p-4 md:p-4 text-black w-full flex justify-center">
    </div>
  );
};

export default function ProgressPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProgressWordPage />
    </Suspense>
  );
}
