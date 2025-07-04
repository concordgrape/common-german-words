import admin from 'firebase-admin';
/*import serviceAccount from '../serviceAccountKey.json' assert { type: 'json' };*/ // for ESM

// If you're using CommonJS or no ESM support, remove `assert { type: 'json' }`
if (!admin.apps.length) {
    admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
});
}

const db = admin.firestore();
export { db };
