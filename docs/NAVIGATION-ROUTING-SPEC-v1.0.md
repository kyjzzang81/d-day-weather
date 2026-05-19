# NAVIGATION / ROUTING SPEC (MVP)

## Version
**v1.0** — 화면 이동 / 라우팅 / Modal State 정의

## Document Type
Product / App Architecture Specification

## Status
MVP Draft

---

# 1. 문서 목적

이 문서는 ggg 앱 MVP의 **화면 구조, 라우팅, 탭 구성, 사이드바, Bottom Sheet, 로그인 가드, prefill 전달 규칙**을 정의한다.

현재까지 정의된 핵심 화면은 다음과 같다.

```text
TODAY
DISCOVER
D-DAY
온보딩
선호 활동 설정
위치 선택
D-DAY 새로 만들기
D-DAY 저장 확인 Bottom Sheet
알림 권한 안내
사이드바 / 마이페이지 / 설정
알림 설정
계정 관리
데이터 출처
```

라우팅 스펙의 목적은 화면 이동 규칙과 데이터 전달 방식을 고정하여, 실제 앱 구현 시 폴더 구조, navigation state, modal state, auth guard가 흔들리지 않게 하는 것이다.

---

# 2. 핵심 결정사항

| 항목 | 결정 |
|---|---|
| Bottom Tabs | TODAY / DISCOVER / D-DAY |
| DISCOVER routing | `/discover`, `/discover/search`, `/discover/results` + 내부 `flow` state |
| D-DAY routing | `/dday`, `/dday/create`, `/dday/:id` |
| 사이드바 | 전역 Drawer |
| Bottom Sheet | route가 아니라 modal state |
| 비로그인 D-DAY 탭 | 접근 허용, 로그인 CTA 표시 |
| D-DAY 저장 | 로그인 필수 |
| 로그인 후 draft 복구 | 필요 |
| 위치 선택 | `/location/select` 재사용 |
| 선호 활동 설정 | `/activity-preferences` 독립 route |
| 로그인 방식 | Google / Apple / Kakao |
| D-DAY 저장 확인 | modal state |
| 알림 권한 안내 | modal state |

---

# 3. 전체 화면 구조

## 3-1. Main App Structure

```text
App Root
├── Onboarding Flow
├── Bottom Tab Navigator
│   ├── TODAY
│   ├── DISCOVER
│   └── D-DAY
├── Global Sidebar Drawer
├── Modal / Bottom Sheet Layer
└── Auth / Login Layer
```

## 3-2. Bottom Tabs

MVP의 하단 탭은 3개로 고정한다.

```text
/today
/discover
/dday
```

| 탭 | 역할 |
|---|---|
| TODAY | 오늘 현재 위치 기준 판단 |
| DISCOVER | 날짜/지역/활동 탐색 |
| D-DAY | 저장 일정 관리 |

---

# 4. Route 목록

## 4-1. Root

```text
/
```

Root 진입 시 다음을 판단한다.

```text
onboarding_completed = false
→ /onboarding

onboarding_completed = true
→ /today
```

---

## 4-2. Main Tabs

```text
/today
/discover
/dday
```

---

## 4-3. Onboarding

```text
/onboarding
/onboarding/location
```

선호 활동 설정은 온보딩 필수 단계가 아니므로 별도 route로 둔다.

```text
/activity-preferences
```

---

## 4-4. Location

```text
/location/select
```

`/location/select`는 여러 화면에서 재사용하는 공통 위치/지역 선택 route다.

사용 가능한 entryPoint:

```text
onboarding
today
discover
dday_create
settings
```

예:

```text
/location/select?entryPoint=today
/location/select?entryPoint=dday_create
/location/select?entryPoint=settings
```

---

## 4-5. DISCOVER

MVP에서는 P0/P1/P2/P3별 독립 route를 만들지 않는다.  
route는 단순하게 유지하고, 내부 `flow` state로 분기한다.

```text
/discover
/discover/search
/discover/results
```

내부 flow state:

```ts
type DiscoverFlow = "p0" | "p1" | "p2" | "p3";
```

예:

