import type { GradeCode } from "../../design/grade";
import { readActivityPreferences } from "../activityPreferences/activityPreferenceStore";
import { LocationUnavailableError } from "../../lib/locationErrors";

export type ActivityCategoryCode =
  | "beach"
  | "hiking"
  | "camping"
  | "scenic"
  | "photo"
  | "urban"
  | "cafe"
  | "festival"
  | "spa"
  | "indoor";

export interface Metric {
  label: string;
  value: string;
  tone?: GradeCode;
  detail: string;
}

export interface DayFlowItem {
  label: string;
  value: string;
  grade: GradeCode;
}

export interface Activity {
  category: ActivityCategoryCode;
  title: string;
  grade: GradeCode;
  reason: string;
  goodReasons: string[];
  cautions: string[];
  timeRecommendations: ActivityTimeRecommendation[];
}

export interface ActivityTimeRecommendation {
  label: string;
  time: string;
  grade: GradeCode;
}

export interface HourlyWeather {
  time: string;
  grade: GradeCode;
  summary: string;
  temperature: string;
  rainProbability: string;
  wind: string;
  pm25: string;
}

export interface DdaySummary {
  title: string;
  dateLabel: string;
  location: string;
  grade: GradeCode;
}

export interface SupportMetric {
  label: string;
  value: string;
}

export interface ActivityImpact {
  label: string;
  summary: string;
  grade: GradeCode;
}

export interface TodayPayload {
  source: "mock" | "live";
  locationLabel: string;
  updatedAtLabel: string;
  grade: GradeCode;
  reasons: string[];
  metrics: Metric[];
  supportMetrics: SupportMetric[];
  prepHints: string[];
  activityImpacts: ActivityImpact[];
  dayFlow: DayFlowItem[];
  activities: Activity[];
  ddaySummary: DdaySummary | null;
  hourlyWeather: HourlyWeather[];
}

interface Coordinates {
  lat: number;
  lon: number;
  displayLocationHint?: string;
}

type CachedTodayPayload = {
  payload: TodayPayload;
  expiresAt: number;
  categoriesKey: string;
};

const TODAY_PAYLOAD_CACHE_KEY = "ggg.todayPayload.v2";
const LEGACY_TODAY_PAYLOAD_CACHE_KEY = "ggg.todayPayload.v1";
const TODAY_PAYLOAD_CACHE_TTL_MS = 30 * 60 * 1000;

