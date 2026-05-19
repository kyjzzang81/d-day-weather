import type { CSSProperties } from "react";
import { getGradeVisual, type GradeCode, type GradeContext } from "../../design/grade";
import { colors, spacing } from "../../design/tokens";

interface DotIndicatorProps {
  grade: GradeCode | "uhm.." | "강력추천" | "추천" | "보통" | "비추천";
  context?: GradeContext;
  size?: number;
}

export function DotIndicator({ grade, context = "today", size = 7 }: DotIndicatorProps) {
  const visual = getGradeVisual(grade, context);
  const dots = Array.from({ length: 3 }, (_, index) => index < visual.dotCount);

  const wrapperStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: spacing.xs
  };

  return (
    <span aria-label={visual.accessibilityLabel} role="img" style={wrapperStyle}>
      {dots.map((isActive, index) => (
        <span
          key={index}
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            background: isActive ? visual.color : colors.border,
            display: "inline-block"
          }}
        />
      ))}
    </span>
  );
}
