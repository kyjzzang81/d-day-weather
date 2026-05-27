import type { OutingMode } from "./outingModeTypes";

export const outingModeOptions: Array<{ value: OutingMode; label: string }> = [
  { value: "daily", label: "일상" },
  { value: "activity", label: "액티비티" },
  { value: "rest", label: "휴식" },
  { value: "with_child", label: "아이와" },
  { value: "date_friends", label: "연인·친구" },
];

export function getOutingModeLabel(mode: OutingMode): string {
  return outingModeOptions.find((option) => option.value === mode)?.label ?? "일상";
}
