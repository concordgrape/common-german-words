// app/helpers/fetchBasicWordList.ts
//
// Every word on the site comes from the static JSON lists in /public/words.
// There is no backend: these helpers just load, filter and sort those files.

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

const cache = new Map<string, Promise<Word[]>>();

/** Load one file from /public/words, normalising the optional fields. */
function loadWordFile(file: string): Promise<Word[]> {
  const cached = cache.get(file);
  if (cached) return cached;

  const pending = (async () => {
    try {
      const res = await fetch(`/words/${file}.json`);
      if (!res.ok) return [];

      const data = await res.json();
      if (!Array.isArray(data.words)) return [];

      return (data.words as Partial<Word>[])
        .map((w, index) => ({
          word: w.word ?? "",
          id: w.id ?? index,
          part_of_speech: w.part_of_speech ?? null,
          frequency: w.frequency ?? 0,
          rank: w.rank ?? 0,
          translation: w.translation ?? "",
          gender: w.gender ?? "",
          phonetic_spelling: w.phonetic_spelling ?? "",
          examples: w.examples ?? [],
        }))
        .filter((w) => w.word !== "")
        .sort((a, b) => b.frequency - a.frequency);
    } catch (error) {
      console.error(`Error loading /words/${file}.json:`, error);
      return [];
    }
  })();

  cache.set(file, pending);
  return pending;
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

export async function fetchBasicWords(
  language: string,
  onPartial?: (words: Word[]) => void,
): Promise<Word[]> {
  const words = await loadWordFile(language);
  onPartial?.(words);
  return words;
}

export async function fetchAllWords(language: string): Promise<Word[]> {
  return loadWordFile(language);
}

export async function fetchTopWords(
  language: string,
  partOfSpeech: string | null,
  count: number,
  onPartial?: (words: Word[]) => void,
): Promise<Word[]> {
  const hasPOS = !!(partOfSpeech && partOfSpeech.trim() !== "");
  const file = staticFileFor(language, partOfSpeech);

  let words = await loadWordFile(file);

  // The generic list is mixed, so filter it down when a POS was requested
  if (hasPOS && file === language) {
    words = words.filter((w) => w.part_of_speech === partOfSpeech);
  }

  const top = words.slice(0, count);
  onPartial?.(top);
  return top;
}

export async function fetchRandomWords(
  language: string,
  partOfSpeech: string | null,
  count: number,
  rank: number | null = null,
  priority: "common-words" | "random" = "random",
  savedWords: string[] = [],
): Promise<Word[]> {
  const all = await loadWordFile(language);

  const normalizedPOS = (partOfSpeech ?? "").trim().toLowerCase();
  const shouldFilterPOS =
    normalizedPOS !== "" && !["unknown", "any", "all"].includes(normalizedPOS);

  let pool = all;
  if (shouldFilterPOS) {
    pool = pool.filter(
      (w) => (w.part_of_speech ?? "").toLowerCase() === normalizedPOS,
    );
  }

  const hasRank = rank !== null && !Number.isNaN(rank) && rank !== 0;
  if (hasRank) {
    pool = pool.filter((w) => w.rank === rank);
  } else if (priority === "common-words" && !shouldFilterPOS) {
    // "Common words" means the two easiest CEFR buckets, when they exist
    const common = pool.filter((w) => w.rank === 1 || w.rank === 2);
    if (common.length > 0) pool = common;
  }

  const amount = Math.min(Math.max(count, 0), 1000);
  const picked = shuffleWords(pool).slice(0, amount);

  // Saved words the learner explicitly asked to include
  const savedSet = new Set(savedWords);
  const saved = all.filter((w) => savedSet.has(w.word));

  const byWord = new Map<string, Word>();
  for (const w of [...picked, ...saved]) byWord.set(w.word, w);
  return Array.from(byWord.values());
}

/** Full record for a single word, used by the detail panels. */
export async function fetchWordDetail(
  language: string,
  word: string,
): Promise<Word | null> {
  if (!word) return null;
  const all = await loadWordFile(language);
  const lower = word.toLowerCase();
  return all.find((w) => w.word.toLowerCase() === lower) ?? null;
}

function shuffleWords(words: Word[]): Word[] {
  const copy = [...words];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
