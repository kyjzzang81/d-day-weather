import type { GradeCode } from "../../design/grade";

export type SavedContentStatus = "wishlist" | "planned" | "visited";

export type ReminderType =
  | "day_before_9am"
  | "same_day_8am"
  | "weather_change"
  | "none";

export type SavedContent = {
  id: string;
  contentId: string;
  title: string;
  status: SavedContentStatus;

  targetDate?: string;
  dateLabel?: string;

  basis?: "forecast" | "historical_trend";
  basisLabel?: string;

  signalGrade?: GradeCode;
  signalSnapshot?: unknown;

  reminder: {
    enabled: boolean;
    type: ReminderType;
    label: string;
  };

  createdAt: string;
  visitedAt?: string;
};
