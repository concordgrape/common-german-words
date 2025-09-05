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

export async function fetchBasicWords(language: string): Promise<Word[]> {
  try {
    const res = await fetch(`/api/basic-words?language=${language}`);

    if (!res.ok) {
      console.error("Failed to fetch basic words:", res.statusText);
      return [];
    }

    const data = await res.json();

    // Make sure we return exactly the `words` array
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching basic words:", error);
    return [];
  }
}


export async function fetchAllWords(language: string): Promise<Word[]> {
  try {
    const res = await fetch(`/api/all-words?language=${language}`);

    if (!res.ok) {
      console.error("Failed to fetch all words:", res.statusText);
      return [];
    }

    const data = await res.json();

    // Make sure we return exactly the `words` array
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
): Promise<Word[]> {
  try {
    // Base URL
    let url = `/api/filtered-words?language=${language}&count=${count > 500 ? 500 : count}`;

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
  partOfSpeech: string | null,
  count: number,
  rank: number | null = null,
  priority: "common-words" | "random" = "random",
  savedWords: string[] = [] // <-- NEW PARAM
): Promise<Word[]> {
  try {
    const params = new URLSearchParams({
      language,
      count: String(Math.min(Math.max(0, count), 1000)), // 0..1000
      priority,
    });

    if (partOfSpeech && partOfSpeech.trim() !== "") {
      params.set("part_of_speech", partOfSpeech);
    }

    if (rank !== null && !Number.isNaN(rank)) {
      params.set("rank", String(rank));
    }

    if (savedWords.length > 0) {
      // Shuffle and take up to 100 saved words
      const shuffled = savedWords
        .map(word => ({ word, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(entry => entry.word)
        .slice(0, 100);

      params.set("saved", shuffled.join(","));
    }

    const url = `/api/random-words?${params.toString()}`;
    const res = await fetch(url);

    if (!res.ok) {
      console.error("Failed to fetch words:", res.status, res.statusText);
      return [];
    }

    const data = await res.json();
    return Array.isArray(data.words) ? (data.words as Word[]) : [];
  } catch (error) {
    console.error("Error fetching words:", error);
    return [];
  }
}
