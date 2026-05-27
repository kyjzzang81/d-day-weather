# DESIGN SYSTEM / UI PATTERN SPEC (MVP)

## Version
**v1.1** — Reference Mockup Direction 반영본

## Document Type
Design System / UI Pattern Specification

## Status
MVP Draft

---

# 0. v1.0 → v1.1 변경 요약

| 영역 | v1.0 | v1.1 |
|---|---|---|
| 디자인 방향 | calm decision app | 유지 |
| 기준 목업 | 없음 | 생성 목업을 MVP UI 기준 레퍼런스로 지정 |
| 시각 스타일 | 토큰/컴포넌트 중심 | iOS card-based mobile UI 방향 명시 |
| 구현 지시 | 일반 규칙 | Codex 구현 시 목업 방향 준수 명시 |
| 컴포넌트 우선순위 | 정의 | design tokens → common components → screens 순서 명시 |
| 하단 탭 | 기본 정의 | 중앙 floating + button 패턴 허용 |
| 일러스트 | 제외에 가까움 | 자연/여행 톤의 부드러운 spot illustration 허용 |

---

# 1. 문서 목적

이 문서는 ggg MVP의 **디자인 컨셉, UI 패턴, 컴포넌트 규칙, 디자인 토큰**을 정의한다.

Codex 구현 지시서와 실제 개발 작업에서 화면별 UI가 제각각 구현되지 않도록, 제품 전체의 시각적·상호작용 기준을 고정하는 것이 목적이다.

ggg는 일반적인 날씨 정보 앱이 아니라, 날씨를 기반으로 **오늘 할 일과 여행/외출 의사결정**을 돕는 앱이다.  
따라서 디자인은 단순한 예보 정보 나열보다 **판단이 빠르고, 신뢰감 있으며, 가볍게 탐색 가능한 구조**를 우선한다.

---

# 2. Reference Mockup Direction

## 2-1. 기준 목업

MVP v1.0의 UI 구현 기준은 다음 목업 방향을 따른다.

```text
Reference mockup:
a_clean_bright_ui_ux_mockup_presentation_image_of.png
```

이 목업은 최종 디자인 파일이 아니라, **구현 방향을 고정하기 위한 스타일 레퍼런스**다.

Codex는 이 목업의 아래 특성을 기준으로 UI를 구현한다.

```text
밝고 깨끗한 배경
iOS 카드형 모바일 UI
부드러운 그라데이션
넓은 여백
둥근 카드
soft shadow
blue primary CTA
green / yellow / gray / red grade color
grade dot indicator
하단 탭 + 중앙 floating action button
Bottom Sheet 기반 확인 UI
자연/여행 톤의 부드러운 일러스트
```

## 2-2. 구현 기준 문장

```text
ggg MVP의 화면은 Reference Mockup의 card-based iOS mobile style을 따른다.
임의의 새로운 UI 스타일을 추가하지 않는다.
공통 디자인 토큰과 컴포넌트를 먼저 만들고, 모든 화면은 이를 조합해 구현한다.
```

## 2-3. 목업에서 유지할 핵심 패턴

| 패턴 | 적용 |
|---|---|
| White / light blue background | 앱 전체 |
| Rounded white cards | 모든 정보 카드 |
| Soft pastel grade states | GradeBadge, ActivityScoreCard |
| Big judgment headline | TODAY Hero, D-DAY current score |
| Dot indicator | 모든 grade 요약 |
| Illustration card | Onboarding / DISCOVER intent / Empty 일부 |
| Bottom tab with central + | 메인 네비게이션 |
| Bottom Sheet | 저장 확인, 로그인 유도, 알림 권한 |
| Chip grid | 활동 선택, 선호 활동 설정 |
| Sectioned list | 검색 결과, 설정, 마이페이지 |

---

# 3. 디자인 방향

## 3-1. Product Design Direction

```text
ggg는 일반 날씨앱처럼 정보가 빽빽한 앱이 아니라,
오늘 할 일과 여행 결정을 도와주는 calm decision app이다.
```

## 3-2. 핵심 인상

```text
깨끗함
가벼움
판단이 빠름
과하게 귀엽지 않음
여행/외출 기대감
날씨 정보의 신뢰감
```

