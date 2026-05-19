import { corsJson, corsOptions } from "../_shared/cors.ts";
import { reverseGeocode } from "../_shared/reverseGeocode.ts";

type GradeCode = "gorgeous" | "great" | "good" | "uhm";

type ForecastRow = {
  timestamp: string;
  temperature: number | null;
  weatherCode: number | null;
  precipitation: number | null;
  precipitationProbability: number | null;
  windSpeedKmh: number | null;
  humidity: number | null;
  pm25: number | null;
  uv: number | null;
};

type RequestBody = {
  lat?: number;
  lon?: number;
  display_location_hint?: string;
  preferred_activity_categories?: string[];
};

type DongWeatherCacheRow = {
  dong_area_id: string;
  forecast_rows: ForecastRow[];
  sunrise: string | null;
  sunset: string | null;
  cached_at: string;
  expires_at: string;
};

const defaultLat = 37.5446;
const defaultLon = 127.0559;
const cacheTtlMinutes = 30;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return corsOptions();
  if (req.method !== "POST") return corsJson({ error: "Method not allowed" }, 405);

  let body: RequestBody;
  try {
    body = (await req.json()) as RequestBody;
  } catch {
    return corsJson({ error: "Invalid JSON body" }, 400);
  }

  const lat = asNumber(body.lat) ?? defaultLat;
  const lon = asNumber(body.lon) ?? defaultLon;
  const manualLabel = body.display_location_hint?.trim();
  const dongAreaId = getDongAreaId(lat, lon);

  try {
    const cached = await readDongWeatherCache(dongAreaId);
    if (cached && isFutureTime(cached.expires_at)) {
      const locationLabel = manualLabel || (await readDongDisplayName(dongAreaId)) || (await reverseGeocode(lat, lon)) || "현재 위치";
      const payload = buildTodayPayloadFromRows(
        cached.forecast_rows,
        cached.sunrise,
        cached.sunset,
        locationLabel,
        new Date(cached.cached_at)
      );
      return corsJson(payload);
    }

    const locationLabel = manualLabel || (await reverseGeocode(lat, lon)) || "현재 위치";
    const liveResult = await buildTodayPayload(lat, lon, locationLabel);
    await writeDongWeatherCache(dongAreaId, lat, lon, locationLabel, liveResult.rows, liveResult.sunrise, liveResult.sunset);
    return corsJson(liveResult.payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return corsJson({ error: message }, 500);
  }
});

async function buildTodayPayload(lat: number, lon: number, locationLabel: string) {
  const [forecast, air] = await Promise.all([fetchForecast(lat, lon), fetchAirQuality(lat, lon)]);
  const rows = mergeForecastAndAir(forecast.rows, air.pm25ByHour, air.uvByHour);
  const payload = buildTodayPayloadFromRows(rows, forecast.sunrise, forecast.sunset, locationLabel, new Date());
  return { payload, rows, sunrise: forecast.sunrise, sunset: forecast.sunset };
}