```text
/discover?flow=p0
/discover?flow=p1
/discover/search?flow=p1
/discover/results?flow=p2
```

---

## 4-6. D-DAY

MVP 포함 route:

```text
/dday
/dday/create
/dday/:id
```

Phase 1.5 이후 검토 route:

```text
/dday/:id/edit
```

---

## 4-7. My Page

```text
/mypage
/mypage/saved-ddays
/mypage/completed-ddays
```

---

## 4-8. Settings

```text
/settings
/settings/notifications
/settings/location
/settings/account
/settings/data-sources
/settings/privacy
/settings/terms
/settings/inquiry
```

---

# 5. Sidebar Drawer

## 5-1. 역할

사이드바는 주요 탭이 아니라 전역 Drawer다.

```text
TODAY / DISCOVER / D-DAY
→ Menu Button
→ Sidebar Drawer
```

## 5-2. 사이드바 메뉴

```text
[프로필 영역]

마이페이지
- 저장된 D-DAY
- 완료된 D-DAY
- 선호 활동 변경

설정
- 알림 설정
- 위치 설정
- 계정 관리
- 데이터 출처
- 개인정보 처리방침
- 서비스 이용약관
- 문의하기
- 앱 버전
```

## 5-3. Sidebar → Route Mapping

| 메뉴 | Route |
|---|---|
| 프로필 / 로그인 | `/settings/account` 또는 Login Modal |
| 저장된 D-DAY | `/mypage/saved-ddays` |
| 완료된 D-DAY | `/mypage/completed-ddays` |
| 선호 활동 변경 | `/activity-preferences` |
| 알림 설정 | `/settings/notifications` |
| 위치 설정 | `/settings/location` |
| 계정 관리 | `/settings/account` |
| 데이터 출처 | `/settings/data-sources` |
| 개인정보 처리방침 | `/settings/privacy` |
| 서비스 이용약관 | `/settings/terms` |
| 문의하기 | `/settings/inquiry` |

---

# 6. Modal / Bottom Sheet 정책

## 6-1. Route로 만들지 않는 UI

아래 항목은 독립 route가 아니라 modal state 또는 Bottom Sheet state로 처리한다.

```text
D-DAY 저장 확인 Bottom Sheet
알림 권한 안내 Bottom Sheet
로그인 유도 Bottom Sheet
삭제 확인 Dialog
로그아웃 확인 Dialog
계정 삭제 확인 Dialog
Score 계산 실패 안내
D-DAY 저장 실패 안내
```

## 6-2. 이유

이 UI들은 독립 화면이 아니라 현재 작업 위에 뜨는 확인/전환 UI다.  
route로 만들 경우 back stack과 draft 복구가 복잡해질 수 있으므로 modal state로 관리한다.

## 6-3. Modal State 예시

```ts
type ModalState =
  | { type: "dday_save_confirmation"; draft: DdayDraft }
  | { type: "notification_permission"; eventId: string }
  | { type: "login_required"; reason: LoginReason; pendingAction?: PendingAction }
  | { type: "delete_confirm"; targetType: string; targetId: string }
  | { type: "logout_confirm" }
  | { type: "account_delete_confirm" }
  | null;
```

---

# 7. Auth Guard 정책

## 7-1. 로그인이 필요 없는 화면

```text
TODAY
DISCOVER
온보딩
위치 선택
선호 활동 설정
데이터 출처
개인정보 처리방침
서비스 이용약관
문의하기
```

## 7-2. 로그인이 필요한 기능

```text
D-DAY 저장
저장된 D-DAY 조회
완료된 D-DAY 조회
계정 관리
알림 설정 저장
D-DAY 알림 설정 저장
```

## 7-3. 비로그인 D-DAY 탭 접근

비로그인 사용자도 `/dday` 탭 진입은 허용한다.

다만 저장된 일정 리스트 대신 Login CTA Empty 상태를 보여준다.

```text
D-DAY를 저장하려면 로그인이 필요해요.
일정을 저장하고 날씨 변화를 받아보세요.

[Google로 계속하기]
[Apple로 계속하기]
[Kakao로 계속하기]
```

