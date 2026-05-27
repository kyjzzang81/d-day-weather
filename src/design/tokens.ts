export const colors = {
  ink: "#141A24",
  black: "#000000",
  background: "#F3F4F6",
  backgroundSoftBlue: "#EBF5FF",
  surface: "#FFFFFF",
  surfaceWarm: "#FFFFFF",
  surfaceMuted: "#F7F8FA",

  textStrong: "#141A24",
  textPrimary: "#191F28",
  textSecondary: "#6B7078",
  textTertiary: "#A7ADB7",
  textDisabled: "#D4D8E1",
  textInverse: "#FFFFFF",

  line: "#EEF0F3",
  border: "#EEF0F3",
  borderWeak: "#F7F8FA",
  divider: "#EEF0F3",
  dividerWeak: "#F7F8FA",

  accent: "#0078FF",
  accentStrong: "#0069FF",
  accentHeavy: "#0052E0",
  accentSoft: "#EBF5FF",
  signalOrange: "#FF8800",
  signalOrangeSoft: "#FFF8E6",
  accentSecondary: "#FF8800",
  accentSecondarySoft: "#FFF8E6",

  signalGreen: "#04CA81",
  signalGreenStrong: "#00BB83",
  signalGreenSoft: "#E6FEF0",
  success: "#04CA81",
  successStrong: "#00BB83",
  successSoft: "#E6FEF0",

  recommendation: "#04CA81",
  recommendationSoft: "#E6FEF0",

  caution: "#FF8800",
  cautionStrong: "#FA7900",
  cautionSoft: "#FFF8E6",

  neutral: "#697383",
  neutralSoft: "#F7F8FA",

  danger: "#FF3A5B",
  dangerStrong: "#F51441",
  dangerSoft: "#FFF0F3"
} as const;

export const typography = {
  display: {
    fontSize: 34,
    lineHeight: "42px",
    fontWeight: 800,
    letterSpacing: "-0.2px"
  },
  title1: {
    fontSize: 28,
    lineHeight: "38px",
    fontWeight: 800
  },
  title2: {
    fontSize: 22,
    lineHeight: "32px",
    fontWeight: 800
  },
  title3: {
    fontSize: 18,
    lineHeight: "26px",
    fontWeight: 700
  },
  body1: {
    fontSize: 16,
    lineHeight: "24px",
    fontWeight: 400
  },
  body2: {
    fontSize: 14,
    lineHeight: "22px",
    fontWeight: 400
  },
  caption: {
    fontSize: 12,
    lineHeight: "18px",
    fontWeight: 500
  },
  button: {
    fontSize: 17,
    lineHeight: "24px",
    fontWeight: 800
  }
} as const;

export const spacing = {
  none: 0,
  xxxs: 1,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  lg2: 20,
  xl: 24,
  xl2: 28,
  xxl: 32,
  xxl2: 36,
  xxxl: 40
} as const;

export const radius = {
  xs: 8,
  sm: 10,
  md: 12,
  lg: 18,
  xl: 24,
  xxl: 28,
  sheet: 32,
  pill: 999
} as const;

export const shadows = {
  card: "0 1px 2px rgba(20, 26, 36, 0.03)",
  floating: "0 10px 28px rgba(20, 26, 36, 0.08)",
  bottomSheet: "0 -14px 36px rgba(20, 26, 36, 0.18)"
} as const;

export const layout = {
  mobileMaxWidth: 430,
  contentPadding: 18,
  cardPadding: 18,
  bottomTabHeight: 82
} as const;

export const fontFamily =
  'Pretendard, -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Noto Sans KR", system-ui, sans-serif';

export const tokens = {
  colors,
  typography,
  spacing,
  radius,
  shadows,
  layout,
  fontFamily
} as const;