## 3-3. 디자인 원칙

| 원칙 | 설명 |
|---|---|
| 판단 우선 | 사용자가 숫자를 해석하기 전에 행동 판단을 먼저 볼 수 있어야 한다 |
| 정보 과밀 금지 | 날씨 지표를 모두 나열하지 않고 핵심 지표 중심으로 보여준다 |
| 부드러운 신뢰감 | 공공 데이터 기반의 신뢰감은 유지하되 딱딱한 관공서 UI는 피한다 |
| 가벼운 탐색성 | DISCOVER는 탐색의 즐거움이 있어야 한다 |
| 일관된 상태 표현 | TODAY / DISCOVER / D-DAY의 grade 표현은 일관되게 유지한다 |
| 모바일 우선 | iOS/Android 앱 전환을 고려한 touch-friendly UI를 사용한다 |

---

# 4. 브랜드 톤

## 4-1. Tone Keywords

```text
calm
clear
light
decision-first
travel-friendly
not childish
not technical
```

## 4-2. 피해야 할 인상

```text
전문 기상청 대시보드처럼 복잡함
게임처럼 과하게 귀여움
투자/분석 툴처럼 딱딱함
배너가 많은 광고형 앱
숫자만 많은 날씨표 앱
```

## 4-3. 카피 톤

```text
짧고 명확하게
사용자가 다음 행동을 알 수 있게
기술 용어 최소화
단정적이되 과장하지 않기
```

예:

```text
오늘은 야외 활동하기 좋아요
오후 바람은 조금 주의하세요
비가 와도 전시·카페는 괜찮아요
아이와 함께라면 자외선을 조금 신경 써주세요
```

피할 표현:

```text
API 오류
데이터 없음
치명적 실패
위험합니다
절대 가지 마세요
```

---

# 5. Visual System Overview

## 5-1. 전체 화면 인상

```text
밝은 배경
넓은 여백
둥근 카드
부드러운 그림자
큰 판단 문구
작은 보조 지표
칩 기반 선택
Bottom Sheet 중심의 저장/확인
```

## 5-2. 정보 위계

화면은 항상 아래 우선순위를 따른다.

```text
1. 오늘/일정의 판단
2. 이유 1~3개
3. 핵심 지표
4. 상세 데이터
5. 보조 행동 CTA
```

예:

```text
강력추천
오늘은 야외 활동하기 좋아요

비 가능성 낮음
바람 안정적
미세먼지 좋음
```

---

# 6. Color Tokens

## 6-1. Base Colors

```ts
export const colors = {
  background: "#F8FAFC",
  backgroundSoftBlue: "#EEF6FF",
  surface: "#FFFFFF",
  surfaceMuted: "#F1F5F9",

  textPrimary: "#0F172A",
  textSecondary: "#64748B",
  textTertiary: "#94A3B8",
  textInverse: "#FFFFFF",

  border: "#E2E8F0",
  divider: "#E5E7EB",

  accent: "#2563EB",
  accentSoft: "#DBEAFE",

  success: "#22C55E",
  successSoft: "#DCFCE7",

  recommendation: "#84CC16",
  recommendationSoft: "#ECFCCB",

  caution: "#F59E0B",
  cautionSoft: "#FEF3C7",

  neutral: "#94A3B8",
  neutralSoft: "#F1F5F9",

  danger: "#EF4444",
  dangerSoft: "#FEE2E2"
};
```

## 6-2. Grade Colors

| Grade | Context | Color | Soft BG |
|---|---|---|---|
| gorgeous / 강력추천 | 매우 좋음 | `#22C55E` | `#DCFCE7` |
| great / 추천 | 좋음 | `#84CC16` | `#ECFCCB` |
| good / 보통 | 보통 | `#94A3B8` | `#F1F5F9` |
| uhm.. / 비추천 | 아쉬움 | `#EF4444` | `#FEE2E2` |

## 6-3. Usage Rules

```text
Primary CTA는 accent 사용
Grade 표현은 grade color 사용
위험/주의 표현은 danger/caution 사용
배경은 background/surface 중심
텍스트 색상은 textPrimary/textSecondary 위주
한 화면에서 강조색은 1~2개만 사용
```

---

# 7. Typography Tokens

