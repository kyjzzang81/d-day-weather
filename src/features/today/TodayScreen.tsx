import { useEffect, useMemo, useState } from "react";
import { CloudRain, Thermometer, Wind } from "lucide-react";
import { useNavigate } from "react-router-dom";
import weatherClearDayIcon from "../../../assets/weather_icons/optimized/weather-clear-day.png";
import weatherClearNightIcon from "../../../assets/weather_icons/optimized/weather-clear-night.png";
import weatherCloudyIcon from "../../../assets/weather_icons/optimized/weather-cloudy.png";
import weatherColdIcon from "../../../assets/weather_icons/optimized/weather-cold.png";
import weatherDustIcon from "../../../assets/weather_icons/optimized/weather-dust.png";
import weatherFogIcon from "../../../assets/weather_icons/optimized/weather-fog.png";
import weatherHotIcon from "../../../assets/weather_icons/optimized/weather-hot.png";
import weatherOvercastIcon from "../../../assets/weather_icons/optimized/weather-overcast.png";
import weatherPartlyCloudyDayIcon from "../../../assets/weather_icons/optimized/weather-partly-cloudy-day.png";
import weatherPartlyCloudyNightIcon from "../../../assets/weather_icons/optimized/weather-partly-cloudy-night.png";
import weatherRainHeavyIcon from "../../../assets/weather_icons/optimized/weather-rain-heavy.png";
import weatherRainLightIcon from "../../../assets/weather_icons/optimized/weather-rain-light.png";
import weatherShowerIcon from "../../../assets/weather_icons/optimized/weather-shower.png";
import weatherSleetIcon from "../../../assets/weather_icons/optimized/weather-sleet.png";
import weatherSnowIcon from "../../../assets/weather_icons/optimized/weather-snow.png";
import weatherThunderIcon from "../../../assets/weather_icons/optimized/weather-thunder.png";
import weatherUnknownIcon from "../../../assets/weather_icons/optimized/weather-unknown.png";
import weatherWindIcon from "../../../assets/weather_icons/optimized/weather-wind.png";
import { BottomSheet } from "../../components/common/BottomSheet";
import { ErrorState } from "../../components/common/ErrorState";
import { LoadingSkeleton } from "../../components/common/LoadingSkeleton";
import { PrimaryButton } from "../../components/common/PrimaryButton";
import { SignalBadge } from "../../components/common/SignalBadge";
import { SignalDot } from "../../components/common/SignalDot";
import { AppHeader } from "../../components/layout/AppHeader";
import { getGradeVisual } from "../../design/grade";
import { isLocationUnavailableError } from "../../lib/locationErrors";
import { getTodayDateContext } from "../dateSignal/dateSignalUtils";
import type { DateContext } from "../dateSignal/dateSignalTypes";
import { LocalContentCard } from "../localContent/LocalContentCard";
import { getLocalContentRecommendations } from "../localContent/localContentUtils";
import type { LocalContent } from "../localContent/localContentTypes";
import { SituationDropdown } from "../outingMode/OutingModeSheet";
import { readOutingMode, writeOutingMode } from "../outingMode/outingModeStore";
import type { OutingMode } from "../outingMode/outingModeTypes";
import { SaveReminderSheet } from "../savedContents/SaveReminderSheet";
import { WeatherCheckGraphic } from "../weatherCheck/WeatherCheckGraphic";
import { getWeatherCheckItems } from "../weatherCheck/weatherCheckUtils";
import {
  loadTodayPayload,
  mockTodayPayload,
  type HourlyWeather,
  type Metric,
  type TodayPayload,
} from "./todayPayload";

type SheetType = "time" | null;
type WeatherVisualCategory =
  | "clear_day"
  | "clear_night"
  | "partly_cloudy_day"
  | "partly_cloudy_night"
  | "cloudy"
  | "overcast"
  | "rain_light"
  | "rain_heavy"
  | "shower"
  | "snow"
  | "sleet"
  | "thunder"
  | "fog"
  | "dust"
  | "wind"
  | "hot"
  | "cold"
  | "unknown";

