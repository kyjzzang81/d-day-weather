import type { GradeCode } from "../../design/grade";
import type { DateContext } from "../dateSignal/dateSignalTypes";
import type { LocalContent } from "../localContent/localContentTypes";
import type { ReminderType, SavedContent, SavedContentStatus } from "./savedContentTypes";

export const SAVED_CONTENTS_STORAGE_KEY = "ggg.savedContents.v1";
export const SAVED_CONTENTS_CHANGED_EVENT = "ggg:savedContentsChanged";

export const reminderOptions: Array<{ type: ReminderType; label: string }> = [
  { type: "day_before_9am", label: "하루 전 오전 9시" },
  { type: "same_day_8am", label: "당일 오전 8시" },
  { type: "weather_change", label: "날씨가 바뀌면" },
  { type: "none", label: "알림 없이 저장" },
];

export function readSavedContents(): SavedContent[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(SAVED_CONTENTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedContent[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveContentWishlist(content: LocalContent): SavedContent {
  return upsertSavedContent(content, {
    status: "wishlist",
    reminderType: "none",
  });
}

export function saveContentPlanned(content: LocalContent, context: DateContext, reminderType: ReminderType): SavedContent {
  return upsertSavedContent(content, {
    status: "planned",
    targetDate: context.targetDate,
    dateLabel: context.label,
    basis: context.basis,
    basisLabel: context.basisLabel,
    signalGrade: content.grade,
    reminderType,
  });
}

export function markSavedContentVisited(savedId: string): void {
  const items = readSavedContents().map((item) =>
    item.id === savedId
      ? {
          ...item,
          status: "visited" as SavedContentStatus,
          visitedAt: new Date().toISOString().slice(0, 10),
        }
      : item,
  );
  writeSavedContents(items);
}

function upsertSavedContent(
  content: LocalContent,
  options: {
    status: SavedContentStatus;
    targetDate?: string;
    dateLabel?: string;
    basis?: "forecast" | "historical_trend";
    basisLabel?: string;
    signalGrade?: GradeCode;
    reminderType: ReminderType;
  },
): SavedContent {
  const items = readSavedContents();
  const existing = items.find((item) => item.contentId === content.id && item.status !== "visited");
  const reminder = reminderOptions.find((option) => option.type === options.reminderType) ?? reminderOptions[0];
  const now = new Date().toISOString();

  const next: SavedContent = {
    id: existing?.id ?? `saved_${content.id}_${Date.now()}`,
    contentId: content.id,
    title: content.title,
    status: options.status,
    targetDate: options.targetDate,
    dateLabel: options.dateLabel,
    basis: options.basis,
    basisLabel: options.basisLabel,
    signalGrade: options.signalGrade ?? content.grade,
    signalSnapshot: {
      grade: options.signalGrade ?? content.grade,
      basisLabel: options.basisLabel ?? content.basisLabel,
      savedAt: now,
    },
    reminder: {
      enabled: reminder.type !== "none",
      type: reminder.type,
      label: reminder.label,
    },
    createdAt: existing?.createdAt ?? now,
    visitedAt: existing?.visitedAt,
  };

  const withoutExisting = existing ? items.filter((item) => item.id !== existing.id) : items;
  writeSavedContents([next, ...withoutExisting]);
  return next;
}

function writeSavedContents(items: SavedContent[]): void {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(SAVED_CONTENTS_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(SAVED_CONTENTS_CHANGED_EVENT));
}
