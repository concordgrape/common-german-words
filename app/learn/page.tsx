'use client';

import React, { useState, Suspense } from 'react';
import { BookOpen, Target, Filter } from 'lucide-react';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const LearnWordPage: React.FC = () => {
  const [wordCount, setWordCount] = useState(20);
  const [difficulty, setDifficulty] = useState('all');
  const [wordType, setWordType] = useState('all');
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="sm:top-15 md:top-15 p-2 sm:p-4 md:p-4 text-black w-full flex justify-center">
      <div className="min-h-[400px] w-full max-w-[700px] mt-20 py-2 px-1 bg-white flex flex-col items-center transition-all duration-500">
        <h1 className="mb-4 mt-10 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl">
          0 words to review
        </h1>

        {/* Start Learning Button */}
        <button className="flex flex-col items-center px-4 py-6 mt-10 border-1 border-blue-600 bg-blue-500 text-white hover:bg-blue-600 transition-all duration-600 rounded-xl font-extrabold font-mono">
          <span className="flex items-center">
            <IoIosArrowForward className="mt-1 mr-2" />
            Start Learning
            <IoIosArrowBack className="mt-1 ml-2" />
          </span>
          <span className="relative mt-2 text-xs text-gray-200 font-normal">0 words loaded</span>
        </button>

        {/* Add Words Button */}
        <button
          className="flex px-4 py-6 mt-10 border-1 border-gray-300 bg-gray-200 text-gray-700 hover:shadow-sm transition-all duration-600 rounded-xl font-extrabold font-mono"
          onClick={() => setShowSettings((prev) => !prev)}
        >
          {showSettings ? 'Hide Settings' : 'Add Words'}
        </button>

        {/* Settings Section with Transition */}
        <div
          className={`overflow-hidden transition-all duration-700 ease-in-out ${
            showSettings ? 'max-h-[1000px] opacity-100 mt-10' : 'max-h-0 opacity-0'
          } w-full`}
        >
          {/* Word Count */}
          <div className="border rounded-lg p-4 w-70 lg:w-100 m-auto space-y-3 bg-blue-50 border-blue-100">
            <label className="flex items-center gap-2 font-medium text-gray-700">
              <BookOpen className="w-5 h-5 text-blue-500" />
              <span className="font-extrabold">Number of Words</span>
            </label>
            <input
              type="range"
              min={5}
              max={50}
              step={1}
              value={wordCount}
              onChange={(e) => setWordCount(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>5 words</span>
              <span className="text-blue-600 font-semibold bg-blue-100 px-3 py-2 rounded-lg">
                {wordCount} words
              </span>
              <span>50 words</span>
            </div>
          </div>

          {/* Difficulty */}
          <div className="border rounded-lg mt-5 p-4 space-y-3 w-70 lg:w-100 m-auto bg-blue-50 border-blue-100">
            <label className="flex items-center gap-2 font-medium text-gray-700">
              <Target className="w-5 h-5 text-blue-500" />
              <span className="font-extrabold">Difficulty Level</span>
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full h-10 border border-blue-100 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="all">All Levels</option>
              <option value="easy">Beginner</option>
              <option value="medium">Intermediate</option>
              <option value="hard">Advanced</option>
            </select>
          </div>

          {/* Word Type */}
          <div className="border rounded-lg mt-5 mb-10 w-70 lg:w-100 m-auto p-4 space-y-3 bg-blue-50 border-blue-100">
            <label className="flex items-center gap-2 font-medium text-gray-700">
              <Filter className="w-5 h-5 text-blue-500" />
              <span className="font-extrabold">Word Type</span>
            </label>
            <select
              value={wordType}
              onChange={(e) => setWordType(e.target.value)}
              className="w-full h-10 border border-blue-100 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="all">All Types</option>
              <option value="noun">Nouns</option>
              <option value="verb">Verbs</option>
              <option value="adjective">Adjectives</option>
            </select>
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
