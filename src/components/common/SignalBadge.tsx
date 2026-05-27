import type { GradeCode } from "../../design/grade";
import { getGradeVisual } from "../../design/grade";
import { SignalDot } from "./SignalDot";

interface SignalBadgeProps {
  grade: GradeCode | "uhm.." | "강력추천" | "추천" | "보통" | "비추천";
  basisLabel?: string;
  compact?: boolean;
}

export function SignalBadge({ grade, basisLabel, compact = false }: SignalBadgeProps) {
  const visual = getGradeVisual(grade);

  return (
    <span className="signalBadge" data-compact={compact}>
      <SignalDot grade={visual.code} size={compact ? 8 : 10} />
      <strong>{visual.signalLabel}</strong>
      {basisLabel ? <span>{basisLabel}</span> : null}
    </span>
  );
}