function buildTodayPayloadFromRows(
  rows: ForecastRow[],
  sunrise: string | null,
  sunset: string | null,
  locationLabel: string,
  updatedAt: Date
) {
  const currentRow = findNearestRow(rows, new Date());
  const dateKey = currentRow.timestamp.slice(0, 10);
  const todayRows = rows.filter((row) => row.timestamp.startsWith(dateKey));
  const rainProbability = currentRow.precipitationProbability ?? inferRainProbability(currentRow);
  const rainAmount = currentRow.precipitation ?? 0;
  const windMs = windKmhToMs(currentRow.windSpeedKmh);
  const pm25Label = getPm25Label(currentRow.pm25);
  const uvLabel = getUvLabel(currentRow.uv);
  const metricGrades = {
    rainProbability: gradeRainProbability(rainProbability),
    rainAmount: gradeRainAmount(rainAmount),
    wind: gradeWind(windMs),
    pm25: gradePm25(currentRow.pm25)
  };
  const grade = getGradeFromScore(
    Math.round(
      (gradeScore(metricGrades.rainProbability) +
        gradeScore(metricGrades.rainAmount) +
        gradeScore(metricGrades.wind) +
        gradeScore(metricGrades.pm25)) /
        4
    )
  );
  const morningGrade = gradePeriod(todayRows, 6, 11);
  const afternoonGrade = gradePeriod(todayRows, 12, 17);
  const eveningGrade = gradePeriod(todayRows, 18, 23);

  return {
    source: "live",
    locationLabel,
    updatedAtLabel: formatUpdatedAt(updatedAt),
    grade,
    reasons: buildReasons(grade, rainProbability, windMs, pm25Label),
    metrics: [
      {
        label: "강수확률",
        value: `${Math.round(rainProbability)}%`,
        tone: metricGrades.rainProbability,
        detail: rainProbability <= 30 ? "비 가능성이 낮아 짧은 외출은 편안해요." : "비 가능성이 있어 이동 전 우산을 챙기는 편이 좋아요."
      },
      {
        label: "강수량",
        value: `${formatNumber(rainAmount)}mm`,
        tone: metricGrades.rainAmount,
        detail: rainAmount <= 1 ? "강수량 부담은 작아요." : "비가 내릴 수 있어 야외 체류 시간은 짧게 잡아주세요."
      },
      {
        label: "바람",
        value: `${formatNumber(windMs)}m/s`,
        tone: metricGrades.wind,
        detail: windMs <= 4 ? "산책, 피크닉, 사진 촬영 모두 무난한 바람이에요." : "바람이 느껴질 수 있어 강변이나 높은 곳은 조금 신경 써주세요."
      },
      {
        label: "미세먼지",
        value: pm25Label,
        tone: metricGrades.pm25,
        detail: currentRow.pm25 == null ? "미세먼지 데이터가 아직 충분하지 않아요." : currentRow.pm25 <= 35 ? "야외 활동에 큰 부담이 적어요." : "오래 걷는 일정은 쉬는 시간을 섞어주세요."
      }
    ],
    supportMetrics: [
      { label: "체감온도", value: `${formatNumber(currentRow.temperature)}°` },
      { label: "습도", value: `${formatNumber(currentRow.humidity)}%` },
      { label: "UV", value: uvLabel }
    ],
    prepHints: buildPrepHints(rainProbability, windMs, uvLabel),
    activityImpacts: [
      { label: "피크닉/도시산책", summary: grade === "uhm" ? "짧은 산책 위주가 좋아요" : "가볍게 걷기 좋아요", grade },
      { label: "카페/맛집", summary: "날씨 영향이 적어요", grade: grade === "uhm" ? "great" : "gorgeous" },
      { label: "사진/뷰", summary: metricGrades.pm25 === "uhm" ? "공기 상태를 확인하세요" : "오후 빛과 구름만 확인하세요", grade: afternoonGrade }
    ],
    dayFlow: [
      { label: "일출", value: formatClock(sunrise) ?? "05:27", grade: "great" },
      { label: "오전", value: gradeShortLabel(morningGrade), grade: morningGrade },
      { label: "오후", value: gradeShortLabel(afternoonGrade), grade: afternoonGrade },
      { label: "저녁", value: gradeShortLabel(eveningGrade), grade: eveningGrade },
      { label: "일몰", value: formatClock(sunset) ?? "19:48", grade: "great" }
    ],
    activities: buildActivities(grade, metricGrades, rainProbability, windMs, pm25Label),
    ddaySummary: {
      title: "친구들과 제주 여행",
      dateLabel: "6.5 (목) ~ 6.8 (일)",
      location: "제주도",
      grade: "great"
    },
    hourlyWeather: buildHourlyWeather(todayRows)
  };
}

