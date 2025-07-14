// /app/api/speak/route.ts
import { NextRequest, NextResponse } from 'next/server';
import * as textToSpeech from '@google-cloud/text-to-speech';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { Buffer } from 'buffer';
import { createClient } from 'redis';

export const dynamic = 'force-dynamic'; // required to opt out of edge
export const runtime = 'nodejs'; // ensure you're in Node.js runtime

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

let redisConnected = false;

async function connectRedis() {
  if (!redisConnected) {
    await redisClient.connect();
    redisConnected = true;
  }
}

function getTextToSpeechClient(): TextToSpeechClient {
  const base64 = process.env.GOOGLE_CREDENTIALS_BASE64;
  if (!base64) throw new Error('Missing GOOGLE_CREDENTIALS_BASE64');

  const credentials = JSON.parse(
    Buffer.from(base64, 'base64').toString('utf-8')
  );

  return new TextToSpeechClient({ credentials });
}

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    const cacheKey = `tts:de:${text.trim().toLowerCase()}`;

    await connectRedis();

    // Check Redis cache
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      const audioBuffer = Buffer.from(cached, 'base64');
      return new NextResponse(audioBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'audio/mpeg',
          'X-Cache': 'HIT',
        },
      });
    }

    // Generate TTS
    const client = getTextToSpeechClient();

    const request: textToSpeech.protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest = {
      input: { text },
      voice: {
        languageCode: 'de-DE',
        ssmlGender: 'SSML_VOICE_GENDER_UNSPECIFIED',
      },
      audioConfig: {
        audioEncoding: 'MP3',
      },
    };

    const [response] = await client.synthesizeSpeech(request);

    if (!response.audioContent) {
      return NextResponse.json({ error: 'No audio content returned' }, { status: 500 });
    }

    const audioBuffer = Buffer.from(response.audioContent as Uint8Array);

    // Cache result in Redis as base64 string
    await redisClient.set(cacheKey, audioBuffer.toString('base64'), {
      EX: 60 * 60 * 24 * 30, // 30 days
    });

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'X-Cache': 'MISS',
      },
    });
  } catch (error) {
    console.error('TTS Error:', error);
    return NextResponse.json({ error: 'TTS failed' }, { status: 500 });
  }
}