## 7-1. Font

MVP 기본 폰트는 시스템 폰트를 사용한다.

```css
font-family:
  -apple-system,
  BlinkMacSystemFont,
  "Apple SD Gothic Neo",
  "Pretendard",
  "Noto Sans KR",
  system-ui,
  sans-serif;
```

## 7-2. Type Scale

```ts
export const typography = {
  display: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: 700
  },
  title1: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 700
  },
  title2: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: 700
  },
  title3: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: 600
  },
  body1: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 400
  },
  body2: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: 400
  },
  caption: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: 400
  },
  button: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: 600
  }
};
```

## 7-3. Typography Usage

| 용도 | Token |
|---|---|
| Hero 판단 문구 | display 또는 title1 |
| 화면 제목 | title2 |
| 카드 제목 | title3 |
| 본문 | body1 |
| 보조 설명 | body2 |
| 배지/칩/메타 | caption |
| CTA | button |

---

# 8. Spacing / Radius / Shadow Tokens

## 8-1. Spacing

8px grid를 기준으로 한다.

```ts
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 40
};
```

## 8-2. Radius

Reference Mockup 기준으로 카드와 Bottom Sheet는 큰 radius를 사용한다.

```ts
export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  pill: 999
};
```

## 8-3. Shadow

```ts
export const shadows = {
  card: "0 8px 24px rgba(15, 23, 42, 0.06)",
  floating: "0 16px 40px rgba(15, 23, 42, 0.12)",
  bottomSheet: "0 -12px 40px rgba(15, 23, 42, 0.16)"
};
```

## 8-4. Layout Width

```text
mobile max width: 430px 기준
content horizontal padding: 20px
card padding: 16px~20px
section spacing: 24px~32px
```

---

# 9. Grade Visual System

## 9-1. 원칙

Weather Score의 0~100 숫자는 사용자에게 직접 노출하지 않는다.  
사용자에게는 **grade label + dot indicator + reason**만 보여준다.

## 9-2. Grade Mapping

| Score | DISCOVER | TODAY / D-DAY |
|---:|---|---|
| 85~100 | gorgeous | 강력추천 |
| 70~84 | great | 추천 |
| 50~69 | good | 보통 |
| 0~49 | uhm.. | 비추천 |

## 9-3. Dot Indicator

| Grade | Dot |
|---|---|
| gorgeous / 강력추천 | ●●● |
| great / 추천 | ●● |
| good / 보통 | ● |
| uhm.. / 비추천 | ◦ |

## 9-4. Dot Rules

```text
dot은 grade color를 사용한다
숫자 score 대신 dot으로 상대적 상태를 보여준다
스크린리더용 label을 반드시 제공한다
```

예:

```text
강력추천, 3단계 중 3단계
추천, 3단계 중 2단계
보통, 3단계 중 1단계
비추천
```

---

# 10. Component System

## 10-1. Core Components

MVP에서 공통으로 구현해야 할 컴포넌트는 다음과 같다.

```text
AppHeader
BottomTabBar
SidebarDrawer
BottomSheet
PrimaryButton
SecondaryButton
TextButton
IconButton
GradeBadge
DotIndicator
CategoryChip
SearchBar
SearchResultRow
EmptyState
LoadingSkeleton
ErrorState
PermissionState
```

## 10-2. Product Components

```text
WeatherHeroCard
MetricCard
DayFlowCard
ActivityScoreCard
DdayCard
DdayTimelineCard
DiscoverIntentCard
DiscoverResultCard
LocationSelectRow
NotificationSettingRow
ProfileSummaryCard
DataSourceCard
IllustrationCard
```

## 10-3. Component Rule

```text
컴포넌트는 props로 grade/activity/status를 받아 렌더링한다
컴포넌트 내부에서 API 호출하지 않는다
컴포넌트 내부에서 route 이동을 직접 결정하지 않는다
상위 screen/container가 data와 action을 주입한다
```

---

# 11. Reference Mockup Component Notes

## 11-1. WeatherHeroCard

목업의 TODAY Hero처럼 큰 판단 문구와 이유, grade illustration을 함께 배치한다.

```text
좌측: 판단 label + 이유
우측: grade face/icon 또는 간단한 weather illustration
하단: dot indicator
```

