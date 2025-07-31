import { doc, setDoc, serverTimestamp, getDoc, DocumentData, collection, query, getDocs, limit, DocumentReference, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebaseClient';
import { useUser } from '../context/UserContext';
import { useRouter } from 'next/navigation';
import { Word } from './fetchBasicWordList';
import { shuffle } from './utils';

type WordStatusType = 'saved' | 'known';

type WordDataWithMeta = {
  id: string;
  data: DocumentData;
  timestamp: Timestamp;
};

export type FillInTheBlankQuestion = {
  sentence: string;
  sentence_translated: string;
  answer: string;
  hint?: string;
};

export function useToggleWordStatus() {
  const { user } = useUser();
  const router = useRouter();

  const ensureUser = () => {
    if (!user?.uid) {
      router.push('/signin');
      throw new Error('User not signed in');
    }
    return user.uid;
  };

  const toggleSavedStatus = async (word: string): Promise<void> => {
    const uid = ensureUser();
    if (!word) throw new Error('Missing word');

    const ref = doc(db, `users/${uid}/de/cards/saved/${word}`);
    const existing = await getDoc(ref);
    const wordRef = doc(db, `languages/german/words/${word}`);

    if (existing.exists()) {
      await deleteDoc(ref);
    } else {
      await setDoc(ref, {
        timestamp: serverTimestamp(),
        wordRef,
      });
    }
  };

  const toggleKnownStatus = async (word: string): Promise<void> => {
    const uid = ensureUser();
    if (!word) throw new Error('Missing word');

    const ref = doc(db, `users/${uid}/de/cards/known/${word}`);
    const existing = await getDoc(ref);
    const wordRef = doc(db, `languages/german/words/${word}`);

    if (existing.exists()) {
      await deleteDoc(ref);
    } else {
      await setDoc(ref, {
        timestamp: serverTimestamp(),
        wordRef,
      });
    }
  };

  return {
    toggleSavedStatus,
    toggleKnownStatus,
  };
}

/**
 * Fetch full word data from languages/german/words/{word}
 * @param word - Word to fetch data for
 * @returns Word data or null if not found
 */
export async function fetchWordData(word: string) {
  if (!word) {
    throw new Error('Word is required');
  }

  const wordRef = doc(db, `languages/german/words/${word}`);
  const wordSnap = await getDoc(wordRef);

  if (!wordSnap.exists()) {
    return null;
  }

  return wordSnap.data();
}



/**
 * Fetches word data for a user's saved or known words (parallel version), sorted by latest saved.
 * @param uid - User ID
 * @param type - 'saved' or 'known'
 * @param max - Maximum number of words to fetch
 * @returns Array of word data with metadata including timestamp, sorted by most recent
 */
export async function fetchWordStatusMetaData(
  uid: string,
  type: WordStatusType,
  max: number
): Promise<WordDataWithMeta[]> {
  if (!uid || (type !== 'saved' && type !== 'known')) {
    throw new Error('Invalid arguments');
  }

  const cardsColRef = collection(db, `users/${uid}/de/cards/${type}`);
  const q = query(cardsColRef, limit(max));
  const snap = await getDocs(q);

  const wordEntries: { ref: DocumentReference<DocumentData>, timestamp: Timestamp }[] = [];

  for (const docSnap of snap.docs) {
    const data = docSnap.data();
    if (data.wordRef && data.timestamp) {
      wordEntries.push({
        ref: data.wordRef as DocumentReference<DocumentData>,
        timestamp: data.timestamp,
      });
    }
  }

  const wordSnaps = await Promise.all(
    wordEntries.map(entry => getDoc(entry.ref))
  );

  console.log("wordSnaps: ", wordSnaps);

  const results: WordDataWithMeta[] = wordSnaps
    .map((snap, i) => {
      if (!snap.exists()) return null;
      return {
        id: snap.id,
        data: snap.data()!,
        timestamp: wordEntries[i].timestamp,
      };
    })
    .filter((item): item is WordDataWithMeta => item !== null);

  // Sort by timestamp (newest first)
  results.sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis());

  return results;
}

export async function fetchWordStatusData(
  uid: string,
  type: WordStatusType,
  max: number
): Promise<Word[]> {
  if (!uid || (type !== 'saved' && type !== 'known')) {
    throw new Error('Invalid arguments');
  }

  const cardsColRef = collection(db, `users/${uid}/de/cards/${type}`);
  const q = query(cardsColRef, limit(max));
  const snap = await getDocs(q);

  const wordRefs: DocumentReference<DocumentData>[] = [];

  for (const docSnap of snap.docs) {
    const data = docSnap.data();
    if (data.wordRef) {
      wordRefs.push(data.wordRef as DocumentReference<DocumentData>);
    }
  }

  const wordSnaps = await Promise.all(wordRefs.map(ref => getDoc(ref)));

  const results: Word[] = wordSnaps
    .map(snap => {
      if (!snap.exists()) return null;
      const data = snap.data() as Omit<Word, 'word'>;
      return {
        word: snap.id, 
        ...data,
      };
    })
    .filter((data): data is Word => data !== null);

  return results;
}


export function formatFillInTheBlankQuestions(words: Word[]): FillInTheBlankQuestion[] {
  const questions: FillInTheBlankQuestion[] = [];

  for (const word of words) {
    if (!word.examples || word.examples.length === 0) continue;

    const shuffledExamples = shuffle([...word.examples]);
    let chosen: string | null = null;
    let chosen_translated: string | null = null;

    for (const ex of shuffledExamples) {
      const regex = new RegExp(`\\b${word.word}\\b`, 'i'); // whole word match
      if (regex.test(ex.sentence)) {
        chosen = ex.sentence.replace(regex, '_____');
        chosen_translated = ex.translation;
        break;
      }
    }

    if (!chosen) continue; // skip if no valid example

    questions.push({
      sentence: chosen,
      answer: word.word,
      hint: word.translation,
      sentence_translated: chosen_translated ? chosen_translated : ""
    });
  }

  return questions;
}