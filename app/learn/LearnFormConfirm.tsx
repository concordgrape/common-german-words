"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { SubmittedWord, useWordForm } from "../context/WordFormContext";
import { fetchWordStatusData } from "../helpers/userWordLibrary";
import { shuffle } from "../helpers/utils";
import { FaUndo } from "react-icons/fa";
import { useToast } from "../hooks/useToast";
import { Word } from "../helpers/fetchBasicWordList";
import { isWord } from "../context/WordFormContext";

interface LearnFormConfirmProps {
  wordCount: number;
}

export const LearnFormConfirm = ({ wordCount }: LearnFormConfirmProps) => {
  const { submittedWords, allWords, setSavedWords, savedWords } = useWordForm();
  const { user } = useUser();

  // savedWordsObject is just a set of word IDs (as strings) that the user has saved
  const [savedWordsObject, setSavedWordsObjects] = useState<Word[]>([]);

  // store the actual Word objects we just added last,
  // so we can undo exactly those
  const [lastAdded, setLastAdded] = useState<SubmittedWord[]>([]);
  const toast = useToast();

  useEffect(() => {
    const fetchStatusData = async () => {
      if (!user?.uid) return;
      try {
        const saved = await fetchWordStatusData(user.uid, "saved", 5000);

        setSavedWordsObjects(saved);
        console.log("fetched saved words: ", saved);
      } catch (err) {
        console.error("❌ Error preloading word status:", err);
      }
    };
    fetchStatusData();
  }, [user?.uid]);

  useEffect(() => {
    console.log("📝 LearnFormConfirm sees submittedWords:", submittedWords);
  }, [submittedWords]);

  const handleAddAll = () => {
    if (!user) {
      toast({
        title: "Not signed in",
        subtitle: "You must sign in to save words",
        variant: "error",
      });
      return;
    }

    // Filter savedWordsObject to only those not already submitted
    const available = savedWordsObject.filter(
      (word) =>
        !submittedWords.some(
          (sw) => isWord(sw) && sw.word === word.word
        )
    );
    const words = available.map(obj => obj.word);

    console.log("available: ", words)

    if (words.length === 0) {
      toast({
        title: "No More Saved Words",
        subtitle: "You already added all available saved words",
        variant: "error",
      });
      return;
    }

    setSavedWords(words);
  };

const handleAdd = (amount: number) => {
  if (!user) {
    toast({ title: "Not signed in", subtitle: "You must sign in to save words", variant: "error" });
    return;
  }

  if (savedWordsObject.length === 0) {
    toast({ title: "No More Saved Words", subtitle: "You already added all available saved words", variant: "error" });
    return;
  }

  // Exclude saved words already submitted
  const available = savedWordsObject.filter(
    (word) => !submittedWords.some((sw) => isWord(sw) && sw.word === word.word)
  );

  if (available.length === 0) {
    toast({ title: "No More Saved Words", subtitle: "You already added all available saved words", variant: "error" });
    return;
  }

  const words = available.map((obj) => obj.word);
  const shuffledWords = shuffle(words, amount ?? available.length);

  // Build a NEW array without duplicates (no functional updater)
  const existing = new Set(savedWords);
  const merged: string[] = [...savedWords];

  for (const w of shuffledWords) {
    if (!existing.has(w)) {
      merged.push(w);
      existing.add(w);
    }
  }

  setSavedWords(merged); // OK: this is a string[]
};



const handleUndo = () => {
    if (savedWords.length === 0) return;

    setSavedWords([]);
    setLastAdded([]);
  };


  return (
    <div className="max-w-80 lg:max-w-full lg:w-full">
      <div
        className={`${
          allWords.length == 0 ? "skeleton opacity-20 fill-[#027AFB]" : ""
        } w-full bg-[#027AFB] rounded-sm shadow-lg p-6 flex flex-col max-h-[80vh] overflow-y-auto`}
      >
        <span className="mb-2 text-white font-bold">
          <span className="font-semibold text-white flex">
            {allWords.length == 0 ? (
              <div className={`flex pt-1 pr-2`}>
                <div className="animate-spin h-4 w-4 rounded-full border-4 border-white border-t-transparent" />
              </div>
            ) : (
              wordCount + savedWords.length
            )}{" "}
            words selected
          </span>
        </span>

        {/* your existing +5 / +10 / +20 quick buttons, unchanged */}
        <p className="text-xs text-white mt-5">Bulk Add Saved Words</p>
        <div className="flex flex-col">
          <button
            onClick={savedWords.length > 0 ? handleUndo : handleAddAll}
            className="text-sm w-50 text-center text-white font-mono mt-5 py-2 px-2 rounded-lg bg-blue-600 hover:bg-blue-700 shadow-sm"
          >
            {(lastAdded.length === savedWordsObject.length) && savedWordsObject.length != 0 ? (
              <span>Undo Add All Saved Words ({savedWordsObject.length})</span>
            ) : (
              <span>Add All Saved Words ({savedWordsObject.length})</span>
            )}
          </button>
        </div>
        <div className="flex mt-4">
          <button
            onClick={() => handleAdd(5)}
            data-tip="Add 5 saved words"
            className={`tooltip cursor-pointer ml-3 py-2 w-10 bg-blue-500 rounded-lg text-white hover:text-gray-300`}
          >
            <u>+5</u>
          </button>
          <button
            onClick={() => handleAdd(10)}
            data-tip="Add 10 saved words"
            className={`tooltip cursor-pointer ml-3 py-2 w-10 bg-blue-500 rounded-lg text-white hover:text-gray-300`}
          >
            <u>+10</u>
          </button>
          <button
            onClick={() => handleAdd(20)}
            data-tip="Add 20 saved words"
            className={`tooltip cursor-pointer ml-3 py-2 w-10 bg-blue-500 rounded-lg text-white hover:text-gray-300`}
          >
            <u>+20</u>
          </button>
          <button
            onClick={handleUndo}
            className={`ml-3 w-10 items-center mx-auto rounded-lg ${
              savedWords.length > 0
                ? "text-white hover:text-gray-300 cursor-pointer"
                : "text-blue-300"
            }`}
          >
            <FaUndo className="text-left" />
          </button>
        </div>
      </div>
    </div>
  );
};
