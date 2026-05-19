export const motion = {
  duration: {
    fast: "120ms",
    normal: "180ms",
    slow: "260ms"
  },
  easing: {
    standard: "cubic-bezier(0.2, 0, 0, 1)",
    gentle: "cubic-bezier(0.16, 1, 0.3, 1)"
  },
  transition: {
    press: "transform 120ms cubic-bezier(0.2, 0, 0, 1), box-shadow 180ms cubic-bezier(0.2, 0, 0, 1)",
    sheet: "transform 260ms cubic-bezier(0.16, 1, 0.3, 1), opacity 180ms cubic-bezier(0.2, 0, 0, 1)"
  }
} as const;
