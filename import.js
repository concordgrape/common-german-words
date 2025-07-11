// This script imports German words from a JSON file into a Firestore database.
// Make sure to have Firebase Admin SDK installed: npm install firebase-admin

const admin = require('firebase-admin');
const fs = require('fs');

// Load Firebase service account credentials
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Load your JSON file
const wordsData = JSON.parse(fs.readFileSync('german_words_temp.json', 'utf8'));

// Upload each word into `languages/german/words/{word}`
async function importGermanWords() {
  const baseCollectionRef = db
    .collection('languages')
    .doc('german')
    .collection('words');

  for (const [word, entries] of Object.entries(wordsData)) {
    if (!Array.isArray(entries) || entries.length === 0) continue;

    const wordData = entries[0]; // Use the first entry
    const docRef = baseCollectionRef.doc(word);
    await docRef.set(wordData);
    console.log(`✅ Imported word: ${word}`);
  }

  console.log('🎉 All words imported into languages/german/words');
}

// Run this once when uploading words or with a cron job
async function generateWordIdList(language) {
  const wordsSnapshot = await db.collection('languages').doc(language).collection('words').listDocuments();
  const ids = wordsSnapshot.map(doc => doc.id);

  await db.collection('languages').doc(language).collection('meta').doc('word_ids').set({ ids });
  console.log(`Stored ${ids.length} word IDs for ${language}`);
}

/*
generateWordIdList('german').catch((err) => {
  console.error('❌ Failed to generate word ID list:', err);
});
*/

importGermanWords().catch((err) => {
  console.error('❌ Import failed:', err);
});