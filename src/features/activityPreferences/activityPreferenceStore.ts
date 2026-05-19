import type { ActivityCategoryCode } from "../today/todayPayload";
import { DEFAULT_ACTIVITY_PREFERENCES, activityPreferenceOptions } from "./activityPreferenceOptions";

const ACTIVITY_PREFERENCES_KEY = "ggg.activityPreferences.v1";

export function readActivityPreferences(): ActivityCategoryCode[] {
  if (typeof window === "undefined") {
    return DEFAULT_ACTIVITY_PREFERENCES;
  }

  try {
    const raw = window.localStorage.getItem(ACTIVITY_PREFERENCES_KEY);
    if (!raw) {
      return DEFAULT_ACTIVITY_PREFERENCES;
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return DEFAULT_ACTIVITY_PREFERENCES;
    }

    const validCategories = new Set(activityPreferenceOptions.map((option) => option.category));
    const filtered = parsed.filter((value): value is ActivityCategoryCode => typeof value === "string" && validCategories.has(value as ActivityCategoryCode));

    return filtered.length ? filtered : DEFAULT_ACTIVITY_PREFERENCES;
  } catch {
    return DEFAULT_ACTIVITY_PREFERENCES;
  }
}

export function writeActivityPreferences(preferences: ActivityCategoryCode[]): void {
  if (typeof window === "undefined") return;

  const validCategories = new Set(activityPreferenceOptions.map((option) => option.category));
  const normalized = preferences.filter((category) => validCategories.has(category));

  try {
    window.localStorage.setItem(ACTIVITY_PREFERENCES_KEY, JSON.stringify(normalized));
  } catch {
    // Ignore storage write errors.
  }
}
