import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';

type Word = {
  id: string;
  part_of_speech?: string;
  gender?: string;
};

type BasicWordInfo = {
  id: string;
  part_of_speech?: string;
};

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

  const filters = {
    part_of_speech: searchParams.get('part_of_speech'),
    gender: searchParams.get('gender'),
    minLength: searchParams.get('minLength') ? parseInt(searchParams.get('minLength')!, 10) : null,
    maxLength: searchParams.get('maxLength') ? parseInt(searchParams.get('maxLength')!, 10) : null,
  };

  try {
    const wordsRef = db.collection('languages').doc(language).collection('words');
    const snapshot = await wordsRef.get();

    const filteredWords: BasicWordInfo[] = snapshot.docs
      .map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          part_of_speech: data.part_of_speech,
          gender: data.gender,
        } as Word;
      })
      .filter((word) => {
        if (filters.part_of_speech && word.part_of_speech !== filters.part_of_speech) return false;
        if (filters.gender && word.gender !== filters.gender) return false;
        if (filters.minLength && word.id.length < filters.minLength) return false;
        if (filters.maxLength && word.id.length > filters.maxLength) return false;
        return true;
      })
      .map((word) => ({
        id: word.id,
        part_of_speech: word.part_of_speech,
      }));

    return NextResponse.json({ words: filteredWords }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
