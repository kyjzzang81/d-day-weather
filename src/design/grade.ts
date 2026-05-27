import { colors } from "./tokens";

export type GradeCode = "gorgeous" | "great" | "good" | "uhm";
export type GradeContext = "today" | "discover" | "dday";
export type SignalLabel = "GREAT" | "GOOD" | "CAUTION" | "BAD";

export interface GradeVisual {
  code: GradeCode;
  label: string;
  signalLabel: SignalLabel;
  color: string;
  softColor: string;
  dotCount: 0 | 1 | 2 | 3;
  accessibilityLabel: string;
}

export const gradeOrder: GradeCode[] = ["uhm", "good", "great", "gorgeous"];

export const normalizeGrade = (
  grade: GradeCode | "uhm.." | "강력추천" | "강렬추천" | "추천" | "보통" | "조금 추천" | "비추천"
): GradeCode => {
  if (grade === "uhm.." || grade === "비추천") {
    return "uhm";
  }

  if (grade === "강력추천" || grade === "강렬추천") {
    return "gorgeous";
  }

  if (grade === "추천") {
    return "great";
  }

  if (grade === "보통" || grade === "조금 추천") {
    return "good";
  }

  return grade;
};

export const getGradeFromScore = (score: number): GradeCode => {
  if (score >= 85) {
    return "gorgeous";
  }

  if (score >= 70) {
    return "great";
  }

  if (score >= 50) {
    return "good";
  }

  return "uhm";
};

export const getGradeVisual = (
  grade: GradeCode | "uhm.." | "강력추천" | "강렬추천" | "추천" | "보통" | "조금 추천" | "비추천",
  context: GradeContext = "today"
): GradeVisual => {
  const code = normalizeGrade(grade);
  const labels: Record<GradeCode, string> = {
    gorgeous: context === "discover" ? "GREAT" : "GREAT",
    great: context === "discover" ? "GOOD" : "GOOD",
    good: context === "discover" ? "CAUTION" : "CAUTION",
    uhm: context === "discover" ? "BAD" : "BAD"
  };

  const visualMap: Record<GradeCode, Omit<GradeVisual, "code" | "label" | "accessibilityLabel">> = {
    gorgeous: {
      signalLabel: "GREAT",
      color: colors.accent,
      softColor: colors.accentSoft,
      dotCount: 3
    },
    great: {
      signalLabel: "GOOD",
      color: colors.accent,
      softColor: colors.accentSoft,
      dotCount: 2
    },
    good: {
      signalLabel: "CAUTION",
      color: colors.ink,
      softColor: colors.neutralSoft,
      dotCount: 1
    },
    uhm: {
      signalLabel: "BAD",
      color: colors.caution,
      softColor: colors.cautionSoft,
      dotCount: 0
    }
  };

  const label = labels[code];
  const dotCopy: Record<GradeCode, string> = {
    gorgeous: `${label}, 3단계 중 3단계`,
    great: `${label}, 3단계 중 2단계`,
    good: `${label}, 3단계 중 1단계`,
    uhm: label
  };

  return {
    code,
    label,
    accessibilityLabel: dotCopy[code],
    ...visualMap[code]
  };
};
