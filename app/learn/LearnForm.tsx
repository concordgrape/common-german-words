"use client";

import React, { useEffect, useState } from "react";
import { FaCheck } from 'react-icons/fa';
import { LuSparkles } from "react-icons/lu";
import { SlidersHorizontal, Target, Filter, BookOpen } from "lucide-react";
import Image from 'next/image';
import SortButton from "../components/SortButtons/Sort";
import { useWordForm } from "../context/WordFormContext";
import { fetchBasicWords, Word } from "../helpers/fetchBasicWordList";
import { shuffle } from "../helpers/utils";
import { Mode } from "./page";

interface LearnFormProps {
  setMode: React.Dispatch<React.SetStateAction<Mode>>;
}

export const LearnForm = ({ setMode }: LearnFormProps) => {
  const [words, setWords] = useState<Word[]>([]);

  useEffect(() => {
    fetchBasicWords("german", process.env.NEXT_PUBLIC_API_PASSWORD || "").then(
      setWords
    );
  }, []);

  return (
    <div
      className={`w-full max-w-[800px] p-1 sm:p-4 md:p-4 items-start overflow-hidden mt-5 px-2 lg:px-5`}
    >
      <h1 className="text-black text-5xl font-extrabold">Learn</h1>
      <h2 className="text-gray-700 text-base font-regular">
        Customize how you&apos;ll practise a set of words, you can also navigate
        to the{" "}
        <a href="/browse" className="text-blue-700">
          <u>Browse page</u>
        </a>{" "}
        to add words to the &apos;saved&apos; collection
      </h2>
      <hr className="h-px my-4 bg-gray-300 border-0" />
      <div className="py-4 pt-5 mt-3">
        <h1 className="text-black text-2xl font-bold flex"><LuSparkles className='mr-3 mt-1 text-blue-500' />Select a practise mode</h1>
        <ModeSelector setMode={setMode} />
      </div>
      <SessionCustomizer words={words} />
    </div>
  );
};

interface ModeSelectorProps {
  setMode: React.Dispatch<React.SetStateAction<Mode>>;
}

function ModeSelector({ setMode }: ModeSelectorProps) {
  const [selected, setSelected] = useState<Mode>('flashcards');

  const modes = [
    {
        key: 'flashcards',
        title: 'Flashcards',
        subtitle: 'Learn with flashcards',
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
        subtitle: 'Test with multiple choice',
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
    /*{
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
    },*/
    ] as const;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 max-w-4xl mx-auto pt-4">
    {modes.map((mode) => {
        const isSelected = selected === mode.key;
        return (
        <button
            key={mode.key}
            onClick={() => {
                setSelected(mode.key)
                setMode(mode.key)
              }
            }
            className={`relative rounded-lg p-6 text-left transition h-50 w-full sm:h-60 md:h-50 lg:h-50 ${
            isSelected ? `${mode.textColor} ${mode.bgColor}` : 'bg-gray-200 opacity-50'
            }`}
        >
            {isSelected && (
            <div className="absolute top-2 right-2 text-black/50">
                <FaCheck />
            </div>
            )}
            <div className="mb-2">{mode.icon}</div>
            <h3 className="text-md font-mono font-bold">{mode.title}</h3>
            <p className="text-xs font-mono text-gray-600">{mode.subtitle}</p>
        </button>
        );
    })}
    </div>
  );
}

interface SessionCustomizerProps {
  words: Word[];
}

