'use client';

import React, { createContext, useContext, useState } from 'react';
import { Word } from '../helpers/fetchBasicWordList';

interface WordFormContextProps {
  filteredWords: Word[];
  setFilteredWords: (words: Word[]) => void;
  submittedWords: Word[];
  setSubmittedWords: (words: Word[]) => void;
  allWords: Word[];
  setAllWords: (words: Word[]) => void;
}

const WordFormContext = createContext<WordFormContextProps | undefined>(undefined);

export const WordFormProvider = ({ children }: { children: React.ReactNode }) => {
  const [filteredWords, setFilteredWords] = useState<Word[]>([]);
  const [submittedWords, setSubmittedWords] = useState<Word[]>([]);
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