const weatherIconByCategory: Record<WeatherVisualCategory, string> = {
  clear_day: weatherClearDayIcon,
  clear_night: weatherClearNightIcon,
  partly_cloudy_day: weatherPartlyCloudyDayIcon,
  partly_cloudy_night: weatherPartlyCloudyNightIcon,
  cloudy: weatherCloudyIcon,
  overcast: weatherOvercastIcon,
  rain_light: weatherRainLightIcon,
  rain_heavy: weatherRainHeavyIcon,
  shower: weatherShowerIcon,
  snow: weatherSnowIcon,
  sleet: weatherSleetIcon,
  thunder: weatherThunderIcon,
  fog: weatherFogIcon,
  dust: weatherDustIcon,
  wind: weatherWindIcon,
  hot: weatherHotIcon,
  cold: weatherColdIcon,
  unknown: weatherUnknownIcon,
};

function getPercentValue(value: string) {
  const match = value.match(/\d+/);
  return match ? Number(match[0]) : 0;
}

function getWeatherVisualCategory(payload: TodayPayload): WeatherVisualCategory {
  const rain = getMetric(payload.metrics, "강수확률")?.current.value ?? "";
  const wind = getMetric(payload.metrics, "바람")?.current.value ?? "";
  const dust = getMetric(payload.metrics, "미세먼지")?.current.value ?? "";
  const feelsLike = payload.supportMetrics.find((metric) => metric.label === "체감온도")?.value ?? "";
  const weatherText = payload.reasons.join(" ");
  const rainPercent = getPercentValue(rain);
  const temperature = getPercentValue(feelsLike);

  if (weatherText.includes("소나기")) return "shower";
  if (weatherText.includes("눈")) return "snow";
  if (weatherText.includes("천둥")) return "thunder";
  if (rainPercent >= 60) return "rain_heavy";
  if (rainPercent >= 30 || weatherText.includes("비")) return "rain_light";
  if (wind.includes("강")) return "wind";
  if (dust.includes("나쁨")) return "dust";
  if (weatherText.includes("안개")) return "fog";
  if (temperature >= 30) return "hot";
  if (temperature > 0 && temperature <= 5) return "cold";
  if (payload.grade === "uhm") return "cloudy";
  if (payload.grade === "gorgeous") return "clear_day";
  return "partly_cloudy_day";
}

const getHeroCopy = (grade: TodayPayload["grade"]) => {
  switch (grade) {
    case "gorgeous":
      return {
        title: "오늘은 좋아요",
        description: "비와 바람 부담이 크지 않아요.",
      };
    case "great":
      return {
        title: "오늘은 무난해요",
        description: "가볍게 움직이기 좋은 흐름이에요.",
      };
    case "good":
      return {
        title: "조금 살펴보면 좋아요",
        description: "오후 변화만 가볍게 확인해요.",
      };
    default:
      return {
        title: "실내 중심이 좋아요",
        description: "날씨 변화가 있어 실내 콘텐츠가 편해요.",
      };
  }
};

const getMetric = (metrics: Metric[], label: string) =>
  metrics.find((metric) => metric.label === label);

function getTimeSignalCopy(items: TodayPayload["dayFlow"]) {
  const cautionItem = items.find((item) => ["good", "uhm"].includes(item.grade));
  const bestItem = items.find((item) => ["gorgeous", "great"].includes(item.grade));

  if (cautionItem) {
    return {
      title: `${cautionItem.label}엔 한 번 더 확인해요`,
    };
  }

  if (bestItem) {
    return {
      title: `${bestItem.label}까지는 편하게 움직여요`,
    };
  }

  return {
    title: "오늘 흐름을 확인해요",
  };
}

