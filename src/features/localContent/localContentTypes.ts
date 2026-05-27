import type { GradeCode } from "../../design/grade";
import type { OutingMode } from "../outingMode/outingModeTypes";

export type ContentKind = "specific_content" | "curated_content";

export type ContentSource =
  | "official"
  | "partner"
  | "brand"
  | "ggg_curated"
  | "user_submitted";

export type ContentType =
  | "place_based"
  | "trail"
  | "exhibition"
  | "festival"
  | "popup"
  | "program"
  | "village_tour"
  | "kids_program"
  | "market"
  | "performance"
  | "library"
  | "cafe"
  | "fair"
  | "trekking"
  | "hiking"
  | "running"
  | "leisure_sports"
  | "sports_watching"
  | "outdoor_game"
  | "theme_cafe"
  | "culture_complex"
  | "select_shop";

export type DateType =
  | "always"
  | "scheduled"
  | "seasonal"
  | "temporary";

export type SpaceType = "indoor" | "outdoor" | "mixed";

export type ContentTypeTag = ContentType;

export type SpaceTag = SpaceType;

export type RegionTag =
  | "paju"
  | "paju_geumchon"
  | "paju_unjeong"
  | "paju_munsan"
  | "paju_heyri"
  | "paju_bookcity"
  | "paju_imjingak"
  | "seoul_seongsu";

export type WeatherConditionTag =
  | "rain"
  | "dust"
  | "heat"
  | "cold"
  | "wind"
  | "snow";

export type ActionTag =
  | "limited_period"
  | "kid_friendly"
  | "parking"
  | "free"
  | "reservation_required"
  | "no_reservation"
  | "stroller_friendly"
  | "pet_friendly"
  | "near_station"
  | "night_available";

export type LocalContent = {
  id: string;
  title: string;

  contentKind: ContentKind;
  contentSource: ContentSource;
  contentType: ContentType;

  dateType: DateType;
  startDate?: string;
  endDate?: string;
  operatingHours?: string;

  organizerName?: string;
  officialUrl?: string;
  summary?: string;

  poiId?: string;
  placeName?: string;
  address?: string;
  regionLabel: string;
  distanceLabel?: string;

  indoorOutdoor: "실내" | "실외" | "복합";
  spaceType: SpaceType;
  weatherSensitivity: "low" | "medium" | "high";

  targetModes: OutingMode[];

  contentTypeTags: ContentTypeTag[];
  regionTags: RegionTag[];
  spaceTags: SpaceTag[];
  weatherGoodTags: WeatherConditionTag[];
  weatherAvoidTags: WeatherConditionTag[];
  actionTags: ActionTag[];

  verifiedBadges: string[];

  imageUrl?: string;

  grade: GradeCode;
  basisLabel: "예보 기준" | "최근 10년 경향 기준";

  reason?: string;
};
