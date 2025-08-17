import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';

function formatWord(doc: FirebaseFirestore.DocumentSnapshot) {
  return {
    word: doc.id,
    id: doc.get('id') ?? 0,
    part_of_speech: doc.get('part_of_speech') ?? null,
    frequency: doc.get('frequency') ?? 0,
    rank: doc.get('rank') ?? 0,
    translation: doc.get('translation') ?? '',
    gender: doc.get('gender') ?? '',
    phonetic_spelling: doc.get('phonetic_spelling') ?? '',
    examples: doc.get('examples') ?? [],
  };
}

// Fisher–Yates
function shuffleInPlace<T>(arr: T[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const language = searchParams.get('language');
  const rawAmount = searchParams.get('amount') || searchParams.get('count') || '10';
  const amount = Math.min(Math.max(parseInt(rawAmount, 10) || 0, 1), 1000);
  const password = searchParams.get('password');
  const partOfSpeech = searchParams.get('part_of_speech');
  const priority = (searchParams.get('priority') || '').toLowerCase();
  const savedRaw = searchParams.get('saved');

  // parse rank once
  const rankParam = searchParams.get('rank');
  const parsedRank = rankParam !== null ? Number(rankParam) : null;
  const hasRank = parsedRank !== null && !Number.isNaN(parsedRank) && parsedRank !== 0;

  // only use priority if rank is provided and not 0
  const usePriority = priority === 'common-words' && hasRank && parsedRank <= 2;

  if (password !== process.env.NEXT_PUBLIC_API_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!language) {
    return NextResponse.json({ error: 'Missing language parameter' }, { status: 400 });
  }

  // saved ids parsing (unchanged)...
  let savedIds: string[] = [];
  if (savedRaw) {
    savedIds = savedRaw.split(',').map(s => s.trim()).filter(Boolean);
    if (savedIds.length > 100) {
      savedIds = savedIds
        .map(id => ({ id, r: Math.random() }))
        .sort((a, b) => a.r - b.r)
        .slice(0, 100)
        .map(x => x.id);
    }
  }

  try {
    const col = db.collection('languages').doc(language).collection('words');

    // Optional POS filter helper
    const normalizedPOS = (partOfSpeech ?? '').trim().toLowerCase();
    const shouldFilterPOS = normalizedPOS && !['unknown', 'any', 'all'].includes(normalizedPOS);

    let results: FirebaseFirestore.QueryDocumentSnapshot[] = [];

    if (usePriority) {
      // PRIORITY (common-words) ONLY when rank is provided and not 0
      // Grab ranks 1 & 2, optional POS, shuffle, slice
      let q1: FirebaseFirestore.Query = col.where('rank', '==', 1);
      let q2: FirebaseFirestore.Query = col.where('rank', '==', 2);
      if (shouldFilterPOS) {
        q1 = q1.where('part_of_speech', '==', partOfSpeech);
        q2 = q2.where('part_of_speech', '==', partOfSpeech);
      }

      const [s1, s2] = await Promise.all([q1.get(), q2.get()]);
      results = [...s1.docs, ...s2.docs];

      // shuffle + slice
      for (let i = results.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [results[i], results[j]] = [results[j], results[i]];
      }
      results = results.slice(0, amount);
    } else {
      // DEFAULT MODE (priority ignored if rank is 0 or null)
      let q: FirebaseFirestore.Query = col;
      if (shouldFilterPOS) q = q.where('part_of_speech', '==', partOfSpeech);
      if (hasRank) q = q.where('rank', '==', parsedRank);

      // No orderBy -> avoid composite index; fetch extra, sort by frequency in-memory
      const snap = await q.limit(Math.min(amount * 3, 3000)).get();
      results = snap.docs
        .sort((a, b) => (b.get('frequency') ?? 0) - (a.get('frequency') ?? 0))
        .slice(0, amount);
    }

    const randomWords = results.map(formatWord);

    // Fetch saved words (unchanged)
    let savedWords: ReturnType<typeof formatWord>[] = [];
    if (savedIds.length) {
      const savedDocs = await Promise.all(savedIds.map(id => col.doc(id).get()));
      savedWords = savedDocs.filter(d => d.exists).map(formatWord);
    }

    // Dedupe
    const byId = new Map<string, ReturnType<typeof formatWord>>();
    for (const w of [...randomWords, ...savedWords]) byId.set(w.word, w);

    return NextResponse.json({ words: Array.from(byId.values()) }, { status: 200 });
  } catch (err) {
    console.error('Error fetching words:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
