import type { DateContext } from "../dateSignal/dateSignalTypes";
import type { OutingMode } from "../outingMode/outingModeTypes";
import { mockLocalContents } from "./mockLocalContents";
import type {
  ActionTag,
  ContentSource,
  ContentType,
  ContentTypeTag,
  LocalContent,
  RegionTag,
  SpaceTag,
  WeatherConditionTag,
} from "./localContentTypes";

const NEARBY_REGION_TAGS: RegionTag[] = ["paju_geumchon", "paju"];

export const contentTypeLabels: Record<ContentType, string> = {
  place_based: "공간",
  trail: "산책",
  exhibition: "전시",
  festival: "축제",
  popup: "팝업",
  program: "프로그램",
  village_tour: "마을탐방",
  kids_program: "어린이 프로그램",
  market: "마켓",
  performance: "공연",
  library: "도서관",
  cafe: "카페",
  fair: "페어",
  trekking: "트래킹",
  hiking: "등산",
  running: "런닝",
  leisure_sports: "레저스포츠",
  sports_watching: "스포츠 관람",
  outdoor_game: "아웃도어 게임",
  theme_cafe: "테마 카페",
  culture_complex: "복합문화공간",
  select_shop: "소품·편집 스토어",
};

export const contentSourceLabels: Record<ContentSource, string> = {
  official: "공식",
  partner: "파트너",
  brand: "브랜드",
  ggg_curated: "ggg 추천",
  user_submitted: "제보",
};

export const spaceTagLabels: Record<SpaceTag, string> = {
  indoor: "실내",
  outdoor: "실외",
  mixed: "실내+실외",
};

export const regionTagLabels: Record<RegionTag, string> = {
  paju: "파주시",
  paju_geumchon: "금촌",
  paju_unjeong: "운정",
  paju_munsan: "문산",
  paju_heyri: "헤이리",
  paju_bookcity: "출판도시",
  paju_imjingak: "임진각",
  seoul_seongsu: "성수동",
};

export const weatherConditionLabels: Record<WeatherConditionTag, string> = {
  rain: "비 오는 날",
  dust: "미세먼지 많음",
  heat: "더운 날",
  cold: "추운 날",
  wind: "바람 센 날",
  snow: "눈 오는 날",
};

export const actionTagLabels: Record<ActionTag, string> = {
  limited_period: "기간 한정",
  kid_friendly: "아이와 추천",
  parking: "주차 가능",
  free: "무료",
  reservation_required: "예약 필요",
  no_reservation: "예약 없이",
  stroller_friendly: "유모차 가능",
  pet_friendly: "반려동물 가능",
  near_station: "역 근처",
  night_available: "야간 가능",
};

export type DiscoverFilterGroupId =
  | "contentTypeTags"
  | "regionTags"
  | "spaceTags"
  | "weatherTags"
  | "actionTags";

export type DiscoverFilterState = Record<DiscoverFilterGroupId, string>;

export const defaultDiscoverFilters: DiscoverFilterState = {
  contentTypeTags: "all",
  regionTags: "nearby",
  spaceTags: "all",
  weatherTags: "all",
  actionTags: "all",
};

type DiscoverFilterOption = {
  label: string;
  value: string;
};

