// app/api/word/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin'; // Admin SDK setup (server-side)

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const language = searchParams.get('language');
    const word = searchParams.get('word');
    const password = searchParams.get('apiKey'); // Get password from query param

    if (password !== process.env.API_PASSWORD) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!language || !word) {
        return NextResponse.json({ error: 'Missing query parameters' }, { status: 400 });
    }

    try {
        const docRef = db.collection('languages').doc(language).collection('words').doc(word);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
        return NextResponse.json({ error: 'Word not found' }, { status: 404 });
        }

        // ✅ Return the document data
        return NextResponse.json({ word: docSnap.data() }, { status: 200 });

    } catch (error) {
        console.error('Firestore error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
