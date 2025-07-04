import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const language = searchParams.get('language');
  const amount = parseInt(searchParams.get('amount') || '10', 10);
  const password = searchParams.get('password');

  if (password !== process.env.API_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!language || isNaN(amount) || amount < 1) {
    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
  }

  try {
    // Step 1: Get pre-generated list of IDs
    const idDoc = await db.collection('languages').doc(language).collection('meta').doc('word_ids').get();

    if (!idDoc.exists) {
      return NextResponse.json({ error: 'ID list not found' }, { status: 404 });
    }

    const allIds: string[] = idDoc.data()?.ids || [];
    if (allIds.length === 0) {
      return NextResponse.json({ error: 'No IDs found' }, { status: 404 });
    }

    // Step 2: Randomly sample IDs
    const shuffled = allIds.sort(() => 0.5 - Math.random());
    const selectedIds = shuffled.slice(0, amount);

    // Step 3: Batch fetch the docs
    const wordRefs = selectedIds.map(id =>
      db.collection('languages').doc(language).collection('words').doc(id)
    );
    const snapshots = await db.getAll(...wordRefs);

    const words = snapshots
      .filter(doc => doc.exists)
      .map(doc => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json({ words }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
