"use client";

import React, { useEffect, useState, useRef } from "react";
import { Word } from "../helpers/fetchBasicWordList";
import GoogleTTSButton from "./GoogleTTSButton/GoogleTTSButton";
import Link from "next/link";

interface WordInfoProps {
  selectedWord?: Word | null;
}

export interface FullWordData {
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
          console.log("fetching words");
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
      <div className="w-full bg-[#027AFB] rounded-sm shadow-lg p-6 flex flex-col max-h-[80vh] overflow-y-auto">
        {fullData ? (
          <div className="text-white space-y-4">
            <div className="relative w-full">
              <div className="grid grid-cols-3 items-center w-full">
                {/* Left: Rank */}
                <div className="text-left">
                  <h2 className="text-lg font-bold">
                    <i>{selectedWord.rank}</i>
                  </h2>
                </div>

                {/* Center: Word */}
                <div className="text-center">
                  {/*isSaved && <p>Saved</p>*/}

                  <h2 className="text-2xl font-bold">{selectedWord.word}</h2>
                </div>

                {/* Right: TTS Button */}
                <div className="text-right">
                  <GoogleTTSButton
                    text={selectedWord.word}
                    color={"text-white hover:bg-blue-400"}
                  />
                </div>
              </div>
            </div>
            <p className="text-center text-gray-200 italic">
              {fullData.part_of_speech} ·{" "}
              {fullData.gender ? `${fullData.gender} · ` : ""} [
              {fullData.phonetic_spelling}]
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
                    <div className="flex justify-between items-center">
                      <span className="flex flex-wrap gap-1">
                        🇩🇪
                        {ex.sentence
                          .replace(/[.,!?;:]/g, "")
                          .split(" ")
                          .map((word, i) => (
                            <Link key={i} href={`/browse?word=${word}`}>
                              <span
                                key={i}
                                className="hover:bg-blue-300 cursor-pointer rounded"
                              >
                                {word}
                              </span>
                            </Link>
                          ))}
                      </span>
                      <GoogleTTSButton
                        text={ex.sentence}
                        color="text-white hover:bg-blue-400"
                      />
                    </div>
                    <div className="text-white/70">
                      🇬🇧 {ex.translation.replace(/\./g, "")}
                    </div>
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
                  {fullData.connected_words.map((w, index) => (
                    <Link key={w + index} href={`/browse?word=${w}`}>
                      <span
                        key={w + index}
                        className="bg-white/10 px-3 py-1 rounded-full text-sm hover:bg-blue-400"
                      >
                        {w}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-white">
            No details available for &quot;{selectedWord.word}&quot;.
          </p>
        )}
      </div>
    </div>
  );
};
