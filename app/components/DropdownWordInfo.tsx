"use client";

import React, { useEffect, useState } from "react";
import { Word } from "../helpers/fetchBasicWordList";
import GoogleTTSButton from "./GoogleTTSButton/GoogleTTSButton";

interface DropdownWordInfoProps {
  word: Word;
  isOpen: boolean;
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

const InnerDropdownWordInfo: React.FC<DropdownWordInfoProps> = ({ word, isOpen }) => {
  const [fullData, setFullData] = useState<FullWordData | null>(null);
  const [visibleExamples, setVisibleExamples] = useState(4);

  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      try {
        const res = await fetch(
          `/api/word?language=german&word=${word.word}&apiKey=${process.env.NEXT_PUBLIC_API_PASSWORD}`
        );
        const json = await res.json();
        setFullData(json.word || null);
      } catch (error) {
        console.error("Error fetching word info:", error);
        setFullData(null);
      }
    };

    fetchData();
    setVisibleExamples(4);
  }, [word.word, isOpen]);

  return (
    <div
      className={`transition-[max-height] duration-500 ease-in-out sm:hidden md:hidden ${
        isOpen ? "opacity-100" : "max-h-0 opacity-0"
      } overflow-hidden`}
    >
      {fullData ? (
        <div className="max-h-[400px] overflow-y-auto p-4 px-6 bg-[#027AFB] text-white space-y-4 rounded-b-lg">
 <div className="relative w-full">
   <div className="grid grid-cols-3 items-center w-full">
     {/* Left: Rank */}
     <div className="text-left">
       <h2 className="text-lg font-bold"><i>{word.rank}</i></h2>
     </div>
 
     {/* Center: Word */}
     <div className="text-center">
       <h2 className="text-2xl font-bold">{word.word}</h2>
     </div>
 
     {/* Right: TTS Button */}
     <div className="text-right">
       <GoogleTTSButton text={word.word} color={'text-white hover:bg-blue-400'} />
     </div>
   </div>
 </div>
          <p className="text-center text-gray-200 italic">
            {fullData?.part_of_speech}
            {fullData?.gender?.length ? ` · ${fullData.gender}` : ''}
            {fullData?.phonetic_spelling ? ` · [${fullData.phonetic_spelling}]` : ''}
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

          {/* Examples */}
          <div>
            <h3 className="text-lg font-semibold mb-1">Examples</h3>
            <ul className="space-y-2">
              {fullData.examples.slice(0, visibleExamples).map((ex, idx) => (
                          <li key={idx} className="text-white/90">
                            <div className="flex justify-between items-center">
                              <span>🇩🇪 {ex.sentence.replace(/\./g, '')}</span>
                              <GoogleTTSButton text={ex.sentence} color="text-white hover:bg-blue-400" />
                            </div>
                            <div className="text-white/70">🇬🇧 {ex.translation.replace(/\./g, '')}</div>
                          </li>
              ))}
            </ul>
            {visibleExamples < fullData.examples.length && (
              <button
                onClick={() => setVisibleExamples((prev) => prev + 4)}
                className="mt-2 text-sm text-blue-100 hover:text-white underline"
              >
                Load more examples
              </button>
            )}
          </div>

          {/* Related Words */}
          {fullData.connected_words.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-1">Related Words</h3>
              <div className="flex flex-wrap gap-2">
                {fullData.connected_words.map((w, index) => (
                  <span key={w + index} className="bg-white/10 px-3 py-1 rounded-full text-sm">
                    {w}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex justify-center items-center h-100">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent" />
        </div>
      )}
    </div>
  );
};

export const DropdownWordInfo = React.memo(InnerDropdownWordInfo, (prev, next) => {
  return (
    prev.word.word === next.word.word &&
    prev.isOpen === next.isOpen
  );
});
