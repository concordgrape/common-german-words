'use client';

import React, { createContext, useContext, useState } from 'react';
import { Word } from '../helpers/fetchBasicWordList';

interface WordFormContextProps {
  filteredWords: Word[];
  setFilteredWords: (words: Word[]) => void;
}

const WordFormContext = createContext<WordFormContextProps | undefined>(undefined);

export const WordFormProvider = ({ children }: { children: React.ReactNode }) => {
  const [filteredWords, setFilteredWords] = useState<Word[]>([]);

  return (
    <WordFormContext.Provider value={{ filteredWords, setFilteredWords }}>
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
