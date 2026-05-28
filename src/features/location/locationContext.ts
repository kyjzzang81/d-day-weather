import type { TodayPayload } from "../today/todayPayload";

const LOCATION_CONTEXT_STORAGE_KEY = "ggg.locationContext.v1";

export type LocationContext = {
  locationLabel: string;
  updatedAtLabel?: string;
};

const fallbackLocationContext: LocationContext = {
  locationLabel: "현재 위치 확인 중",
};

export function readLocationContext(): LocationContext {
  if (typeof window === "undefined") return fallbackLocationContext;

  try {
    const raw = window.localStorage.getItem(LOCATION_CONTEXT_STORAGE_KEY);
    if (!raw) return fallbackLocationContext;
    const parsed = JSON.parse(raw) as Partial<LocationContext>;
    if (!parsed.locationLabel) return fallbackLocationContext;
    return {
      locationLabel: parsed.locationLabel,
      updatedAtLabel: parsed.updatedAtLabel,
    };
  } catch {
    return fallbackLocationContext;
  }
}

export function writeLocationContextFromTodayPayload(payload: TodayPayload): void {
  if (typeof window === "undefined") return;

  const context: LocationContext = {
    locationLabel: payload.locationLabel,
    updatedAtLabel: payload.updatedAtLabel,
  };
  window.localStorage.setItem(LOCATION_CONTEXT_STORAGE_KEY, JSON.stringify(context));
}
