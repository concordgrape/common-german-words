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
} from "recharts";
import dayjs from "dayjs";
import { Timestamp } from "firebase/firestore";
import Lottie from "lottie-react";
import fireAnimation from "../external/Lottie/fire.json";
import { fetchBasicWords, Word } from "../helpers/fetchBasicWordList";

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
  const { user } = useUser();
  const [savedData, setSavedData] = useState<{ date: string; count: number }[]>(
    []
  );
  const [knownData, setKnownData] = useState<{ date: string; count: number }[]>(
    []
  );
  const [rangeKey, setRangeKey] = useState<"7d" | "30d" | "6m">("7d");
  const [words, setWords] = useState<Word[]>([]);

  useEffect(() => {
    fetchBasicWords("german", process.env.NEXT_PUBLIC_API_PASSWORD || "").then(
      setWords
    );
  }, []);

  useEffect(() => {
    if (!user?.uid) return;

    const loadSavedData = async () => {
      const savedWords = await fetchSavedWordMetadata(user.uid, 100);

      const countsByDate: Record<string, number> = {};

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

  const mergedData = mergeSavedAndKnownData(savedData, knownData);
  const totalSavedCount = savedData.reduce((sum, item) => sum + item.count, 0);
  const totalKnownCount = knownData.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="p-6 max-w-4xl mx-auto pt-30">
      <div className="flex justify-center items-center mb-10">
        {" "}
        {/* Parent container */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
          <div
            data-tip="Total saved words"
            className="tooltip px-4 py-6 pt-7 bg-gray-200 dark:bg-gray-700 w-40 h-30 rounded-sm lg:rounded-xs text-center hover:scale-105 transition-transform duration-200"
          >
            <span className="text-6xl font-mono font-bold text-blue-400">
              {totalSavedCount}
            </span>
          </div>
          <div
            data-tip="Total known words"
            className="tooltip px-4 py-6 pt-7 bg-gray-200 dark:bg-gray-700 w-40 h-30 rounded-sm lg:rounded-xs text-center hover:scale-105 transition-transform duration-200"
          >
            <span className="text-6xl font-mono font-bold text-green-500">
              {totalKnownCount}
            </span>
          </div>
          <div
            data-tip="All available words"
            className="tooltip py-6 pt-7 bg-gray-200 dark:bg-gray-700 w-40 h-30 rounded-sm lg:rounded-xs text-center hover:scale-105 transition-transform duration-200"
          >
            <span className="text-6xl font-mono font-bold text-gray-500 dark:text-gray-300">
              {words.length}
            </span>
          </div>
          <div
            data-tip="Your daily streak"
            className="tooltip px-4 py-6 bg-gray-200 dark:bg-gray-700 w-40 h-30 rounded-sm lg:rounded-xs hover:scale-105 transition-transform duration-200"
          >
            <div className="flex flex-row items-center justify-center h-full w-full">
              <span className="text-5xl font-mono font-bold text-orange-400">
                {1}
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

      <div className="flex flex-col items-start mt-5 w-60">
        <select
          value={rangeKey}
          onChange={(e) => setRangeKey(e.target.value as "7d" | "30d" | "6m")}
          className="px-3 py-2 h-10 sm:h-auto rounded-md bg-gray-100 dark:bg-[#262839] cursor-pointer text-sm col-span-2 w-full border border-1 border-gray-200 dark:border-gray-600 rounded-lg text-black dark:text-white"
          id="partOfSpeechSelect"
        >
          {Object.entries(ranges).map(([key]) => (
            <option key={key} value={key}>
              {key === "7d" ? "7 Days" : key === "30d" ? "30 Days" : "6 Months"}
            </option>
          ))}
        </select>
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
