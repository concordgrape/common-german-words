// This script imports german words from a JSON file into a Firestore database.
// Make sure to have Firebase Admin SDK installed: npm install firebase-admin

const admin = require("firebase-admin");
const fs = require("fs");

// Load Firebase service account credentials
const serviceAccount = require("./serviceAccountKey.json");

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Load your JSON file
const wordsData = JSON.parse(
  fs.readFileSync("JAPANESE_words_enriched_ranked.json", "utf8"),
);

// Upload each word into `languages/german/words/{word}`
async function importgermanWords() {
  const baseCollectionRef = db
    .collection("languages")
    .doc("japanese")
    .collection("words");

  let count = 0;
  let batch = db.batch();
  const BATCH_SIZE = 500; // Firestore allows max 500 operations per batch

  for (const [word, entries] of Object.entries(wordsData)) {
    if (!Array.isArray(entries) || entries.length === 0) continue;

    const wordData = entries[0]; // Use the first entry
    const docRef = baseCollectionRef.doc(word);

    batch.set(docRef, wordData);
    count++;

    // Commit batch when it reaches the limit
    if (count % BATCH_SIZE === 0) {
      await batch.commit();
      console.log(
        `✅ Committed batch of ${BATCH_SIZE} words (total: ${count})`,
      );
      batch = db.batch(); // Create new batch
    }
  }

  // Commit any remaining documents
  if (count % BATCH_SIZE !== 0) {
    await batch.commit();
    console.log(`✅ Committed final batch (total: ${count})`);
  }

  console.log("🎉 All words imported into languages/german/words");
}

// Run this once when uploading words or with a cron job
async function generateWordIdList(language) {
  const wordsSnapshot = await db
    .collection("languages")
    .doc(language)
    .collection("words")
    .listDocuments();
  const ids = wordsSnapshot.map((doc) => doc.id);

  await db
    .collection("languages")
    .doc(language)
    .collection("meta")
    .doc("word_ids")
    .set({ ids });
  console.log(`Stored ${ids.length} word IDs for ${language}`);
}

/*
generateWordIdList('german').catch((err) => {
  console.error('❌ Failed to generate word ID list:', err);
});
*/

importgermanWords().catch((err) => {
  console.error("❌ Import failed:", err);
});
