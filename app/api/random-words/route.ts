import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const language = searchParams.get('language');
  const amount = Math.min(parseInt(searchParams.get('amount') || '10', 10), 1000);
  const password = searchParams.get('password');
  const partOfSpeech = searchParams.get('part_of_speech');
  const rank = searchParams.get('rank') ? parseInt(searchParams.get('rank')!, 10) : null;

  if (password !== process.env.API_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!language || isNaN(amount) || amount < 1) {
    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
  }

  try {
    const wordsCollection = db.collection('languages').doc(language).collection('words');

    // Build base query with optional filters
    let baseQuery: FirebaseFirestore.Query = wordsCollection;
    if (partOfSpeech) {
      baseQuery = baseQuery.where('part_of_speech', '==', partOfSpeech);
    }
    if (rank) {
      baseQuery = baseQuery.where('rank', '==', rank);
    }

    // Random selection logic using pre-stored random field
    const randomSeed = Math.random();

    // First try: random >= seed
    const query1 = baseQuery.where('random', '>=', randomSeed).limit(amount);
    const snapshot1 = await query1.get();

    let docs = snapshot1.docs;

    // If not enough results, get the rest from random < seed
    if (docs.length < amount) {
      const remaining = amount - docs.length;
      let query2 = baseQuery.where('random', '<', randomSeed).limit(remaining);
      let snapshot2 = await query2.get();
      docs = [...docs, ...snapshot2.docs];
    }

    const words = docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json({ words }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