function SessionCustomizer({ words }: SessionCustomizerProps) {
  const [wordType, setWordType] = useState("All");
  const [wordCount, setWordCount] = useState(5);
  const [selectedCEFR, setSelectedCEFR] = useState(0);
  const [allWordCount, setAllWordCount] = useState(0);

  const { setFilteredWords, setSubmittedWords } = useWordForm();

  useEffect(() => {
    const filtered = words.filter((word) => {
      const matchesCEFR = selectedCEFR === 0 || word.rank === selectedCEFR;
      const matchesType =
        wordType === "All" || word.part_of_speech === wordType;
      return matchesCEFR && matchesType;
    });

    setAllWordCount(filtered.length);

    const shuffledSample = shuffle(filtered).slice(0, wordCount);

    setSubmittedWords(shuffledSample);

    console.log("shuffled: ", shuffledSample);

    setFilteredWords(shuffledSample);
  }, [
    wordType,
    selectedCEFR,
    wordCount,
    words,
    setFilteredWords,
    setSubmittedWords,
  ]);

  return (
    <div>
      <div className="bg-[#FFFFFF] border-1 border-gray-200 px-6 py-4 pt-5 rounded-lg mt-3 shadow-sm">
        <h1 className="text-black text-2xl font-bold flex">
          <SlidersHorizontal className="mr-3 mt-1 text-blue-500" />
          Add Words
        </h1>
        <span className="flex text-gray-500 mt-3 font-mono text-xs">
          {allWordCount == 0 ? 
            <div className={`flex pt-1 pr-2 h-2 max-h-2`}>
              <div className="animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
            </div>
          : allWordCount} available words
        </span>

        <hr className="h-px my-4 bg-gray-200 border-0" />

        <div className="mx-aut pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Target className="w-4 h-4 text-gray-500" />{" "}
                <span className="font-bold">Word Difficulty</span>
              </label>
              <div className="grid grid-cols-2 gap-0 lg:w-50 border border-1 border-gray-200 rounded-lg">
                {[
                  { id: 0, label: "All" },
                  { id: 1, label: "A1" },
                  { id: 2, label: "A2" },
                  { id: 3, label: "B1" },
                ].map((option, index) => (
                  <SortButton
                    key={option.id}
                    label={option.label}
                    isActive={selectedCEFR === option.id}
                    onClick={() => setSelectedCEFR(option.id)}
                    index={index}
                    color={"bg-blue-400"}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <Filter className="w-4 h-4 text-gray-500" />{" "}
                <span className="font-bold">Word Type</span>
              </label>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {[
                  { label: "All", value: "All" },
                  { label: "Verbs", value: "Verb" },
                  { label: "Adjectives", value: "Adjective" },
                  { label: "Nouns", value: "Noun" },
                  { label: "Interjections", value: "Interjection" },
                  { label: "Adverbs", value: "Adverb" },
                  { label: "Determiners", value: "Determiner" },
                  { label: "Pronouns", value: "Pronoun" },
                  { label: "Conjunctions", value: "Conjunction" },
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
        </div>
      </div>
      <div className="bg-[#FFFFFF] border-1 border-gray-200 px-6 py-4 pt-5 rounded-lg mt-3 shadow-sm">
        <h1 className="text-black text-2xl font-bold flex">
          <SlidersHorizontal className="mr-3 mt-1 text-blue-500" />
          Set Word Count
        </h1>
        <p className="text-gray-500 mt-3 font-mono text-xs">
          How many words do you want to practise?
        </p>

        <hr className="h-px my-4 bg-gray-200 border-0" />
        <div className="mx-aut p-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <BookOpen className="w-4 h-4 text-gray-500" />{" "}
              <span className="font-bold">Word Count</span>
            </label>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">0</span>
              <span className="font-semibold text-blue-600">{wordCount}
              </span>
              <span className="font-semibold text-gray-500">{100}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={allWordCount > 100 ? 100 : allWordCount}
              value={wordCount}
              onChange={(e) => setWordCount(Number(e.target.value))}
              className="w-full mt-2 accent-blue-600 custom-slider"
              disabled={allWordCount == 0}
            />
            <div className="mt-4 flex justify-center items-center space-x-3">
              {[5, 10, 20].map((inc) => (
                <button
                  data-tip={`Add ${inc} words`}
                  key={inc}
                  onClick={() =>
                    setWordCount((prev) =>
                      Math.min(
                        prev + inc,
                        allWordCount > 100 ? 100 : allWordCount
                      )
                    )
                  }
                  disabled={wordCount >= allWordCount}
                  className={`
                  tooltip py-2 w-10 rounded-lg
                  ${
                    wordCount >= allWordCount
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-gray-100 text-black hover:bg-gray-200"
                  }
                `}
                >
                  <u>+{inc}</u>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
