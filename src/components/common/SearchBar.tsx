import type { ChangeEventHandler, CSSProperties } from "react";
import { colors, radius, shadows, spacing, typography } from "../../design/tokens";

interface SearchBarProps {
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  label?: string;
}

export function SearchBar({ value, onChange, placeholder = "검색어를 입력하세요", label = "검색" }: SearchBarProps) {
  const wrapperStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: spacing.sm,
    minHeight: 50,
    borderRadius: radius.lg,
    background: colors.surface,
    border: `1px solid ${colors.border}`,
    boxShadow: shadows.card,
    padding: `0 ${spacing.md}px`
  };

  return (
    <label style={wrapperStyle}>
      <span aria-hidden="true" style={{ color: colors.textTertiary }}>
        ⌕
      </span>
      <span className="srOnly">{label}</span>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          flex: 1,
          border: 0,
          outline: 0,
          color: colors.textPrimary,
          background: "transparent",
          ...typography.body2
        }}
      />
    </label>
  );
}
