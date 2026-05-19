import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BottomSheet } from "../../components/common/BottomSheet";
import { DotIndicator } from "../../components/common/DotIndicator";
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
import { loadTodayPayload, mockTodayPayload, type Activity, type ActivityCategoryCode, type TodayPayload } from "./todayPayload";
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
  indoor: activityIndoorIcon
};

export function TodayScreen({ onMenuClick }: { onMenuClick: () => void }) {
  const navigate = useNavigate();
  const [payload, setPayload] = useState<TodayPayload>(mockTodayPayload);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLocationError, setIsLocationError] = useState(false);
  const [sheetType, setSheetType] = useState<"metrics" | "flow" | "activity" | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const { activities, activityImpacts, dayFlow, ddaySummary, hourlyWeather, metrics, prepHints, reasons, supportMetrics } = payload;
  const preferredCategories = readActivityPreferences();
  const activityPreferenceSet = preferredCategories.length > 0;
  const preferredCategorySet = new Set(preferredCategories);
  const visibleActivities = activities.filter((activity) => preferredCategorySet.has(activity.category));
  const todayGrade = payload.grade;
  const heroVisual = getGradeVisual(todayGrade, "today");

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
        const message = error instanceof Error ? error.message : "실시간 날씨를 불러오지 못했어요.";
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
          <LoadingSkeleton rows={4} message="위치와 날씨를 확인하고 있어요. 실내에서는 조금 더 걸릴 수 있어요." />
        ) : (
          <>
            {loadError ? (
              <ErrorState
                title={isLocationError ? "현재 위치를 확인해주세요." : "실시간 날씨 연결을 확인해주세요."}
                description={
                  isLocationError
                    ? `${loadError} 지금은 예시 데이터로 화면을 유지하고 있어요.`
                    : "지금은 목업 데이터로 화면을 유지하고 있어요. 잠시 후 다시 시도할 수 있어요."
                }
                action={<PrimaryButton onClick={refreshTodayPayload}>다시 불러오기</PrimaryButton>}
              />
            ) : null}

        <section
          className="weatherHeroCard"
          style={{
            borderRadius: radius.xxl,
            background: `linear-gradient(135deg, ${colors.surface} 0%, ${colors.backgroundSoftBlue} 100%)`,
            boxShadow: shadows.card,
            overflow: "hidden",
            position: "relative"
          }}
        >
          <div className="heroCopy">
            <p style={{ color: colors.textSecondary, margin: 0, ...typography.body2 }}>오늘 외출 지수</p>
            <h1 className="heroGradeTitle" style={{ color: heroVisual.color }}>
              {heroVisual.label}
            </h1>
            <DotIndicator grade={todayGrade} />
            <ul className="reasonList">
              {reasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </div>
          <div className="heroImageSlot heroFace" aria-hidden="true">
            <span className="heroEyes">
              <span className="heroEye heroEyeLeft" />
              <span className="heroEye heroEyeRight" />
            </span>
            <span className="heroMouth" />
          </div>
        </section>

        <section className="sectionBlock">
          <div className="sectionTitleRow">
            <h2>핵심 날씨 지표</h2>
            <button className="textButton" type="button" onClick={() => setSheetType("metrics")}>
              자세히 보기
            </button>
          </div>
          <div className="metricGrid">
            {metrics.map((metric) => {
              const tone = metric.tone ? getGradeVisual(metric.tone) : null;

              return (
                <article className="miniCard" key={metric.label}>
                  <p>{metric.label}</p>
                  <strong style={{ color: tone?.color ?? colors.textPrimary }}>{metric.value}</strong>
                </article>
              );
            })}
          </div>
        </section>

        <section className="sectionBlock">
          <div className="sectionTitleRow">
            <h2>오늘의 시간별 흐름</h2>
            <button className="textButton" type="button" onClick={() => setSheetType("flow")}>
              자세히 보기
            </button>
          </div>
          <div className="dayFlowTimeline">
            <div className="dayFlowRail" aria-hidden="true" />
            {dayFlow.map((item) => {
              const visual = getGradeVisual(item.grade);

              return (
                <article className="dayFlowPoint" key={item.label}>
                  <span className="dayFlowDot" style={{ background: visual.color }} />
                  <span className="dayFlowLabel">{item.label}</span>
                  <strong className="dayFlowValue" style={{ color: visual.color }}>
                    {item.value}
                  </strong>
                </article>
              );
            })}
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
                <button className="activityCard" key={activity.title} type="button" onClick={() => openActivitySheet(activity)}>
                  <img className="activityImageSlot" src={activityIconByCategory[activity.category]} alt="" aria-hidden="true" />
                  <GradeBadge grade={activity.grade} />
                  <h3>{activity.title}</h3>
                  <p>{activity.reason}</p>
                </button>
              ))}
            </div>
          ) : (
            <EmptyState
              title={activityPreferenceSet ? "선택한 활동 추천을 준비 중이에요." : "선호 활동을 선택해주세요."}
              description={
                activityPreferenceSet
                  ? "선택한 카테고리의 실시간 추천은 곧 반영될 예정이에요. 다른 활동도 함께 선택해보세요."
                  : "자주 하는 활동을 설정하면 오늘 어떤 활동이 좋은지 알려드릴게요."
              }
              action={<PrimaryButton onClick={() => navigate("/activity-preferences")}>선호 활동 설정하기</PrimaryButton>}
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
          <PrimaryButton fullWidth={false} onClick={() => navigate("/discover")}>
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
          {sheetType === "flow"
            ? hourlyWeather.map((item) => (
                <div className="hourlyWeatherRow" key={item.time}>
                  <div className="hourlyWeatherMain">
                    <strong>{item.time}</strong>
                    <span>{item.summary}</span>
                  </div>
                  <div className="hourlyWeatherMeta">
                    <GradeBadge grade={item.grade} />
                    <span>{item.temperature}</span>
                    <span>비 {item.rainProbability}</span>
                    <span>바람 {item.wind}</span>
                    <span>먼지 {item.pm25}</span>
                  </div>
                </div>
              ))
            : sheetType === "activity" && selectedActivity
              ? (
                  <>
                    <div className="activityDetailHero">
                      <GradeBadge grade={selectedActivity.grade} />
                      <p>오늘은 {getGradeVisual(selectedActivity.grade).label}이에요.</p>
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
                    <PrimaryButton onClick={() => navigate("/discover")}>근처 {selectedActivity.title} 장소 보기</PrimaryButton>
                  </>
                )
            : (
                <>
                  <section className="metricDecisionSummary">
                    <p>오늘은 비보다 바람과 오후 구름만 조금 보면 돼요.</p>
                  </section>
                  <section className="metricDetailGrid">
                    {metrics.map((metric) => (
                      <article className="metricDetailCard" key={metric.label}>
                        <div>
                          <span>{metric.label}</span>
                          <strong>{metric.value}</strong>
                        </div>
                        <p>{metric.detail}</p>
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
                  <section className="compactInfoSection">
                    <h3>준비물 힌트</h3>
                    <div className="prepHintList">
                      {prepHints.map((hint) => (
                        <span key={hint}>{hint}</span>
                      ))}
                    </div>
                  </section>
                  <section className="compactInfoSection">
                    <h3>활동 영향</h3>
                    <div className="activityImpactList">
                      {activityImpacts.map((impact) => (
                        <div className="activityImpactRow" key={impact.label}>
                          <div>
                            <strong>{impact.label}</strong>
                            <span>{impact.summary}</span>
                          </div>
                          <GradeBadge grade={impact.grade} />
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
