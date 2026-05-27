import type { GradeCode } from "../../design/grade";
import type { Metric, TodayPayload } from "../today/todayPayload";

export type WeatherCheckKind = "rain" | "wind" | "dust" | "feelsLike";
export type WeatherCheckIconKey =
  | "rain-low"
  | "rain-normal"
  | "rain-caution"
  | "rain-bad"
  | "wind-low"
  | "wind-normal"
  | "wind-caution"
  | "wind-bad"
  | "dust-good"
  | "dust-normal"
  | "dust-bad"
  | "dust-very-bad"
  | "feels-like-cold"
  | "feels-like-cool"
  | "feels-like-comfort"
  | "feels-like-warm"
  | "feels-like-hot";

export type WeatherCheckItem = {
  kind: WeatherCheckKind;
  label: string;
  value: string;
  status: string;
  grade: GradeCode;
  iconKey: WeatherCheckIconKey;
};

const getMetric = (metrics: Metric[], label: string) =>
  metrics.find((metric) => metric.label === label);

const getFirstNumber = (value: string): number | null => {
  const match = value.match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
};

const getRainStatus = (value: string): Pick<WeatherCheckItem, "status" | "grade" | "iconKey"> => {
  const percent = getFirstNumber(value);

  if (percent === null) return { status: "확인", grade: "good", iconKey: "rain-normal" };
  if (percent <= 20) return { status: "낮음", grade: "great", iconKey: "rain-low" };
  if (percent <= 40) return { status: "보통", grade: "good", iconKey: "rain-normal" };
  if (percent <= 60) return { status: "우산 체크", grade: "good", iconKey: "rain-caution" };
  return { status: "우산 필요", grade: "uhm", iconKey: "rain-bad" };
};

const getWindStatus = (value: string): Pick<WeatherCheckItem, "status" | "grade" | "iconKey"> => {
  const speed = getFirstNumber(value);

  if (speed === null) return { status: "확인", grade: "good", iconKey: "wind-normal" };
  if (speed < 4) return { status: "약함", grade: "great", iconKey: "wind-low" };
  if (speed < 7) return { status: "보통", grade: "good", iconKey: "wind-normal" };
  if (speed < 10) return { status: "강함", grade: "uhm", iconKey: "wind-caution" };
  return { status: "매우 강함", grade: "uhm", iconKey: "wind-bad" };
};

const getDustStatus = (value: string): Pick<WeatherCheckItem, "status" | "grade" | "iconKey"> => {
  const normalized = value.replace(/\s/g, "");

  if (normalized.includes("매우나쁨")) return { status: "매우 나쁨", grade: "uhm", iconKey: "dust-very-bad" };
  if (normalized.includes("나쁨")) return { status: "나쁨", grade: "uhm", iconKey: "dust-bad" };
  if (normalized.includes("보통")) return { status: "보통", grade: "good", iconKey: "dust-normal" };
  if (normalized.includes("좋음")) return { status: "좋음", grade: "great", iconKey: "dust-good" };

  const pmValue = getFirstNumber(value);
  if (pmValue === null) return { status: "확인", grade: "good", iconKey: "dust-normal" };
  if (pmValue <= 15) return { status: "좋음", grade: "great", iconKey: "dust-good" };
  if (pmValue <= 35) return { status: "보통", grade: "good", iconKey: "dust-normal" };
  if (pmValue <= 75) return { status: "나쁨", grade: "uhm", iconKey: "dust-bad" };
  return { status: "매우 나쁨", grade: "uhm", iconKey: "dust-very-bad" };
};

const getFeelsLikeStatus = (value: string): Pick<WeatherCheckItem, "status" | "grade" | "iconKey"> => {
  const temperature = getFirstNumber(value);

  if (temperature === null) return { status: "확인", grade: "good", iconKey: "feels-like-comfort" };
  if (temperature <= 4) return { status: "추움", grade: "uhm", iconKey: "feels-like-cold" };
  if (temperature <= 9) return { status: "쌀쌀", grade: "good", iconKey: "feels-like-cool" };
  if (temperature <= 17) return { status: "선선", grade: "good", iconKey: "feels-like-cool" };
  if (temperature <= 24) return { status: "쾌적", grade: "great", iconKey: "feels-like-comfort" };
  if (temperature <= 27) return { status: "따뜻", grade: "good", iconKey: "feels-like-warm" };
  if (temperature <= 30) return { status: "더움", grade: "good", iconKey: "feels-like-warm" };
  return { status: "매우 더움", grade: "uhm", iconKey: "feels-like-hot" };
};

export function getWeatherCheckItems(payload: TodayPayload): WeatherCheckItem[] {
  const rain = getMetric(payload.metrics, "강수확률");
  const wind = getMetric(payload.metrics, "바람");
  const dust = getMetric(payload.metrics, "미세먼지");
  const feelsLike = payload.supportMetrics.find((metric) => metric.label === "체감온도");

  const rainValue = rain?.current.value ?? "20%";
  const windValue = wind?.current.value ?? "2m/s";
  const dustValue = dust?.current.value ?? "좋음";
  const feelsLikeValue = feelsLike?.value ?? "22°";

  return [
    {
      kind: "rain",
      label: "비",
      value: rainValue,
      ...getRainStatus(rainValue),
    },
    {
      kind: "wind",
      label: "바람",
      value: windValue,
      ...getWindStatus(windValue),
    },
    {
      kind: "dust",
      label: "먼지",
      value: dustValue,
      ...getDustStatus(dustValue),
    },
    {
      kind: "feelsLike",
      label: "체감",
      value: feelsLikeValue,
      ...getFeelsLikeStatus(feelsLikeValue),
    },
  ];
}
