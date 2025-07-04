import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const language = searchParams.get('language');
  const password = searchParams.get('password');

  if (password !== process.env.API_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!language) {
    return NextResponse.json({ error: 'Missing language parameter' }, { status: 400 });
  }

  try {
    const collectionRef = db.collection('languages').doc(language).collection('words');
    const snapshot = await collectionRef.get();

    const words = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        part_of_speech: data.part_of_speech || null,
      };
    });

    return NextResponse.json({ words }, { status: 200 });
  } catch (error) {
    console.error('Error fetching basic words:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
