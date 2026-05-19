import type { ActivityCategoryCode } from "../today/todayPayload";
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

export interface ActivityPreferenceOption {
  category: ActivityCategoryCode;
  label: string;
  icon: string;
}

export const MAX_ACTIVITY_PREFERENCES = 3;

export const DEFAULT_ACTIVITY_PREFERENCES: ActivityCategoryCode[] = ["urban", "photo", "cafe"];

export const activityPreferenceOptions: ActivityPreferenceOption[] = [
  { category: "beach", label: "계곡/강", icon: activityBeachIcon },
  { category: "hiking", label: "등산/트래킹", icon: activityHikingIcon },
  { category: "camping", label: "테마 탐방", icon: activityCampingIcon },
  { category: "scenic", label: "일출/일몰", icon: activityScenicIcon },
  { category: "photo", label: "사진/뷰", icon: activityPhotoIcon },
  { category: "urban", label: "피크닉/산책", icon: activityUrbanIcon },
  { category: "cafe", label: "카페/맛집", icon: activityCafeIcon },
  { category: "festival", label: "축제/이벤트", icon: activityFestivalIcon },
  { category: "spa", label: "온천/리조트", icon: activitySpaIcon },
  { category: "indoor", label: "전시/실내", icon: activityIndoorIcon }
];
