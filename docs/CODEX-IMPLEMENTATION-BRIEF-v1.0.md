# CODEX IMPLEMENTATION BRIEF (MVP)

## Version
**v1.0** — ggg MVP 개발 착수 지시서

## Document Type
Engineering Implementation Brief

## Status
Ready for Codex Desktop

---

# 1. 목적

이 문서는 Codex Desktop에서 ggg MVP 구현을 시작하기 위한 작업 지시서다.

Codex는 이 문서를 기준으로 프로젝트를 단계적으로 구현한다.  
한 번에 전체 앱을 만들지 말고, 아래 Task 순서대로 작게 구현·검증한다.

---

# 2. 제품 요약

ggg는 날씨 정보를 단순히 보여주는 앱이 아니라, 사용자가 **오늘 무엇을 할지, 언제 어디로 갈지, 저장한 일정에서 무엇을 준비해야 할지**를 판단하게 돕는 날씨·기후 기반 외출/여행 의사결정 앱이다.

## 핵심 탭

```text
TODAY
DISCOVER
D-DAY
```

## 핵심 UX

```text
TODAY
→ 현재 위치 기준 오늘 외출 판단

DISCOVER
→ 날짜/지역/활동 기반 추천 탐색

D-DAY
→ 저장 일정의 날씨 변화와 준비 단계 관리
```

---

# 3. 기준 문서

Codex는 아래 문서를 기준으로 구현한다.

| 영역 | 파일 |
|---|---|
| 최종 PRD | `ggg-FINAL-PRD-v2.5.md` |
| 디자인 시스템 | `DESIGN-SYSTEM-UI-PATTERN-SPEC-v1.1.md` |
| Navigation/Routing | `NAVIGATION-ROUTING-SPEC-v1.0.md` |
| Supabase Data Model | `SUPABASE-DATA-MODEL-SPEC-v1.1.md` |
| Supabase Migration | `SUPABASE-MIGRATION-PLAN-v1.0.md` |
| API/Data Access | `API-DATA-ACCESS-SPEC-v1.1.md` |
| Weather Score Policy | `WEATHER-SCORE-POLICY-SPEC-v1.2.md` |
| Weather Score Implementation | `WEATHER-SCORE-ENGINE-IMPLEMENTATION-SPEC-v1.1.md` |
| TODAY | `TODAY-PRODUCT-SPEC-v1.1.md` |
| DISCOVER | `DISCOVER-PRODUCT-SPEC-v1.2.md` |
| D-DAY | `D-DAY-Product-Spec-v2.1.md` |
| D-DAY Create | `D-DAY-CREATE-FORM-SPEC-v1.0.md` |
| D-DAY Save | `D-DAY-SAVE-CONFIRMATION-NOTIFICATION-SPEC-v1.1.md` |
| Onboarding / Preferences | `ONBOARDING-ACTIVITY-PREFERENCE-SPEC-v1.0.md` |
| Common Search | `COMMON-SEARCH-SELECTION-SPEC-v1.0.md` |
| Common States | `COMMON-EMPTY-LOADING-ERROR-STATES-SPEC-v1.0.md` |
| Notification Settings | `NOTIFICATION-SETTINGS-SPEC-v1.0.md` |
| Sidebar / MyPage / Settings | `SIDEBAR-MYPAGE-SETTINGS-SPEC-v1.0.md` |

---

# 4. Design Reference

## 4-1. Reference Mockup

Codex는 아래 목업의 시각 방향을 기준으로 UI를 구현한다.

```text
a_clean_bright_ui_ux_mockup_presentation_image_of.png
```

## 4-2. Design Direction

```text
calm decision app
밝은 배경
iOS card-based mobile UI
rounded white cards
soft shadow
blue primary CTA
green/yellow/gray/red grade system
grade dot indicator
Bottom Sheet 중심 interaction
하단 탭 + 중앙 floating action
자연/여행 톤의 부드러운 일러스트
```

## 4-3. 반드시 지킬 규칙