async function fetchForecast(lat: number, lon: number): Promise<{ rows: ForecastRow[]; sunrise: string | null; sunset: string | null }> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    hourly: "temperature_2m,precipitation,precipitation_probability,weather_code,wind_speed_10m,relative_humidity_2m",
    daily: "sunrise,sunset",
    forecast_days: "2",
    timezone: "Asia/Seoul"
  });
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
  if (!response.ok) throw new Error(`Open-Meteo forecast HTTP ${response.status}`);

  const body = (await response.json()) as {
    hourly?: Record<string, Array<number | string | null> | undefined>;
    daily?: { sunrise?: string[]; sunset?: string[] };
  };
  const hourly = body.hourly ?? {};
  const times = (hourly.time ?? []) as string[];

  return {
    sunrise: body.daily?.sunrise?.[0] ?? null,
    sunset: body.daily?.sunset?.[0] ?? null,
    rows: times.map((timestamp, index) => ({
      timestamp,
      temperature: asNumber(hourly.temperature_2m?.[index]),
      weatherCode: asInt(hourly.weather_code?.[index]),
      precipitation: asNumber(hourly.precipitation?.[index]),
      precipitationProbability: asNumber(hourly.precipitation_probability?.[index]),
      windSpeedKmh: asNumber(hourly.wind_speed_10m?.[index]),
      humidity: asNumber(hourly.relative_humidity_2m?.[index]),
      pm25: null,
      uv: null
    }))
  };
}

