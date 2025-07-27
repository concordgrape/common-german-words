'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { useWordForm } from '../context/WordFormContext';
import { fetchWordStatusData } from '../helpers/userWordLibrary';
import type { Word } from '../helpers/fetchBasicWordList';
import { shuffle } from '../helpers/utils';
import { FaUndo } from 'react-icons/fa';
import { useToast } from '../hooks/useToast';

export const LearnFormConfirm = () => {
  const { filteredWords, submittedWords, setSubmittedWords, allWords } = useWordForm();
  const { user } = useUser();

  // savedWords is just a set of word IDs (as strings) that the user has saved
  const [savedWords, setSavedWords] = useState<Set<string>>(new Set());

  // store the actual Word objects we just added last,
  // so we can undo exactly those
  const [lastAdded, setLastAdded] = useState<Word[]>([]);
  const toast = useToast();

  useEffect(() => {
    const fetchStatusData = async () => {
      if (!user?.uid) return;
      try {
        const [saved] = await Promise.all([
          fetchWordStatusData(user.uid, 'saved', 5000),
        ]);
        setSavedWords(new Set(saved.map((doc) => doc.id)));
      } catch (err) {
        console.error('❌ Error preloading word status:', err);
      }
    };
    fetchStatusData();
  }, [user?.uid]);

  useEffect(() => {
  console.log('📝 LearnFormConfirm sees submittedWords:', submittedWords);
}, [submittedWords]);

const handleAddAll = () => {
  if (!user) {
    toast({ title: 'Not signed in', subtitle: 'You must sign in to save words', variant: 'error' });
    return;
  }

  // Only saved & not already submitted
  const toAdd = allWords.filter(w =>
    savedWords.has(w.word) &&
    !submittedWords.some(sw => sw.word === w.word)
  );

  if (toAdd.length === 0) {
    toast({ title: 'No More Saved Words', subtitle: 'You already added all available saved words', variant: 'error' });
    return;
  }

  setLastAdded(toAdd);
  setSubmittedWords([...submittedWords, ...toAdd]);
};

const handleAdd = (amount: number) => {
  if (!user) {
    toast({ title: 'Not signed in', subtitle: 'You must sign in to save words', variant: 'error' });
    return;
  }

  // Only saved & not already submitted
  const pool = filteredWords.filter(w =>
    savedWords.has(w.word) &&
    !submittedWords.some(sw => sw.word === w.word)
  );

  if (pool.length === 0) {
    toast({ title: 'No More Saved Words', subtitle: 'You already added all available saved words', variant: 'error' });
    return;
  }

  // Random up to `amount`
  const toAdd = shuffle(pool).slice(0, amount);

  setLastAdded(toAdd);
  setSubmittedWords([...submittedWords, ...toAdd]);
};


  const handleUndo = () => {
    if (lastAdded.length === 0) {
      return
    };
    // build a new array without the lastAdded items
    const reverted = submittedWords.filter(
      (w) => !lastAdded.some((lw) => lw.id === w.id)
    );
    setSubmittedWords(reverted);
    setLastAdded([]);
  };

  return (
    <div className="max-w-80 lg:max-w-full lg:w-full">
      <div className="w-full bg-[#027AFB] rounded-sm shadow-lg p-6 flex flex-col max-h-[80vh] overflow-y-auto">
        <span className="mb-2 text-white font-bold">
          <span className="font-semibold text-white flex">{allWords.length == 0 ? 
            <div className={`flex pt-1 pr-2`}>
              <div className="animate-spin h-4 w-4 rounded-full border-4 border-white border-t-transparent" />
            </div>  
            :
            submittedWords.length
            } words selected
          </span>
        </span>

        {/* your existing +5 / +10 / +20 quick buttons, unchanged */}
        <p className='text-xs text-white mt-5'>Bulk Add Saved Words</p>
                <div className="flex flex-col">
          <button
            onClick={lastAdded.length > 0 ? handleUndo : handleAddAll}
            className="text-sm w-50 text-center text-white font-mono mt-5 py-2 px-2 rounded-lg bg-blue-600 hover:bg-blue-700 shadow-sm"
          >
            {lastAdded.length > 0 ? <span>Undo Add All Saved Words ({savedWords.size})</span> : <span>Add All Saved Words ({savedWords.size})</span>}
          </button>
        </div>
        <div className="flex mt-4">
          <button onClick={() => handleAdd(5)} data-tip="Add 5 saved words" className={`tooltip cursor-pointer ml-3 py-2 w-10 bg-blue-500 rounded-lg text-white hover:text-gray-300`}>
            <u>+5</u>
          </button>
          <button onClick={() => handleAdd(10)} data-tip="Add 10 saved words" className={`tooltip cursor-pointer ml-3 py-2 w-10 bg-blue-500 rounded-lg text-white hover:text-gray-300`}>
            <u>+10</u>
          </button>
          <button onClick={() => handleAdd(20)} data-tip="Add 20 saved words" className={`tooltip cursor-pointer ml-3 py-2 w-10 bg-blue-500 rounded-lg text-white hover:text-gray-300`}>
            <u>+20</u>
          </button>
          <button onClick={handleUndo} className={`ml-3 w-10 items-center mx-auto rounded-lg ${lastAdded.length > 0 ? 'text-white hover:text-gray-300 cursor-pointer' : 'text-blue-300'}`}>
            <FaUndo className='text-left' />
          </button>
        </div>
      </div>
    </div>
  );
};
