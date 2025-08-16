"use client";

import React, { Suspense, useEffect, useState } from 'react';
import { LearnForm } from './LearnForm';
import { LearnFormConfirm } from './LearnFormConfirm';
import { useWordForm } from '../context/WordFormContext';
import { fetchAllWords, fetchRandomWords } from '../helpers/fetchBasicWordList';
import { useToast } from '../hooks/useToast';
import Link from 'next/link';

export type Mode = 'flashcards' | 'quiz' | 'fill';

const LearnWordPage: React.FC = () => {
  const { setFilteredWords, setAllWords, allWords, submittedWords } = useWordForm();
  const [mode, setMode] = useState<Mode>('flashcards');
  const [wordType, setWordType] = useState<string>('All');
  const [priority, setPriority] = useState<"common-words" | "random">(
    "common-words"
  );
  const [rank, setRank] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

useEffect(() => {
    let active = true; // prevent state update if unmounted
    setLoading(true);
    const start = Date.now();


    //  TODO: ADD PRIORITY TO THE API CALL
    fetchRandomWords(
      "german",
      wordType,
      1000,
      process.env.NEXT_PUBLIC_API_PASSWORD || "",
      rank === 0 ? null : rank
    )
      .then(words => {
        if (active) setAllWords(words);
      })
      .catch(err => {
        console.error("Error fetching words:", err);
        toast({ title: "Error", subtitle: "Failed to fetch words", variant: "error" });
      })
      .finally(() => {
        const elapsed = Date.now() - start;
        const remaining = 500 - elapsed; // ensure at least 500ms
        if (remaining > 0) {
          setTimeout(() => {
            if (active) setLoading(false);
          }, remaining);
        } else {
          if (active) setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [mode, wordType, rank, setAllWords, toast]);


  useEffect(() => {
      console.log("wordType: ", wordType)
  }, [wordType]);

  useEffect(() => {
    console.log("loading ", loading)
  }, [loading])

  return (
      <div className="min-h-screen w-full sm:top-15 md:top-15 pt-15 sm:p-4 md:p-4 text-black grid grid-cols-1 sm:grid-cols-[2fr_1fr] md:grid-cols-[2fr_1fr] gap-0 max-w-7xl mx-auto relative z-0">
      {/* WordTable (left column) */}
      <div className="z-10">
        <LearnForm priority={priority} setPriority={setPriority} rank={rank} setRank={setRank} wordType={wordType} setWordType={setWordType} setMode={setMode} mode={mode} loading={loading} />
      </div>

      {/* WordInfo (right column) */}
      <div className="flex mt-5 sm:mt-0 md:mt-0 lg:mt-0 sticky top-25 self-start z-20 flex-col items-center w-full">
        <LearnFormConfirm mode={mode} />
        {(allWords.length == 0 || submittedWords.length == 0) ?
          <button onClick={() => {
            toast({ title: 'No Words Selected', subtitle: `You cannot start with zero words selected`, variant: 'error' });
          }} className={`${(loading || allWords.length == 0) ? 'skeleton opacity-20 fill-[#027AFB]' : ''} bg-blue-500 text-white font-bold font-mono p-4 rounded-2xl mt-5 cursor-pointer hover:shadow-lg`}>
            &gt; Start &lt;
            <span className='block text-xs mt-1'><i>{mode}</i></span>
          </button>
        :
        <Link href="/learn/cards">
          <button className={`${(loading || allWords.length == 0) ? 'skeleton opacity-20 fill-[#027AFB]' : ''} bg-blue-500 text-white font-bold font-mono p-4 rounded-2xl mt-5 cursor-pointer hover:shadow-lg`}>
            &gt; Start &lt;
            <span className='block text-xs mt-1'><i>{mode}</i></span>
          </button>
        </Link>
        }
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
