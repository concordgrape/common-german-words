"use client";

import Lottie from "lottie-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import fireAnimation from './/external/Lottie/fire.json';

const images = [
  "/germany1.webp",
  "/germany2.webp",
  "/germany3.webp",
  "/germany4.webp",
];

const App: React.FC = () => {
  return (
    <div className="pt-20 max-w-[1000px] m-auto flex flex-col md:flex-row">
      {/* Left: Text content */}
      <div className="w-full md:w-1/2 px-6 mt-4 pb-6 bg-white border-1 border-gray-200 dark:border-gray-700 dark:bg-[#0D1B2A]">
        <h1 className="mt-10 text-4xl md:text-5xl font-bold text-black dark:text-white flex items-center flex-wrap">
          Start Learning{" "}
          <span className="flex items-center">
            German
            <Lottie className="h-10 w-10" animationData={fireAnimation} loop={true} />
          </span>
        </h1>

        <p className="mt-4 text-lg md:text-xl text-gray-700 dark:text-gray-300">
          by memorizing common words and phrases first
        </p>

        <div className="mt-8 space-y-2 gap-4">
          <div className="w-full lg:w-100 h-32 bg-gray-100 dark:bg-[#1B263B] p-4 items-center justify-center text-center rounded-md">
            <Link href="/browse" className="hover:underline">
            <h1 className="text-md font-bold">Browse Words</h1>
            <h3 className="text-xs">Explore 6000+ words from our library</h3>
            </Link>

            <p className="font-mono text-xs text-left pt-1 pb-1">Try:</p>
            <div className="flex gap-2">
              <div className="cursor-pointer px-4 py-2 bg-blue-300 hover:scale-102 transition-transform duration-300 text-blue-700 rounded-full text-xs font-bold"><Link href="/browse?word=die">die</Link></div>
              <div className="cursor-pointer px-4 py-2 bg-blue-300 hover:scale-102 transition-transform duration-300 text-blue-700 rounded-full text-xs font-bold"><Link href="/browse?word=hund">hund</Link></div>
              <div className="cursor-pointer px-4 py-2 bg-blue-300 hover:scale-102 transition-transform duration-300 text-blue-700 rounded-full text-xs font-bold"><Link href="/browse?word=aber">aber</Link></div>
            </div>
          </div>

          <ModeLinks />

          <div className="w-full lg:w-100 h-32 bg-gray-100 dark:bg-[#1B263B] p-4 items-center justify-center text-center rounded-md">
            <Link href="/top-500-words/nouns" className="hover:underline">
            <h1 className="text-md font-bold">Top 500 <span className="text-orange-500">Nouns</span></h1>
            <h3 className="text-xs">Start learning our top nouns</h3>
            </Link>

            <p className="font-mono text-xs text-left pt-1 pb-1">Try:</p>
            <div className="flex gap-2">
              <div className="cursor-pointer px-4 py-2 bg-orange-300 hover:scale-102 transition-transform duration-300 text-orange-700 rounded-full text-xs font-bold"><Link href="/browse?word=gott">gott</Link></div>
              <div className="cursor-pointer px-4 py-2 bg-orange-300 hover:scale-102 transition-transform duration-300 text-orange-700 rounded-full text-xs font-bold"><Link href="/browse?word=frau">frau</Link></div>
              <div className="cursor-pointer px-4 py-2 bg-orange-300 hover:scale-102 transition-transform duration-300 text-orange-700 rounded-full text-xs font-bold"><Link href="/browse?word=arzt">arzt</Link></div>
            </div>
          </div>
          <div className="w-full lg:w-100 h-32 bg-gray-100 dark:bg-[#1B263B] p-4 items-center justify-center text-center rounded-md">
            <Link href="/top-500-words/verbs" className="hover:underline">
            <h1 className="text-md font-bold">Top 500 <span className="text-green-500">Verbs</span></h1>
            <h3 className="text-xs">Start learning our top verbs</h3>
            </Link>

            <p className="font-mono text-xs text-left pt-1 pb-1">Try:</p>
            <div className="flex gap-2">
              <div className="cursor-pointer px-4 py-2 bg-green-300 hover:scale-102 transition-transform duration-300 text-green-700 rounded-full text-xs font-bold"><Link href="/browse?word=haben">haben</Link></div>
              <div className="cursor-pointer px-4 py-2 bg-green-300 hover:scale-102 transition-transform duration-300 text-green-700 rounded-full text-xs font-bold"><Link href="/browse?word=wollte">wollte</Link></div>
              <div className="cursor-pointer px-4 py-2 bg-green-300 hover:scale-102 transition-transform duration-300 text-green-700 rounded-full text-xs font-bold"><Link href="/browse?word=musst">musst</Link></div>
            </div>
          </div>
          <div className="w-full lg:w-100 h-32 bg-gray-100 dark:bg-[#1B263B] p-4 items-center justify-center text-center rounded-md">
            <Link href="/top-500-words/adjectives" className="hover:underline">
            <h1 className="text-md font-bold">Top 500 <span className="text-blue-500">Adjectives</span></h1>
            <h3 className="text-xs">Start learning our top adjectives</h3>
            </Link>

            <p className="font-mono text-xs text-left pt-1 pb-1">Try:</p>
            <div className="flex gap-2">
              <div className="cursor-pointer px-4 py-2 bg-blue-300 hover:scale-102 transition-transform duration-300 text-blue-700 rounded-full text-xs font-bold"><Link href="/browse?word=gut">gut</Link></div>
              <div className="cursor-pointer px-4 py-2 bg-blue-300 hover:scale-102 transition-transform duration-300 text-blue-700 rounded-full text-xs font-bold"><Link href="/browse?word=spät">spät</Link></div>
              <div className="cursor-pointer px-4 py-2 bg-blue-300 hover:scale-102 transition-transform duration-300 text-blue-700 rounded-full text-xs font-bold"><Link href="/browse?word=alt">alt</Link></div>
            </div>
          </div>
          <div className="w-full lg:w-100 h-32 bg-gray-100 dark:bg-[#1B263B] p-4 items-center justify-center text-center rounded-md">
            <Link href="/top-500-words/adverbs" className="hover:underline">
            <h1 className="text-md font-bold">Top 500 <span className="text-orange-500">Adverbs</span></h1>
            <h3 className="text-xs">Start learning our top adverbs</h3>
            </Link>

            <p className="font-mono text-xs text-left pt-1 pb-1">Try:</p>
            <div className="flex gap-2">
              <div className="cursor-pointer px-4 py-2 bg-orange-300 hover:scale-102 transition-transform duration-300 text-orange-700 rounded-full text-xs font-bold"><Link href="/browse?word=dann">dann</Link></div>
              <div className="cursor-pointer px-4 py-2 bg-orange-300 hover:scale-102 transition-transform duration-300 text-orange-700 rounded-full text-xs font-bold"><Link href="/browse?word=immer">immer</Link></div>
              <div className="cursor-pointer px-4 py-2 bg-orange-300 hover:scale-102 transition-transform duration-300 text-orange-700 rounded-full text-xs font-bold"><Link href="/browse?word=vielleicht">vielleicht</Link></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Masonry grid */}
      <div className="w-full md:w-1/2 p-4 columns-2 md:columns-2 gap-4 space-y-4">
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Germany ${index + 1}`}
            className="w-full rounded-lg object-cover break-inside-avoid shadow-md hover:scale-102 transition-transform duration-300"
          />
        ))}
      </div>
    </div>
  );
};

export default App;

const modes = [
  {
    key: 'flashcards',
    title: 'Flashcards',
    subtitle: 'Learn with flashcards',
    icon: (
      <Image
        src="/card.svg"
        alt="Flashcards icon"
        width={100}
        height={100}
        className="m-auto"
      />
    ),
    bgColor: 'bg-blue-200 dark:bg-blue-300',
    textColor: 'text-blue-600 dark:text-blue-700',
  },
  {
    key: 'quiz',
    title: 'Quiz',
    subtitle: 'Test with fill in the blank',
    icon: (
      <Image
        src="/quiz.svg"
        alt="Quiz icon"
        width={90}
        height={90}
        className="m-auto"
      />
    ),
    bgColor: 'bg-blue-200 dark:bg-blue-300',
    textColor: 'text-blue-600 dark:text-blue-700',
  },
] as const;

function ModeLinks() {
  return (
    <div className="max-w-5xl w-full mx-auto lg:px-4 mt-8 mb-8">
      <h2 className="mb-6 text-xl font-semibold text-center">
        Practise your word knowledge with...
      </h2>

      <div className="flex flex-row justify-center gap-4">
        {modes.map((mode) => (
          <Link
            key={mode.key}
            href="/learn"
            className={`flex-shrink-0 flex flex-col items-center justify-center rounded-lg p-6 w-40 h-48 transition shadow-md hover:scale-105 ${mode.bgColor} ${mode.textColor}`}
          >
            <div className="mb-2">{mode.icon}</div>
            <h3 className="text-md font-mono font-bold">{mode.title}</h3>
            <p className="text-xs font-mono text-gray-600 text-center">{mode.subtitle}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