export const mockTodayPayload: TodayPayload = {
  source: "mock",
  locationLabel: "성수동",
  updatedAtLabel: "6월 2일 (월) 09:30 기준",
  grade: "gorgeous",
  reasons: ["가벼운 외출과 산책에 좋아요", "비 가능성이 낮고 바람도 안정적이에요"],
  metrics: [
    { label: "강수확률", value: "20%", tone: "great", detail: "우산 없이 짧은 외출은 괜찮아요. 오래 머문다면 접이식 우산만 챙겨도 충분해요." },
    { label: "강수량", value: "0mm", tone: "gorgeous", detail: "비 때문에 일정이 크게 흔들릴 가능성은 낮아요." },
    { label: "바람", value: "2m/s", tone: "great", detail: "산책, 피크닉, 사진 촬영 모두 무난해요." },
    { label: "미세먼지", value: "좋음", tone: "gorgeous", detail: "아이와 함께하거나 오래 걷기에도 부담이 적어요." }
  ],
  supportMetrics: [
    { label: "체감온도", value: "24°" },
    { label: "습도", value: "52%" },
    { label: "UV", value: "보통" }
  ],
  prepHints: ["겉옷은 얇게", "우산은 선택", "오후 햇빛은 조금 체크"],
  activityImpacts: [
    { label: "피크닉/도시산책", summary: "가볍게 오래 걷기 좋아요", grade: "gorgeous" },
    { label: "카페/맛집", summary: "날씨 영향이 적어요", grade: "great" },
    { label: "사진/뷰", summary: "오후 구름만 확인하세요", grade: "good" }
  ],
  dayFlow: [
    { label: "일출", value: "05:27", grade: "great" },
    { label: "오전", value: "좋음", grade: "gorgeous" },
    { label: "오후", value: "추천", grade: "great" },
    { label: "저녁", value: "조금", grade: "good" },
    { label: "일몰", value: "19:48", grade: "great" }
  ],
  activities: [
    {
      category: "urban",
      title: "피크닉/도시산책",
      grade: "gorgeous",
      reason: "햇빛과 바람 모두 편안해요",
      goodReasons: ["비 가능성이 낮아요 (20%)", "바람이 약하고 안정적이에요 (2m/s)"],
      cautions: ["오후에는 구름이 조금 늘 수 있어요"],
      timeRecommendations: [
        { label: "오전", time: "06~12시", grade: "gorgeous" },
        { label: "오후", time: "12~18시", grade: "great" },
        { label: "저녁", time: "18~24시", grade: "great" }
      ]
    },
    {
      category: "cafe",
      title: "카페/맛집",
      grade: "great",
      reason: "짧은 이동에도 부담이 적어요",
      goodReasons: ["강수량이 거의 없어요 (0mm)", "미세먼지가 좋아 이동이 편해요"],
      cautions: ["점심 시간대에는 체감온도가 조금 오를 수 있어요"],
      timeRecommendations: [
        { label: "오전", time: "06~12시", grade: "great" },
        { label: "오후", time: "12~18시", grade: "great" },
        { label: "저녁", time: "18~24시", grade: "gorgeous" }
      ]
    },
    {
      category: "photo",
      title: "사진/뷰",
      grade: "good",
      reason: "오후 구름이 조금 늘 수 있어요",
      goodReasons: ["오전 빛이 부드럽고 바람이 약해요", "일몰 시간대는 비 가능성이 낮아요"],
      cautions: ["15시 이후 구름과 바람을 조금 확인하세요"],
      timeRecommendations: [
        { label: "오전", time: "06~12시", grade: "great" },
        { label: "오후", time: "12~18시", grade: "good" },
        { label: "저녁", time: "18~24시", grade: "great" }
      ]
    }
  ],
  ddaySummary: {
    title: "친구들과 제주 여행",
    dateLabel: "6.5 (목) ~ 6.8 (일)",
    location: "제주도",
    grade: "great"
  },
  hourlyWeather: [
    { time: "06:00", grade: "great", summary: "상쾌한 아침", temperature: "18°", rainProbability: "10%", wind: "1m/s", pm25: "좋음" },
    { time: "07:00", grade: "gorgeous", summary: "산책 좋아요", temperature: "19°", rainProbability: "10%", wind: "1m/s", pm25: "좋음" },
    { time: "08:00", grade: "gorgeous", summary: "외출 추천", temperature: "20°", rainProbability: "10%", wind: "2m/s", pm25: "좋음" },
    { time: "09:00", grade: "gorgeous", summary: "햇빛 편안", temperature: "21°", rainProbability: "15%", wind: "2m/s", pm25: "좋음" },
    { time: "10:00", grade: "gorgeous", summary: "활동하기 좋아요", temperature: "22°", rainProbability: "15%", wind: "2m/s", pm25: "좋음" },
    { time: "11:00", grade: "great", summary: "가벼운 바람", temperature: "23°", rainProbability: "20%", wind: "2m/s", pm25: "좋음" },
    { time: "12:00", grade: "great", summary: "점심 외출 무난", temperature: "24°", rainProbability: "20%", wind: "3m/s", pm25: "좋음" },
    { time: "13:00", grade: "great", summary: "구름 조금", temperature: "24°", rainProbability: "20%", wind: "3m/s", pm25: "좋음" },
    { time: "14:00", grade: "great", summary: "야외 활동 무난", temperature: "25°", rainProbability: "20%", wind: "3m/s", pm25: "보통" },
    { time: "15:00", grade: "good", summary: "바람 조금 증가", temperature: "25°", rainProbability: "25%", wind: "4m/s", pm25: "보통" },
    { time: "16:00", grade: "good", summary: "사진은 구름 주의", temperature: "24°", rainProbability: "25%", wind: "4m/s", pm25: "보통" },
    { time: "17:00", grade: "great", summary: "저녁 전 산책 추천", temperature: "23°", rainProbability: "20%", wind: "3m/s", pm25: "좋음" },
    { time: "18:00", grade: "great", summary: "선선해져요", temperature: "22°", rainProbability: "15%", wind: "2m/s", pm25: "좋음" },
    { time: "19:00", grade: "great", summary: "일몰 보기 좋아요", temperature: "21°", rainProbability: "10%", wind: "2m/s", pm25: "좋음" },
    { time: "20:00", grade: "good", summary: "가벼운 겉옷", temperature: "20°", rainProbability: "10%", wind: "2m/s", pm25: "좋음" },
    { time: "21:00", grade: "good", summary: "무난한 귀가", temperature: "19°", rainProbability: "10%", wind: "1m/s", pm25: "좋음" },
    { time: "22:00", grade: "good", summary: "조금 쌀쌀", temperature: "18°", rainProbability: "10%", wind: "1m/s", pm25: "좋음" },
    { time: "23:00", grade: "good", summary: "실내가 편해요", temperature: "18°", rainProbability: "10%", wind: "1m/s", pm25: "좋음" }
  ]
};