## 7-4. D-DAY 저장 시 Auth Guard

```text
D-DAY 저장 시도
→ auth session 확인
→ 로그인 상태면 create_dday_event
→ 비로그인이면 Login Required Bottom Sheet
```

---

# 8. Pending Draft 복구 정책

## 8-1. 필요성

비로그인 사용자가 D-DAY 저장 직전에 로그인하게 되면, 작성한 일정 정보가 사라지면 안 된다.

따라서 저장 전 임시 draft를 session state에 보관한다.

```text
pendingDdayDraft
```

## 8-2. 저장 대상

```ts
interface PendingDdayDraft {
  source: "manual" | "discover";
  title?: string;
  startDate: string;
  endDate: string;
  cityId: string;
  displayLocation: string;
  activityCategories: string[];
  themeOverlay?: "family_kids";
  plannedItems?: PendingPlannedItem[];
  scoreSnapshot?: unknown;
  notificationSettings?: Record<string, boolean>;
}
```

## 8-3. 로그인 후 복구 흐름

```text
D-DAY 저장 시도
→ 비로그인
→ pendingDdayDraft 저장
→ Login Required Bottom Sheet
→ Google / Apple / Kakao 로그인
→ 로그인 성공
→ pendingDdayDraft 복구
→ D-DAY 저장 확인 Bottom Sheet 재오픈
→ D-DAY 저장
```

## 8-4. Draft 만료

MVP에서는 앱 세션 동안만 유지한다.

```text
앱 종료 시 pending draft 삭제 가능
```

Phase 1.5에서 local persistence 검토 가능.

---

# 9. 주요 이동 규칙

## 9-1. TODAY → DISCOVER

TODAY 활동 카드에서 DISCOVER로 이동할 수 있다.

```text
TODAY 활동 카드 클릭
→ DISCOVER
→ date=today
→ scope=nearby
→ activity_category=선택 활동
```

예시 route:

```text
/today
→ /discover?flow=p3&date=today&scope=nearby&activity=urban
```

전달 state:

```json
{
  "entryPoint": "today_activity_card",
  "flow": "p3",
  "date": "today",
  "scope": "nearby",
  "activity_category": "urban"
}
```

---

## 9-2. TODAY → 선호 활동 설정

TODAY에서 선호 활동이 미설정이면 CTA를 노출한다.

```text
선호 활동을 선택해주세요.
[선호 활동 설정하기]
```

이동:

```text
/today
→ /activity-preferences?entryPoint=today
```

저장 후:

```text
/activity-preferences
→ /today
```

---

## 9-3. TODAY → 위치 선택

```text
/today
→ /location/select?entryPoint=today
→ 선택 완료
→ /today
```

TODAY 현재 위치는 GPS 기반이지만, 위치 권한이 없거나 직접 지역 기준으로 보고 싶은 경우 city 선택을 허용할 수 있다.

---

## 9-4. DISCOVER 시작

```text
/discover
→ intent 선택
→ flow state 설정
```

Intent 예시:

```text
아직 못 정했어요 → p0
장소는 정했어요 → p1
날짜는 정했어요 → p2
날짜+지역은 정했어요 → p3
```

---

## 9-5. DISCOVER 검색

```text
/discover
→ /discover/search?flow=p1
→ 지역 또는 POI 선택
→ /discover/results
```

선택 결과에 따라 분기한다.

### 지역 선택

```text
지역 선택
→ activity 선택
→ results
```

### POI 선택

```text
POI 선택
→ category 기반 activity 추론
→ results
```

---

## 9-6. DISCOVER → D-DAY 저장

```text
DISCOVER 결과
→ D-DAY로 저장
→ D-DAY 저장 확인 Bottom Sheet
→ auth check
→ create_dday_event
→ /dday/:id
```

전달 draft 예시:

```json
{
  "source": "discover",
  "startDate": "2026-06-21",
  "endDate": "2026-06-23",
  "cityId": "busan",
  "displayLocation": "부산",
  "activityCategories": ["beach", "cafe"],
  "themeOverlay": "family_kids",
  "plannedItems": [
    {
      "poiId": "poi_gwangalli_beach",
      "placeName": "광안리해수욕장",
      "activityCategory": "beach"
    }
  ],
  "scoreSnapshot": {}
}
```

