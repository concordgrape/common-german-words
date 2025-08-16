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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const language = searchParams.get('language');
  const rawAmount = searchParams.get('amount') || searchParams.get('count') || '10';
  const amount = Math.min(parseInt(rawAmount, 10), 1000);
  const password = searchParams.get('password');
  const partOfSpeech = searchParams.get('part_of_speech');
  const rank = searchParams.get('rank') ? parseInt(searchParams.get('rank')!, 10) : null;
  const priority = searchParams.get('common-words') ?? 'random';
  const savedRaw = searchParams.get('saved'); // Comma-separated words

  if (password !== process.env.NEXT_PUBLIC_API_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let savedWords: any[] = [];
  let savedIds: string[] = [];

  if (savedRaw) {
    savedIds = savedRaw
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (savedIds.length > 100) {
      savedIds = savedIds
        .map(id => ({ id, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(entry => entry.id)
        .slice(0, 100);
    }
  }

  if (!language || isNaN(amount) || (amount < 1 && savedIds.length === 0)) {
    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
  }

  try {
    const wordsCollection = db.collection('languages').doc(language).collection('words');
    const normalizedPOS = (partOfSpeech ?? '').trim().toLowerCase();
    const shouldFilterPOS = normalizedPOS && !['unknown', 'any', 'all'].includes(normalizedPOS);

    console.log("amount: ", amount)

    let query: FirebaseFirestore.Query = wordsCollection;
    if (shouldFilterPOS) {
      query = query.where('part_of_speech', '==', partOfSpeech);
    }

    const fetchLimit = Math.max(amount * 5, 1000);
    const snapshot = await query.limit(fetchLimit).get();

    let docs = snapshot.docs;

    if (rank !== null && !isNaN(rank)) {
      docs = docs.filter(doc => doc.get('rank') === rank);
    }

    if (priority === 'common-words') {
      docs = docs
        .filter(doc => typeof doc.get('frequency') === 'number')
        .sort((a, b) => b.get('frequency') - a.get('frequency'))
        .slice(0, 1000);
    }

    const shuffled = docs
      .map(doc => ({ doc, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(entry => entry.doc)
      .slice(0, amount);

    const randomWords = shuffled.map(formatWord);

    // Process saved words
    let savedWords: any[] = [];
    if (savedRaw) {
      let savedIds = savedRaw
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      if (savedIds.length > 100) {
        // Shuffle and take top 100
        savedIds = savedIds
          .map(id => ({ id, sort: Math.random() }))
          .sort((a, b) => a.sort - b.sort)
          .map(entry => entry.id)
          .slice(0, 100);
      }

      const savedDocs = await Promise.all(
        savedIds.map(id => wordsCollection.doc(id).get())
      );

      savedWords = savedDocs
        .filter(doc => doc.exists)
        .map(doc => formatWord(doc));
    }

    return NextResponse.json(
      { words: [...randomWords, ...savedWords] },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching words:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