export function clearTodayPayloadCache(): void {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(TODAY_PAYLOAD_CACHE_KEY);
  window.localStorage.removeItem(LEGACY_TODAY_PAYLOAD_CACHE_KEY);
}

export async function loadTodayPayload(
  preferredCategories?: ActivityCategoryCode[],
  options?: { skipCache?: boolean }
): Promise<TodayPayload> {
  const categories = preferredCategories && preferredCategories.length ? preferredCategories : readActivityPreferences();
  const categoriesKey = getCategoriesKey(categories);

  if (options?.skipCache) {
    clearTodayPayloadCache();
  } else {
    const cachedPayload = readTodayPayloadCache(categoriesKey);
    if (cachedPayload) {
      return cachedPayload;
    }
  }

  const coordinates = await resolveCoordinates();

  const requestBody: Record<string, unknown> = {
    lat: coordinates.lat,
    lon: coordinates.lon,
    preferred_activity_categories: categories
  };

  if (coordinates.displayLocationHint) {
    requestBody.display_location_hint = coordinates.displayLocationHint;
  }

  const edgePayload = await invokeSupabaseFunction<TodayPayload>("get_today_payload", requestBody);

  if (!isTodayPayload(edgePayload)) {
    throw new Error("get_today_payload 응답 형식이 올바르지 않습니다.");
  }

  writeTodayPayloadCache(edgePayload, categoriesKey);
  return edgePayload;
}

async function resolveCoordinates(): Promise<Coordinates> {
  if (!navigator.geolocation) {
    throw new LocationUnavailableError("이 브라우저에서는 위치 정보를 사용할 수 없어요.");
  }

  if (!window.isSecureContext) {
    throw new LocationUnavailableError("위치 정보는 HTTPS 또는 localhost에서만 사용할 수 있어요.");
  }

  const mobile = isLikelyMobileDevice();
  const attempts: GeolocationRequestOptions[] = mobile
    ? [
        // 1) OS에 캐시된 최근 위치(지도 등)를 먼저 사용
        { enableHighAccuracy: false, maximumAge: 60 * 60 * 1000, timeout: 8000 },
        // 2) Wi-Fi·셀 기반 신규 측정
        { enableHighAccuracy: false, maximumAge: 5 * 60 * 1000, timeout: 25000 },
        // 3) GPS 고정밀
        { enableHighAccuracy: true, maximumAge: 0, timeout: 30000 }
      ]
    : [
        { enableHighAccuracy: true, maximumAge: 5 * 60 * 1000, timeout: 10000 },
        { enableHighAccuracy: false, maximumAge: 10 * 60 * 1000, timeout: 8000 }
      ];

  let lastErrorCode: number | undefined;

  for (const options of attempts) {
    const result = await requestCurrentPosition(options);
    if (result.position) {
      return positionToCoordinates(result.position);
    }

    lastErrorCode = result.errorCode ?? lastErrorCode;
    if (result.errorCode === 1) {
      break;
    }
  }

  if (mobile) {
    const watched = await watchForPosition({
      enableHighAccuracy: false,
      maximumAge: 5 * 60 * 1000,
      timeout: 35000
    });
    if (watched) {
      return positionToCoordinates(watched);
    }
  }

  throw buildLocationUnavailableError(lastErrorCode, mobile);
}

function positionToCoordinates(position: GeolocationPosition): Coordinates {
  return {
    lat: position.coords.latitude,
    lon: position.coords.longitude
  };
}

type GeolocationRequestOptions = {
  enableHighAccuracy: boolean;
  maximumAge: number;
  timeout: number;
};

type GeolocationRequestResult = {
  position: GeolocationPosition | null;
  errorCode?: number;
};

function isLikelyMobileDevice(): boolean {
  if (typeof navigator === "undefined") return false;

  const ua = navigator.userAgent;
  if (/Android|iPhone|iPad|iPod|Mobile/i.test(ua)) {
    return true;
  }

  return navigator.maxTouchPoints > 1 && window.matchMedia("(pointer: coarse)").matches;
}

