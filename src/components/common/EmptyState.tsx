import type { CSSProperties, ReactNode } from "react";
import { colors, radius, shadows, spacing, typography } from "../../design/tokens";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  const stateStyle: CSSProperties = {
    borderRadius: radius.xl,
    background: colors.surface,
    boxShadow: shadows.card,
    padding: spacing.xl,
    textAlign: "center"
  };

  return (
    <section style={stateStyle}>
      <div className="softIllustration" aria-hidden="true" />
      <h2 style={{ color: colors.textPrimary, margin: `${spacing.md}px 0 ${spacing.xs}px`, ...typography.title3 }}>
        {title}
      </h2>
      <p style={{ color: colors.textSecondary, margin: `0 0 ${spacing.lg}px`, ...typography.body2 }}>{description}</p>
      {action}
    </section>
  );
}
