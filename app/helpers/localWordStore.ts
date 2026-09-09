// app/helpers/localWordStore.ts
//
// Per-device store for saved/known words and the daily streak. There are no
// accounts, so everything lives in localStorage and never leaves the browser.

import dayjs from "dayjs";
import { kCOUNTRY_LANG_CODE } from "../lib/constants";

export type WordStatusType = "saved" | "known";

/** word -> timestamp (ms) it was added */
export type WordStatusMap = Record<string, number>;

const STATUS_CHANGE_EVENT = "commonwords:word-status-change";

function statusKey(type: WordStatusType) {
  return `cw:${kCOUNTRY_LANG_CODE}:${type}`;
}

const STREAK_KEY = `cw:${kCOUNTRY_LANG_CODE}:streak`;

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Private mode / quota — nothing useful to do here.
  }
}

export function getWordStatusMap(type: WordStatusType): WordStatusMap {
  return readJSON<WordStatusMap>(statusKey(type), {});
}

export function hasWordStatus(word: string, type: WordStatusType): boolean {
  return Object.prototype.hasOwnProperty.call(getWordStatusMap(type), word);
}

/** Add or remove a word. Returns the resulting state for that word. */
export function setWordStatus(
  word: string,
  type: WordStatusType,
  enabled: boolean,
): boolean {
  if (!word) throw new Error("Missing word");

  const map = getWordStatusMap(type);
  if (enabled) {
    if (!map[word]) map[word] = Date.now();
  } else {
    delete map[word];
  }

  writeJSON(statusKey(type), map);
  notifyStatusChange();
  return enabled;
}

/** Flip a word between on and off. Returns the new state. */
export function toggleWordStatus(word: string, type: WordStatusType): boolean {
  return setWordStatus(word, type, !hasWordStatus(word, type));
}

export function clearWordStatus(type: WordStatusType) {
  writeJSON(statusKey(type), {});
  notifyStatusChange();
}

function notifyStatusChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(STATUS_CHANGE_EVENT));
}

/** Run `handler` whenever saved/known words change in this tab. */
export function onWordStatusChange(handler: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(STATUS_CHANGE_EVENT, handler);
  return () => window.removeEventListener(STATUS_CHANGE_EVENT, handler);
}

interface StreakState {
  lastActive: string; // YYYY-MM-DD
  streak: number;
  longestStreak: number;
}

/**
 * Bump the streak for today's visit. Same day = unchanged, yesterday = +1,
 * anything older restarts at 1.
 */
export function updateStreak(): number {
  const today = dayjs().startOf("day");
  const stored = readJSON<StreakState | null>(STREAK_KEY, null);

  let streak = 1;
  let longestStreak = 1;

  if (stored) {
    streak = Math.max(stored.streak || 1, 1);
    longestStreak = Math.max(stored.longestStreak || 1, 1);

    const lastDay = dayjs(stored.lastActive).startOf("day");
    if (lastDay.isValid()) {
      if (lastDay.isSame(today)) {
        return streak;
      } else if (lastDay.isSame(today.subtract(1, "day"))) {
        streak += 1;
        if (streak > longestStreak) longestStreak = streak;
      } else {
        streak = 1;
      }
    }
  }

  writeJSON(STREAK_KEY, {
    lastActive: today.format("YYYY-MM-DD"),
    streak,
    longestStreak,
  });

  return streak;
}
