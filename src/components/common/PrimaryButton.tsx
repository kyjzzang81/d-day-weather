import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";
import {
  colors,
  radius,
  shadows,
  spacing,
  typography,
} from "../../design/tokens";
import { motion } from "../../design/motion";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  fullWidth?: boolean;
}

export function PrimaryButton({
  children,
  fullWidth = true,
  style,
  ...props
}: PrimaryButtonProps) {
  const buttonStyle: CSSProperties = {
    width: fullWidth ? "100%" : "auto",
    border: 0,
    borderRadius: radius.md,
    padding: `${spacing.sm}px ${spacing.md}px`,
    background: colors.accent,
    color: colors.textInverse,
    boxShadow: shadows.card,
    cursor: props.disabled ? "not-allowed" : "pointer",
    opacity: props.disabled ? 0.55 : 1,
    transition: motion.transition.press,
    ...typography.button,
    ...style,
  };

  return (
    <button type="button" style={buttonStyle} {...props}>
      {children}
    </button>
  );
}
