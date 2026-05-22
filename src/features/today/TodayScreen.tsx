import { useEffect, useState } from "react";
import { CloudFog, CloudRain, Droplets, Thermometer, Wind, type LucideIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { BottomSheet } from "../../components/common/BottomSheet";
import { EmptyState } from "../../components/common/EmptyState";
import { ErrorState } from "../../components/common/ErrorState";
import { GradeBadge } from "../../components/common/GradeBadge";
import { LoadingSkeleton } from "../../components/common/LoadingSkeleton";
import { PrimaryButton } from "../../components/common/PrimaryButton";
import { AppHeader } from "../../components/layout/AppHeader";
import { getGradeVisual } from "../../design/grade";
import { colors, radius, shadows, typography } from "../../design/tokens";
import { isLocationUnavailableError } from "../../lib/locationErrors";
import { readActivityPreferences } from "../activityPreferences/activityPreferenceStore";
import {
  loadTodayPayload,
  mockTodayPayload,
  type Activity,
  type ActivityCategoryCode,
  type TodayPayload,
} from "./todayPayload";
import activityBeachIcon from "../../../assets/activity-icons/optimized/activity-beach.webp";
import activityCafeIcon from "../../../assets/activity-icons/optimized/activity-cafe.webp";
import activityCampingIcon from "../../../assets/activity-icons/optimized/activity-camping.webp";
import activityFestivalIcon from "../../../assets/activity-icons/optimized/activity-festival.webp";
import activityHikingIcon from "../../../assets/activity-icons/optimized/activity-hiking.webp";
import activityIndoorIcon from "../../../assets/activity-icons/optimized/activity-indoor.webp";
import activityPhotoIcon from "../../../assets/activity-icons/optimized/activity-photo.webp";
import activityScenicIcon from "../../../assets/activity-icons/optimized/activity-scenic.webp";
import activitySpaIcon from "../../../assets/activity-icons/optimized/activity-spa.webp";
import activityUrbanIcon from "../../../assets/activity-icons/optimized/activity-urban.webp";

const activityIconByCategory: Record<ActivityCategoryCode, string> = {
  beach: activityBeachIcon,
  hiking: activityHikingIcon,
  camping: activityCampingIcon,
  scenic: activityScenicIcon,
  photo: activityPhotoIcon,
  urban: activityUrbanIcon,
  cafe: activityCafeIcon,
  festival: activityFestivalIcon,
  spa: activitySpaIcon,
  indoor: activityIndoorIcon,
};

const metricIconByLabel: Record<string, LucideIcon> = {
  강수확률: CloudRain,
  강수량: Droplets,
  바람: Wind,
  미세먼지: CloudFog,
};

const getMetricCheckCopy = (label: string, currentValue: string, peakValue: string) => {
  switch (label) {
    case "강수확률":
      return `오후 최대 ${peakValue}예요. 비가 올 수도 있지만 일정 전체를 접을 정도는 아니고, 접이식 우산이면 충분한 수준이에요.`;
    case "강수량":
      return `오늘 최대 ${peakValue}는 바닥이 살짝 젖는 정도의 약한 비예요. 이동과 산책에는 큰 부담이 적어요.`;
    case "바람":
      return `최대 ${peakValue}는 나뭇잎이 조금 흔들리는 약한 바람이에요. 걷거나 사진 찍기엔 무난해요.`;
    case "미세먼지":
      return `지금 ${currentValue}, 오늘 최대 ${peakValue} 수준이에요. 오래 걷는 일정에도 큰 부담은 낮아요.`;
    default:
      return "";
  }
};

export function TodayScreen({ onMenuClick }: { onMenuClick: () => void }) {
  const navigate = useNavigate();
  const [payload, setPayload] = useState<TodayPayload>(mockTodayPayload);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLocationError, setIsLocationError] = useState(false);
  const [sheetType, setSheetType] = useState<
    "metrics" | "flow" | "activity" | null
  >(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null,
  );
  const {
    activities,
    dayFlow,
    ddaySummary,
    hourlyWeather,
    metrics,
    prepHints,
    reasons,
    supportMetrics,
  } = payload;
  const preferredCategories = readActivityPreferences();
  const activityPreferenceSet = preferredCategories.length > 0;
  const preferredCategorySet = new Set(preferredCategories);
  const visibleActivities = activities.filter((activity) =>
    preferredCategorySet.has(activity.category),
  );
  const todayGrade = payload.grade;
  const heroVisual = getGradeVisual(todayGrade, "today");
  const hasPoorDustHour = hourlyWeather.some((item) =>
    ["나쁨", "매우나쁨"].includes(item.pm25),
  );
  const flowPrepHints = hasPoorDustHour
    ? Array.from(new Set([...prepHints, "마스크"]))
    : prepHints;

  const refreshTodayPayload = () => {
    setIsLoading(true);
    setLoadError(null);
    setIsLocationError(false);
    loadTodayPayload(preferredCategories, { skipCache: true })
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

  const closeSheet = () => {
    setSheetType(null);
    setSelectedActivity(null);
  };
  const openActivitySheet = (activity: Activity) => {
    setSelectedActivity(activity);
    setSheetType("activity");
  };
  const sheetTitle =
    sheetType === "flow"
      ? "오늘의 시간별 흐름"
      : sheetType === "activity" && selectedActivity
        ? selectedActivity.title
        : "핵심 지표 요약";

  return (
    <>
      <AppHeader
        title="TODAY"
        locationLabel={payload.locationLabel}
        updatedAtLabel={payload.updatedAtLabel}
        onMenuClick={onMenuClick}
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

            <section
              className="weatherHeroCard"
              style={{
                borderRadius: radius.xxl,
                background: `linear-gradient(135deg, ${colors.surface} 0%, ${colors.backgroundSoftBlue} 100%)`,
                boxShadow: shadows.card,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <div className="heroCopy">
                <p
                  style={{
                    color: colors.textSecondary,
                    margin: 0,
                    ...typography.body2,
                  }}
                >
                  오늘 외출 지수
                </p>
                <h1
                  className="heroGradeTitle"
                  style={{
                    color: heroVisual.color,
                    background: `linear-gradient(to top, ${heroVisual.softColor} 38%, transparent 38%)`,
                  }}
                >
                  {heroVisual.label}
                </h1>
                <ul className="reasonList">
                  {reasons.map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
              </div>
              <div
                className="heroImageSlot heroFace"
                data-grade={todayGrade}
                aria-hidden="true"
                style={{
                  background: `radial-gradient(circle at 30% 24%, rgba(255, 255, 255, 0.42), transparent 1rem), linear-gradient(135deg, ${heroVisual.softColor}, ${heroVisual.color})`,
                }}
              >
                <span className="heroEyes">
                  <span className="heroEye heroEyeLeft" />
                  <span className="heroEye heroEyeRight" />
                </span>
                <span className="heroMouth" />
              </div>
            </section>

            <section className="sectionBlock">
              <div className="sectionTitleRow">
                <h2>오늘 날씨 지표</h2>
                <button
                  className="textButton"
                  type="button"
                  onClick={() => setSheetType("metrics")}
                >
                  자세히 보기
                </button>
              </div>
              <div className="metricGrid">
                {metrics.map((metric) => {
                  const currentTone = metric.current.tone
                    ? getGradeVisual(metric.current.tone)
                    : null;
                  const peakTone = metric.peak.tone
                    ? getGradeVisual(metric.peak.tone)
                    : null;
                  const valuesMatch =
                    metric.current.value === metric.peak.value;
                  const statusColor = peakTone?.color ?? currentTone?.color ?? colors.textTertiary;

                  return (
                    <article
                      className="miniCard metricDualCard"
                      key={metric.label}
                    >
                      <div className="metricDualCardHeader">
                        <span
                          className="metricStatusDot"
                          style={{ background: statusColor }}
                          aria-hidden="true"
                        />
                        <p className="metricDualCardTitle">{metric.label}</p>
                      </div>
                      {valuesMatch ? (
                        <strong
                          className="metricDualValueCurrent"
                        >
                          {metric.current.value}
                        </strong>
                      ) : (
                        <div className="metricDualValues">
                          <strong className="metricDualValueCurrent">
                            {metric.current.value}
                          </strong>
                          <div className="metricDualPeakBlock">
                            <span className="metricDualPeakLabel">
                              오늘 최대
                            </span>
                            <span className="metricDualPeakValue">
                              {metric.peak.value}
                            </span>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>

            <section className="sectionBlock">
              <div className="sectionTitleRow">
                <h2>오늘의 시간별 흐름</h2>
                <button
                  className="textButton"
                  type="button"
                  onClick={() => setSheetType("flow")}
                >
                  자세히 보기
                </button>
              </div>
              <div className="dayFlowSummaryCard">
                <div className="dayFlowSummaryCopy">
                  <strong>오늘은 오전부터 오후까지 무난해요</strong>
                  <span>
                    일출 {dayFlow[0]?.value ?? "-"} · 일몰 {dayFlow[4]?.value ?? "-"}
                  </span>
                </div>
                <div className="dayFlowSegments">
                  {dayFlow.slice(1, 4).map((item) => {
                  const visual = getGradeVisual(item.grade);

                  return (
                    <article className="dayFlowSegment" key={item.label}>
                      <span
                        className="dayFlowSegmentDot"
                        style={{ background: visual.color }}
                        aria-hidden="true"
                      />
                      <span>{item.label}</span>
                      <strong>{item.value}</strong>
                    </article>
                  );
                  })}
                </div>
              </div>
            </section>

            <section className="sectionBlock">
              <div className="sectionTitleRow">
                <h2>오늘 어울리는 활동</h2>
                <Link className="textButton" to="/activity-preferences">
                  설정 변경
                </Link>
              </div>
              {activityPreferenceSet && visibleActivities.length > 0 ? (
                <div className="activityScroller">
                  {visibleActivities.map((activity) => (
                    <button
                      className="activityCard"
                      key={activity.title}
                      type="button"
                      onClick={() => openActivitySheet(activity)}
                    >
                      <img
                        className="activityImageSlot"
                        src={activityIconByCategory[activity.category]}
                        alt=""
                        aria-hidden="true"
                      />
                      <GradeBadge grade={activity.grade} />
                      <h3>{activity.title}</h3>
                      <p>{activity.reason}</p>
                    </button>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title={
                    activityPreferenceSet
                      ? "선택한 활동 추천을 불러오지 못했어요."
                      : "선호 활동을 선택해주세요."
                  }
                  description={
                    activityPreferenceSet
                      ? "다시 불러오기를 눌러 최신 추천을 받아보세요. 계속 비어 있으면 설정을 한 번 더 저장해주세요."
                      : "자주 하는 활동을 설정하면 오늘 어떤 활동이 좋은지 알려드릴게요."
                  }
                  action={
                    activityPreferenceSet ? (
                      <PrimaryButton onClick={refreshTodayPayload}>
                        다시 불러오기
                      </PrimaryButton>
                    ) : (
                      <PrimaryButton
                        onClick={() => navigate("/activity-preferences")}
                      >
                        선호 활동 설정하기
                      </PrimaryButton>
                    )
                  }
                />
              )}
            </section>

            {ddaySummary ? (
              <section className="ddayMiniCard">
                <div>
                  <p>오늘 / 내일 D-DAY</p>
                  <strong>{ddaySummary.title}</strong>
                  <span>
                    {ddaySummary.dateLabel} · {ddaySummary.location}
                  </span>
                </div>
                <GradeBadge grade={ddaySummary.grade} />
              </section>
            ) : null}

            <section className="discoverCtaCard">
              <div>
                <p>이번 주말 뭐 하지?</p>
                <strong>오늘 날씨에 맞는 장소를 찾아볼까요?</strong>
              </div>
              <PrimaryButton
                fullWidth={false}
                onClick={() => navigate("/discover")}
              >
                보러 가기
              </PrimaryButton>
            </section>
          </>
        )}
      </main>

      <BottomSheet
        open={sheetType !== null}
        title={sheetTitle}
        onClose={closeSheet}
      >
        <div className="sheetStack">
          {sheetType === "flow" ? (
            <>
              <section className="hourlyFlowSummary">
                <h3>오전부터 오후까지 무난하고, 저녁엔 조금 선선해져요.</h3>
                <div className="hourlyFlowPills">
                  <span>일출 {dayFlow[0]?.value ?? "-"}</span>
                  <span>일몰 {dayFlow[4]?.value ?? "-"}</span>
                </div>
              </section>
              <section className="hourlyWeatherList">
                {hourlyWeather.map((item) => {
                  const visual = getGradeVisual(item.grade);

                  return (
                    <div className="hourlyWeatherRow" key={item.time}>
                      <div className="hourlyWeatherTime">
                        <span
                          className="hourlyWeatherDot"
                          style={{ background: visual.color }}
                          aria-hidden="true"
                        />
                        <strong>{item.time}</strong>
                      </div>
                      <div className="hourlyWeatherBody">
                        <div className="hourlyWeatherMain">
                          <span>{item.summary}</span>
                          <GradeBadge grade={item.grade} />
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
                  );
                })}
              </section>
              <section className="compactInfoSection prepInfoSection hourlyPrepSection">
                <h3>준비물</h3>
                <div className="prepHintList">
                  {flowPrepHints.map((hint) => (
                    <span key={hint}>{hint}</span>
                  ))}
                </div>
              </section>
            </>
          ) : sheetType === "activity" && selectedActivity ? (
            <>
              <div className="activityDetailHero">
                <GradeBadge grade={selectedActivity.grade} />
                <p>
                  오늘은 {getGradeVisual(selectedActivity.grade).label}이에요.
                </p>
              </div>
              <section className="activityDetailSection">
                <h3>좋은 이유</h3>
                <ul>
                  {selectedActivity.goodReasons.map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
              </section>
              <section className="activityDetailSection">
                <h3>주의할 점</h3>
                <ul>
                  {selectedActivity.cautions.map((caution) => (
                    <li key={caution}>{caution}</li>
                  ))}
                </ul>
              </section>
              <section className="activityDetailSection">
                <h3>시간대별 추천</h3>
                <div className="activityTimeList">
                  {selectedActivity.timeRecommendations.map((item) => (
                    <div className="activityTimeRow" key={item.label}>
                      <span>
                        {item.label} {item.time}
                      </span>
                      <GradeBadge grade={item.grade} />
                    </div>
                  ))}
                </div>
              </section>
              <PrimaryButton onClick={() => navigate("/discover")}>
                근처 {selectedActivity.title} 장소 보기
              </PrimaryButton>
            </>
          ) : (
            <>
              <section className="metricCheckSection">
                <div className="metricCheckHeader">
                  <span>오늘 체크 포인트</span>
                  <GradeBadge grade={todayGrade} />
                </div>
                <p className="metricCheckLead">
                  외출 스코어는 {getGradeVisual(todayGrade).label}이에요.
                </p>
                <ul className="metricCheckList">
                  {metrics.map((metric) => (
                    <li key={metric.label}>
                      {getMetricCheckCopy(metric.label, metric.current.value, metric.peak.value)}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="compactInfoSection prepInfoSection">
                <h3>준비물</h3>
                <div className="prepHintList">
                  {prepHints.map((hint) => (
                    <span key={hint}>{hint}</span>
                  ))}
                </div>
              </section>

              <section className="metricCompactGrid" aria-label="오늘 날씨 지표">
                {metrics.map((metric) => (
                  <article className="metricCompactCard" key={metric.label}>
                    <div className="metricCompactHeader">
                      <span className="metricCompactIcon" aria-hidden="true">
                        {(() => {
                          const Icon = metricIconByLabel[metric.label] ?? CloudFog;
                          return <Icon size={18} strokeWidth={2.2} />;
                        })()}
                      </span>
                      <strong>{metric.label}</strong>
                    </div>

                    <div className="metricCompactValues">
                      <div>
                        <span>지금</span>
                        <strong style={{ color: metric.current.tone ? getGradeVisual(metric.current.tone).color : colors.textPrimary }}>
                          {metric.current.value}
                        </strong>
                      </div>
                      <div>
                        <span>오늘 최대</span>
                        <strong style={{ color: metric.peak.tone ? getGradeVisual(metric.peak.tone).color : colors.textPrimary }}>
                          {metric.peak.value}
                        </strong>
                      </div>
                    </div>
                  </article>
                ))}
              </section>

              <section className="compactInfoSection">
                <h3>보조 지표</h3>
                <div className="supportMetricGrid">
                  {supportMetrics.map((metric) => (
                    <div key={metric.label}>
                      <span>{metric.label}</span>
                      <strong>{metric.value}</strong>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </BottomSheet>
    </>
  );
}
