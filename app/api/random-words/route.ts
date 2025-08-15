import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const language = searchParams.get('language');
  const rawAmount = searchParams.get('amount') || searchParams.get('count') || '10';
  const amount = Math.min(parseInt(rawAmount, 10), 1000);
  const password = searchParams.get('password');
  const partOfSpeech = searchParams.get('part_of_speech');
  const rank = searchParams.get('rank') ? parseInt(searchParams.get('rank')!, 10) : null;

  if (password !== process.env.NEXT_PUBLIC_API_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!language || isNaN(amount) || amount < 1) {
    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
  }

  try {
    const wordsCollection = db.collection('languages').doc(language).collection('words');

    // Always use fallback logic (no composite index queries)
    const normalizedPOS = (partOfSpeech ?? '').trim().toLowerCase();
    const shouldFilterPOS = normalizedPOS && !['unknown', 'any', 'all'].includes(normalizedPOS);

    let query: FirebaseFirestore.Query = wordsCollection;
    if (shouldFilterPOS) {
      query = query.where('part_of_speech', '==', partOfSpeech);
    }

    const fetchLimit = Math.max(amount * 5, 500);
    const snapshot = await query.limit(fetchLimit).get();

    let docs = snapshot.docs;

    // Optional: filter by rank in memory
    if (rank !== null && !isNaN(rank)) {
      docs = docs.filter(doc => doc.get('rank') === rank);
    }

    // Shuffle the docs randomly
    const shuffled = docs
      .map(doc => ({ doc, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(entry => entry.doc)
      .slice(0, amount);

    const words = shuffled.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ words }, { status: 200 });

  } catch (error) {
    console.error('Error fetching fallback words:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
