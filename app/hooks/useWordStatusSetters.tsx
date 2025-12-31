import { doc, setDoc, serverTimestamp, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import { useUser } from "../context/UserContext";
import { useGoNavigation } from "../lib/navigation";
import { kCOUNTRY_LANG_CODE, kLANG_NAME } from "../lib/constants";

export function useWordStatusSetters() {
  const { user } = useUser();
  const { go } = useGoNavigation();

  const ensureUser = () => {
    if (!user?.uid) {
      go("/signin");
      throw new Error("User not signed in");
    }
    return user.uid;
  };

  const setSaved = async (word: string, enabled: boolean) => {
    const uid = ensureUser();
    const ref = doc(
      db,
      `users/${uid}/${kCOUNTRY_LANG_CODE}/cards/saved/${word}`,
    );
    if (enabled) {
      await setDoc(
        ref,
        {
          timestamp: serverTimestamp(),
          wordRef: doc(db, `languages/${kLANG_NAME}/words/${word}`),
        },
        { merge: true },
      );
    } else {
      await deleteDoc(ref);
    }
  };

  const setKnown = async (word: string, enabled: boolean) => {
    const uid = ensureUser();
    const ref = doc(
      db,
      `users/${uid}/${kCOUNTRY_LANG_CODE}/cards/known/${word}`,
    );
    if (enabled) {
      await setDoc(
        ref,
        {
          timestamp: serverTimestamp(),
          wordRef: doc(db, `languages/${kLANG_NAME}/words/${word}`),
        },
        { merge: true },
      );
    } else {
      await deleteDoc(ref);
    }
  };

  return { setSaved, setKnown };
}
