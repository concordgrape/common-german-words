import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import { createClient } from 'redis';

// Reusable Redis client
let redisClient: ReturnType<typeof createClient> | null = null;
async function getRedisClient() {
  if (!redisClient) {
    redisClient = createClient({
      url: process.env.REDIS_URL,
    });
    redisClient.on('error', (err) => console.error('Redis error:', err));
    await redisClient.connect();
  }
  return redisClient;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const language = searchParams.get('language');
  const word = searchParams.get('word');
  const password = searchParams.get('apiKey');

  if (password !== process.env.NEXT_PUBLIC_API_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!language || !word) {
    return NextResponse.json({ error: 'Missing query parameters' }, { status: 400 });
  }

  const cacheKey = `word:${language}:${word}`;

  try {
    const redis = await getRedisClient();

    // ✅ Try Redis first
    const cached = await redis.get(cacheKey);
    if (cached) {
      return NextResponse.json({ word: JSON.parse(cached) }, { status: 200 });
    }

    // ❌ If not cached, query Firestore
    const docRef = db.collection('languages').doc(language).collection('words').doc(word);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: 'Word not found' }, { status: 404 });
    }

    const wordData = docSnap.data();

    // ✅ Cache for 1 day
    await redis.set(cacheKey, JSON.stringify(wordData), { EX: 86400 });

    return NextResponse.json({ word: wordData }, { status: 200 });
  } catch (error) {
    console.error('Firestore or Redis error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