function HourlyWeatherRows({ rows }: { rows: HourlyWeather[] }) {
  return (
    <section className="hourlyWeatherList">
      {rows.map((item) => (
        <div className="hourlyWeatherRow" key={item.time}>
          <div className="hourlyWeatherTime">
            <SignalDot grade={item.grade} size={8} className="hourlyWeatherDot" />
            <strong>{item.time}</strong>
          </div>
          <div className="hourlyWeatherBody">
            <div className="hourlyWeatherMain">
              <span>{item.summary}</span>
              <SignalBadge grade={item.grade} compact />
            </div>
            <div className="hourlyWeatherMeta">
              <span aria-label={`온도 ${item.temperature}`}>
                <Thermometer size={13} strokeWidth={2.2} aria-hidden="true" />
                {item.temperature}
              </span>
              <span aria-label={`비 ${item.rainProbability}`}>
                <CloudRain size={13} strokeWidth={2.2} aria-hidden="true" />
                {item.rainProbability}
              </span>
              <span aria-label={`바람 ${item.wind}`}>
                <Wind size={13} strokeWidth={2.2} aria-hidden="true" />
                {item.wind}
              </span>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

export function TodayScreen({ onMenuClick }: { onMenuClick: () => void }) {
  const navigate = useNavigate();
  const [payload, setPayload] = useState<TodayPayload>(mockTodayPayload);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLocationError, setIsLocationError] = useState(false);
  const [mode, setMode] = useState<OutingMode>(() => readOutingMode());
  const [sheetType, setSheetType] = useState<SheetType>(null);
  const [saveTarget, setSaveTarget] = useState<LocalContent | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [dateContext] = useState<DateContext>(() => getTodayDateContext());

  const refreshTodayPayload = () => {
    setIsLoading(true);
    setLoadError(null);
    setIsLocationError(false);
    loadTodayPayload(undefined, { skipCache: true })
      .then((nextPayload) => {
        setPayload(nextPayload);
      })
      .catch((error: unknown) => {
        const locationError = isLocationUnavailableError(error);
        const message =
          error instanceof Error
            ? error.message
            : "실시간 날씨를 불러오지 못했어요.";
        setPayload(mockTodayPayload);
        setLoadError(message);
        setIsLocationError(locationError);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    refreshTodayPayload();
  }, []);

  const changeMode = (nextMode: OutingMode) => {
    setMode(nextMode);
    writeOutingMode(nextMode);
  };

  const heroCopy = getHeroCopy(payload.grade);
  const weatherVisualCategory = getWeatherVisualCategory(payload);
  const weatherIconSrc = weatherIconByCategory[weatherVisualCategory];
  const weatherCheckItems = getWeatherCheckItems(payload);
  const recommendations = useMemo(
    () => getLocalContentRecommendations(mode).slice(0, 5),
    [mode],
  );
  const flowItems = payload.dayFlow.filter((item) => !["일출", "일몰"].includes(item.label)).slice(0, 4);
  const timeSignalCopy = getTimeSignalCopy(flowItems);

  return (
    <>
      <AppHeader
        locationLabel="경기 파주시 금촌동"
        updatedAtLabel="10:00 기준"
        menuPlacement="right"
        onMenuClick={onMenuClick}
        beforeNotification={
          <SituationDropdown
            mode={mode}
            onChange={changeMode}
          />
        }
      />

      <main className="screenStack">
        {isLoading ? (
          <LoadingSkeleton
            rows={4}
            message="위치와 날씨를 확인하고 있어요. 실내에서는 조금 더 걸릴 수 있어요."
          />
        ) : (
          <>
            {loadError ? (
              <ErrorState
                title={
                  isLocationError
                    ? "현재 위치를 확인해주세요."
                    : "실시간 날씨 연결을 확인해주세요."
                }
                description={
                  isLocationError
                    ? `${loadError} 지금은 예시 데이터로 화면을 유지하고 있어요.`
                    : "지금은 목업 데이터로 화면을 유지하고 있어요. 잠시 후 다시 시도할 수 있어요."
                }
                action={
                  <PrimaryButton onClick={refreshTodayPayload}>
                    다시 불러오기
                  </PrimaryButton>
                }
              />
            ) : null}

            <section className="heroSignalCard heroSignalExpanded">
              <div className="heroSignalCopy">
                <SignalBadge grade={payload.grade} />
                <h1>{heroCopy.title}</h1>
                <p>{heroCopy.description}</p>
              </div>
              <div
                className="heroWeatherIllustration"
                data-weather-category={weatherVisualCategory}
                aria-label="현재 날씨 그래픽"
              >
                <img src={weatherIconSrc} alt="" aria-hidden="true" />
              </div>
            </section>

            <section className="sectionBlock">
              <div className="sectionTitleRow">
                <h2>날씨 체크</h2>
              </div>
              <div className="weatherCheckScroller" aria-label="날씨 체크">
                {weatherCheckItems.map((item) => {
                  const visual = getGradeVisual(item.grade);
                  return (
                    <article className="weatherCheckCard" key={item.label}>
                      <span className="weatherCheckIcon">
                        <WeatherCheckGraphic iconKey={item.iconKey} label={`${item.label} ${item.status}`} />
                      </span>
                      <span>{item.label}</span>
                      <strong>{item.value}</strong>
                      <em style={{ color: visual.color }}>{item.status}</em>
                    </article>
                  );
                })}
              </div>
            </section>

            <section className="sectionBlock">
              <div className="sectionTitleRow">
                <h2>오늘 흐름</h2>
                <button className="textButton" type="button" onClick={() => setSheetType("time")}>
                  더보기 &gt;
                </button>
              </div>
              <article className="timeSignalCard">
                <div className="timeSignalSummary">
                  <strong>{timeSignalCopy.title}</strong>
                </div>
                <div className="timeSignalLine">
                  {flowItems.slice(0, 3).map((item) => (
                    <span className="timeSignalPoint" key={item.label}>
                      <SignalDot grade={item.grade} size={10} />
                      <strong>{item.label}</strong>
                      <em>{item.value}</em>
                    </span>
                  ))}
                </div>
              </article>
            </section>

            <section className="sectionBlock">
              <div className="sectionTitleRow">
                <h2>오늘의 추천</h2>
                <button className="textButton" type="button" onClick={() => navigate("/discover")}>
                  더 보기
                </button>
              </div>
              {savedMessage ? <p className="inlineStatusMessage">{savedMessage}</p> : null}
              <div className="localContentList">
                {recommendations.map((content) => (
                  <LocalContentCard
                    key={content.id}
                    content={content}
                    compact
                    onClick={() => navigate(`/content/${content.id}`)}
                    onSave={(nextContent) => setSaveTarget(nextContent)}
                  />
                ))}
              </div>
            </section>

            <section className="discoverCtaCard signalSearchCtaCard">
              <div>
                <p>다른 콘텐츠도 볼까요?</p>
                <strong>날짜와 지역에 맞는 신호를 찾아보세요.</strong>
              </div>
              <PrimaryButton
                fullWidth={false}
                onClick={() => navigate("/discover")}
              >
                지역·콘텐츠 검색
              </PrimaryButton>
            </section>
          </>
        )}
      </main>

      <BottomSheet
        open={sheetType === "time"}
        title="시간별 날씨"
        onClose={() => setSheetType(null)}
      >
        <div className="sheetStack">
          <section className="hourlyFlowSummary">
            <h3>시간대별 신호를 확인해요.</h3>
            <div className="hourlyFlowPills">
              <span>일출 {payload.dayFlow[0]?.value ?? "-"}</span>
              <span>일몰 {payload.dayFlow[4]?.value ?? "-"}</span>
            </div>
          </section>
          <HourlyWeatherRows rows={payload.hourlyWeather} />
        </div>
      </BottomSheet>

      <SaveReminderSheet
        open={Boolean(saveTarget)}
        content={saveTarget}
        dateContext={dateContext}
        onClose={() => setSaveTarget(null)}
        onSaved={() => setSavedMessage("저장했어요. 저장 탭에서 다시 볼 수 있어요.")}
      />
    </>
  );
}
