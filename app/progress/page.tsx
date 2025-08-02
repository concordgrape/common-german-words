"use client";

import React, { useEffect, useState, Suspense } from "react";
import { fetchSavedWordMetadata } from "../helpers/userWordLibrary";
import { useUser } from "../context/UserContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";
import { Timestamp } from "firebase/firestore";

interface WordWithTimestamp {
  word: string;
  timestamp: Timestamp;
}

const ranges = {
  "7d": 7,
  "30d": 30,
  "6m": 180,
};

function ProgressPage() {
  const { user } = useUser();
  const [data, setData] = useState<{ date: string; count: number }[]>([]);
  const [rangeKey, setRangeKey] = useState<"7d" | "30d" | "6m">("7d");

  useEffect(() => {
    if (!user?.uid) return;

    const loadData = async () => {
      const words = await fetchSavedWordMetadata(user.uid, 100);

      console.log("words: ", words);

      const countsByDate: Record<string, number> = {};

      for (const word of words as WordWithTimestamp[]) {
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

      setData(temp);
    };

    loadData();
  }, [user?.uid, rangeKey]);

  return (
    <div className="p-6 max-w-4xl mx-auto pt-30">
      <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">
        History of saved words
      </h1>

      <div className="flex flex-col items-start mt-5 w-60">
        <select
          value={rangeKey}
          onChange={(e) => setRangeKey(e.target.value as "7d" | "30d" | "6m")}
          className="px-3 py-2 h-8 sm:h-auto rounded-md bg-gray-100 dark:bg-[#262839] cursor-pointer text-sm col-span-2 w-full border border-1 border-gray-200 dark:border-gray-600 rounded-lg text-black dark:text-white"
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
            data={data}
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
            <Line
              type="monotone"
              dataKey="count"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={false}
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