export const discoverTagFilterGroups: Array<{
  id: DiscoverFilterGroupId;
  title: string;
  options: DiscoverFilterOption[];
}> = [
  {
    id: "contentTypeTags",
    title: "유형",
    options: [
      { label: "전체", value: "all" },
      { label: "팝업", value: "popup" },
      { label: "축제", value: "festival" },
      { label: "공연", value: "performance" },
      { label: "마켓", value: "market" },
      { label: "탐방", value: "village_tour" },
      { label: "페어", value: "fair" },
      { label: "전시", value: "exhibition" },
      { label: "프로그램", value: "program" },
      { label: "트래킹", value: "trekking" },
      { label: "등산", value: "hiking" },
      { label: "런닝", value: "running" },
      { label: "레저스포츠", value: "leisure_sports" },
      { label: "스포츠 관람", value: "sports_watching" },
      { label: "아웃도어 게임", value: "outdoor_game" },
      { label: "테마 카페", value: "theme_cafe" },
      { label: "복합문화공간", value: "culture_complex" },
      { label: "소품·편집 스토어", value: "select_shop" },
    ],
  },
  {
    id: "regionTags",
    title: "지역",
    options: [
      { label: "내 주변", value: "nearby" },
      { label: "전체", value: "all" },
      { label: "금촌", value: "paju_geumchon" },
      { label: "운정", value: "paju_unjeong" },
      { label: "문산", value: "paju_munsan" },
      { label: "헤이리", value: "paju_heyri" },
      { label: "출판도시", value: "paju_bookcity" },
      { label: "임진각", value: "paju_imjingak" },
      { label: "성수동", value: "seoul_seongsu" },
    ],
  },
  {
    id: "spaceTags",
    title: "공간",
    options: [
      { label: "전체", value: "all" },
      { label: "실내", value: "indoor" },
      { label: "실외", value: "outdoor" },
      { label: "실내+실외", value: "mixed" },
    ],
  },
  {
    id: "weatherTags",
    title: "날씨",
    options: [
      { label: "전체", value: "all" },
      { label: "비 오는 날", value: "rain" },
      { label: "미세먼지 많음", value: "dust" },
      { label: "더운 날", value: "heat" },
      { label: "추운 날", value: "cold" },
      { label: "바람 센 날", value: "wind" },
      { label: "눈 오는 날", value: "snow" },
    ],
  },
  {
    id: "actionTags",
    title: "조건",
    options: [
      { label: "전체", value: "all" },
      { label: "기간 한정", value: "limited_period" },
      { label: "아이와 추천", value: "kid_friendly" },
      { label: "주차 가능", value: "parking" },
      { label: "무료", value: "free" },
      { label: "예약 필요", value: "reservation_required" },
      { label: "예약 없이", value: "no_reservation" },
      { label: "유모차 가능", value: "stroller_friendly" },
      { label: "반려동물 가능", value: "pet_friendly" },
      { label: "역 근처", value: "near_station" },
      { label: "야간 가능", value: "night_available" },
    ],
  },
];

const formatMonthDay = (dateKey: string) => {
  const [, month, day] = dateKey.split("-");
  return `${Number(month)}/${Number(day)}`;
};

export function getLocalContentById(id: string | undefined): LocalContent | undefined {
  return mockLocalContents.find((content) => content.id === id);
}

export function getContentDateLabel(content: LocalContent): string | undefined {
  if (content.dateType === "always") return content.distanceLabel;
  if (content.startDate && content.endDate) {
    return `${formatMonthDay(content.startDate)}~${formatMonthDay(content.endDate)}`;
  }
  if (content.startDate) return formatMonthDay(content.startDate);
  return content.distanceLabel;
}

export function getLocalContentSubtitle(content: LocalContent): string {
  const typeLabel =
    content.contentKind === "curated_content"
      ? contentSourceLabels[content.contentSource]
      : contentTypeLabels[content.contentType];
  const location = content.placeName ?? content.regionLabel;
  const dateOrDistance = getContentDateLabel(content);
  return [typeLabel, location, dateOrDistance].filter(Boolean).join(" · ");
}

export function getLocalContentSummary(content: LocalContent): string {
  if (content.summary) {
    return content.summary;
  }

  if (content.contentKind === "specific_content") {
    return `${content.title}은 ${content.regionLabel}에서 확인할 수 있는 ${contentTypeLabels[content.contentType]} 콘텐츠입니다. 날짜별 날씨 신호를 확인하고 저장해두면 방문하기 좋은 시점을 다시 볼 수 있어요.`;
  }

  return `${content.title}은 ggg가 날씨와 상황을 함께 보고 제안하는 추천입니다. 주변 장소와 이동 부담을 함께 고려해 날짜별 신호를 확인할 수 있어요.`;
}

export function getLocalContentMapQuery(content: LocalContent): string {
  return content.address ?? content.placeName ?? content.regionLabel ?? content.title;
}

export function getNaverMapUrl(content: LocalContent): string {
  return `https://map.naver.com/p/search/${encodeURIComponent(getLocalContentMapQuery(content))}`;
}

export function getKakaoMapUrl(content: LocalContent): string {
  return `https://map.kakao.com/link/search/${encodeURIComponent(getLocalContentMapQuery(content))}`;
}

