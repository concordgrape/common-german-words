'use client';

import React, { useState, Suspense } from 'react';
import { BookOpen, Target } from 'lucide-react';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IoLanguageSharp } from "react-icons/io5";

const LearnWordPage: React.FC = () => {
  const [wordCount, setWordCount] = useState(20);
  const [difficulty, setDifficulty] = useState('all');
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="sm:top-15 md:top-15 p-2 sm:p-4 md:p-4 text-black w-full flex justify-center">
      <div className="min-h-[400px] w-full max-w-[700px] mt-20 py-2 px-1 bg-white border-1 border-gray-200 flex flex-col items-center transition-all duration-500">
        <h1 className="mb-4 mt-10 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl">
          0 words to review
        </h1>

        {/* Start Learning Button */}
        <button className="flex flex-col items-center px-4 py-6 mt-5 border-1 border-blue-600 bg-blue-500 text-white hover:bg-blue-600 transition-all duration-600 rounded-xl font-extrabold font-mono">
          <span className="flex items-center">
            <IoIosArrowForward className="mt-1 mr-2" />
            Start Learning
            <IoIosArrowBack className="mt-1 ml-2" />
          </span>
          <span className="relative mt-2 text-xs text-gray-200 font-normal">0 words loaded</span>
        </button>

        {/* Add Words Button */}
        <button
          className={`${showSettings ? 'hidden' : ''} flex px-4 py-6 mt-10 border-1 border-gray-300 bg-gray-200 text-gray-700 hover:shadow-sm transition-all duration-600 rounded-xl font-extrabold font-mono`}
          onClick={() => setShowSettings((prev) => !prev)}
        >
          {showSettings ? 'Hide Settings' : 'Add Words'}
        </button>

        {/* Settings Section with Transition */}
        <div
          className={`overflow-hidden transition-all duration-700 ease-in-out ${
            showSettings ? 'max-h-[1000px] opacity-100 mt-10 mb-10' : 'max-h-0 opacity-0'
          } w-full`}
        >
          {/* Word Count (Radio Buttons) */}
          <div className="border rounded-t-xl p-4 w-full md:w-90 lg:w-70 lg:w-100 m-auto space-y-3 bg-gray-50 border-gray-100">
            <label className="flex items-center gap-2 font-medium text-gray-700">
              <BookOpen className="w-5 h-5 text-blue-500" />
              <span className="font-extrabold">Number of Words</span>
            </label>
            <div className="grid grid-cols-6 gap-0 mt-2">
              {[5, 10, 20, 30, 40, 50].map((count) => (
                <label
                  key={count}
                  className="flex items-center gap-2 font-mono text-sm text-gray-700 px-3 py-2 rounded-md border border-blue-100 hover:border-blue-300 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="wordCount"
                    value={count}
                    checked={wordCount === count}
                    onChange={() => setWordCount(count)}
                    className="accent-blue-500"
                  />
                  {count}
                </label>
              ))}
            </div>
          </div>

          {/* Difficulty (Radio Buttons) */}
          <div className="border p-4 space-y-3 w-full md:w-90 lg:w-100 m-auto bg-gray-50 border-gray-100">
            <label className="flex items-center gap-2 font-medium text-gray-700">
              <Target className="w-5 h-5 text-blue-500" />
              <span className="font-extrabold">Difficulty Level</span>
            </label>
            <div className="grid grid-cols-5 gap-0 mt-2 w-full font-mono">
              {[
                { label: 'All', value: 'all' },
                { label: 'A1', value: 'easy' },
                { label: 'A2', value: 'medium' },
                { label: 'B1', value: 'hard' },
                { label: '-', value: 'vhard' },
              ].map(({ label, value }) => (
                <label
                  key={value}
                  className="flex items-right gap-2 text-sm text-gray-700 px-3 py-2 rounded-md border border-blue-100 hover:border-blue-300 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="difficulty"
                    value={value}
                    checked={difficulty === value}
                    onChange={() => setDifficulty(value)}
                    className="accent-blue-500"
                  />
                  <span className='text-right'>{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Word Type */}
          <div className="border p-4 space-y-3 rounded-b-xl w-full md:w-90 lg:w-100 m-auto bg-gray-50 border-gray-100">
            <label className="flex items-center gap-2 font-medium text-gray-700">
              <IoLanguageSharp className="w-5 h-5 text-blue-500" />
              <span className="font-extrabold">Word Type</span>
            </label>
            <div className="grid grid-cols-2 gap-0 mt-2 w-full font-mono">
              {[
                { label: 'Verb', value: 'verb' },
                { label: 'Adjective', value: 'adjective' },
                { label: 'Noun', value: 'noun' },
                { label: 'Interjection', value: 'interjection' },
                { label: 'Adverb', value: 'adverb' },
                { label: 'Determiner', value: 'determiner' },
              ].map(({ label, value }) => (
                <label
                  key={value}
                  className="flex items-right gap-2 text-sm text-gray-700 px-3 py-2 rounded-md border border-blue-100 hover:border-blue-300 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="difficulty"
                    value={value}
                    checked={difficulty === value}
                    onChange={() => setDifficulty(value)}
                    className="accent-blue-500"
                  />
                  <span className='text-right'>{label}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="w-full flex justify-end pr-5 lg:pr-40 md:pr-40">
            <button className="flex px-4 py-4 mt-4 border border-blue-600 bg-blue-500 text-white hover:bg-blue-600 transition-all duration-600 rounded-xl font-extrabold font-mono">
              <span className="flex items-center">
                <IoLanguageSharp className="mr-2" />
                Add (5) words
              </span>
            </button>
          </div>
        </div>
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
