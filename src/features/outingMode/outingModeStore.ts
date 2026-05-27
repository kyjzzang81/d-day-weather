import type { OutingMode } from "./outingModeTypes";

const OUTING_MODE_STORAGE_KEY = "ggg.outingMode.v1";
const DEFAULT_OUTING_MODE: OutingMode = "daily";

const validModes: OutingMode[] = ["daily", "activity", "rest", "with_child", "date_friends"];

export function readOutingMode(): OutingMode {
  if (typeof window === "undefined") return DEFAULT_OUTING_MODE;

  const stored = window.localStorage.getItem(OUTING_MODE_STORAGE_KEY);
  return validModes.includes(stored as OutingMode) ? (stored as OutingMode) : DEFAULT_OUTING_MODE;
}

export function writeOutingMode(mode: OutingMode): void {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(OUTING_MODE_STORAGE_KEY, mode);
}
