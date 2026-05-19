import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";
import { colors, radius, shadows, spacing, typography } from "../../design/tokens";

interface CategoryChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  selected?: boolean;
  icon?: ReactNode;
}

export function CategoryChip({ label, selected = false, icon, style, ...props }: CategoryChipProps) {
  const chipStyle: CSSProperties = {
    minHeight: 44,
    borderRadius: radius.lg,
    border: `1px solid ${selected ? colors.success : colors.border}`,
    background: selected ? colors.successSoft : colors.surface,
    color: selected ? colors.textPrimary : colors.textSecondary,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    padding: `${spacing.sm}px ${spacing.md}px`,
    boxShadow: selected ? shadows.card : "none",
    cursor: "pointer",
    ...typography.body2,
    fontWeight: selected ? 700 : 500,
    ...style
  };

  return (
    <button type="button" aria-pressed={selected} style={chipStyle} {...props}>
      {icon}
      <span>{label}</span>
    </button>
  );
}