## 11-2. DiscoverIntentCard

DISCOVER P0/P1/P2/P3 카드는 목업처럼 큰 카드 4개를 세로로 배치한다.

```text
카드 제목
짧은 설명
작은 hashtag 또는 type label
우측/하단 일러스트
```

## 11-3. DdayHeroCard

D-DAY 상세 상단은 이미지/일러스트 카드 + D-day badge를 사용한다.

```text
배경 이미지 또는 gradient illustration
일정명
날짜/장소
D-3 badge
```

## 11-4. SearchResultRow

검색 결과는 지역/장소/POI 섹션을 구분하고 thumbnail이 있으면 사용한다.

```text
thumbnail optional
title
subtitle
chevron
```

## 11-5. LoginRequiredBottomSheet

목업처럼 dim overlay 위에 둥근 Bottom Sheet를 띄운다.

```text
lock icon
짧은 설명
primary login CTA
secondary signup/close CTA
```

---

# 12. Screen Layout Patterns

## 12-1. TODAY Layout Pattern

```text
AppHeader(location)
WeatherHeroCard
MetricCard Grid
DayFlowCard
ActivityScoreCard List
D-DAY Mini Section
DISCOVER CTA
```

### Rules

```text
Hero 판단을 최상단에 배치
일출/일몰은 Hero가 아니라 DayFlow에 포함
활동 추천은 선호 활동만 표시
선호 활동 미설정 시 EmptyState + CTA
```

---

## 12-2. DISCOVER Layout Pattern

```text
AppHeader
Intent Selection
Search / Selection Step
Result Summary
DiscoverResultCard List
D-DAY Save CTA
```

### Rules

```text
P0/P1/P2/P3는 flow state로 관리
route는 단순 유지
결과 카드는 grade + reason 중심
D-DAY 저장 CTA는 명확히 표시
```

---

## 12-3. D-DAY Layout Pattern

```text
AppHeader
DdayHero / Current Stage
Score Snapshot
Timeline
Activity Breakdown
Notification Guide
```

### Rules

```text
D-DAY는 추천 탐색 화면이 아니라 저장 일정 관리 화면
현재 stage를 먼저 보여준다
D-14 이후 forecast 업데이트 가능성을 표시한다
```

---

## 12-4. D-DAY Create Pattern

```text
Title Input
Date Range Picker
City Select
Activity Chips
Theme Option
Notification Preview
Next CTA
Save Confirmation BottomSheet
```

### Rules

```text
활동은 최대 3개
지역은 cities 기반 시/군/구 단위
POI 직접 입력은 제외
저장 전 Bottom Sheet에서 확인
```

---

## 12-5. Settings Pattern

```text
Section Title
Setting Row
Toggle / Navigation Row
Description Text
```

### Rules

```text
전체 알림 OFF이면 하위 알림 비활성
기기 권한 OFF이면 설정 이동 CTA
계정 삭제는 destructive dialog
```

---

# 13. Interaction Patterns

## 13-1. Navigation

```text
Bottom Tab: TODAY / DISCOVER / D-DAY
Sidebar: 전역 drawer
Bottom Sheet: modal state
```

## 13-2. D-DAY 저장

```text
D-DAY 저장 CTA
→ Save Confirmation Bottom Sheet
→ auth check
→ 비로그인: Login Required Bottom Sheet
→ 로그인 성공: pendingDdayDraft 복구
→ 저장
```

## 13-3. Search

```text
검색 결과는 타입별 섹션 분리
최근 검색어가 아니라 최근 선택 저장
D-DAY 직접 입력은 POI 검색 제외
DISCOVER는 지역 + POI 검색 허용
```

## 13-4. Activity Selection

```text
TODAY: 선호 활동만 표시
DISCOVER: 선호 활동 우선 + 전체 활동
D-DAY: 선호 활동 우선 + 전체 활동
```

---

# 14. Mobile UX Rules

## 14-1. Safe Area

```text
상단 notch/safe area 대응
하단 tab/sheet safe area 대응
CTA가 홈 인디케이터와 겹치지 않게 한다
```

## 14-2. Touch Target

```text
최소 touch target: 44px
칩/버튼은 세로 40~48px 권장
리스트 row는 최소 56px
```