```text
0~100 score를 사용자에게 직접 노출하지 않는다.
사용자에게는 grade label + dot indicator + reason만 보여준다.
화면마다 임의 색상/임의 스타일을 만들지 않는다.
DESIGN-SYSTEM-UI-PATTERN-SPEC-v1.1의 tokens/components를 따른다.
공통 컴포넌트를 먼저 만들고 화면은 조합한다.
```

---

# 5. 기술 스택 전제

사용자의 현재 방향:

```text
Web App
Capacitor로 모바일 앱 확장 예정
Supabase PostgreSQL
Supabase Auth
Supabase Edge Functions
```

권장 구현 스택:

```text
React
TypeScript
Vite
Capacitor-ready structure
Supabase JS Client
Tailwind CSS 또는 CSS Modules
```

Tailwind를 사용할 경우 디자인 토큰은 Tailwind config와 `src/design/tokens.ts`에 모두 반영한다.

---

# 6. 프로젝트 구조 제안

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
├── types/
└── main.tsx
```

Supabase Edge Functions는 별도 폴더에 둔다.

```text
supabase/
├── functions/
│   ├── get_today_payload/
│   ├── calculate_discover_recommendations/
│   ├── create_dday_event/
│   └── update_dday_forecast_snapshot/
└── migrations/
```

---

# 7. 구현 우선순위

## Phase A — App Shell / Design Foundation

```text
Task A1. 프로젝트 환경 확인
Task A2. design tokens 구현
Task A3. grade visual system 구현
Task A4. common components 구현
Task A5. layout components 구현
Task A6. Bottom Tab / Sidebar / Modal Layer 구현
```

## Phase B — Supabase Foundation

```text
Task B1. migration SQL 적용
Task B2. Supabase client 설정
Task B3. Auth provider 연결 준비
Task B4. activity_categories seed 확인
Task B5. RLS 기본 동작 확인
```

## Phase C — Preferences / Auth

```text
Task C1. Google / Apple / Kakao 로그인 UI 구현
Task C2. user_profiles upsert
Task C3. user_preferences 구현
Task C4. 선호 활동 설정 화면 구현
Task C5. 비로그인/로그인 상태 분기
```

## Phase D — TODAY

```text
Task D1. TODAY mock payload 생성
Task D2. TODAY UI 구현
Task D3. 선호 활동 미설정 EmptyState 구현
Task D4. 선호 활동 기반 ActivityScoreCard 구현
Task D5. GPS permission flow 연결
Task D6. get_today_payload Edge Function mock 연결
```

## Phase E — Weather Score Engine

```text
Task E1. shared score engine package 골격 구현
Task E2. grade mapping 구현
Task E3. activity category/profile mapping 구현
Task E4. indoor alternative bonus 구현
Task E5. fatal rule interface 구현
Task E6. weather_score_logs insert helper 구현
```

## Phase F — D-DAY

```text
Task F1. /dday list 구현
Task F2. 비로그인 D-DAY Empty/Login CTA 구현
Task F3. /dday/create 구현
Task F4. D-DAY Save Confirmation Bottom Sheet 구현
Task F5. pendingDdayDraft 구현
Task F6. create_dday_event Edge Function mock 구현
Task F7. /dday/:id 상세 구현
```

## Phase G — DISCOVER

```text
Task G1. /discover intent 화면 구현
Task G2. flow state 구현
Task G3. /discover/search 구현
Task G4. cities search 구현
Task G5. poi_master search mock 구현
Task G6. /discover/results 구현
Task G7. D-DAY 저장 연결
```

## Phase H — Settings / MyPage

```text
Task H1. Sidebar Drawer 구현
Task H2. MyPage 구현
Task H3. 저장된 D-DAY 리스트
Task H4. 완료된 D-DAY 리스트
Task H5. 알림 설정 화면
Task H6. 위치 설정 화면
Task H7. 계정 관리 화면
Task H8. 데이터 출처 화면
```

---

# 8. Task별 완료 조건

## Task A2 — design tokens

완료 조건:

```text
src/design/tokens.ts 생성
colors / typography / spacing / radius / shadows / motion 정의
Reference Mockup 스타일과 일치
```

## Task A3 — grade visual system

완료 조건:

```text
src/design/grade.ts 생성
scoreToGrade 함수
gradeToLabel 함수
gradeToColor 함수
DotIndicator 규칙 구현
0~100 score UI 노출 없음
```

## Task A4 — common components

완료 조건:

```text
PrimaryButton
SecondaryButton
GradeBadge
DotIndicator
CategoryChip
EmptyState
LoadingSkeleton
ErrorState
BottomSheet
SearchBar
SearchResultRow
```

## Task A6 — navigation shell

완료 조건:

```text
/today
/discover
/dday
/location/select
/activity-preferences
/settings
/mypage
BottomTabBar
SidebarDrawer
modal state layer
```

## Task D2 — TODAY UI

완료 조건:

```text
Reference Mockup 수준의 card-based TODAY 화면
WeatherHeroCard
MetricCard
DayFlowCard
ActivityScoreCard
D-DAY mini section
DISCOVER CTA
```

## Task F4 — D-DAY Save Confirmation

완료 조건:

```text
Bottom Sheet 구현
일정명/옵션/알림 수정 가능
날짜/지역/활동 수정 불가
로그인 필요 시 Login Required Bottom Sheet 연결
```

---

# 9. Mock으로 시작할 부분

초기 구현에서는 아래를 mock으로 시작한다.

```text
get_today_payload response
calculate_discover_recommendations response
create_dday_event response
poi_master 초기 데이터
dong_weather_cache response
weather_score_logs insert
notification scheduling
```

Mock은 실제 타입과 동일한 shape을 사용해야 한다.

---

# 10. 실제 API 연동이 필요한 부분

Mock UI 이후 실제 연동한다.

```text
Supabase Auth
Supabase user_preferences
Supabase user_dday_events
Supabase recent_selections
Supabase activity_categories
Edge Function get_today_payload
Edge Function create_dday_event
weather_score_logs insert
```

외부 날씨 API는 클라이언트에서 직접 호출하지 않는다.

```text
Client
→ Supabase Edge Function
→ External API
```

---

# 11. Supabase Migration 적용 순서

SQL은 아래 순서로 적용한다.

```text
001_create_master_tables.sql
002_create_user_tables.sql
003_create_dday_tables.sql
004_create_score_cache_tables.sql
005_create_indexes.sql
006_enable_rls_policies.sql
007_seed_activity_categories.sql
```

주의:

```text
기존 cities/weather/climate 테이블은 변경하지 않는다.
nearby_places → poi_master 마이그레이션은 Phase 1.5.
```

---

# 12. Routing Rules

## Main

```text
/today
/discover
/dday
```

## DISCOVER

```text
/discover
/discover/search
/discover/results
```

P0/P1/P2/P3는 route가 아니라 내부 flow state로 관리한다.

```ts
type DiscoverFlow = "p0" | "p1" | "p2" | "p3";
```

## D-DAY

```text
/dday
/dday/create
/dday/:id
```

## Modal State

아래는 route로 만들지 않는다.

```text
D-DAY 저장 확인 Bottom Sheet
알림 권한 안내 Bottom Sheet
로그인 유도 Bottom Sheet
삭제 확인 Dialog
로그아웃 확인 Dialog
계정 삭제 확인 Dialog
```

---

# 13. Auth Rules

## 비로그인 가능

```text
TODAY
DISCOVER
온보딩
위치 선택
선호 활동 설정
데이터 출처
약관/개인정보
D-DAY 탭 진입
```

## 로그인 필요

```text
D-DAY 저장
저장된 D-DAY 조회
완료된 D-DAY 조회
계정 관리
알림 설정 저장
```

## D-DAY 저장

```text
비로그인 저장 불가
저장 시 로그인 유도
로그인 후 pendingDdayDraft 복구
```

---

# 14. Critical Implementation Rules

Codex는 아래 규칙을 반드시 지킨다.

## Do

```text
작은 Task 단위로 구현한다.
각 Task 후 타입 에러와 빌드 에러를 확인한다.
공통 컴포넌트를 재사용한다.
Supabase 타입/스키마와 UI 타입을 분리한다.
Edge Function 호출은 lib/api 또는 feature service layer에 둔다.
```

## Do Not

```text
전체 앱을 한 번에 생성하지 않는다.
외부 날씨 API를 클라이언트에서 직접 호출하지 않는다.
0~100 score를 사용자 UI에 직접 노출하지 않는다.
Bottom Sheet를 route로 구현하지 않는다.
P0/P1/P2/P3를 독립 route로 과도하게 나누지 않는다.
임의의 디자인 스타일을 새로 만들지 않는다.
기존 Supabase weather/climate 테이블을 임의 변경하지 않는다.
```

---

# 15. Initial Mock Data

## 15-1. Activity Categories

```ts
export const activityCategories = [
  { code: "beach", displayName: "해변", profile: "outdoor_exposed" },
  { code: "hiking", displayName: "등산/트레킹", profile: "outdoor_active" },
  { code: "camping", displayName: "캠핑", profile: "outdoor_stay" },
  { code: "scenic", displayName: "일출/일몰", profile: "outdoor_exposed" },
  { code: "photo", displayName: "사진/뷰", profile: "outdoor_exposed" },
  { code: "urban", displayName: "피크닉/도시산책", profile: "outdoor_relax" },
  { code: "cafe", displayName: "카페/맛집", profile: "indoor_social" },
  { code: "festival", displayName: "축제/이벤트", profile: "outdoor_relax" },
  { code: "spa", displayName: "온천/리조트", profile: "indoor_stay" },
  { code: "indoor", displayName: "전시/문화", profile: "indoor_visit" }
];
```

## 15-2. Grade Labels

```ts
const gradeLabels = {
  discover: {
    gorgeous: "gorgeous",
    great: "great",
    good: "good",
    bad: "uhm.."
  },
  todayDday: {
    gorgeous: "강력추천",
    great: "추천",
    good: "보통",
    bad: "비추천"
  }
};
```

---

# 16. First Implementation Prompt for Codex

Codex Desktop에서 첫 작업은 아래처럼 시작한다.

```text
Read CODEX-IMPLEMENTATION-BRIEF-v1.0.md and DESIGN-SYSTEM-UI-PATTERN-SPEC-v1.1.md.

