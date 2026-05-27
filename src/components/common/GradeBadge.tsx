import type { CSSProperties } from "react";
import { getGradeVisual, type GradeCode, type GradeContext } from "../../design/grade";
import { radius, spacing, typography } from "../../design/tokens";
import { SignalDot } from "./SignalDot";

interface GradeBadgeProps {
  grade: GradeCode | "uhm.." | "강력추천" | "추천" | "보통" | "비추천";
  context?: GradeContext;
  showDots?: boolean;
}

export function GradeBadge({ grade, context = "today" }: GradeBadgeProps) {
  const visual = getGradeVisual(grade, context);
  const badgeStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    width: "fit-content",
    maxWidth: "100%",
    justifySelf: "start",
    alignSelf: "center",
    borderRadius: radius.pill,
    padding: `4px 9px`,
    background: visual.softColor,
    color: visual.color,
    ...typography.caption,
    fontSize: 11,
    lineHeight: "16px",
    fontWeight: 700,
    whiteSpace: "nowrap"
  };

  return (
    <span style={badgeStyle}>
      <SignalDot grade={visual.code} size={7} />
      {visual.signalLabel}
    </span>
  );
}
