import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { createClient } from "redis";

let redisClient: ReturnType<typeof createClient> | null = null;

async function getRedisClient() {
  if (!redisClient) {
    redisClient = createClient({
      url: process.env.REDIS_URL,
    });
    redisClient.on("error", (err) => console.error("Redis error:", err));
    await redisClient.connect();
  }
  return redisClient;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const language = searchParams.get("language");
  const partOfSpeechRaw = searchParams.get("part_of_speech");
  const count = parseInt(searchParams.get("count") || "100", 10);
  const password = searchParams.get("password");
  const forceRefresh = searchParams.get("refresh") === "true";

  if (password !== process.env.NEXT_PUBLIC_API_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!language) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const partOfSpeech = partOfSpeechRaw
    ? partOfSpeechRaw.charAt(0).toUpperCase() + partOfSpeechRaw.slice(1).toLowerCase()
    : null;

  const cacheKey = `filtered_words:${language}:${partOfSpeech ?? "all"}:${count}`;

  try {
    const redis = await getRedisClient();
    if (forceRefresh) await redis.del(cacheKey);

    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log(`Returning cached result for ${cacheKey}`);
      return NextResponse.json(JSON.parse(cached), { status: 200 });
    }

    const collectionRef = db.collection("languages").doc(language).collection("words");

    let docs: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>[] = [];

    if (!partOfSpeech) {
      // Simple: no composite index needed
      const snapshot = await collectionRef.orderBy("frequency", "desc").limit(count).get();
      docs = snapshot.docs;
    } else {
      try {
        // Preferred (requires composite index)
        const snapshot = await collectionRef
          .where("part_of_speech", "==", partOfSpeech)
          .orderBy("frequency", "desc")
          .limit(count)
          .get();
        docs = snapshot.docs;
      } catch (e: any) {
        // Fallback when composite index is missing: fetch, then sort in memory.
        if (e?.code === 9 || /requires an index/i.test(String(e))) {
          console.warn("Composite index missing, using in-memory sort fallback.");
          // Cap how many we pull to avoid huge reads; adjust as needed.
          const snapshot = await collectionRef
            .where("part_of_speech", "==", partOfSpeech)
            .limit(Math.max(count * 5, 500)) // pull extra to get good top-N after sort
            .get();
          docs = snapshot.docs
            .map((d) => ({ id: d.id, data: d.data() }))
            .sort((a, b) => (b.data.frequency ?? 0) - (a.data.frequency ?? 0))
            .slice(0, count)
            // map back to a doc-like shape
            .map((x, i) => snapshot.docs[i]); // structure alignment for later mapping
        } else {
          throw e;
        }
      }
    }

    console.log(
      `Found ${docs.length} documents matching part_of_speech = ${partOfSpeech ?? "all"}`
    );

    const words = docs
      .map((doc, index) => {
        const data = doc.data() as any;
        return {
          id: index,
          word: doc.id,
          part_of_speech: data.part_of_speech || null,
          frequency: data.frequency || 0,
          rank: data.rank || 0,
          translation: data.translation || "",
          gender: data.gender || "",
        };
      })
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, count);

    await redis.set(cacheKey, JSON.stringify({ words }), { EX: 86400 });
    return NextResponse.json({ words }, { status: 200 });
  } catch (error) {
    console.error("Error fetching filtered words:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