export function getLocalContentRecommendations(mode: OutingMode): LocalContent[] {
  const matching = mockLocalContents.filter((content) => content.targetModes.includes(mode));
  const fallback = matching.length >= 3 ? matching : mockLocalContents;
  return [...fallback].sort((a, b) => {
    if (a.contentKind !== b.contentKind) {
      return a.contentKind === "specific_content" ? -1 : 1;
    }
    return mockLocalContents.indexOf(a) - mockLocalContents.indexOf(b);
  });
}

function toDateTime(dateKey: string) {
  return new Date(`${dateKey}T00:00:00`).getTime();
}

export function isLocalContentAvailableOnDate(
  content: LocalContent,
  context?: DateContext,
) {
  if (!context) return true;
  if (content.dateType === "always") return true;
  if (!content.startDate && !content.endDate) return true;

  const targetTime = toDateTime(context.targetDate);
  const startTime = content.startDate ? toDateTime(content.startDate) : Number.NEGATIVE_INFINITY;
  const endTime = content.endDate ? toDateTime(content.endDate) : Number.POSITIVE_INFINITY;

  return targetTime >= startTime && targetTime <= endTime;
}

function getLocalContentDateRank(content: LocalContent, context?: DateContext) {
  if (!context) return 0;
  if (content.contentKind === "specific_content" && isLocalContentAvailableOnDate(content, context)) {
    return 0;
  }
  if (content.dateType === "always") {
    return 1;
  }
  return 2;
}

function matchesDiscoverFilter(
  content: LocalContent,
  groupId: DiscoverFilterGroupId,
  value: string,
) {
  if (value === "all") return true;

  if (groupId === "contentTypeTags") {
    return content.contentTypeTags.includes(value as ContentTypeTag);
  }

  if (groupId === "regionTags") {
    if (value === "nearby") {
      return NEARBY_REGION_TAGS.some((tag) => content.regionTags.includes(tag));
    }
    return content.regionTags.includes(value as RegionTag);
  }

  if (groupId === "spaceTags") {
    return content.spaceTags.includes(value as SpaceTag);
  }

  if (groupId === "weatherTags") {
    return content.weatherGoodTags.includes(value as WeatherConditionTag);
  }

  return content.actionTags.includes(value as ActionTag);
}

export function searchLocalContents(
  query: string,
  mode: OutingMode,
  filters: DiscoverFilterState = defaultDiscoverFilters,
  context?: DateContext,
): LocalContent[] {
  const normalizedQuery = query.trim().toLowerCase();
  const base = getLocalContentRecommendations(mode);

  return base.filter((content) => {
    if (!isLocalContentAvailableOnDate(content, context)) return false;

    const tagLabels = [
      ...content.contentTypeTags.map((tag) => contentTypeLabels[tag]),
      ...content.regionTags.map((tag) => regionTagLabels[tag]),
      ...content.spaceTags.map((tag) => spaceTagLabels[tag]),
      ...content.weatherGoodTags.map((tag) => weatherConditionLabels[tag]),
      ...content.weatherAvoidTags.map((tag) => weatherConditionLabels[tag]),
      ...content.actionTags.map((tag) => actionTagLabels[tag]),
    ];
    const queryMatch = normalizedQuery
      ? [
          content.title,
          content.regionLabel,
          content.placeName,
          contentTypeLabels[content.contentType],
          contentSourceLabels[content.contentSource],
          ...tagLabels,
          ...content.verifiedBadges,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery)
      : true;

    if (!queryMatch) return false;
    return (Object.entries(filters) as Array<[DiscoverFilterGroupId, string]>).every(
      ([groupId, value]) => matchesDiscoverFilter(content, groupId, value),
    );
  }).sort((a, b) => {
    const dateRank = getLocalContentDateRank(a, context) - getLocalContentDateRank(b, context);
    if (dateRank !== 0) return dateRank;

    if (a.contentKind !== b.contentKind) {
      return a.contentKind === "specific_content" ? -1 : 1;
    }

    return mockLocalContents.indexOf(a) - mockLocalContents.indexOf(b);
  });
}

export function getContentDateSignalLabel(context: DateContext): string {
  return `${context.label} · ${context.basisLabel}`;
}
