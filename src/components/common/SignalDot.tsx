import type { CSSProperties } from "react";
import { getGradeVisual, type GradeCode } from "../../design/grade";

interface SignalDotProps {
  grade?: GradeCode | "uhm.." | "강력추천" | "추천" | "보통" | "비추천";
  size?: number;
  color?: string;
  className?: string;
}

export function SignalDot({ grade, size = 10, color, className = "signalDot" }: SignalDotProps) {
  const visual = grade ? getGradeVisual(grade) : null;
  const style: CSSProperties = {
    width: size,
    height: size,
    background: color ?? visual?.color,
  };

  return <span className={className} style={style} aria-hidden="true" />;
}
