const admin = require("firebase-admin");
const fs = require("fs").promises; // Use promises version of fs for async operations
const path = require("path");

// --- Configuration ---
// Path to your Firebase service account key JSON file.
// Make sure this file is secure and not publicly accessible.
const SERVICE_ACCOUNT_KEY_PATH = "./serviceAccountKey.json";

// The base collection path where your word documents are located.
// Based on your example: 'languages/german/words'
const BASE_COLLECTION_PATH = "languages/german/words";

// Firestore max batch size for write operations (deletes are writes)
const BATCH_SIZE = 500;

// Retry configuration for Firestore operations
const MAX_RETRIES = 5;
const INITIAL_RETRY_DELAY_MS = 1000; // 1 second

// --- Firebase Initialization ---
let db;
try {
  const serviceAccount = require(SERVICE_ACCOUNT_KEY_PATH);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  db = admin.firestore();
  console.log("✅ Firebase Admin SDK initialized successfully.");
} catch (error) {
  if (
    error.code === "MODULE_NOT_FOUND" &&
    error.message.includes(SERVICE_ACCOUNT_KEY_PATH)
  ) {
    console.error(
      `❌ Error: Service account key file not found at '${SERVICE_ACCOUNT_KEY_PATH}'.`,
    );
    console.error(
      "Please ensure 'serviceAccountKey.json' is in the same directory as the script.",
    );
  } else {
    console.error(`❌ Error initializing Firebase: ${error.message}`);
  }
  process.exit(1); // Exit the process with an error code
}

// --- Helper Functions for Robustness ---
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withRetry(
  asyncFn,
  retries = MAX_RETRIES,
  delayMs = INITIAL_RETRY_DELAY_MS,
) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await asyncFn();
    } catch (error) {
      if (attempt < retries) {
        console.warn(
          `⚠️ Retrying (attempt ${attempt + 1}/${retries + 1}) after error: ${error.message}`,
        );
        await sleep(delayMs);
        delayMs *= 2; // Exponential backoff
      } else {
        throw error; // Re-throw the exception if all retries are exhausted
      }
    }
  }
}

async function deleteDocumentsFromFirestore(wordListFilePath) {
  let wordsToDelete = [];
  let deletedCount = 0;
  let skippedCount = 0;

  try {
    // Read words from the text file
    const fileContent = await fs.readFile(wordListFilePath, "utf8");
    wordsToDelete = fileContent
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    console.log(
      `📝 Loaded ${wordsToDelete.length} words from '${wordListFilePath}' for deletion.`,
    );
  } catch (error) {
    if (error.code === "ENOENT") {
      console.error(
        `❌ Error: Word list file not found at '${wordListFilePath}'.`,
      );
    } else {
      console.error(`❌ Error reading word list file: ${error.message}`);
    }
    return;
  }

  if (wordsToDelete.length === 0) {
    console.log("ℹ️ No words found in the text file to delete. Exiting.");
    return;
  }

  // Process words in batches
  for (let i = 0; i < wordsToDelete.length; i += BATCH_SIZE) {
    const batchWords = wordsToDelete.slice(i, i + BATCH_SIZE);
    const batch = db.batch();
    let opsInBatch = 0;

    console.log(
      `\nProcessing batch ${Math.floor(i / BATCH_SIZE) + 1} of ${Math.ceil(wordsToDelete.length / BATCH_SIZE)}...`,
    );

    for (const word of batchWords) {
      // Basic validation for document ID (Firestore document IDs cannot contain '/' or '..')
      if (!word || word.includes("/") || word.includes(".")) {
        console.warn(`⚠️ Skipping invalid word/document ID: '${word}'`);
        skippedCount++;
        continue;
      }

      const docRef = db.collection(BASE_COLLECTION_PATH).doc(word);
      batch.delete(docRef);
      console.log(`🗑️ Queued for deletion: '${BASE_COLLECTION_PATH}/${word}'`);
      opsInBatch++;
    }

    if (opsInBatch > 0) {
      try {
        // Commit the batch with retry logic
        await withRetry(() => batch.commit());
        deletedCount += opsInBatch;
        console.log(
          `✅ Successfully committed batch. Deleted ${opsInBatch} documents.`,
        );
        await sleep(250); // Throttle between batches to avoid hitting limits
      } catch (error) {
        console.error(`❌ Error committing batch: ${error.message}`);
        console.error(
          "Some documents in this batch might not have been deleted.",
        );
      }
    } else {
      console.log("No valid documents to delete in this batch.");
    }
  }

  console.log(`\n--- Deletion Summary ---`);
  console.log(`🎯 Done. Attempted to delete ${wordsToDelete.length} words.`);
  console.log(`✅ Successfully deleted ${deletedCount} documents.`);
  console.log(`ℹ️ Skipped ${skippedCount} invalid words/document IDs.`);
}

// --- Main Execution ---
if (require.main === module) {
  const args = process.argv.slice(2); // Get command-line arguments, excluding 'node' and script name

  if (args.length === 1) {
    const wordListFile = args[0];
    console.log(`Starting deletion process for words in '${wordListFile}'...`);
    deleteDocumentsFromFirestore(wordListFile).catch((error) => {
      console.error(
        `❌ An unhandled error occurred during deletion: ${error.message}`,
      );
      process.exit(1);
    });
  } else {
    console.log(
      "Usage: node firestore_document_deleter.js <word_list_file.txt>",
    );
    console.log(
      "Example: node firestore_document_deleter.js matching_words.txt",
    ); // Updated example
    console.log(
      `\nNote: This script will attempt to delete documents from '${BASE_COLLECTION_PATH}/<word>'.`,
    );
    console.log(
      `Please ensure '${SERVICE_ACCOUNT_KEY_PATH}' is present and has appropriate permissions.`,
    );
    process.exit(1);
  }
}

// Example usage for local testing (uncomment to use)
/*
if (process.argv.length === 2) { // Only run example if no arguments are provided
    async function runDummyExample() {
        const dummyWordsContent = "zoo\napple\nbanana\ninvalid/word";
        const dummyWordListName = "dummy_words_to_delete.txt";
        await fs.writeFile(dummyWordListName, dummyWordsContent, 'utf8');
        console.log(`Created dummy file: '${dummyWordListName}'`);

        // Note: For a true dummy test, you'd need to mock Firestore interactions
        // or ensure your Firebase project has dummy documents to delete.
        await deleteDocumentsFromFirestore(dummyWordListName);

        await fs.unlink(dummyWordListName); // Clean up dummy file
        console.log(`Cleaned up dummy file: '${dummyWordListName}'`);
    }
    // runDummyExample().catch(console.error);
}
*/
