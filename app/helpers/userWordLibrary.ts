import { doc, setDoc, serverTimestamp, getDoc, DocumentData, collection, query, getDocs, limit, DocumentReference, DocumentSnapshot, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebaseClient';
import { useUser } from '../context/UserContext';
import { useRouter } from 'next/navigation';

type WordStatusType = 'saved' | 'known';

interface WordDataWithMeta {
  id: string;
  data: DocumentData;
}

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
 * Fetches word data for a user's saved or known words (parallel version).
 * @param user?.uid - User ID
 * @param type - 'saved' or 'known'
 * @param max - Maximum number of words to fetch
 * @returns Array of word data
 */
export async function fetchWordStatusData(
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

  const wordRefs: DocumentReference<DocumentData>[] = [];

  for (const docSnap of snap.docs) {
    const data = docSnap.data();
    if (data.wordRef) {
      wordRefs.push(data.wordRef as DocumentReference<DocumentData>);
    }
  }

  const wordSnaps: DocumentSnapshot<DocumentData>[] = await Promise.all(
    wordRefs.map(ref => getDoc(ref))
  );

  return wordSnaps
    .filter((snap): snap is DocumentSnapshot<DocumentData> => snap.exists())
    .map((snap) => ({
      id: snap.id,
      data: snap.data()!,
    }));
}
