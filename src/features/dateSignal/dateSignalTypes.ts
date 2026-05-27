export type DateBasis = "forecast" | "historical_trend";

export type DateContext = {
  targetDate: string;
  label: string;
  basis: DateBasis;
  basisLabel: string;
};
