"use client";

import React, { useEffect, useState, Suspense } from "react";
import {
  fetchSavedWordMetadata,
  fetchKnownWordMetadata,
} from "../helpers/userWordLibrary";
import { useUser } from "../context/UserContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import dayjs from "dayjs";
import { Timestamp } from "firebase/firestore";
import Lottie from "lottie-react";
import fireAnimation from "../external/Lottie/fire.json";
import { fetchBasicWords, Word } from "../helpers/fetchBasicWordList";
import Link from "next/link";

interface WordWithTimestamp {
  word: string;
  timestamp: Timestamp;
}

const ranges = {
  "7d": 7,
  "30d": 30,
  "6m": 180,
};

interface MergedLineData {
  date: string;
  savedCount: number;
  knownCount: number;
}

function mergeSavedAndKnownData(
  saved: { date: string; count: number }[],
  known: { date: string; count: number }[]
): MergedLineData[] {
  const merged: Record<string, MergedLineData> = {};

  saved.forEach(({ date, count }) => {
    if (!merged[date]) merged[date] = { date, savedCount: 0, knownCount: 0 };
    merged[date].savedCount = count;
  });

  known.forEach(({ date, count }) => {
    if (!merged[date]) merged[date] = { date, savedCount: 0, knownCount: 0 };
    merged[date].knownCount = count;
  });

  return Object.values(merged).sort((a, b) => a.date.localeCompare(b.date));
}

