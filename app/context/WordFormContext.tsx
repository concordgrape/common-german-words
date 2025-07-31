'use client';

import React, { createContext, useContext, useState } from 'react';
import { Word } from '../helpers/fetchBasicWordList';
import { FillInTheBlankQuestion } from '../helpers/userWordLibrary';

export type SubmittedWord = Word | FillInTheBlankQuestion;

export function isWord(entry: SubmittedWord): entry is Word {
  return typeof (entry as Word).id === 'number' && typeof (entry as Word).word === 'string';
}

interface WordFormContextProps {
  filteredWords: Word[];
  setFilteredWords: (words: Word[]) => void;
  submittedWords: SubmittedWord[];
  setSubmittedWords: (words: SubmittedWord[]) => void;
  allWords: Word[];
  setAllWords: (words: Word[]) => void;
}

const WordFormContext = createContext<WordFormContextProps | undefined>(undefined);

export const WordFormProvider = ({ children }: { children: React.ReactNode }) => {
  const [filteredWords, setFilteredWords] = useState<Word[]>([]);
  const [submittedWords, setSubmittedWords] = useState<SubmittedWord[]>([]);
  const [allWords, setAllWords] = useState<Word[]>([]);

  return (
    <WordFormContext.Provider value={{ filteredWords, setFilteredWords, submittedWords, setSubmittedWords, allWords, setAllWords }}>
      {children}
    </WordFormContext.Provider>
  );
};

export const useWordForm = (): WordFormContextProps => {
  const context = useContext(WordFormContext);
  if (!context) {
    throw new Error('useWordForm must be used within a WordFormProvider');
  }
  return context;
};
