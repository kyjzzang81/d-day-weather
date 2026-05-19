import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";
import { colors, radius, spacing, typography } from "../../design/tokens";
import { motion } from "../../design/motion";

interface SecondaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  fullWidth?: boolean;
}

export function SecondaryButton({ children, fullWidth = true, style, ...props }: SecondaryButtonProps) {
  const buttonStyle: CSSProperties = {
    width: fullWidth ? "100%" : "auto",
    minHeight: 48,
    border: `1px solid ${colors.accent}`,
    borderRadius: radius.md,
    padding: `${spacing.md}px ${spacing.lg}px`,
    background: colors.surface,
    color: colors.accent,
    cursor: props.disabled ? "not-allowed" : "pointer",
    opacity: props.disabled ? 0.55 : 1,
    transition: motion.transition.press,
    ...typography.button,
    ...style
  };

  return (
    <button type="button" style={buttonStyle} {...props}>
      {children}
    </button>
  );
}
