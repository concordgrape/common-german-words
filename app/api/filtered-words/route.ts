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

  // Normalize part_of_speech to match Firestore values (e.g., "Noun")
  const partOfSpeech = partOfSpeechRaw
    ? partOfSpeechRaw.charAt(0).toUpperCase() +
      partOfSpeechRaw.slice(1).toLowerCase()
    : null;
  const cacheKey = `filtered_words:${language}:${
    partOfSpeech ?? "all"
  }:${count}`;

  try {
    const redis = await getRedisClient();

    if (forceRefresh) {
      await redis.del(cacheKey);
    }

    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log(`Returning cached result for ${cacheKey}`);
      return NextResponse.json(JSON.parse(cached), { status: 200 });
    }

    const collectionRef = db
      .collection("languages")
      .doc(language)
      .collection("words");
    let q = collectionRef.orderBy("frequency", "desc").limit(count);
    if (partOfSpeech) {
      q = collectionRef
        .where("part_of_speech", "==", partOfSpeech)
        .orderBy("frequency", "desc")
        .limit(count);
    }
    const snapshot = await q.get();

    console.log(
      `Found ${snapshot.size} documents matching part_of_speech = ${partOfSpeech}`
    );

    const words = snapshot.docs
      .map((doc, index) => {
        const data = doc.data();
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

    await redis.set(cacheKey, JSON.stringify({ words }), { EX: 86400 }); // 24 hours

    return NextResponse.json({ words }, { status: 200 });
  } catch (error) {
    console.error("Error fetching filtered words:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
