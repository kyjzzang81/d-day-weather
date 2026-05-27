import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";
import { colors, radius, spacing, typography } from "../../design/tokens";

interface CategoryChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  selected?: boolean;
  icon?: ReactNode;
}

export function CategoryChip({ label, selected = false, icon, style, ...props }: CategoryChipProps) {
  const chipStyle: CSSProperties = {
    minHeight: 42,
    borderRadius: radius.pill,
    border: `1px solid ${selected ? colors.accent : colors.border}`,
    background: colors.surface,
    color: selected ? colors.accent : colors.textPrimary,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    padding: `${spacing.sm}px ${spacing.md}px`,
    boxShadow: "none",
    cursor: "pointer",
    ...typography.body2,
    fontWeight: selected ? 800 : 600,
    ...style
  };

  return (
    <button type="button" aria-pressed={selected} style={chipStyle} {...props}>
      {icon}
      <span>{label}</span>
    </button>
  );
}
