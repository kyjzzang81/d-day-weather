export const colors = {
  background: "#F7F8FF",
  backgroundSoftBlue: "#EEF0FF",
  surface: "#FFFFFF",
  surfaceMuted: "#F4F5FF",

  textPrimary: "#1F2933",
  textSecondary: "#64707D",
  textTertiary: "#9AA5B1",
  textInverse: "#FFFFFF",

  border: "#E4E7F5",
  divider: "#ECEEFA",

  accent: "#5260FE",
  accentSoft: "#E7E9FF",
  accentSecondary: "#C871FD",
  accentSecondarySoft: "#F5E7FF",

  success: "#14EB00",
  successSoft: "#E8FFE5",

  recommendation: "#5260FE",
  recommendationSoft: "#E7E9FF",

  caution: "#FF8F2E",
  cautionSoft: "#FFF0E4",

  neutral: "#9AA5B1",
  neutralSoft: "#F4F6F8",

  danger: "#FF5B5B",
  dangerSoft: "#FFEAEA"
} as const;

export const typography = {
  display: {
    fontSize: 30,
    lineHeight: "38px",
    fontWeight: 700
  },
  title1: {
    fontSize: 24,
    lineHeight: "32px",
    fontWeight: 700
  },
  title2: {
    fontSize: 20,
    lineHeight: "28px",
    fontWeight: 700
  },
  title3: {
    fontSize: 17,
    lineHeight: "24px",
    fontWeight: 600
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
    fontWeight: 400
  },
  button: {
    fontSize: 16,
    lineHeight: "22px",
    fontWeight: 600
  }
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 40
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  pill: 999
} as const;

export const shadows = {
  card: "0 8px 24px rgba(31, 41, 51, 0.07)",
  floating: "0 16px 40px rgba(31, 41, 51, 0.13)",
  bottomSheet: "0 -12px 40px rgba(31, 41, 51, 0.16)"
} as const;

export const layout = {
  mobileMaxWidth: 430,
  contentPadding: 20,
  cardPadding: 18,
  bottomTabHeight: 82
} as const;

export const fontFamily =
  '-apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", Pretendard, "Noto Sans KR", system-ui, sans-serif';

export const tokens = {
  colors,
  typography,
  spacing,
  radius,
  shadows,
  layout,
  fontFamily
} as const;
