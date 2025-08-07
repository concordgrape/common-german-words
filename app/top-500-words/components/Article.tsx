"use client";

import React from "react";
import { FaVolumeUp, FaCopy, FaInfoCircle } from "react-icons/fa";

interface ArticleProps {
    type: 'Nouns' | 'Verbs' | 'Adjectives' | 'Adverbs';
}

export default function Article({ type }: ArticleProps) {
    let textColor = "text-black dark:text-white";
    switch (type) {
        case 'Nouns':
            textColor = "text-orange-400";
            break;
        case 'Verbs':
            textColor = "text-green-400";
            break;
        case 'Adjectives':
            textColor = "text-blue-400";
            break;
        case 'Adverbs':
            textColor = "text-orange-400";
            break;
        default:
            textColor = "text-black dark:text-white";
    }
  return (
    <div
      className={`w-full px-6 text-black dark:text-white max-w-[800px] p-1 sm:p-4 md:p-4 items-start bg-[#FFFFFF] dark:bg-[#0D1B2A] border-0 sm:border-1 border-gray-200 dark:border-gray-700 overflow-hidden mt-0 pt-10 sm:pt-0 sm:mt-5`}
    >
      <h1 className="text-3xl font-bold mb-6">Explore the Top 500 German <span className={textColor}>{type}</span></h1>

      <p className="mb-4">
        Welcome to <strong>Common German Words</strong>! On this page, you’ll find the
        <strong> 500 most common German {type.toLowerCase()}</strong> — a great place to start if you want to build a strong vocabulary quickly.
      </p>

      <p className="mb-4">
        You’ll see a big list of words like:
      </p>

      <ul className="list-disc list-inside mb-4">
        <li><strong>der Mann</strong> – <em>the man</em></li>
        <li><strong>die Frau</strong> – <em>the woman</em></li>
        <li><strong>das Kind</strong> – <em>the child</em></li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3">How to Use This Page</h2>

      <ul className="list-disc list-inside mb-6 space-y-2">
        <li>
          Click <strong>Save</strong> to study a word later with flashcards or quizzes (you’ll find those on the <strong>Learn</strong> page).
        </li>
        <li>
          Click <strong>Known</strong> if you already know the word — this tells the site not to focus on it as much when you&apos;re learning.
        </li>
        <li>
          Click on a word to open an <span className="text-blue-500 inline-flex items-center"><FaInfoCircle className="mr-1" />Info</span> box.
          It shows example sentences (with translations), how to pronounce the word, and related words.
        </li>
        <li>
          Hover over any word to:
          <ul className="list-disc list-inside ml-4 mt-1">
            <li>
              Click the <span className="inline-flex items-center"><FaVolumeUp className="mr-1" />audio icon</span> to hear how it&apos;s pronounced.
            </li>
            <li>
              Click the <span className="inline-flex items-center"><FaCopy className="mr-1" />copy icon</span> to copy the word.
            </li>
          </ul>
        </li>
      </ul>

      <p className="text-md">
        This tool is here to help you learn the words that actually show up in real German conversations.
        Take your time, save what you don’t know yet, and come back anytime to keep learning!
      </p>
    </div>
  );
}