function buildLocationUnavailableError(errorCode: number | undefined, mobile: boolean): LocationUnavailableError {
  const inAppBrowserHint = mobile
    ? " 카카오톡·인스타 등 앱 안 브라우저라면 Safari나 Chrome으로 링크를 열어주세요."
    : "";

  switch (errorCode) {
    case 1:
      return new LocationUnavailableError(
        `위치 권한이 꺼져 있어요. 휴대폰 설정에서 이 사이트의 위치를 허용한 뒤 다시 시도해주세요.${inAppBrowserHint}`
      );
    case 2:
      return new LocationUnavailableError(
        "GPS 신호를 잡지 못했어요. 설정에서 위치 서비스가 켜져 있는지 확인하거나, 잠시 후 다시 시도해주세요."
      );
    case 3:
      return new LocationUnavailableError(
        "위치 확인이 시간 초과됐어요. Wi-Fi·GPS를 켠 뒤 다시 불러오기를 눌러주세요."
      );
    default:
      return new LocationUnavailableError(
        `현재 위치를 확인하지 못했어요. 브라우저에서 이 사이트의 위치 권한을 허용한 뒤 다시 시도해주세요.${inAppBrowserHint}`
      );
  }
}

function requestCurrentPosition(options: GeolocationRequestOptions): Promise<GeolocationRequestResult> {
  return new Promise((resolve) => {
    let settled = false;
    const settle = (result: GeolocationRequestResult) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(failSafeTimer);
      resolve(result);
    };

    // iOS는 timeout 콜백이 늦게 오는 경우가 있어 여유를 둠
    const failSafeTimer = window.setTimeout(
      () => settle({ position: null, errorCode: 3 }),
      options.timeout + 3000
    );

    navigator.geolocation.getCurrentPosition(
      (position) => settle({ position }),
      (error) => settle({ position: null, errorCode: error.code }),
      options
    );
  });
}

function watchForPosition(options: GeolocationRequestOptions): Promise<GeolocationPosition | null> {
  return new Promise((resolve) => {
    let settled = false;
    let watchId = 0;

    const settle = (position: GeolocationPosition | null) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(failSafeTimer);
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
      resolve(position);
    };

    const failSafeTimer = window.setTimeout(() => settle(null), options.timeout + 3000);

    watchId = navigator.geolocation.watchPosition(
      (position) => settle(position),
      () => {
        // watch는 타임아웃까지 재시도
      },
      options
    );
  });
}

function getCategoriesKey(categories: ActivityCategoryCode[]): string {
  return [...new Set(categories)].sort().join(",");
}

function readTodayPayloadCache(categoriesKey: string): TodayPayload | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(TODAY_PAYLOAD_CACHE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as CachedTodayPayload;
    if (!parsed || typeof parsed !== "object") return null;
    if (typeof parsed.expiresAt !== "number" || parsed.expiresAt <= Date.now() || parsed.categoriesKey !== categoriesKey) {
      window.localStorage.removeItem(TODAY_PAYLOAD_CACHE_KEY);
      return null;
    }

    if (!isTodayPayload(parsed.payload)) {
      window.localStorage.removeItem(TODAY_PAYLOAD_CACHE_KEY);
      return null;
    }

    return parsed.payload;
  } catch {
    return null;
  }
}

function writeTodayPayloadCache(payload: TodayPayload, categoriesKey: string): void {
  if (typeof window === "undefined") return;

  try {
    const value: CachedTodayPayload = {
      payload,
      expiresAt: Date.now() + TODAY_PAYLOAD_CACHE_TTL_MS,
      categoriesKey
    };
    window.localStorage.setItem(TODAY_PAYLOAD_CACHE_KEY, JSON.stringify(value));
  } catch {
    // Ignore storage quota/private mode errors.
  }
}

async function invokeSupabaseFunction<T>(functionName: string, body: unknown): Promise<T> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

  if (!supabaseUrl || !anonKey) {
    throw new Error("Supabase 환경 변수가 없습니다.");
  }

  const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/functions/v1/${functionName}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${anonKey}`,
      "Content-Type": "application/json",
      apikey: anonKey
    },
    body: JSON.stringify(body)
  });

  const payload = (await response.json().catch(() => null)) as T | { error?: string } | null;

  if (!response.ok || !payload) {
    const message = extractErrorMessage(payload) ?? `${functionName} 호출 실패 (${response.status})`;
    throw new Error(message);
  }

  return payload as T;
}

function isTodayPayload(input: unknown): input is TodayPayload {
  return Boolean(
    input &&
      typeof input === "object" &&
      "grade" in input &&
      "metrics" in input &&
      "hourlyWeather" in input &&
      Array.isArray((input as TodayPayload).metrics)
  );
}

function extractErrorMessage(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;

  if ("error" in payload && typeof payload.error === "string" && payload.error) {
    return payload.error;
  }

  if ("message" in payload && typeof payload.message === "string" && payload.message) {
    return payload.message;
  }

  return null;
}