## 14-3. Scroll

```text
긴 화면은 vertical scroll
Bottom Sheet는 내부 scroll 가능
Modal open 시 background scroll lock
```

---

# 15. Motion / Feedback

## 15-1. Motion Principle

```text
빠르고 부드럽게
과도한 애니메이션 금지
상태 변화가 이해될 정도만 사용
```

## 15-2. Timing

```ts
export const motion = {
  fast: 150,
  normal: 220,
  slow: 320
};
```

## 15-3. Use Cases

```text
Bottom Sheet open/close
Sidebar open/close
Chip selected/unselected
Loading skeleton shimmer
Card press feedback
```

---

# 16. Accessibility

## 16-1. Text

```text
텍스트 대비 확보
caption도 읽을 수 있는 크기 유지
중요 정보는 색상만으로 전달하지 않음
```

## 16-2. Screen Reader

필수 label:

```text
GradeBadge
DotIndicator
Toggle
Bottom Tab
IconButton
```

예:

```text
오늘 야외 활동 강력추천, 3단계 중 3단계
```

## 16-3. Color Dependency

```text
grade는 색상 + 텍스트 + dot을 함께 사용
위험 상태는 아이콘과 문구 병기
```

---

# 17. Implementation Rules for Codex

Codex는 아래 규칙을 따라 구현해야 한다.

## 17-1. Do

```text
공통 컴포넌트를 먼저 만든다
디자인 토큰을 별도 파일로 분리한다
grade color/label은 중앙 함수에서 관리한다
Bottom Sheet는 modal state로 구현한다
화면별 inline style 남발을 피한다
Reference Mockup의 card-based iOS mobile style을 따른다
```

## 17-2. Do Not

```text
0~100 score를 사용자 UI에 직접 노출하지 않는다
화면마다 임의 색상 사용하지 않는다
Bottom Sheet를 route로 만들지 않는다
활동 카테고리 이름을 화면마다 다르게 쓰지 않는다
외부 API 호출을 UI 컴포넌트 안에서 하지 않는다
목업과 다른 강한 색상/복잡한 대시보드 스타일을 임의 도입하지 않는다
```

## 17-3. Required Build Order

```text
1. design/tokens.ts
2. design/grade.ts
3. common components
4. layout components
5. Bottom Tab / Sidebar / Bottom Sheet
6. TODAY
7. DISCOVER
8. D-DAY
9. Settings / MyPage
```

---

# 18. Recommended File Structure

```text
src/
├── app/
│   ├── routes/
│   └── providers/
├── components/
│   ├── common/
│   ├── layout/
│   ├── weather/
│   ├── discover/
│   ├── dday/
│   └── settings/
├── design/
│   ├── tokens.ts
│   ├── grade.ts
│   └── motion.ts
├── features/
│   ├── today/
│   ├── discover/
│   ├── dday/
│   ├── preferences/
│   └── settings/
├── lib/
│   ├── supabase/
│   ├── score/
│   └── utils/
└── types/
```

---

# 19. MVP 포함 / 제외

## 19-1. 포함

```text
Reference Mockup Direction
디자인 토큰
Grade visual system
Core components
Product components
TODAY/DISCOVER/D-DAY layout patterns
Bottom Sheet pattern
Sidebar pattern
Empty/Loading/Error pattern
Mobile safe area
Accessibility labels
```

## 19-2. 제외

```text
다크모드
복잡한 일러스트 시스템
고급 차트 디자인 시스템
브랜드 캐릭터
테마 스킨
지도 UI 패턴
태블릿/데스크톱 최적화
고급 모션 시스템
```

---

# 20. 최종 요약

```text
ggg Design System
→ Reference Mockup을 MVP UI 방향으로 고정
→ calm decision app
→ 밝은 배경, 둥근 카드, 넓은 여백
→ 0~100 점수는 숨기고 grade + dot + reason 노출
→ 공통 컴포넌트 우선
→ Bottom Sheet / Sidebar / Chip / Card 패턴 일관화
→ 모바일 safe area와 touch target 준수
```

이 문서는 `CODEX-IMPLEMENTATION-BRIEF`의 디자인 기준 문서로 사용한다.
