import type { CSSProperties } from "react";
import { colors, radius, spacing } from "../../design/tokens";

interface LoadingSkeletonProps {
  rows?: number;
  message?: string;
}

export function LoadingSkeleton({ rows = 3, message }: LoadingSkeletonProps) {
  const skeletonStyle: CSSProperties = {
    display: "grid",
    gap: spacing.md
  };

  return (
    <div aria-busy="true" aria-live="polite" style={skeletonStyle}>
      {message ? <p style={{ color: colors.textSecondary, margin: 0 }}>{message}</p> : null}
      {Array.from({ length: rows }, (_, index) => (
        <div
          key={index}
          className="skeletonBlock"
          style={{
            height: index === 0 ? 132 : 68,
            borderRadius: index === 0 ? radius.xl : radius.lg
          }}
        />
      ))}
    </div>
  );
}
