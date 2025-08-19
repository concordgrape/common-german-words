import { doc, setDoc, serverTimestamp, deleteDoc } from "firebase/firestore";
import { db } from '@/lib/firebaseClient';
import { useUser } from '../context/UserContext';
import { useRouter } from 'next/navigation';

export function useWordStatusSetters() {
  const { user } = useUser();
  const router = useRouter();

  const ensureUser = () => {
    if (!user?.uid) {
      router.push('/signin');
      throw new Error('User not signed in');
    }
    return user.uid;
  };

  const setSaved = async (word: string, enabled: boolean) => {
    const uid = ensureUser();
    const ref = doc(db, `users/${uid}/de/cards/saved/${word}`);
    if (enabled) {
      await setDoc(ref, {
        timestamp: serverTimestamp(),
        wordRef: doc(db, `languages/german/words/${word}`),
      }, { merge: true });
    } else {
      await deleteDoc(ref);
    }
  };

  const setKnown = async (word: string, enabled: boolean) => {
    const uid = ensureUser();
    const ref = doc(db, `users/${uid}/de/cards/known/${word}`);
    if (enabled) {
      await setDoc(ref, {
        timestamp: serverTimestamp(),
        wordRef: doc(db, `languages/german/words/${word}`),
      }, { merge: true });
    } else {
      await deleteDoc(ref);
    }
  };

  return { setSaved, setKnown };
}
