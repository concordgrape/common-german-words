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
  const password = searchParams.get('password');

  if (password !== process.env.NEXT_PUBLIC_API_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!language) {
    return NextResponse.json({ error: 'Missing language parameter' }, { status: 400 });
  }

  const cacheKey = `basic_words:${language}`;

  try {
    const redis = await getRedisClient();

    // ✅ Check Redis cache first
    const cached = await redis.get(cacheKey);
    if (cached) {
      return NextResponse.json(JSON.parse(cached));
    }

    // ❌ If not cached, fetch from Firestore
    const collectionRef = db.collection('languages').doc(language).collection('words');
    const snapshot = await collectionRef.get();

    const words = snapshot.docs.map((doc, index) => {
      const data = doc.data();
      return {
        word: doc.id,
        id: index,
        part_of_speech: data.part_of_speech || null,
      };
    });

    // ✅ Store in Redis for 1 hour
    await redis.set(cacheKey, JSON.stringify({ words }), {
      EX: 3600,
    });

    return NextResponse.json({ words }, { status: 200 });
  } catch (error) {
    console.error('Error fetching basic words:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
