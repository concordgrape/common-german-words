import { doc, setDoc, serverTimestamp, getDoc, DocumentData, collection, query, getDocs, limit, DocumentReference, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebaseClient';
import { useUser } from '../context/UserContext';
import { useRouter } from 'next/navigation';
import { Word } from './fetchBasicWordList';
import { shuffle } from './utils';
import dayjs from "dayjs";
import { kCOUNTRY_LANG_CODE, kLANG_NAME } from '../lib/constants';

type WordStatusType = 'saved' | 'known';

type WordDataWithMeta = {
  id: string;
  data: DocumentData;
  timestamp: Timestamp;
};

export interface SavedWordMetadata {
  word: string;
  timestamp: Timestamp;
}

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

    const ref = doc(db, `users/${uid}/${kCOUNTRY_LANG_CODE}/cards/saved/${word}`);
    const existing = await getDoc(ref);
    const wordRef = doc(db, `languages/${kLANG_NAME}/words/${word}`);

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

    const ref = doc(db, `users/${uid}/${kCOUNTRY_LANG_CODE}/cards/known/${word}`);
    const existing = await getDoc(ref);
    const wordRef = doc(db, `languages/${kLANG_NAME}/words/${word}`);

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
 * Fetch full word data from languages/${kLANG_NAME}/words/{word}
 * @param word - Word to fetch data for
 * @returns Word data or null if not found
 */
export async function fetchWordData(word: string) {
  if (!word) {
    throw new Error('Word is required');
  }

  const wordRef = doc(db, `languages/${kLANG_NAME}/words/${word}`);
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

  const cardsColRef = collection(db, `users/${uid}/${kCOUNTRY_LANG_CODE}/cards/${type}`);
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

  const cardsColRef = collection(db, `users/${uid}/${kCOUNTRY_LANG_CODE}/cards/${type}`);
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
      sentence: chosen,
      answer: word.word,
      hint: word.translation,
      sentence_translated: chosen_translated ? chosen_translated : ""
    })

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


export async function fetchSavedWordMetadata(
  uid: string,
  max: number
): Promise<SavedWordMetadata[]> {
  if (!uid) {
    throw new Error('Invalid UID');
  }

  const cardsColRef = collection(db, `users/${uid}/${kCOUNTRY_LANG_CODE}/cards/saved`);
  const snap = await getDocs(cardsColRef);

  const metadata: SavedWordMetadata[] = [];

  for (const docSnap of snap.docs) {
    const data = docSnap.data();
    if (data.timestamp) {
      metadata.push({
        word: docSnap.id,
        timestamp: data.timestamp,
      });
    }
  }

  return metadata
    .sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis())
    .slice(0, max);
}


export async function fetchKnownWordMetadata(
  uid: string,
  max: number
): Promise<SavedWordMetadata[]> {
  if (!uid) {
    throw new Error('Invalid UID');
  }

  const cardsColRef = collection(db, `users/${uid}/${kCOUNTRY_LANG_CODE}/cards/known`);
  const snap = await getDocs(cardsColRef);

  const metadata: SavedWordMetadata[] = [];

  for (const docSnap of snap.docs) {
    const data = docSnap.data();
    if (data.timestamp) {
      metadata.push({
        word: docSnap.id,
        timestamp: data.timestamp,
      });
    }
  }

  return metadata
    .sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis())
    .slice(0, max);
}

export async function updateStreak(userId: string): Promise<number> {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  const today = dayjs().startOf("day");
  const yesterday = today.subtract(1, "day");

  let streak = 1;
  let longestStreak = 1;

  if (userSnap.exists()) {
    const data = userSnap.data();
    const lastActive = data.lastActive?.toDate?.();
    streak = Math.max(data.streak || 1, 1);
    longestStreak = Math.max(data.longestStreak || 1, 1);

    if (lastActive) {
      const lastDay = dayjs(lastActive).startOf("day");

      if (lastDay.isSame(today)) {
        return streak; 
      } else if (lastDay.isSame(yesterday)) {
        streak += 1;
        if (streak > longestStreak) longestStreak = streak;
      } else {
        streak = 1;
      }
    }
  }

  await setDoc(
    userRef,
    {
      lastActive: new Date(),
      streak,
      longestStreak,
    },
    { merge: true }
  );

  return streak;
}


/**
 * Deletes a Firestore document after confirming with the user.
 * @param collectionPath - The collection name (e.g., "users")
 * @param docId - The ID of the document to delete
 */
type LanguageCode = 'de' | 'es' | 'fr' | 'it';
type WordDocCode = 'saved' | 'known';

interface DeleteWordDocParams {
  uid: string;
  languageCode: LanguageCode;
  docId: WordDocCode;
}

export async function deleteFirestoreDoc({
  uid,
  languageCode,
  docId,
}: DeleteWordDocParams): Promise<void> {
  const confirmed = confirm(
    `Are you sure you want to delete all ${docId} words? This action cannot be undone.`
  );
  if (!confirmed) return;

  try {
    const collectionRef = collection(db, 'users', uid, languageCode, 'cards', docId);
    const snapshot = await getDocs(collectionRef);

    if (snapshot.empty) {
      alert("No documents found to delete.");
      return;
    }

    const deletePromises = snapshot.docs.map((docSnap) => deleteDoc(docSnap.ref));
    await Promise.all(deletePromises);

    alert("All documents deleted.");
  } catch (error) {
    console.error("Error deleting documents:", error);
    alert("Failed to delete documents.");
  }
}