function ProgressPage() {
  const { user, streak, loading } = useUser();
  const [savedData, setSavedData] = useState<{ date: string; count: number }[]>(
    []
  );
  const [knownData, setKnownData] = useState<{ date: string; count: number }[]>(
    []
  );
  const [totalSavedWords, setTotalSavedWords] = useState<number>(0);
  const [totalKnownWords, setTotalKnownWords] = useState<number>(0);
  const [rangeKey, setRangeKey] = useState<"7d" | "30d" | "6m">("7d");
  const [rankedSavedWords, setRankedSavedWords] = useState<Word[]>([]);
  const [rawSavedWords, setRawSavedWords] = useState<WordWithTimestamp[]>([]);
  const [rankChartData, setRankChartData] = useState<
    { rank: string; total: number; completed: number }[]
  >([]);
  const [words, setWords] = useState<Word[]>([]);
  const [rankStats, setRankStats] = useState<
    Record<number, { total: number; completed: number }>
  >({});

  useEffect(() => {
    fetchBasicWords("german", process.env.NEXT_PUBLIC_API_PASSWORD || "").then(
      (e) => {
        setWords(e);
        console.log("word metadata: ", e);
      }
    );
  }, []);

  useEffect(() => {
    if (!user?.uid) return;

    const loadSavedData = async () => {
      const savedWords = await fetchSavedWordMetadata(user.uid, 100);
      setTotalSavedWords(savedWords.length);
      setRawSavedWords(savedWords);
      const countsByDate: Record<string, number> = {};

      console.log("saved word metadata: ", savedWords);

      for (const word of savedWords as WordWithTimestamp[]) {
        const date = dayjs(word.timestamp.toDate()).format("YYYY-MM-DD");
        countsByDate[date] = (countsByDate[date] || 0) + 1;
      }

      const today = dayjs();
      const days = ranges[rangeKey];
      const temp: { date: string; count: number }[] = [];

      for (let i = days - 1; i >= 0; i--) {
        const date = today.subtract(i, "day").format("YYYY-MM-DD");
        temp.push({ date, count: countsByDate[date] || 0 });
      }

      setSavedData(temp);
    };

    const loadKnownData = async () => {
      const knownWords = await fetchKnownWordMetadata(user.uid, 100);
      setTotalKnownWords(knownWords.length);
      const countsByDate: Record<string, number> = {};

      for (const word of knownWords as WordWithTimestamp[]) {
        const date = dayjs(word.timestamp.toDate()).format("YYYY-MM-DD");
        countsByDate[date] = (countsByDate[date] || 0) + 1;
      }

      const today = dayjs();
      const days = ranges[rangeKey];
      const temp: { date: string; count: number }[] = [];

      for (let i = days - 1; i >= 0; i--) {
        const date = today.subtract(i, "day").format("YYYY-MM-DD");
        temp.push({ date, count: countsByDate[date] || 0 });
      }

      setKnownData(temp);
    };

    loadSavedData();
    loadKnownData();
  }, [user?.uid, rangeKey]);

  const matchAndSortSavedWords = async () => {
    if (!rawSavedWords.length || !words.length) return;

    const matched: Word[] = rawSavedWords
      .map((saved) =>
        words.find((w) => w.word.toLowerCase() === saved.word.toLowerCase())
      )
      .filter((w): w is Word => !!w);

    const sorted = matched.sort((a, b) => a.rank - b.rank);

    console.log("✅ Ranked Saved Words:", sorted);
    setRankedSavedWords(sorted);
  };

  useEffect(() => {
    matchAndSortSavedWords();
  }, [words, rawSavedWords]);

  useEffect(() => {
    if (!rankedSavedWords.length || !words.length) return;

    const ranks = [1, 2, 3];
    const data = ranks.map((rank) => {
      const total = words.filter((w) => w.rank === rank).length;
      const completed = rankedSavedWords.filter((w) => w.rank === rank).length;
      let rankLabel = "All";
      switch (rank) {
        case 1:
          rankLabel = "A1";
          break;
        case 2:
          rankLabel = "A2";
          break;
        case 3:
          rankLabel = "A3";
          break;
        default:
          rankLabel = "All";
      }
      return {
        rank: rankLabel,
        total,
        completed,
      };
    });

    setRankChartData(data);
  }, [rankedSavedWords, words]);

  useEffect(() => {
    if (!words.length || !rawSavedWords.length) return;

    const savedSet = new Set(rawSavedWords.map((w) => w.word.toLowerCase()));
    const stats: Record<number, { total: number; completed: number }> = {
      1: { total: 0, completed: 0 },
      2: { total: 0, completed: 0 },
      3: { total: 0, completed: 0 },
      4: { total: 0, completed: 0 },
    };

    for (const word of words) {
      const rank = word.rank;
      if (stats[rank]) {
        stats[rank].total++;
        if (savedSet.has(word.word.toLowerCase())) {
          stats[rank].completed++;
        }
      }
    }

    setRankStats(stats);
  }, [words, rawSavedWords]);

  const mergedData = mergeSavedAndKnownData(savedData, knownData);
  const totalSavedCount = savedData.reduce((sum, item) => sum + item.count, 0);
  const totalKnownCount = knownData.reduce((sum, item) => sum + item.count, 0);

  if (!user && !loading) {
    return (
      <div className="min-h-screen w-full pt-15 pt-50 text-center items-center justify-center">
        <p className="text-gray-500">You&apos;re not signed in</p>
        <Link href="/signin">
          <button className="bg-blue-500 text-white font-bold font-mono p-4 rounded-2xl mt-5 cursor-pointer hover:shadow-lg">
            &gt; Sign in &lt;
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto min-h-screen pt-30">
      <div className="flex justify-center items-center mb-10">
        {" "}
        {/* Parent container */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
          <div
            data-tip="Total saved words"
            className={`${
              totalSavedWords == 0 ? "skeleton opacity-50" : ""
            } tooltip px-4 py-6 pt-7 bg-gray-200 dark:bg-gray-700 w-40 h-30 rounded-sm lg:rounded-xs text-center hover:scale-105 transition-transform duration-200`}
          >
            <div>
              <span className="text-6xl font-mono font-bold text-blue-400">
                {totalSavedWords}
              </span>
              <span className="block text-xs font-mon font-regular text-black">
                  total saved words
              </span>
            </div>
          </div>
          <div
            data-tip="Total known words"
            className={`${
              totalKnownWords == 0 ? "skeleton opacity-50" : ""
            } tooltip px-4 py-6 pt-7 bg-gray-200 dark:bg-gray-700 w-40 h-30 rounded-sm lg:rounded-xs text-center hover:scale-105 transition-transform duration-200`}
          >
            <div>
              <span className="text-6xl font-mono font-bold text-green-500">
                {totalKnownWords}
              </span>
              <span className="block text-xs font-mon font-regular text-black">
                    total known words
              </span>
            </div>
          </div>
          <div
            data-tip="All available words"
            className={`${
              words.length == 0 ? "skeleton opacity-50" : ""
            } tooltip py-6 pt-7 bg-gray-200 dark:bg-gray-700 w-40 h-30 rounded-sm lg:rounded-xs text-center hover:scale-105 transition-transform duration-200`}
          >
            <div>
              <span className="text-6xl font-mono font-bold text-gray-500 dark:text-gray-300">
                {words.length}
              </span>
              <span className="block text-xs font-mon font-regular text-black">
                total words
              </span>
            </div>
          </div>
          <div
            data-tip="Your daily streak"
            className={`${
              loading ? "skeleton opacity-50" : ""
            } tooltip px-4 py-6 bg-gray-200 dark:bg-gray-700 w-40 h-30 rounded-sm lg:rounded-xs hover:scale-105 transition-transform duration-200`}
          >
            <div className="flex flex-row items-center justify-center h-full w-full">
              <span className="text-5xl font-mono font-bold text-orange-400">
                {streak}
              </span>
              <Lottie
                className="w-20 h-20"
                animationData={fireAnimation}
                loop={true}
              />
            </div>
          </div>
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">
        History of reviewed words
      </h1>

      <div className="flex flex-col items-start mt-5 w-full">
        <select
          value={rangeKey}
          onChange={(e) => setRangeKey(e.target.value as "7d" | "30d" | "6m")}
          className="w-60 max-w-60 px-3 py-2 h-10 sm:h-auto rounded-md bg-gray-100 dark:bg-[#262839] cursor-pointer text-sm col-span-2 w-full border border-1 border-gray-200 dark:border-gray-600 rounded-lg text-black dark:text-white"
          id="partOfSpeechSelect"
        >
          {Object.entries(ranges).map(([key]) => (
            <option key={key} value={key}>
              {key === "7d" ? "7 Days" : key === "30d" ? "30 Days" : "6 Months"}
            </option>
          ))}
        </select>
        <div className="mt-2 text-xs w-full">
          <p>
            <span className="font-mono font-bold text-blue-400">
              {totalSavedCount}
            </span>{" "}
            words saved &
          </p>
          <p>
            <span className="font-mono font-bold text-green-500">
              {totalKnownCount}
            </span>{" "}
            completed or &apos;known&apos; words in the last{" "}
            {rangeKey === "7d"
              ? "7 days"
              : rangeKey === "30d"
              ? "30 days"
              : "6 months"}
          </p>
        </div>
      </div>

      <div className="outline-none focus:outline-none focus:ring-0">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={mergedData}
            margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{
                fontSize: 12,
                fill: "var(--chart-text-color)",
              }}
            />
            <YAxis
              allowDecimals={false}
              tick={{
                fontSize: 12,
                fill: "var(--chart-text-color)",
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--chart-tooltip-bg)",
                color: "var(--chart-text-color)",
                border: "none",
              }}
              itemStyle={{ color: "var(--chart-text-color)" }}
              labelStyle={{ color: "var(--chart-text-color)" }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="savedCount"
              stroke="#51a2ff" // orange
              strokeWidth={2}
              dot={false}
              name="Saved Words"
            />
            <Line
              type="monotone"
              dataKey="knownCount"
              stroke="#00c951" // green
              strokeWidth={2}
              dot={false}
              name="Known Words"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <h2 className="text-xl font-semibold mt-10 mb-4 text-gray-800 dark:text-white">
        Completion by Level
      </h2>
      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={rankChartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="rank" tick={{ fill: "var(--chart-text-color)" }} />
            <YAxis
              allowDecimals={false}
              tick={{ fill: "var(--chart-text-color)" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--chart-tooltip-bg)",
                color: "var(--chart-text-color)",
                border: "none",
              }}
              itemStyle={{ color: "var(--chart-text-color)" }}
              labelStyle={{ color: "var(--chart-text-color)" }}
            />
            <Legend />
            <Bar
              type="monotone"
              activeBar={{ fill: "#3164e4" }}
              dataKey="total"
              fill="#3164e4"
              name="Total Words"
            />
            <Bar
              activeBar={{ fill: "#00c951" }}
              dataKey="completed"
              fill="#00c951"
              name="Completed Words"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-12">
        <ul className="space-y-2 text-sm text-gray-800 dark:text-gray-200">
          {[1, 2, 3, 4].map((rank) => {
            const data = rankStats[rank];
            if (!data) return null;
            const percentage =
              data.total > 0
                ? ((data.completed / data.total) * 100).toFixed(1)
                : "0.0";
            let rankLabel = "Other"
            switch (rank) {
              case 1:
                rankLabel = "A1";
                break;
              case 2:
                rankLabel = "A2";
                break;
              case 3:
                rankLabel = "A3";
                break;
              default:
                rankLabel = "Other";
            }
            return (
              <li key={rank} className="flex items-center justify-between">
                <span className="font-mono text-base">
                  <span className="font-bold">{rankLabel}</span>: {data.completed} / {data.total} completed
                </span>
                <span className="text-sm font-semibold text-blue-500 text-xl">
                  {percentage}%
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default function ProgressWordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProgressPage />
    </Suspense>
  );
}