Start with Phase A only:
1. Inspect the existing project structure.
2. Create or update design tokens.
3. Implement grade visual utilities.
4. Implement common UI components:
   - PrimaryButton
   - SecondaryButton
   - GradeBadge
   - DotIndicator
   - CategoryChip
   - BottomSheet
   - EmptyState
   - LoadingSkeleton
5. Implement app shell routes:
   - /today
   - /discover
   - /dday
6. Create a mock TODAY screen that follows the reference mockup style.

Do not implement Supabase or external API calls yet.
Use mock data only.
Keep the implementation small and type-safe.
```

---

# 17. Expected First Milestone

첫 번째 milestone은 다음이다.

```text
앱 실행
→ Bottom Tabs 표시
→ TODAY mock 화면 표시
→ DISCOVER placeholder 표시
→ D-DAY placeholder 표시
→ 디자인 토큰/공통 컴포넌트 적용
```

완료 기준:

```text
Reference Mockup과 유사한 밝은 카드형 UI
타입 에러 없음
빌드 성공
공통 컴포넌트 재사용
0~100 score 미노출
```

---

# 18. 최종 요약

```text
Codex 구현 순서
→ Design System
→ Common Components
→ App Shell
→ TODAY mock
→ Supabase foundation
→ Preferences/Auth
→ Weather Score Engine
→ D-DAY
→ DISCOVER
→ Settings/MyPage
```

이 문서는 ggg MVP 구현의 단일 작업 지시서로 사용한다.
