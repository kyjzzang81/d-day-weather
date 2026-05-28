import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import contentTypeAllIcon from "../../../assets/content_type_icons/content-type-all.png";
import contentTypeCultureComplexIcon from "../../../assets/content_type_icons/content-type-culture-complex.png";
import contentTypeExhibitionIcon from "../../../assets/content_type_icons/content-type-exhibition.png";
import contentTypeFairIcon from "../../../assets/content_type_icons/content-type-fair.png";
import contentTypeFestivalIcon from "../../../assets/content_type_icons/content-type-festival.png";
import contentTypeHikingIcon from "../../../assets/content_type_icons/content-type-hiking.png";
import contentTypeKidsProgramIcon from "../../../assets/content_type_icons/content-type-kids-program.png";
import contentTypeLeisureSportsIcon from "../../../assets/content_type_icons/content-type-leisure-sports.png";
import contentTypeLibraryIcon from "../../../assets/content_type_icons/content-type-library.png";
import contentTypeMarketIcon from "../../../assets/content_type_icons/content-type-market.png";
import contentTypeOutdoorGameIcon from "../../../assets/content_type_icons/content-type-outdoor-game.png";
import contentTypePerformanceIcon from "../../../assets/content_type_icons/content-type-performance.png";
import contentTypePopupIcon from "../../../assets/content_type_icons/content-type-popup.png";
import contentTypeProgramIcon from "../../../assets/content_type_icons/content-type-program.png";
import contentTypeRunningIcon from "../../../assets/content_type_icons/content-type-running.png";
import contentTypeSelectShopIcon from "../../../assets/content_type_icons/content-type-select-shop.png";
import contentTypeSportsWatchingIcon from "../../../assets/content_type_icons/content-type-sports-watching.png";
import contentTypeThemeCafeIcon from "../../../assets/content_type_icons/content-type-theme-cafe.png";
import contentTypeTrekkingIcon from "../../../assets/content_type_icons/content-type-trekking.png";
import contentTypeVillageTourIcon from "../../../assets/content_type_icons/content-type-village-tour.png";
import { BottomSheet } from "../../components/common/BottomSheet";
import { CategoryChip } from "../../components/common/CategoryChip";
import { PrimaryButton } from "../../components/common/PrimaryButton";
import { SearchBar } from "../../components/common/SearchBar";
import { AppHeader } from "../../components/layout/AppHeader";
import { DateSelectSheet } from "../dateSignal/DateSelectSheet";
import {
  getTodayDateContext,
  getWeekendDateContext,
} from "../dateSignal/dateSignalUtils";
import type { DateContext } from "../dateSignal/dateSignalTypes";
import { LocalContentCard } from "../localContent/LocalContentCard";
import {
  defaultDiscoverFilters,
  discoverTagFilterGroups,
  searchLocalContents,
  type DiscoverFilterGroupId,
} from "../localContent/localContentUtils";
import type { ContentTypeTag, LocalContent } from "../localContent/localContentTypes";
import { readLocationContext } from "../location/locationContext";
import { SituationDropdown } from "../outingMode/OutingModeSheet";
import { readOutingMode, writeOutingMode } from "../outingMode/outingModeStore";
import type { OutingMode } from "../outingMode/outingModeTypes";
import { SaveReminderSheet } from "../savedContents/SaveReminderSheet";

const typeIconByValue: Record<string, string> = {
  all: contentTypeAllIcon,
  popup: contentTypePopupIcon,
  festival: contentTypeFestivalIcon,
  performance: contentTypePerformanceIcon,
  market: contentTypeMarketIcon,
  village_tour: contentTypeVillageTourIcon,
  fair: contentTypeFairIcon,
  exhibition: contentTypeExhibitionIcon,
  program: contentTypeProgramIcon,
  library: contentTypeLibraryIcon,
  kids_program: contentTypeKidsProgramIcon,
  trekking: contentTypeTrekkingIcon,
  hiking: contentTypeHikingIcon,
  running: contentTypeRunningIcon,
  leisure_sports: contentTypeLeisureSportsIcon,
  sports_watching: contentTypeSportsWatchingIcon,
  outdoor_game: contentTypeOutdoorGameIcon,
  theme_cafe: contentTypeThemeCafeIcon,
  culture_complex: contentTypeCultureComplexIcon,
  select_shop: contentTypeSelectShopIcon,
};

