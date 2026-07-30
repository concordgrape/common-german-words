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

/**
 * Load the static word list shipped in /public/words. These files hold the most
 * common words for the language, so page 1 can render before the API responds.
 */
async function fetchStaticWords(file: string): Promise<Word[]> {
  try {
    const res = await fetch(`/words/${file}.json`);
    if (!res.ok) return [];

    const data = await res.json();
    if (!Array.isArray(data.words) || data.words.length === 0) return [];

    return [...data.words].sort(
      (a: Word, b: Word) => b.frequency - a.frequency,
    );
  } catch {
    return [];
  }
}

export async function fetchBasicWords(
  language: string,
  onPartial?: (words: Word[]) => void,
): Promise<Word[]> {
  // Static JSON first — populates page 1 instantly
  let partial: Word[] = [];
  if (onPartial) {
    partial = await fetchStaticWords(language);
    if (partial.length > 0) onPartial(partial);
  }

  try {
    const res = await fetch(`/api/basic-words?language=${language}`);

    if (!res.ok) {
      console.error("Failed to fetch basic words:", res.statusText);
      return partial;
    }

    const data = await res.json();

    // Make sure we return exactly the `words` array
    return Array.isArray(data) && data.length > 0 ? data : partial;
  } catch (error) {
    console.error("Error fetching basic words:", error);
    return partial;
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

/** Static file in /public/words that best matches a part of speech, if any. */
function staticFileFor(language: string, partOfSpeech: string | null): string {
  switch (partOfSpeech) {
    case "Noun":
      return `${language}_nouns`;
    case "Verb":
      return `${language}_verbs`;
    default:
      return language;
  }
}

export async function fetchTopWords(
  language: string,
  partOfSpeech: string | null, // now optional
  count: number,
  onPartial?: (words: Word[]) => void,
): Promise<Word[]> {
  const hasPOS = !!(partOfSpeech && partOfSpeech.trim() !== "");

  // Static JSON first — populates page 1 instantly
  let partial: Word[] = [];
  if (onPartial) {
    const file = staticFileFor(language, partOfSpeech);
    let staticWords = await fetchStaticWords(file);

    // The generic list is mixed, so filter it down when a POS was requested
    if (hasPOS && file === language) {
      staticWords = staticWords.filter(
        (w) => w.part_of_speech === partOfSpeech,
      );
    }

    if (staticWords.length > 0) {
      partial = staticWords.slice(0, Math.min(count, 100));
      onPartial(partial);
    }
  }

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
      return partial;
    }

    const data = await res.json();

    // Ensure we return exactly the `words` array
    return Array.isArray(data.words) && data.words.length > 0
      ? data.words.sort((a: Word, b: Word) => b.frequency - a.frequency)
      : partial;
  } catch (error) {
    console.error("Error fetching words:", error);
    return partial;
  }
}

export async function fetchRandomWords(
  language: string,
  partOfSpeech: string | null,
  count: number,
  rank: number | null = null,
  priority: "common-words" | "random" = "random",
  savedWords: string[] = [], // <-- NEW PARAM
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
        .map((word) => ({ word, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map((entry) => entry.word)
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
