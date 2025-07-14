// /app/api/speak/route.ts
import { NextRequest, NextResponse } from 'next/server';
import * as textToSpeech from '@google-cloud/text-to-speech';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { Buffer } from 'buffer';

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

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('TTS Error:', error);
    return NextResponse.json({ error: 'TTS failed' }, { status: 500 });
  }
}