---

## 9-7. D-DAY 직접 생성

```text
/dday
→ /dday/create
→ 직접 입력
→ D-DAY 저장 확인 Bottom Sheet
→ auth check
→ create_dday_event
→ /dday/:id
```

---

## 9-8. D-DAY 상세

```text
/dday/:id
```

D-DAY 상세는 저장된 일정의 현재 단계 정보를 보여준다.

```text
D-84 / D-28 / D-14 / D-7 / D-1 / D-0
```

D-14 이후에는 forecast 변화에 따라 score snapshot이 업데이트될 수 있다.

---

## 9-9. D-DAY 상세 → 알림 설정

일정별 알림 설정은 D-DAY 상세 안에서 간단히 관리하거나, 전체 알림 설정으로 보낼 수 있다.

```text
/dday/:id
→ 알림 관리
→ /settings/notifications
```

MVP에서는 전체 알림 설정 화면으로 연결한다.

---

## 9-10. 마이페이지 → 저장된 D-DAY

```text
/mypage
→ /mypage/saved-ddays
→ 카드 클릭
→ /dday/:id
```

---

## 9-11. 마이페이지 → 완료된 D-DAY

```text
/mypage
→ /mypage/completed-ddays
→ 카드 클릭
→ /dday/:id
```

완료된 D-DAY도 상세 조회는 가능하다.

---

# 10. Location Select 반환 규칙

## 10-1. 공통 route

```text
/location/select?entryPoint={entryPoint}
```

## 10-2. entryPoint별 반환

| entryPoint | 선택 후 동작 |
|---|---|
| onboarding | onboarding 완료 후 `/today` |
| today | `/today`로 복귀, 기준 위치 갱신 |
| discover | `/discover` 또는 직전 discover flow 복귀 |
| dday_create | `/dday/create`로 복귀, city field prefill |
| settings | `/settings/location`으로 복귀, default city 저장 |

## 10-3. 반환 데이터

```ts
interface SelectedLocation {
  cityId: string;
  displayName: string;
  region?: string;
  lat?: number;
  lon?: number;
}
```

---

# 11. Activity Preferences 반환 규칙

## 11-1. route

```text
/activity-preferences?entryPoint={entryPoint}
```

## 11-2. entryPoint별 반환

| entryPoint | 저장 후 |
|---|---|
| today | `/today` |
| mypage | `/mypage` |
| settings | `/settings` |
| onboarding_optional | `/today` |

## 11-3. 정책

```text
1~5개 선택 가능
TODAY는 선택한 활동만 표시
DISCOVER/D-DAY는 선호 활동 우선 노출
```

---

# 12. Login Flow

## 12-1. Login Entry Points

```text
Sidebar profile area
/settings/account
D-DAY save attempt
/dday empty login CTA
```

## 12-2. Login Providers

```text
Google
Apple
Kakao
```

## 12-3. 로그인 성공 후 이동

| 진입점 | 로그인 성공 후 |
|---|---|
| Sidebar | 직전 화면 |
| Account Settings | `/settings/account` |
| D-DAY 저장 | pending draft 복구 후 저장 확인 Bottom Sheet |
| D-DAY 탭 Empty | `/dday` 재조회 |
| My Page | `/mypage` 재조회 |

## 12-4. 로그인 실패

```text
로그인하지 못했어요.
잠시 후 다시 시도해주세요.

[다시 시도]
[닫기]
```

---

# 13. Back Navigation 정책

## 13-1. Main Tabs

Main tab 간 이동은 각 탭의 root state를 유지한다.

```text
/today
/discover
/dday
```

## 13-2. Modal Open 상태

Back action 우선순위:

```text
1. 열린 Bottom Sheet / Dialog 닫기
2. 현재 sub route에서 이전 route로 이동
3. tab root면 앱 종료 또는 OS 기본 동작
```

