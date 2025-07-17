"use client";

import React, { Suspense } from 'react';
import { Card } from '../components/Card/Card';
import { FaBrain } from 'react-icons/fa';
import { MdQuiz } from 'react-icons/md';
import { IoLanguage } from "react-icons/io5";
import { RiNewspaperLine } from "react-icons/ri";
import { FaBoltLightning } from 'react-icons/fa6';

const LearnWordPage: React.FC = () => {
  return (
    <div className="sm:top-15 md:top-15 p-2 sm:p-4 md:p-4 text-white w-full lg:max-w-[1000px] m-auto">
        <div
        className={`min-h-[500px] mt-20 py-2 px-1 m-auto mt-5`}
        >
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight md:text-5xl text-center mt-5">How should you start practising?</h1>
          <div className='flex bg-blue-400 text-blue-800 font-bold py-3 px-2 rounded-4xl w-45 text-center m-auto shadow-sm mt-5 hover:text-blue-700 hover:shadow-lg transition-all duration-300 ease-in-out'>
            <IoLanguage className='mt-[1.5px] ml-1' />
            <span className='pl-[5px] text-center m-auto'>Learning German</span>
          </div>
          <CardsContainer />
          <div className='mt-6'>
            <TipContainer />
          </div>
        </div>
    </div>
  );
};

function CardsContainer() {
  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-6 py-10">
      <Card
        icon={FaBrain}
        iconBgColor="bg-blue-500"
        title="Flashcard Mode"
        description="Traditional flashcard learning with spaced repetition"
        features={['Spaced repetition', 'Audio pronunciation', 'Example sentences']}
      />
      <Card
        icon={MdQuiz}
        iconBgColor="bg-green-500"
        title="Quiz Mode"
        description="Multiple choice questions to test your knowledge"
        features={['Multiple choice', 'Instant feedback', 'Progress tracking']}
      />
      <Card
        icon={RiNewspaperLine}
        iconBgColor="bg-purple-500"
        title="Fill in the Blank"
        description="Complete sentences with the correct word"
        features={['Context learning', 'Sentence completion', 'Real usage examples']}
      />
    </div>
  );
}

function TipContainer() {
  return (
    <div className="mx-auto w-[80%] max-w-xl p-6 text-center rounded-md border border-gray-700 bg-[#21252B]">
      <div className="flex justify-center items-center mb-4 font-extrabold text-xl text-white">
        <FaBoltLightning className="mr-2" />
        <span>Today&apos;s Learning Goal</span>
      </div>

      <p className="text-gray-300 mb-6">
        Practise consistently to build your vocabulary. Each mode offers a different way to reinforce your learning!
      </p>

      <div className="grid grid-cols-2 gap-4 text-sm text-gray-400 max-w-md mx-auto">
        <div className="flex items-center justify-center gap-2">
          <span className="text-lg">🎯</span>
          <span>Daily Goal: 20 words</span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <span className="text-lg">🧠</span>
          <span>Spaced repetition optimized</span>
        </div>
      </div>
    </div>
  );
}

export default function LearnPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LearnWordPage />
    </Suspense>
  );
}
