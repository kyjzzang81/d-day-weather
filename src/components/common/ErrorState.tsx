import type { ReactNode } from "react";
import { colors, radius, shadows, spacing, typography } from "../../design/tokens";

interface ErrorStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function ErrorState({ title, description, action }: ErrorStateProps) {
  return (
    <section
      style={{
        borderRadius: radius.xl,
        background: colors.surface,
        border: `1px solid ${colors.dangerSoft}`,
        boxShadow: shadows.card,
        padding: spacing.xl
      }}
    >
      <p style={{ color: colors.danger, margin: `0 0 ${spacing.xs}px`, ...typography.title3 }}>{title}</p>
      <p style={{ color: colors.textSecondary, margin: `0 0 ${spacing.lg}px`, ...typography.body2 }}>{description}</p>
      {action}
    </section>
  );
}
