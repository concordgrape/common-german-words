"use client";

import React, { useEffect, useState, useRef } from 'react';
import { Word } from '../helpers/fetchBasicWordList';

interface WordInfoProps {
  selectedWord?: Word | null;
}

interface FullWordData {
  connected_words: string[];
  definitions: string[];
  examples: { sentence: string; translation: string }[];
  language: string;
  part_of_speech: string;
  phonetic_spelling: string;
  same_words: string[];
  gender: string;
}

export const WordInfo: React.FC<WordInfoProps> = ({ selectedWord }) => {
  const [fullData, setFullData] = useState<FullWordData | null>(null);
  // Add this to your component state
const [visibleExamples, setVisibleExamples] = useState(4);
const lastFetchedWord = useRef<string | null>(null);

useEffect(() => {
  if (!selectedWord || selectedWord.word === lastFetchedWord.current) {
    return;
  }

  const fetchData = async () => {
    try {
      const res = await fetch(
        `/api/word?language=german&word=${selectedWord.word}&apiKey=${process.env.NEXT_PUBLIC_API_PASSWORD}`
      );
      const json = await res.json();
      if (json.word) {
        setFullData(json.word);
        console.log("fetching words")
      } else {
        setFullData(null);
      }
      lastFetchedWord.current = selectedWord.word;
    } catch (error) {
      console.error("Error fetching word info:", error);
      setFullData(null);
    }
  };

  fetchData();
  setVisibleExamples(4); // reset
}, [selectedWord]);


  if (!selectedWord) {
    return <div className="w-full" />;
  }

  return (
    <div className="w-full">
<div className="w-full bg-[#027AFB] rounded-lg shadow-lg p-6 flex flex-col max-h-[80vh] overflow-y-auto">
{fullData ? (
  <div className="text-white space-y-4">
  <div className="relative w-full">
    <h2 className="text-2xl font-bold text-center">{selectedWord.word}</h2>
    <h2 className="text-lg font-bold absolute left-0 top-0"><i>{selectedWord.rank}</i></h2>
  </div>

    <p className="text-center text-gray-200 italic">
      {fullData.part_of_speech} · {fullData.gender} · [{fullData.phonetic_spelling}]
    </p>

    {/* Definitions */}
    <div>
      <h3 className="text-lg font-semibold mb-1">Definitions</h3>
      <ul className="list-disc list-inside text-white/90">
        {fullData.definitions.slice(0, 3).map((def, idx) => (
          <li key={idx}>{def}</li>
        ))}
      </ul>
    </div>

    {/* Example Sentences */}
    <div>
      <h3 className="text-lg font-semibold mb-1">Examples</h3>
      <ul className="space-y-2">
        {fullData.examples.slice(0, visibleExamples).map((ex, idx) => (
          <li key={idx} className="text-white/90">
            <div>🇩🇪 {ex.sentence}</div>
            <div className="text-white/70">🇬🇧 {ex.translation}</div>
          </li>
        ))}
      </ul>

      {visibleExamples < fullData.examples.length && (
        <button
          onClick={() => setVisibleExamples((prev) => prev + 4)}
          className="mt-4 text-sm text-blue-100 hover:text-white underline"
        >
          Load more examples
        </button>
      )}
    </div>

    {/* Connected Words */}
    {fullData.connected_words.length > 0 && (
      <div>
        <h3 className="text-lg font-semibold mb-1">Related Words</h3>
        <div className="flex flex-wrap gap-2">
          {fullData.connected_words.map((w) => (
            <span key={w} className="bg-white/10 px-3 py-1 rounded-full text-sm">
              {w}
            </span>
          ))}
        </div>
      </div>
    )}
  </div>
) : (
  <p className="text-white">No details available for &quot;{selectedWord.word}&quot;.</p>
)}

      </div>
    </div>
  );
};
