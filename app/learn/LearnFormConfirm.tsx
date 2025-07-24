"use client";

import React from 'react';
import { useWordForm } from '../context/WordFormContext';

export const LearnFormConfirm = () => {
  const { submittedWords } = useWordForm();

  return (
    <div className="w-full">
      <div className="w-full bg-[#027AFB] rounded-sm shadow-lg p-6 flex flex-col max-h-[80vh] overflow-y-auto">
        <p className="mb-2 text-white font-bold">
          {submittedWords.length} words selected
        </p>
       </div>
    </div>
  );
};
