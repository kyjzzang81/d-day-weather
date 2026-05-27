import type { DateContext } from "./dateSignalTypes";

export const FORECAST_AVAILABLE_DAYS = 10;

const formatDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const formatShortKoreanDate = (dateKey: string) => {
  const [, month, day] = dateKey.split("-");
  return `${Number(month)}월 ${Number(day)}일`;
};

export function getDateContext(date: Date): DateContext {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(date);
  target.setHours(0, 0, 0, 0);

  const dayDiff = Math.round((target.getTime() - today.getTime()) / 86_400_000);
  const basis = dayDiff <= FORECAST_AVAILABLE_DAYS ? "forecast" : "historical_trend";
  const basisLabel = basis === "forecast" ? "예보 기준" : "최근 10년 경향 기준";
  const targetDate = formatDateKey(target);
  const dateLabel = dayDiff === 0 ? "오늘" : formatShortKoreanDate(targetDate);

  return {
    targetDate,
    label: `${dateLabel} 기준`,
    basis,
    basisLabel,
  };
}

export function getTodayDateContext(): DateContext {
  return getDateContext(new Date());
}

export function getWeekendDateContext(): DateContext {
  const date = new Date();
  const day = date.getDay();
  const daysUntilSaturday = day === 6 ? 0 : (6 - day + 7) % 7;
  date.setDate(date.getDate() + daysUntilSaturday);
  return getDateContext(date);
}

export function getFixedDateContext(month: number, day: number): DateContext {
  const date = new Date();
  date.setMonth(month - 1, day);
  return getDateContext(date);
}

export const dateContextLabel = (context: DateContext) =>
  `${context.label} · ${context.basisLabel}`;
