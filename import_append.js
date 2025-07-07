const admin = require('firebase-admin');
const fs = require('fs');

const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

const rankedData = JSON.parse(fs.readFileSync('ranked_words.json', 'utf8'));

const BATCH_SIZE = 500; // Firestore max batch size
const MAX_RETRIES = 5;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function withRetry(fn, retries = MAX_RETRIES, delay = 1000) {
  try {
    return await fn();
  } catch (err) {
    if (retries === 0) throw err;
    console.warn(`⚠️ Retrying after error: ${err.message}`);
    await sleep(delay);
    return withRetry(fn, retries - 1, delay * 2);
  }
}

async function appendRanksToExistingWords() {
  const baseCollectionRef = db.collection('languages').doc('german').collection('words');
  const allEntries = Object.entries(rankedData);

  let updatedCount = 0;
  let skippedCount = 0;

  for (let i = 0; i < allEntries.length; i += BATCH_SIZE) {
    const chunk = allEntries.slice(i, i + BATCH_SIZE);
    const batch = db.batch();
    let opsInBatch = 0;

    for (const [word, data] of chunk) {
      if (!word || word.includes('/')) {
        console.warn(`⚠️ Skipped invalid key: "${word}"`);
        skippedCount++;
        continue;
      }

      const docRef = baseCollectionRef.doc(word);
      const docSnap = await withRetry(() => docRef.get());

      if (!docSnap.exists) {
        skippedCount++;
        continue;
      }

      batch.update(docRef, {
        rank: data.rank,
        frequency: data.frequency, // ⬅️ add frequency field
      });

      console.log(`✅ Queued: "${word}" → rank: ${data.rank}, freq: ${data.frequency}`);
      opsInBatch++;
    }

    if (opsInBatch > 0) {
      await withRetry(() => batch.commit());
      updatedCount += opsInBatch;
      await sleep(250); // Throttle between batches
    }
  }

  console.log(`🎯 Done. Updated ${updatedCount} words. Skipped ${skippedCount} missing or invalid.`);
}

appendRanksToExistingWords().catch(err => {
  console.error('❌ Failed to append ranks and frequency:', err);
});
