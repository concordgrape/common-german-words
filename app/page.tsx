"use client";

import Lottie from "lottie-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import fireAnimation from ".//external/Lottie/fire.json";
import { FaArrowAltCircleRight } from "react-icons/fa";
import { useRouter } from "next/navigation";

import {
  kCOUNTRY_NAME,
  kESTIMATE_TOTAL_WORD_COUNT,
  kIMAGE_PATHS,
  kEXAMPLE_WORDS,
  kLANG_NAME_CAPITAL,
} from "./lib/constants";

const App: React.FC = () => {
  const router = useRouter();

  return (
    <div className="pt-10 sm:pt-15 sm:pt-20 sm:p-4 md:pt-20 max-w-[1200px] m-auto flex flex-col md:flex-row">
      {/* Left: Text content */}
      <div className="w-full md:w-1/2 px-6 mt-4 pb-6 bg-white dark:bg-[#0D1B2A]">
        <h1 className="mt-10 text-4xl md:text-5xl font-bold text-black dark:text-white flex items-center flex-wrap">
          Start Learning&nbsp;
          <span className="flex items-center">
            <span className="px-2 bg-red-500 text-white">{kLANG_NAME_CAPITAL}</span>
            <Lottie
              className="h-10 w-10 lg:h-15 lg:w-15"
              animationData={fireAnimation}
              loop={true}
            />
          </span>
        </h1>

        <h2 className="mt-1 text-lg md:text-xl text-gray-700 dark:text-gray-300 font-semibold">
          by memorizing common words and phrases first
        </h2>

        <div className="mt-8 space-y-2 gap-4 items-center">
          {/* Browse */}
          <div className="w-full lg:w-100 max-w-100 h-32 bg-gray-100 dark:bg-[#1B263B] p-4 flex flex-col m-auto mb-4 text-center rounded-md">
            <button
              onClick={() => router.push("/browse")}
              className="cursor-pointer hover:underline"
            >
              <h3 className="text-md font-bold flex items-center justify-center">
                Browse Words
                <FaArrowAltCircleRight className="ml-1 mb-1" />
              </h3>
              <h4 className="text-xs">
                Explore <b>{kESTIMATE_TOTAL_WORD_COUNT}+</b> words from our
                library
              </h4>
            </button>

            <p className="font-mono text-xs text-left pt-1 pb-1">Try:</p>
            <ChipsRow
              words={kEXAMPLE_WORDS.browse}
              hrefBase="/browse"
              badgeClass="bg-blue-300 text-blue-700"
            />
          </div>

          <ModeLinks />

          <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />

          {/* Top 100 */}
          <div className="w-full lg:w-100 max-w-100 h-32 bg-gray-100 dark:bg-[#1B263B] p-4 flex flex-col m-auto mb-4 text-center rounded-md">
            <button
              onClick={() => router.push("/top-100-words")}
              className="cursor-pointer hover:underline"
            >
              <h1 className="text-md font-bold flex items-center justify-center">
                <span className="text-red-400">Top 100</span>&nbsp;{kLANG_NAME_CAPITAL} Words
                <FaArrowAltCircleRight className="ml-1 mb-1" />
              </h1>
              <h3 className="text-xs">Start exploring our top 100 words</h3>
            </button>

            <p className="font-mono text-xs text-left pt-1 pb-1">Try:</p>
            <ChipsRow
              words={kEXAMPLE_WORDS.top100}
              hrefBase="/top-100-words"
              badgeClass="bg-red-300 text-red-700"
            />
          </div>

          {/* Top 500 */}
          <div className="w-full lg:w-100 max-w-100 h-32 bg-gray-100 dark:bg-[#1B263B] p-4 flex flex-col m-auto mb-4 text-center rounded-md">
            <button
              onClick={() => router.push("/top-500-words")}
              className="cursor-pointer hover:underline"
            >
              <h1 className="text-md font-bold flex items-center justify-center">
                <span className="text-red-400">Top 500</span>&nbsp;{kLANG_NAME_CAPITAL} Words
                <FaArrowAltCircleRight className="ml-1 mb-1" />
              </h1>
              <h3 className="text-xs">Start exploring our top 500 words</h3>
            </button>

            <p className="font-mono text-xs text-left pt-1 pb-1">Try:</p>
            <ChipsRow
              words={kEXAMPLE_WORDS.top500}
              hrefBase="/top-500-words"
              badgeClass="bg-red-300 text-red-700"
            />
          </div>

          <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />

          {/* TOP 500 WORDS SECTION */}
          <div className="w-full lg:w-100 max-w-100 h-32 bg-gray-100 dark:bg-[#1B263B] p-4 flex flex-col m-auto mb-4 text-center rounded-md">
            <button
              onClick={() => router.push("/top-500-words/nouns")}
              className="cursor-pointer hover:underline"
            >
              <h3 className="text-md font-bold flex items-center justify-center">
                Top 500 <span className="text-orange-500 px-1">Nouns</span>
                <FaArrowAltCircleRight className="mb-1" />
              </h3>
              <h4 className="text-xs">Start learning our top nouns</h4>
            </button>

            <p className="font-mono text-xs text-left pt-1 pb-1">Try:</p>
            <ChipsRow
              words={kEXAMPLE_WORDS.top500Nouns}
              hrefBase="/top-500-words/nouns"
              badgeClass="bg-orange-300 text-orange-700"
            />
          </div>

          <div className="w-full lg:w-100 max-w-100 h-32 bg-gray-100 dark:bg-[#1B263B] p-4 flex flex-col m-auto mb-4 text-center rounded-md">
            <button
              onClick={() => router.push("/top-500-words/verbs")}
              className="cursor-pointer hover:underline"
            >
              <h3 className="text-md font-bold flex items-center justify-center">
                Top 500 <span className="text-green-500 px-1">Verbs</span>
                <FaArrowAltCircleRight className="mb-1" />
              </h3>
              <h4 className="text-xs">Start learning our top verbs</h4>
            </button>

            <p className="font-mono text-xs text-left pt-1 pb-1">Try:</p>
            <ChipsRow
              words={kEXAMPLE_WORDS.top500Verbs}
              hrefBase="/top-500-words/verbs"
              badgeClass="bg-green-300 text-green-700"
            />
          </div>

          <div className="w-full lg:w-100 max-w-100 h-32 bg-gray-100 dark:bg-[#1B263B] p-4 flex flex-col m-auto mb-4 text-center rounded-md">
            <button
              onClick={() => router.push("/top-500-words/adjectives")}
              className="cursor-pointer hover:underline"
            >
              <h3 className="text-md font-bold flex items-center justify-center">
                Top 500 <span className="text-blue-500 px-1">Adjectives</span>
                <FaArrowAltCircleRight className="mb-1" />
              </h3>
              <h4 className="text-xs">Start learning our top adjectives</h4>
            </button>

            <p className="font-mono text-xs text-left pt-1 pb-1">Try:</p>
            <ChipsRow
              words={kEXAMPLE_WORDS.top500Adjectives}
              hrefBase="/top-500-words/adjectives"
              badgeClass="bg-blue-300 text-blue-700"
            />
          </div>

          <div className="w-full lg:w-100 max-w-100 h-32 bg-gray-100 dark:bg-[#1B263B] p-4 flex flex-col m-auto mb-4 text-center rounded-md">
            <button
              onClick={() => router.push("/top-500-words/adverbs")}
              className="cursor-pointer hover:underline"
            >
              <h3 className="text-md font-bold flex items-center justify-center">
                Top 500 <span className="text-orange-500 px-1">Adverbs</span>
                <FaArrowAltCircleRight className="mb-1" />
              </h3>
              <h4 className="text-xs">Start learning our top adverbs</h4>
            </button>

            <p className="font-mono text-xs text-left pt-1 pb-1">Try:</p>
            <ChipsRow
              words={kEXAMPLE_WORDS.top500Adverbs}
              hrefBase="/top-500-words/adverbs"
              badgeClass="bg-orange-300 text-orange-700"
            />
          </div>

          <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />

          {/* TOP 100 WORDS SECTION */}
          <div className="w-full lg:w-100 max-w-100 h-32 bg-gray-100 dark:bg-[#1B263B] p-4 flex flex-col m-auto mb-4 text-center rounded-md">
            <button
              onClick={() => router.push("/top-100-words/nouns")}
              className="cursor-pointer hover:underline"
            >
              <h3 className="text-md font-bold flex items-center justify-center">
                Top 100 <span className="text-orange-500 px-1">Nouns</span>
                <FaArrowAltCircleRight className="mb-1" />
              </h3>
              <h4 className="text-xs">Start learning our top nouns</h4>
            </button>

            <p className="font-mono text-xs text-left pt-1 pb-1">Try:</p>
            <ChipsRow
              words={kEXAMPLE_WORDS.top100Nouns}
              hrefBase="/top-100-words/nouns"
              badgeClass="bg-orange-300 text-orange-700"
            />
          </div>

          <div className="w-full lg:w-100 max-w-100 h-32 bg-gray-100 dark:bg-[#1B263B] p-4 flex flex-col m-auto mb-4 text-center rounded-md">
            <button
              onClick={() => router.push("/top-100-words/verbs")}
              className="cursor-pointer hover:underline"
            >
              <h3 className="text-md font-bold flex items-center justify-center">
                Top 100 <span className="text-green-500 px-1">Verbs</span>
                <FaArrowAltCircleRight className="mb-1" />
              </h3>
              <h4 className="text-xs">Start learning our top verbs</h4>
            </button>

            <p className="font-mono text-xs text-left pt-1 pb-1">Try:</p>
            <ChipsRow
              words={kEXAMPLE_WORDS.top100Verbs}
              hrefBase="/top-100-words/verbs"
              badgeClass="bg-green-300 text-green-700"
            />
          </div>

          <div className="w-full lg:w-100 max-w-100 h-32 bg-gray-100 dark:bg-[#1B263B] p-4 flex flex-col m-auto mb-4 text-center rounded-md">
            <button
              onClick={() => router.push("/top-100-words/adjectives")}
              className="cursor-pointer hover:underline"
            >
              <h3 className="text-md font-bold flex items-center justify-center">
                Top 100 <span className="text-blue-500 px-1">Adjectives</span>
                <FaArrowAltCircleRight className="mb-1" />
              </h3>
              <h4 className="text-xs">Start learning our top adjectives</h4>
            </button>

            <p className="font-mono text-xs text-left pt-1 pb-1">Try:</p>
            <ChipsRow
              words={kEXAMPLE_WORDS.top100Adjectives}
              hrefBase="/top-100-words/adjectives"
              badgeClass="bg-blue-300 text-blue-700"
            />
          </div>

          <div className="w-full lg:w-100 max-w-100 h-32 bg-gray-100 dark:bg-[#1B263B] p-4 flex flex-col m-auto mb-4 text-center rounded-md">
            <button
              onClick={() => router.push("/top-100-words/adverbs")}
              className="cursor-pointer hover:underline"
            >
              <h3 className="text-md font-bold flex items-center justify-center">
                Top 100 <span className="text-orange-500 px-1">Adverbs</span>
                <FaArrowAltCircleRight className="mb-1" />
              </h3>
              <h4 className="text-xs">Start learning our top adverbs</h4>
            </button>

            <p className="font-mono text-xs text-left pt-1 pb-1">Try:</p>
            <ChipsRow
              words={kEXAMPLE_WORDS.top100Adverbs}
              hrefBase="/top-100-words/adverbs"
              badgeClass="bg-orange-300 text-orange-700"
            />
          </div>
        </div>
      </div>

      {/* Right: Images */}
      <div className="hidden md:block w-full md:w-1/2 pt-4 pl-2 lg:pl-4 columns-2 md:columns-2 gap-4 space-y-4">
        {kIMAGE_PATHS.map((src, index) => (
          <div
            key={index}
            className="break-inside-avoid rounded-lg overflow-hidden shadow-md hover:scale-102 transition-transform duration-300"
          >
            <Image
              src={src}
              alt={`Landscape in ${kCOUNTRY_NAME} - ${index + 1}`}
              width={600}
              height={900}
              className="w-full h-auto rounded-lg object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={index === 0}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;

function ChipsRow({
  words,
  hrefBase,
  badgeClass,
}: {
  words: readonly string[];
  hrefBase: string;
  badgeClass: string;
}) {
  return (
    <div className="flex gap-2 justify-start">
      {words.map((word) => (
        <div
          key={`${hrefBase}-${word}`}
          className={`cursor-pointer px-4 py-2 ${badgeClass} hover:scale-102 transition-transform duration-300 rounded-full text-xs font-bold`}
        >
          <Link href={{ pathname: hrefBase, query: { word } }}>{word}</Link>
        </div>
      ))}
    </div>
  );
}

const modes = [
  {
    key: "flashcards",
    title: "Flashcards",
    subtitle: "Learn with flashcards",
    icon: (
      <Image
        src="/card.svg"
        alt="Flashcards icon"
        width={100}
        height={100}
        className="m-auto"
      />
    ),
    bgColor: "bg-blue-300 dark:bg-blue-300",
    textColor: "text-blue-600 dark:text-blue-700",
  },
  {
    key: "quiz",
    title: "Quizzes",
    subtitle: "Fill in the blank questions",
    icon: (
      <Image
        src="/quiz.svg"
        alt="Quiz icon"
        width={90}
        height={90}
        className="m-auto"
      />
    ),
    bgColor: "bg-blue-300 dark:bg-blue-300",
    textColor: "text-blue-600 dark:text-blue-700",
  },
] as const;

function ModeLinks() {
  return (
    <div className="max-w-5xl w-full mx-auto lg:px-4 mt-8 mb-8">
      <h2 className="mb-6 text-xl font-semibold text-center">
        Practise your vocab knowledge with...
      </h2>

      <div className="flex flex-row justify-center gap-4">
        {modes.map((mode) => (
          <Link
            key={mode.key}
            href="/learn"
            className={`flex-shrink-0 flex flex-col items-center justify-center rounded-lg p-6 w-40 h-48 transition hover:scale-105 ${mode.bgColor} ${mode.textColor}`}
          >
            <div className="mb-2">{mode.icon}</div>
            <h3 className="text-md font-mono font-bold">{mode.title}</h3>
            <p className="text-xs font-mono text-gray-600 text-center">
              {mode.subtitle}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