const contentTypeFilterGroup = discoverTagFilterGroups.find(
  (group) => group.id === "contentTypeTags",
);

const sheetFilterGroups = discoverTagFilterGroups.filter(
  (group) => group.id !== "contentTypeTags",
);

function getDiscoverRecommendationTitle(context: DateContext) {
  if (context.targetDate === getTodayDateContext().targetDate) {
    return "오늘의 추천";
  }
  if (context.targetDate === getWeekendDateContext().targetDate) {
    return "이번 주말 추천";
  }
  return `${context.label.replace(" 기준", "")} 추천`;
}

export function DiscoverScreen({ onMenuClick }: { onMenuClick: () => void }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [dateContext, setDateContext] = useState<DateContext>(() =>
    getTodayDateContext(),
  );
  const [dateSheetOpen, setDateSheetOpen] = useState(false);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [mode, setMode] = useState<OutingMode>(() => readOutingMode());
  const [activeFilters, setActiveFilters] = useState(defaultDiscoverFilters);
  const [saveTarget, setSaveTarget] = useState<LocalContent | null>(null);
  const [saveReminderOpen, setSaveReminderOpen] = useState(false);
  const [isSelectingSaveDate, setIsSelectingSaveDate] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [locationContext] = useState(() => readLocationContext());

  const results = useMemo(
    () => searchLocalContents(query, mode, activeFilters, dateContext),
    [activeFilters, dateContext, mode, query],
  );

  const typeAvailabilityBase = useMemo(
    () =>
      searchLocalContents(query, mode, {
        ...activeFilters,
        contentTypeTags: "all",
      }, dateContext),
    [activeFilters, dateContext, mode, query],
  );

  const recommendationTitle = useMemo(
    () => getDiscoverRecommendationTitle(dateContext),
    [dateContext],
  );

  const contentTypeOptions = useMemo(() => {
    const options = contentTypeFilterGroup?.options ?? [];
    const withCount = options.map((option) => {
      const count =
        option.value === "all"
          ? typeAvailabilityBase.length
          : typeAvailabilityBase.filter((content) =>
              content.contentTypeTags.includes(option.value as ContentTypeTag),
            ).length;

      return {
        ...option,
        count,
      };
    });

    return withCount.sort((a, b) => {
      if (a.value === "all") return -1;
      if (b.value === "all") return 1;

      const aEmpty = a.count === 0;
      const bEmpty = b.count === 0;
      if (aEmpty !== bEmpty) return aEmpty ? 1 : -1;

      return options.findIndex((option) => option.value === a.value) -
        options.findIndex((option) => option.value === b.value);
    });
  }, [typeAvailabilityBase]);

  const changeMode = (nextMode: OutingMode) => {
    setMode(nextMode);
    writeOutingMode(nextMode);
  };

  const requestSave = (content: LocalContent) => {
    setSaveTarget(content);
    setIsSelectingSaveDate(true);
    setDateSheetOpen(true);
  };

  const selectFilter = (groupId: DiscoverFilterGroupId, value: string) => {
    setActiveFilters((current) => ({
      ...current,
      [groupId]: value,
    }));
  };

  const selectDate = (nextContext: DateContext) => {
    setDateContext(nextContext);
    if (isSelectingSaveDate) {
      window.setTimeout(() => setSaveReminderOpen(true), 0);
    }
  };

  return (
    <>
      <AppHeader
        locationLabel={locationContext.locationLabel}
        updatedAtLabel={locationContext.updatedAtLabel}
        menuPlacement="right"
        onMenuClick={onMenuClick}
        beforeNotification={
          <SituationDropdown mode={mode} onChange={changeMode} />
        }
      />
      <main className="screenStack">
        <SearchBar
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="지역이나 콘텐츠 검색"
        />

        <section className="sectionBlock">
          <div className="discoverFilterBar">
            <div className="dateSelectorRow" aria-label="빠른 날짜 선택">
              <button
                className="dateChip"
                type="button"
                data-active={
                  dateContext.targetDate === getTodayDateContext().targetDate
                }
                onClick={() => setDateContext(getTodayDateContext())}
              >
                오늘
              </button>
              <button
                className="dateChip"
                type="button"
                data-active={
                  dateContext.targetDate === getWeekendDateContext().targetDate
                }
                onClick={() => setDateContext(getWeekendDateContext())}
              >
                이번 주말
              </button>
              <button
                className="dateChip"
                type="button"
                onClick={() => setDateSheetOpen(true)}
              >
                날짜 선택
              </button>
            </div>
            <button
              className="discoverFilterTextButton"
              type="button"
              onClick={() => setFilterSheetOpen(true)}
            >
              필터
            </button>
          </div>
        </section>

        <section className="sectionBlock" aria-label="콘텐츠 유형">
          <div className="contentTypeCarousel">
            {contentTypeOptions.map((option) => {
              const selected = activeFilters.contentTypeTags === option.value;
              const state = selected
                ? "active"
                : option.count > 0
                  ? "unactive"
                  : "none";

              return (
                <button
                  className="contentTypePill"
                  key={option.value}
                  type="button"
                  data-state={state}
                  disabled={state === "none"}
                  onClick={() => selectFilter("contentTypeTags", option.value)}
                >
                  <span className="contentTypePillIcon" aria-hidden="true">
                    {typeIconByValue[option.value] ? (
                      <img src={typeIconByValue[option.value]} alt="" />
                    ) : (
                      option.label.slice(0, 1)
                    )}
                  </span>
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="sectionBlock">
          <div className="sectionTitleRow">
            <h2>{recommendationTitle}</h2>
            <span className="resultCountLabel">{results.length}개</span>
          </div>
          {savedMessage ? (
            <p className="inlineStatusMessage">{savedMessage}</p>
          ) : null}
          {results.length > 0 ? (
            <div className="localContentList">
              {results.map((content) => (
                <LocalContentCard
                  key={content.id}
                  content={content}
                  basisLabel={`${dateContext.basisLabel} · ${content.regionLabel} 날씨`}
                  onClick={() => navigate(`/content/${content.id}`)}
                  onSave={requestSave}
                />
              ))}
            </div>
          ) : (
            <section className="noResultCard">
              <strong>결과가 없어요.</strong>
              <p>검색어를 줄이거나 조건을 전체로 바꿔보세요.</p>
              <PrimaryButton
                onClick={() => {
                  setQuery("");
                  setActiveFilters(defaultDiscoverFilters);
                }}
              >
                전체 보기
              </PrimaryButton>
            </section>
          )}
        </section>
      </main>

      <DateSelectSheet
        open={dateSheetOpen}
        selected={dateContext}
        onSelect={selectDate}
        onClose={() => setDateSheetOpen(false)}
      />

      <BottomSheet
        open={filterSheetOpen}
        title="필터"
        onClose={() => setFilterSheetOpen(false)}
      >
        <div className="discoverFilterSheet">
          {sheetFilterGroups.map((group) => (
            <section className="discoverTagGroup" key={group.id}>
              <div className="discoverTagGroupHeader">
                <h2>{group.title}</h2>
              </div>
              <div className="contentCategoryGrid">
                {group.options.map((option) => (
                  <CategoryChip
                    key={`${group.id}-${option.value}`}
                    label={option.label}
                    selected={activeFilters[group.id] === option.value}
                    onClick={() => selectFilter(group.id, option.value)}
                  />
                ))}
              </div>
            </section>
          ))}
          <div className="discoverFilterSheetActions">
            <button
              className="discoverFilterResetButton"
              type="button"
              onClick={() => setActiveFilters(defaultDiscoverFilters)}
            >
              초기화
            </button>
            <PrimaryButton onClick={() => setFilterSheetOpen(false)}>
              적용하기
            </PrimaryButton>
          </div>
        </div>
      </BottomSheet>

      <SaveReminderSheet
        open={saveReminderOpen}
        content={saveTarget}
        dateContext={dateContext}
        onClose={() => {
          setSaveReminderOpen(false);
          setSaveTarget(null);
          setIsSelectingSaveDate(false);
        }}
        onSaved={() => {
          setSavedMessage("저장했어요. 저장 탭에서 다시 볼 수 있어요.");
          setSaveReminderOpen(false);
          setSaveTarget(null);
          setIsSelectingSaveDate(false);
        }}
      />
    </>
  );
}