async function fetchAirQuality(lat: number, lon: number): Promise<{ pm25ByHour: Record<string, number | null>; uvByHour: Record<string, number | null> }> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    hourly: "pm2_5,uv_index",
    forecast_days: "2",
    timezone: "Asia/Seoul"
  });
  const response = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?${params.toString()}`);
  if (!response.ok) throw new Error(`Open-Meteo air-quality HTTP ${response.status}`);

  const body = (await response.json()) as {
    hourly?: { time?: string[]; pm2_5?: Array<number | null>; uv_index?: Array<number | null> };
  };
  const times = body.hourly?.time ?? [];
  const pm25ByHour: Record<string, number | null> = {};
  const uvByHour: Record<string, number | null> = {};

  for (let index = 0; index < times.length; index += 1) {
    pm25ByHour[times[index]] = asNumber(body.hourly?.pm2_5?.[index]);
    uvByHour[times[index]] = asNumber(body.hourly?.uv_index?.[index]);
  }

  return { pm25ByHour, uvByHour };
}

function mergeForecastAndAir(rows: ForecastRow[], pm25ByHour: Record<string, number | null>, uvByHour: Record<string, number | null>): ForecastRow[] {
  return rows.map((row) => ({
    ...row,
    pm25: pm25ByHour[row.timestamp] ?? null,
    uv: uvByHour[row.timestamp] ?? null
  }));
}

function buildHourlyWeather(rows: ForecastRow[]) {
  return rows
    .filter((row) => {
      const hour = parseLocalDate(row.timestamp).getHours();
      return hour >= 6 && hour <= 23;
    })
    .slice(0, 18)
    .map((row) => {
      const hour = parseLocalDate(row.timestamp).getHours();
      const rainProbability = row.precipitationProbability ?? inferRainProbability(row);

      return {
        time: `${String(hour).padStart(2, "0")}:00`,
        grade: gradeForecastRow(row),
        summary: getWeatherSummary(row.weatherCode, rainProbability),
        temperature: `${formatNumber(row.temperature)}°`,
        rainProbability: `${Math.round(rainProbability)}%`,
        wind: `${formatNumber(windKmhToMs(row.windSpeedKmh))}m/s`,
        pm25: getPm25Label(row.pm25)
      };
    });
}

function buildActivities(
  grade: GradeCode,
  metricGrades: { rainProbability: GradeCode; rainAmount: GradeCode; wind: GradeCode; pm25: GradeCode },
  rainProbability: number,
  windMs: number,
  pm25Label: string
) {
  const urbanGrade = lowestGrade([grade, metricGrades.rainProbability, metricGrades.wind, metricGrades.pm25]);
  const cafeGrade = grade === "uhm" ? "great" : "gorgeous";
  const photoGrade = lowestGrade([grade, metricGrades.pm25, metricGrades.wind]);

  return [
    {
      category: "urban",
      title: "피크닉/도시산책",
      grade: urbanGrade,
      reason: rainProbability <= 30 ? "비 부담이 낮고 걷기 편해요" : "짧은 산책 위주로 좋아요",
      goodReasons: [`강수확률 ${Math.round(rainProbability)}%`, `바람 ${formatNumber(windMs)}m/s`],
      cautions: rainProbability >= 40 ? ["비 예보가 바뀌는지 확인해주세요"] : ["오후 체감온도만 확인하세요"],
      timeRecommendations: [
        { label: "오전", time: "06~12시", grade: metricGrades.wind },
        { label: "오후", time: "12~18시", grade },
        { label: "저녁", time: "18~24시", grade: urbanGrade }
      ]
    },
    {
      category: "cafe",
      title: "카페/맛집",
      grade: cafeGrade,
      reason: "날씨 변수와 상관없이 일정이 안정적이에요",
      goodReasons: ["실내 이동 비중을 조절하기 쉬워요", `미세먼지는 ${pm25Label}이에요`],
      cautions: rainProbability >= 40 ? ["비가 오면 이동 시간을 조금 넉넉히 잡아주세요"] : ["점심 시간대 혼잡만 고려하면 좋아요"],
      timeRecommendations: [
        { label: "오전", time: "06~12시", grade: cafeGrade },
        { label: "오후", time: "12~18시", grade: cafeGrade },
        { label: "저녁", time: "18~24시", grade: "gorgeous" }
      ]
    },
    {
      category: "photo",
      title: "사진/뷰",
      grade: photoGrade,
      reason: metricGrades.pm25 === "uhm" ? "시야와 공기 상태를 확인하세요" : "빛과 바람이 비교적 무난해요",
      goodReasons: [`미세먼지 ${pm25Label}`, `바람 ${formatNumber(windMs)}m/s`],
      cautions: ["구름 변화가 있으면 실내 뷰 스팟도 함께 잡아주세요"],
      timeRecommendations: [
        { label: "오전", time: "06~12시", grade: photoGrade },
        { label: "오후", time: "12~18시", grade },
        { label: "저녁", time: "18~24시", grade: "great" }
      ]
    }
  ];
}

function gradePeriod(rows: ForecastRow[], startHour: number, endHour: number): GradeCode {
  const periodRows = rows.filter((row) => {
    const hour = parseLocalDate(row.timestamp).getHours();
    return hour >= startHour && hour <= endHour;
  });
  if (!periodRows.length) return "good";

  const score = periodRows.reduce((sum, row) => sum + gradeScore(gradeForecastRow(row)), 0) / periodRows.length;
  return getGradeFromScore(Math.round(score));
}

function gradeForecastRow(row: ForecastRow): GradeCode {
  const rain = gradeRainProbability(row.precipitationProbability ?? inferRainProbability(row));
  const amount = gradeRainAmount(row.precipitation ?? 0);
  const wind = gradeWind(windKmhToMs(row.windSpeedKmh));
  const dust = gradePm25(row.pm25);

  return getGradeFromScore(Math.round((gradeScore(rain) + gradeScore(amount) + gradeScore(wind) + gradeScore(dust)) / 4));
}

function findNearestRow(rows: ForecastRow[], now: Date): ForecastRow {
  return rows.reduce((best, row) => {
    const bestDiff = Math.abs(parseLocalDate(best.timestamp).getTime() - now.getTime());
    const rowDiff = Math.abs(parseLocalDate(row.timestamp).getTime() - now.getTime());
    return rowDiff < bestDiff ? row : best;
  }, rows[0]);
}

function parseLocalDate(timestamp: string): Date {
  return new Date(timestamp.length === 16 ? `${timestamp}:00` : timestamp);
}

function inferRainProbability(row: ForecastRow): number {
  const precipitation = row.precipitation ?? 0;
  const code = row.weatherCode ?? 0;

  if (precipitation >= 5 || (code >= 61 && code <= 82)) return 80;
  if (precipitation >= 1 || (code >= 51 && code <= 57)) return 55;
  if (precipitation > 0 || code >= 45) return 35;
  return 10;
}

function windKmhToMs(value: number | null): number {
  if (value == null) return 0;
  return Math.round((value / 3.6) * 10) / 10;
}

function gradeRainProbability(value: number): GradeCode {
  if (value <= 15) return "gorgeous";
  if (value <= 30) return "great";
  if (value <= 55) return "good";
  return "uhm";
}

function gradeRainAmount(value: number): GradeCode {
  if (value <= 0.2) return "gorgeous";
  if (value <= 1) return "great";
  if (value <= 5) return "good";
  return "uhm";
}

function gradeWind(value: number): GradeCode {
  if (value <= 3) return "gorgeous";
  if (value <= 5.5) return "great";
  if (value <= 8) return "good";
  return "uhm";
}

function gradePm25(value: number | null): GradeCode {
  if (value == null) return "good";
  if (value <= 15) return "gorgeous";
  if (value <= 35) return "great";
  if (value <= 75) return "good";
  return "uhm";
}

function getGradeFromScore(score: number): GradeCode {
  if (score >= 85) return "gorgeous";
  if (score >= 70) return "great";
  if (score >= 50) return "good";
  return "uhm";
}

function gradeScore(grade: GradeCode): number {
  const scores: Record<GradeCode, number> = {
    gorgeous: 94,
    great: 78,
    good: 58,
    uhm: 35
  };
  return scores[grade];
}

function lowestGrade(grades: GradeCode[]): GradeCode {
  const order: Record<GradeCode, number> = {
    uhm: 0,
    good: 1,
    great: 2,
    gorgeous: 3
  };
  return grades.reduce((lowest, grade) => (order[grade] < order[lowest] ? grade : lowest), grades[0]);
}

function getPm25Label(value: number | null): string {
  if (value == null) return "확인중";
  if (value <= 15) return "좋음";
  if (value <= 35) return "보통";
  if (value <= 75) return "나쁨";
  return "매우나쁨";
}

function getUvLabel(value: number | null): string {
  if (value == null) return "확인중";
  if (value < 3) return "낮음";
  if (value < 6) return "보통";
  if (value < 8) return "높음";
  return "매우 높음";
}

function getWeatherSummary(weatherCode: number | null, rainProbability: number): string {
  if (weatherCode == null) return "날씨 확인중";
  if (weatherCode >= 95) return "천둥 가능";
  if (weatherCode >= 71) return "눈 가능";
  if (weatherCode >= 51 || rainProbability >= 55) return "비 가능";
  if (weatherCode >= 45) return "안개 주의";
  if (weatherCode >= 3) return "구름 많음";
  if (weatherCode >= 1) return "구름 조금";
  return "맑고 편안";
}

function buildReasons(grade: GradeCode, rainProbability: number, windMs: number, pm25Label: string): string[] {
  if (grade === "uhm") {
    return ["야외 일정은 조금 신중하게 잡아주세요", "비나 바람 상태를 한 번 더 확인하는 게 좋아요"];
  }

  return [
    rainProbability <= 30 ? "비 가능성이 낮아 외출 부담이 적어요" : "비 가능성이 있어 짧은 외출이 좋아요",
    windMs <= 5 ? `바람과 공기 상태가 무난해요 (${pm25Label})` : "바람이 조금 있어 동선은 가볍게 잡아주세요"
  ];
}

function buildPrepHints(rainProbability: number, windMs: number, uvLabel: string): string[] {
  const hints = [rainProbability >= 40 ? "작은 우산 챙기기" : "우산은 선택", windMs >= 5 ? "바람막이 추천" : "겉옷은 가볍게"];
  hints.push(uvLabel === "높음" || uvLabel === "매우 높음" ? "자외선 차단제" : "오후 햇빛만 체크");
  return hints;
}

function gradeShortLabel(grade: GradeCode): string {
  const labels: Record<GradeCode, string> = {
    gorgeous: "강추",
    great: "추천",
    good: "조금",
    uhm: "주의"
  };
  return labels[grade];
}

function formatUpdatedAt(date: Date): string {
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  return `${date.getMonth() + 1}월 ${date.getDate()}일 (${weekdays[date.getDay()]}) ${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes()
  ).padStart(2, "0")} 기준`;
}

function formatClock(value: string | null | undefined): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (!Number.isNaN(date.getTime())) {
    return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  }
  const match = value.match(/(\d{2}):(\d{2})/);
  return match ? `${match[1]}:${match[2]}` : null;
}

function formatNumber(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return "-";
  return Number.isInteger(value) ? String(value) : value.toFixed(1).replace(/\.0$/, "");
}

function getDongAreaId(lat: number, lon: number): string {
  return `geo_${lat.toFixed(3)}_${lon.toFixed(3)}`.replace(/[^a-zA-Z0-9_]/g, "_");
}

function isFutureTime(iso: string): boolean {
  const expiresAt = Date.parse(iso);
  return Number.isFinite(expiresAt) && expiresAt > Date.now();
}

function getSupabaseAdminConfig(): { url: string; serviceRoleKey: string } | null {
  const url = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SERVICE_ROLE_KEY");
  if (!url || !serviceRoleKey) return null;
  return { url, serviceRoleKey };
}

function getSupabaseAdminHeaders(serviceRoleKey: string): HeadersInit {
  return {
    Authorization: `Bearer ${serviceRoleKey}`,
    apikey: serviceRoleKey,
    "Content-Type": "application/json"
  };
}

async function readDongDisplayName(dongAreaId: string): Promise<string | null> {
  const config = getSupabaseAdminConfig();
  if (!config) return null;

  const query = new URLSearchParams({
    select: "display_name",
    id: `eq.${dongAreaId}`,
    limit: "1"
  });

  const response = await fetch(`${config.url}/rest/v1/dong_areas?${query.toString()}`, {
    headers: getSupabaseAdminHeaders(config.serviceRoleKey)
  });

  if (!response.ok) return null;
  const rows = (await response.json().catch(() => [])) as Array<{ display_name?: string }>;
  return rows[0]?.display_name ?? null;
}

async function readDongWeatherCache(dongAreaId: string): Promise<DongWeatherCacheRow | null> {
  const config = getSupabaseAdminConfig();
  if (!config) return null;

  const query = new URLSearchParams({
    select: "dong_area_id,forecast_rows,sunrise,sunset,cached_at,expires_at",
    dong_area_id: `eq.${dongAreaId}`,
    limit: "1"
  });
  const response = await fetch(`${config.url}/rest/v1/dong_weather_cache?${query.toString()}`, {
    headers: getSupabaseAdminHeaders(config.serviceRoleKey)
  });

  if (!response.ok) return null;
  const rows = (await response.json().catch(() => [])) as DongWeatherCacheRow[];
  const row = rows[0];
  if (!row || !Array.isArray(row.forecast_rows)) return null;
  return row;
}

async function writeDongWeatherCache(
  dongAreaId: string,
  lat: number,
  lon: number,
  locationLabel: string,
  rows: ForecastRow[],
  sunrise: string | null,
  sunset: string | null
): Promise<void> {
  const config = getSupabaseAdminConfig();
  if (!config) return;

  const now = new Date();
  const expiresAt = new Date(now.getTime() + cacheTtlMinutes * 60 * 1000);

  const dongAreasResponse = await fetch(`${config.url}/rest/v1/dong_areas?on_conflict=id`, {
    method: "POST",
    headers: {
      ...getSupabaseAdminHeaders(config.serviceRoleKey),
      Prefer: "resolution=merge-duplicates,return=minimal"
    },
    body: JSON.stringify([
      {
        id: dongAreaId,
        sido: "미정",
        sigungu: "미정",
        dong: locationLabel,
        display_name: locationLabel,
        lat,
        lon,
        geohash: dongAreaId,
        is_active: true
      }
    ])
  });

  if (!dongAreasResponse.ok) return;

  await fetch(`${config.url}/rest/v1/dong_weather_cache?on_conflict=dong_area_id`, {
    method: "POST",
    headers: {
      ...getSupabaseAdminHeaders(config.serviceRoleKey),
      Prefer: "resolution=merge-duplicates,return=minimal"
    },
    body: JSON.stringify([
      {
        dong_area_id: dongAreaId,
        lat,
        lon,
        forecast_rows: rows,
        current_weather: {},
        pm25_by_hour: {},
        uv_by_hour: {},
        sunrise,
        sunset,
        cached_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
        updated_at: now.toISOString()
      }
    ])
  });
}

function asNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
}

function asInt(value: unknown): number | null {
  const numberValue = asNumber(value);
  return numberValue == null ? null : Math.round(numberValue);
}
