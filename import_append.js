const admin = require("firebase-admin");
const fs = require("fs");

const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

const rankedData = JSON.parse(fs.readFileSync("german.json", "utf8"));

const BATCH_SIZE = 500;
const MAX_RETRIES = 5;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
  const baseCollectionRef = db
    .collection("languages")
    .doc("german")
    .collection("words");
  const allEntries = Object.entries(rankedData);

  let updatedCount = 0;
  let skippedCount = 0;

  for (let i = 0; i < allEntries.length; i += BATCH_SIZE) {
    const chunk = allEntries.slice(i, i + BATCH_SIZE);
    const batch = db.batch();
    let opsInBatch = 0;

    for (const [word, rawData] of chunk) {
      if (!word || word.includes("/")) {
        console.warn(`⚠️ Skipped invalid key: "${word}"`);
        skippedCount++;
        continue;
      }

      // Extract data from your malformed JSON structure
      let data = null;
      
      if (Array.isArray(rawData) && rawData.length > 0) {
        // Get first element of array
        const firstElement = rawData[0];
        
        // Extract from 'properties' field
        if (firstElement && firstElement.properties) {
          data = firstElement.properties;
        }
      }

      const docRef = baseCollectionRef.doc(word);
      const docSnap = await withRetry(() => docRef.get());

      if (!docSnap.exists) {
        skippedCount++;
        console.warn(`⚠️ Skipped missing document for word: "${word}"`);
        continue;
      }

      // Build update object from extracted data
      const updateData = {
        connected_words: data.connected_words || [],
        definitions: data.definitions || [],
        examples: data.examples || [],
        parsed_examples: data.parsed_examples || [],
        same_words: data.same_words || [],
        article: data.article || "",
        frequency: data.frequency || 0,
        gender: data.gender || "",
        language: data.language || "German",
        part_of_speech: data.part_of_speech || "",
        phonetic_spelling: data.phonetic_spelling || "",
        rank: data.rank || 0,
        translation: data.translation || "",
      };

      batch.update(docRef, updateData);

      console.log(
        `✅ Queued: "${word}" → rank: ${updateData.rank}, freq: ${updateData.frequency}`
      );
      opsInBatch++;
    }

    if (opsInBatch > 0) {
      await withRetry(() => batch.commit());
      updatedCount += opsInBatch;
      await sleep(250);
    }
  }

  console.log(
    `🎯 Done. Updated ${updatedCount} words. Skipped ${skippedCount} missing or invalid.`,
  );
}

appendRanksToExistingWords().catch((err) => {
  console.error("❌ Failed to append ranks and frequency:", err);
});