# NAVIGATION / ROUTING SPEC (MVP)

## Version
**v1.0** — 현재 프론트 구현 기준 정리본

## Document Type
Product / App Architecture Specification

## Status
MVP Draft

---

# 1. 문서 목적

이 문서는 ggg 앱 MVP의 **화면 구조, 라우팅, Header action, Bottom Sheet, 로그인 가드**를 정의한다.

현재 구현은 LocalContent 추천과 SavedContent 저장을 중심으로 한다. 기존 D-DAY 일정 생성 중심 플로우와 전역 Sidebar Drawer는 MVP 메인 구조에서 제외한다.

---

# 2. 핵심 결정사항

| 항목 | 결정 |
|---|---|
| Bottom Tabs | TODAY / DISCOVER / 저장 |
| 저장 route | `/dday` 유지, 사용자 화면명은 `저장` |
| Content Detail | `/content/:contentId` |
| Header 알림 icon | `/notifications` 직접 이동 |
| Header 마이페이지 icon | `/mypage` 직접 이동 |
| Sidebar Drawer | MVP 메인 구조에서 제거 |
| Bottom Sheet | route가 아니라 modal state |
| 콘텐츠 저장 | 로그인 필수 |
| 로그인 방식 | Google 우선 |
| Today cache | localStorage 1시간 |

---

# 3. App Structure

```text
App Root
├── Bottom Tab Navigator
│   ├── /today
│   ├── /discover
│   └── /dday  (사용자 화면명: 저장)
├── Header Actions
│   ├── 알림 → /notifications
│   └── 마이페이지 → /mypage
├── Content Detail
├── Utility Screens
└── Bottom Sheet Layer
```

---

# 4. Route 목록

## 4-1. Root

```text
/
→ /today
```

## 4-2. Main Tabs

| Route | 사용자 화면명 | 역할 |
|---|---|---|
| `/today` | TODAY | 현재 위치 기준 오늘의 신호와 추천 |
| `/discover` | DISCOVER | 날짜/상황/지역/유형 기반 LocalContent 탐색 |
| `/dday` | 저장 | SavedContent 목록 관리 |

## 4-3. Content Detail

```text
/content/:contentId
```

LocalContent 상세 화면이다.

주요 CTA:

```text
길찾기
공식 페이지
날짜 저장
```

## 4-4. Utility Screens

```text
/mypage
/location/select
/settings
/notifications
```

| Route | 역할 |
|---|---|
| `/mypage` | 계정 상태, 로그인/로그아웃, 저장/설정/위치 진입 |
| `/location/select` | 현재 적용 위치와 위치 권한 안내 |
| `/settings` | 저장 알림, 위치 기반 추천, 마케팅 알림 설정 |
| `/notifications` | 알림 empty state 및 저장 화면 진입 |

## 4-5. Legacy / Reserved

```text
/activity-preferences
```

기존 선호 활동 설정 route는 남아 있지만, 현재 Header/마이페이지 주요 진입에서는 사용하지 않는다.

---

# 5. Header Action 정책

공통 Header는 위치/시간 정보와 주요 action을 제공한다.

```text
location label
updatedAtLabel + refresh icon
situation dropdown optional
notification icon
my page icon
```

Action mapping:

| Action | Route / Behavior |
|---|---|
| updatedAtLabel refresh | Today payload cache 무시 후 재호출 |
| situation dropdown | Home/Discover 상황 조건 변경 |
| notification icon | `/notifications` |
| my page icon | `/mypage` |

Header 오른쪽에는 햄버거 메뉴를 쓰지 않는다.

---

# 6. Bottom Sheet 정책

아래 UI는 route가 아니라 현재 화면 위에 뜨는 modal state로 처리한다.

```text
상황 선택 dropdown/menu
날짜 선택 sheet
Discover filter sheet
시간별 날씨 sheet
SaveReminderSheet
Login Required Bottom Sheet
길찾기 지도 선택 sheet
```

SaveReminderSheet:

```text
언제 알림 받을까요?
→ reminder option 선택
→ 저장하기
```

비로그인 저장:

```text
로그인이 필요해요!
→ Google 로그인
```

---

# 7. 저장 Auth Guard

콘텐츠 저장은 로그인 사용자만 가능하다.

```text
북마크 / 날짜 저장 클릭
→ 로그인 상태 확인
→ 로그인됨: SaveReminderSheet
→ 비로그인: Login Required Bottom Sheet
```

현재 프론트 MVP 저장소:

```text
localStorage key: ggg.savedContents.v1
```

Supabase `user_saved_contents`는 운영 전환 시 적용한다.

---

# 8. Data / Location Context

TODAY에서 `get_today_payload` 응답을 받으면 location context를 저장한다.

```text
localStorage key: ggg.locationContext.v1
```

Discover, Saved, Content Detail, Utility Screens는 이 context를 Header 표시용으로 읽는다.

TODAY payload cache:

```text
localStorage key: ggg.todayPayload.v1
TTL: 1시간
```

---

# 9. MVP 제외

```text
전역 Sidebar Drawer
D-DAY 직접 일정 생성
D-DAY 상세 route
마이페이지 하위 상세 route
Apple/Kakao 로그인
실제 push notification
서버 저장 동기화
고정 지역 검색/선택 저장
```

---

# 10. 구현 파일

```text
src/app/App.tsx
src/components/layout/AppHeader.tsx
src/components/layout/BottomTabBar.tsx
src/features/today/TodayScreen.tsx
src/features/discover/DiscoverScreen.tsx
src/features/contentDetail/ContentDetailScreen.tsx
src/features/savedContents/SavedScreen.tsx
src/features/savedContents/SaveReminderSheet.tsx
src/features/settings/UtilityScreens.tsx
src/features/location/locationContext.ts
src/features/auth/authState.ts
```
