"use client";

import React, { useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { LuSparkles } from "react-icons/lu";
import { SlidersHorizontal, Target, Filter, BookOpen } from 'lucide-react';
import Image from 'next/image';
import SortButton from '../components/SortButtons/Sort';

type Mode = 'flashcards' | 'quiz' | 'fill';


export const LearnForm = () => {
  return (
    <div
      className={`w-full max-w-[800px] p-1 sm:p-4 md:p-4 items-start overflow-hidden mt-5 px-2 lg:px-5`}
    >
        <h1 className="text-black text-4xl font-extrabold pl-5 lg:pl-0">Learn</h1>
        <h2 className="text-gray-700 text-lg font-regular pl-5 lg:pl-0">Choose your preferred way to practice and customize your session to fit your learning goals.</h2>
        <div className="bg-[#FFFFFF] border-1 border-gray-200 px-6 py-4 pt-5 rounded-lg mt-3 shadow-sm">
            <h1 className="text-black text-2xl font-bold flex"><LuSparkles className='mr-3 mt-1 text-blue-500' />Select a practise mode</h1>
            <ModeSelector />
        </div>

        <div className="bg-[#FFFFFF] border-1 border-gray-200 px-6 py-4 pt-5 rounded-lg mt-3 shadow-sm">
            <h1 className="text-black text-2xl font-bold flex"><SlidersHorizontal className='mr-3 mt-1 text-blue-500' />Add Words</h1>
            <SessionCustomizer />
        </div>
    </div>
  );
}

function ModeSelector() {
  const [selected, setSelected] = useState<Mode>('flashcards');

  const modes = [
    {
        key: 'flashcards',
        title: 'Flashcards',
        subtitle: 'Classic flip cards to build recognition',
        icon: (
            <Image
                src="/card.svg"
                alt="Globe icon"
                width={100}
                height={100}
                className="m-auto text-orange-400"
            />
        ),        
        bgColor: 'bg-blue-200',
        textColor: 'text-blue-600',
    },
    {
        key: 'quiz',
        title: 'Quiz',
        subtitle: 'Test your knowledge with multiple choice',
        icon: (
            <Image
                src="/quiz.svg"
                alt="Globe icon"
                width={90}
                height={90}
                className="m-auto text-orange-400"
            />
        ),        
        bgColor: 'bg-blue-200',
        textColor: 'text-blue-600',
    },
    {
        key: 'fill',
        title: 'Fill in the Blank',
        subtitle: 'Type the word in context',
        icon: (
            <Image
                src="/globe-02.svg"
                alt="Globe icon"
                width={100}
                height={100}
                className="m-auto text-orange-400"
            />
        ),        
        bgColor: 'bg-blue-200',
        textColor: 'text-blue-600',
    },
    ] as const;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto pt-4">
    {modes.map((mode) => {
        const isSelected = selected === mode.key;
        return (
        <button
            key={mode.key}
            onClick={() => setSelected(mode.key)}
            className={`relative rounded-lg p-6 text-left transition h-70 w-full md:h-80 lg:h-70 w-[150px] lg:w-full ${
            isSelected ? `${mode.textColor} ${mode.bgColor}` : 'bg-gray-200 opacity-50'
            }`}
        >
            {isSelected && (
            <div className="absolute top-2 right-2 text-black/50">
                <FaCheck />
            </div>
            )}
            <div className="mb-8">{mode.icon}</div>
            <h3 className="text-lg font-bold">{mode.title}</h3>
            <p className="text-sm text-gray-600">{mode.subtitle}</p>
        </button>
        );
    })}
    </div>
  );
}


function SessionCustomizer() {
  const [wordType, setWordType] = useState('all');
  const [wordCount, setWordCount] = useState(20);
  const [selectedCEFR, setSelectedCEFR] = useState("All")

  return (
    <div className="mx-aut p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <Target className="w-4 h-4 text-gray-500" /> <span className='font-bold'>Word Difficulty</span>
          </label>
          <div className="grid grid-cols-2 gap-0 lg:w-50 border border-1 border-gray-200 rounded-lg">                
                {[
                  { id: "All", label: "All" },
                  { id: "A1", label: "A1" },
                  { id: "A2", label: "A2" },
                  { id: "B1", label: "B1" },
                ].map((option, index) => (
                  <SortButton
                    key={option.id}
                    label={option.label}
                    isActive={selectedCEFR === option.id}
                    onClick={() =>
                      setSelectedCEFR(
                        option.id as "All" | "A1" | "A2" | "B1"
                      )
                    }
                    index={index}
                    color={"bg-blue-400"}
                  />
                ))}
              </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <Filter className="w-4 h-4 text-gray-500" /> <span className="font-bold">Word Type</span>
            </label>

            <div className="grid grid-cols-2 gap-2 text-sm">
            {[
                { label: 'All', value: 'all' },
                { label: 'Nouns', value: 'noun' },
                { label: 'Verbs', value: 'verb' },
                { label: 'Adjectives', value: 'adj' },
                { label: 'Adverbs', value: 'adv' },
            ].map((option) => (
                <label
                key={option.value}
                className="inline-flex items-center gap-2"
                >
                <input
                    type="radio"
                    name="wordType"
                    value={option.value}
                    checked={wordType === option.value}
                    onChange={(e) => setWordType(e.target.value)}
                    className="text-blue-600 focus:ring-blue-500"
                />
                {option.label}
                </label>
            ))}
            </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 mt-2 flex items-center gap-1">
          <BookOpen className="w-4 h-4 text-gray-500" /> <span className='font-bold'>Word Count</span>
        </label>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">5</span>
          <span className="font-semibold text-blue-600">{wordCount}</span>
          <span className="text-gray-500">37</span>
        </div>
        <input
            type="range"
            min={5}
            max={37}
            value={wordCount}
            onChange={(e) => setWordCount(Number(e.target.value))}
            className="w-full mt-2 accent-blue-600 custom-slider"
        />
      </div>
    </div>
  );
}