## 13-3. D-DAY Create

```text
/dday/create
→ back
→ 입력 중 draft가 있으면 이탈 확인 Dialog
→ 없으면 /dday
```

## 13-4. Discover Results

```text
/discover/results
→ back
→ 직전 discover flow state로 복귀
```

---

# 14. Deep Link / Share

MVP에서는 외부 공유 링크를 지원하지 않는다.

## 제외

```text
/dday/:id 공유 링크
DISCOVER 결과 공유
소셜 공유
초대 링크
```

Phase 1.5 이후 검토.

---

# 15. Route State 모델

## 15-1. Discover State

```ts
interface DiscoverRouteState {
  flow?: "p0" | "p1" | "p2" | "p3";
  dateRange?: {
    from: string;
    to: string;
  };
  cityId?: string;
  poiId?: string;
  activityCategories?: string[];
  scope?: "nearby" | "popular" | "nationwide" | "region_group";
  themeOverlay?: "family_kids";
  entryPoint?: string;
}
```

## 15-2. D-DAY Create State

```ts
interface DdayCreateRouteState {
  title?: string;
  startDate?: string;
  endDate?: string;
  cityId?: string;
  displayLocation?: string;
  activityCategories?: string[];
  themeOverlay?: "family_kids";
  source?: "manual" | "discover";
}
```

## 15-3. Pending Action

```ts
type PendingAction =
  | { type: "create_dday"; draft: PendingDdayDraft }
  | { type: "save_notification_settings"; payload: unknown }
  | { type: "open_account" };
```

---

# 16. 화면별 Auth 상태

| 화면 | 비로그인 접근 | 로그인 필요 조건 |
|---|---:|---|
| `/today` | 가능 | 없음 |
| `/discover` | 가능 | D-DAY 저장 시 |
| `/dday` | 가능 | 리스트 조회/저장 |
| `/dday/create` | 가능 | 최종 저장 시 |
| `/dday/:id` | 불가 또는 권한 필요 | 본인 event |
| `/mypage` | 가능 | 개인 데이터 표시 |
| `/mypage/saved-ddays` | 로그인 필요 | 본인 event |
| `/mypage/completed-ddays` | 로그인 필요 | 본인 event |
| `/settings/notifications` | 로그인 필요 | user settings |
| `/settings/account` | 로그인 상태별 분기 | 계정 관리 |
| `/settings/data-sources` | 가능 | 없음 |
| `/activity-preferences` | 가능 | 로그인 시 Supabase 저장, 비로그인 시 local/session 가능 |

---

# 17. MVP 포함 / 제외

## 17-1. 포함

```text
Bottom Tabs: TODAY / DISCOVER / D-DAY
전역 Sidebar Drawer
/discover + flow state
/discover/search
/discover/results
/dday
/dday/create
/dday/:id
/location/select
/activity-preferences
/mypage
/mypage/saved-ddays
/mypage/completed-ddays
/settings
/settings/notifications
/settings/location
/settings/account
/settings/data-sources
modal state 기반 Bottom Sheet
비로그인 D-DAY 탭 접근 + 로그인 CTA
D-DAY 저장 로그인 필수
pendingDdayDraft 복구
```

## 17-2. 제외

```text
D-DAY edit route
Deep link / share link
외부 초대 링크
지도 기반 route
DISCOVER P0/P1/P2/P3 독립 route
Bottom Sheet route화
완료된 D-DAY 다시 일정 만들기
고급 알림 설정 route
```

---

# 18. 최종 요약

```text
Navigation / Routing
→ Bottom Tabs는 TODAY / DISCOVER / D-DAY
→ DISCOVER는 단순 route + flow state
→ D-DAY는 /dday, /dday/create, /dday/:id
→ 사이드바는 전역 Drawer
→ Bottom Sheet는 modal state
→ 비로그인도 D-DAY 탭 접근 가능
→ D-DAY 저장은 로그인 필수
→ 로그인 후 pending draft 복구
```

MVP에서는 route 수를 과도하게 늘리지 않고, flow state와 modal state를 활용해 화면 이동을 단순하게 유지한다.
