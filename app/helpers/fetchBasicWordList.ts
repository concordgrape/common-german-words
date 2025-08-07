// lib/fetchBasicWords.ts

export interface Word {
    word: string;
    id: number;
    part_of_speech: string | null;
    frequency: number; 
    rank: number; 
    translation: string;
    gender: string;
    phonetic_spelling: string;
    examples: { sentence: string; translation: string }[];
}

export async function fetchBasicWords(language: string, password: string): Promise<Word[]> {
  try {
    const res = await fetch(`/api/basic-words?language=${language}&password=${password}`);

    if (!res.ok) {
      console.error("Failed to fetch basic words:", res.statusText);
      return [];
    }

    const data = await res.json();

    // Make sure we return exactly the `words` array
    console.log("Fetched basic words:", data);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching basic words:", error);
    return [];
  }
}


export async function fetchAllWords(language: string, password: string): Promise<Word[]> {
  try {
    const res = await fetch(`/api/all-words?language=${language}&password=${password}`);

    if (!res.ok) {
      console.error("Failed to fetch all words:", res.statusText);
      return [];
    }

    const data = await res.json();

    // Make sure we return exactly the `words` array
    console.log("Fetched all words:", data);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching all words:", error);
    return [];
  }
}

export async function fetchTopWords(language: string, partOfSpeech: string, count: number, password: string): Promise<Word[]> {
  try {
    const res = await fetch(`/api/filtered-words?language=${language}&part_of_speech=${partOfSpeech}&count=${count > 500 ? 500 : count}&password=${password}`);

    if (!res.ok) {
      console.error("Failed to fetch basic words:", res.statusText);
      return [];
    }

    const data = await res.json();

    // Make sure we return exactly the `words` array
    console.log("Fetched basic words:", data);
    return Array.isArray(data.words)
      ? data.words.sort((a: Word, b: Word) => b.frequency - a.frequency)
      : [];
  } catch (error) {
    console.error("Error fetching basic words:", error);
    return [];
  }
}