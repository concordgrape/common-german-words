// lib/fetchBasicWords.ts

export interface Word {
    word: string;
    id: number;
    part_of_speech: string | null;
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
    console.log("Fetched basic words:", data.words);
    return Array.isArray(data.words) ? data.words : [];
  } catch (error) {
    console.error("Error fetching basic words:", error);
    return [];
  }
}
