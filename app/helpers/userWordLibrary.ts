// app/helpers/userWordLibrary.ts
//
// The learner's saved/known words. Backed by localStorage (see localWordStore),
// so it is per-device and needs no account.

import { Word } from "./fetchBasicWordList";
import { shuffle } from "./utils";
import {
  WordStatusType,
  getWordStatusMap,
  setWordStatus,
  toggleWordStatus,
} from "./localWordStore";

export type { WordStatusType };

export type WordWithMeta = {
  id: string;
  timestamp: number;
};

export interface SavedWordMetadata {
  word: string;
  timestamp: number;
}

export type FillInTheBlankQuestion = {
  sentence: string;
  sentence_translated: string;
  answer: string;
  hint?: string;
};

export function useToggleWordStatus() {
  const toggleSavedStatus = async (word: string): Promise<void> => {
    toggleWordStatus(word, "saved");
  };

  const toggleKnownStatus = async (word: string): Promise<void> => {
    toggleWordStatus(word, "known");
  };

  return { toggleSavedStatus, toggleKnownStatus };
}

export function useWordStatusSetters() {
  const setSaved = async (word: string, enabled: boolean) => {
    setWordStatus(word, "saved", enabled);
  };

  const setKnown = async (word: string, enabled: boolean) => {
    setWordStatus(word, "known", enabled);
  };

  return { setSaved, setKnown };
}

/** Saved/known words with the time they were added, newest first. */
export function fetchWordStatusMetaData(
  type: WordStatusType,
  max = Infinity,
): WordWithMeta[] {
  return Object.entries(getWordStatusMap(type))
    .map(([id, timestamp]) => ({ id, timestamp }))
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, max);
}

/** The same list, resolved against `allWords` into full word records. */
export function fetchWordStatusData(
  allWords: Word[],
  type: WordStatusType,
  max = Infinity,
): Word[] {
  const byWord = new Map(allWords.map((w) => [w.word.toLowerCase(), w]));

  return fetchWordStatusMetaData(type, max)
    .map((entry) => byWord.get(entry.id.toLowerCase()))
    .filter((w): w is Word => !!w);
}

export function fetchSavedWordMetadata(max = Infinity): SavedWordMetadata[] {
  return fetchWordStatusMetaData("saved", max).map(({ id, timestamp }) => ({
    word: id,
    timestamp,
  }));
}

export function fetchKnownWordMetadata(max = Infinity): SavedWordMetadata[] {
  return fetchWordStatusMetaData("known", max).map(({ id, timestamp }) => ({
    word: id,
    timestamp,
  }));
}

export function formatFillInTheBlankQuestions(
  words: Word[],
): FillInTheBlankQuestion[] {
  const questions: FillInTheBlankQuestion[] = [];

  for (const word of words) {
    if (!word.examples || word.examples.length === 0) continue;

    const shuffledExamples = shuffle([...word.examples]);
    let chosen: string | null = null;
    let chosen_translated: string | null = null;

    for (const ex of shuffledExamples) {
      const regex = new RegExp(`\\b${word.word}\\b`, "i"); // whole word match
      if (regex.test(ex.sentence)) {
        chosen = ex.sentence.replace(regex, "_____");
        chosen_translated = ex.translation;
        break;
      }
    }

    if (!chosen) continue; // skip if no valid example

    questions.push({
      sentence: chosen,
      answer: word.word,
      hint: word.translation,
      sentence_translated: chosen_translated ? chosen_translated : "",
    });
  }

  return questions;
}
