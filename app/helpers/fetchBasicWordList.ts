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

export async function fetchTopWords(
  language: string,
  partOfSpeech: string | null, // now optional
  count: number,
  password: string
): Promise<Word[]> {
  try {
    // Base URL
    let url = `/api/filtered-words?language=${language}&count=${count > 500 ? 500 : count}&password=${password}`;

    // Only add part_of_speech if provided
    if (partOfSpeech && partOfSpeech.trim() !== "") {
      url += `&part_of_speech=${encodeURIComponent(partOfSpeech)}`;
    }

    const res = await fetch(url);

    if (!res.ok) {
      console.error("Failed to fetch words:", res.statusText);
      return [];
    }

    const data = await res.json();

    // Ensure we return exactly the `words` array
    console.log("Fetched words:", data);
    return Array.isArray(data.words)
      ? data.words.sort((a: Word, b: Word) => b.frequency - a.frequency)
      : [];
  } catch (error) {
    console.error("Error fetching words:", error);
    return [];
  }
}


export async function fetchRandomWords(
  language: string,
  partOfSpeech: string | null, // optional
  count: number,
  password: string,
  rank: number | null = null,  // NEW optional param added at the end for backward-compat
): Promise<Word[]> {
  try {
    const params = new URLSearchParams({
      language,
      count: String(Math.min(Math.max(1, count || 0), 1000)), // 1..1000
      password,
    });

    if (partOfSpeech && partOfSpeech.trim() !== "") {
      params.set("part_of_speech", partOfSpeech);
    }
    if (rank !== null && !Number.isNaN(rank)) {
      params.set("rank", String(rank));
    }

    const url = `/api/random-words?${params.toString()}`;
    const res = await fetch(url);

    if (!res.ok) {
      console.error("Failed to fetch words:", res.status, res.statusText);
      return [];
    }

    const data = await res.json();

    // Do NOT sort here—preserve randomness from the API
    return Array.isArray(data.words) ? (data.words as Word[]) : [];
  } catch (error) {
    console.error("Error fetching words:", error);
    return [];
  }
}
