# ggg MVP — Phase별 개발 진행 계획

## Version
**v1.0**

## Purpose
Codex Desktop에서 ggg MVP를 단계별로 개발하기 위한 실행 계획이다. 각 Phase는 한 번에 하나씩 진행하며, 이전 Phase의 빌드 안정성과 UI 일관성을 확인한 뒤 다음 Phase로 넘어간다.

---

# 전체 진행 순서

```text
Phase A. UI Foundation / Mock App
Phase B. Supabase Foundation
Phase C. Auth / User Preferences
Phase D. TODAY Real Data Structure
Phase E. Weather Score Engine Foundation
Phase F. D-DAY Create / Save / Detail
Phase G. DISCOVER Flow
Phase H. Settings / MyPage / Notification
Phase I. Real Edge Functions / Integration
Phase J. QA / Polish / MVP Freeze
```

---

# Phase A — UI Foundation / Mock App

## 목표
디자인 시스템, 공통 컴포넌트, 앱 셸, 라우팅, TODAY mock 화면을 먼저 만든다.

## 구현 범위

```text
디자인 토큰
GradeBadge / DotIndicator
공통 버튼 / 칩 / Bottom Sheet
하단 탭
Sidebar 구조
TODAY mock 화면
DISCOVER placeholder
D-DAY placeholder
```

## 하지 않는 것

```text
Supabase 연동
로그인
실제 날씨 API
D-DAY 저장
DISCOVER 추천 계산
```

## 산출물

```text
src/design/tokens.ts
src/design/grade.ts
src/design/motion.ts
src/components/common/*
src/components/layout/*
src/features/today/TodayScreen.tsx
src/features/discover/DiscoverScreen.tsx
src/features/dday/DdayScreen.tsx
```

## 완료 기준

```text
앱 실행 가능
TODAY mock 화면 표시
Bottom Tabs 동작
DISCOVER / D-DAY placeholder 표시
공통 컴포넌트 재사용
0~100 score 미노출
빌드/타입체크 통과
```

---

# Phase B — Supabase Foundation

## 목표
Supabase 연결 기반을 만든다. 아직 실제 기능 완성보다 DB 스키마와 클라이언트 연결 준비가 목적이다.

## 구현 범위

```text
Supabase client 설정
환경변수 placeholder
migration SQL 위치 정리
service layer 생성
activity_categories 조회 구조
user_preferences service 구조
user_dday_events service 구조
```

## 하지 않는 것

```text
실제 외부 날씨 API
Edge Function 실제 계산
복잡한 추천 로직
알림 발송
```

## 산출물

```text
.env.example
supabase/migrations/*
src/lib/supabase/client.ts
src/lib/supabase/types.ts
src/features/preferences/preferences.service.ts
src/features/dday/dday.service.ts
src/features/search/search.service.ts
src/features/activity/activity.service.ts
```

## 완료 기준

```text
Supabase client 설정 완료
migration 파일 프로젝트 내 배치
UI가 Supabase env 없이도 mock fallback으로 실행
서비스 함수가 typed interface로 분리
빌드/타입체크 통과
```

---

# Phase C — Auth / User Preferences

## 목표
로그인 구조와 선호 활동 설정을 실제 데이터 구조와 연결한다.

## 구현 범위

```text
Google / Apple / Kakao 로그인 UI
Supabase Auth service wrapper
user_profiles upsert
user_preferences 저장/조회
선호 활동 설정 화면
TODAY에서 선호 활동 미설정/설정 상태 반영
사이드바에서 선호 활동 변경 진입
```

## 하지 않는 것

```text
D-DAY 저장 완성
실제 날씨 API
DISCOVER 추천 계산
```

## 완료 기준

```text
로그인 UI 표시
선호 활동 1~5개 선택 가능
비로그인 상태에서는 local/session preference 저장
로그인 상태에서는 user_preferences 저장
TODAY가 선호 활동 상태를 반영
빌드/타입체크 통과
```

---

# Phase D — TODAY Real Data Structure

## 목표
TODAY를 실제 데이터 호출 구조에 맞춘다. 초기에는 Edge Function mock 또는 stub으로 연결하고, 이후 실제 외부 API는 Edge Function에서만 호출한다.

## 구현 범위

```text
TODAY payload type 정의
today.service.ts 생성
getTodayPayload mock service
GPS 권한 플로우
위치 권한 거부/오류 상태
Loading / Error / Permission State 적용
```

## 하지 않는 것

```text
Open-Meteo / KMA / AirKorea 직접 호출
실제 Edge Function 완성
Supabase weather cache 실제 연동
```

## 완료 기준

```text
TODAY 화면이 service layer에서 typed payload를 받음
위치 권한 허용/거부 흐름이 있음
외부 API를 client에서 호출하지 않음
UI가 Phase A 디자인을 유지
빌드/타입체크 통과
```

---

# Phase E — Weather Score Engine Foundation

## 목표
Weather Score Engine의 코드 골격을 만든다. 정밀한 기상 계산보다 타입, grade mapping, 함수 구조, 로그 구조를 먼저 만든다.

## 구현 범위

```text
src/lib/score/types.ts
src/lib/score/grade.ts
src/lib/score/activityProfiles.ts
src/lib/score/calculateWeatherScore.ts
src/lib/score/reasons.ts

grade threshold
activity category/profile mapping
multi-activity score
date range score
indoor alternative bonus
fatal rule interface
reason generation
```

## 완료 기준

```text
score 관련 함수가 UI와 분리됨
10개 활동 카테고리 매핑 완료
grade label 일관화
실내 활동 대안성 로직 포함
0~100 score는 UI에 직접 노출되지 않음
빌드/타입체크 통과
```

---

# Phase F — D-DAY Create / Save / Detail

## 목표
D-DAY 생성, 저장 확인 Bottom Sheet, 로그인 유도, pending draft, 상세 화면을 구현한다.

## 구현 범위

```text
/dday 리스트 화면
비로그인 D-DAY Empty/Login CTA
/dday/create
D-DAY 생성 폼
D-DAY Save Confirmation Bottom Sheet
Login Required Bottom Sheet
pendingDdayDraft
mock createDdayEvent service
/dday/:id 상세 화면
```

## 완료 기준

```text
사용자가 D-DAY 생성 폼을 입력 가능
활동 최대 3개 제한
저장 확인 Bottom Sheet 표시
비로그인 저장 시 로그인 유도
pendingDdayDraft 유지
mock event 저장/상세 표시
빌드/타입체크 통과
```

---

# Phase G — DISCOVER Flow

## 목표
DISCOVER P0/P1/P2/P3 탐색 flow, 검색, 결과 카드, D-DAY 저장 연결을 만든다.

## 구현 범위

```text
/discover intent selection
internal flow state: p0 / p1 / p2 / p3
/discover/search
지역/장소 섹션형 검색 결과
mock cities / poi_master
활동 선택 칩
/discover/results
D-DAY 저장 CTA 연결
```

## 완료 기준

```text
P0/P1/P2/P3가 route가 아닌 flow state로 동작
검색 결과가 지역/장소로 분리
활동 자유 검색 없음
결과 카드에 grade + dot + reason 표시
D-DAY 저장 Bottom Sheet 연결
빌드/타입체크 통과
```

---

# Phase H — Settings / MyPage / Notification

## 목표
마이페이지, 설정, 알림 설정, 계정 관리, 데이터 출처를 구현한다.

## 구현 범위

```text
SidebarDrawer 완성
/mypage
/mypage/saved-ddays
/mypage/completed-ddays
/settings
/settings/notifications
/settings/location
/settings/account
/settings/data-sources
알림 설정 UI
계정 관리 UI
```

## 완료 기준

```text
사이드바에서 보조 화면 이동 가능
알림 설정 기본값 적용
전체 알림 OFF 시 하위 알림 비활성화
계정 관리 UI 표시
데이터 출처 화면 존재
빌드/타입체크 통과
```

---

# Phase I — Real Edge Functions / Integration

## 목표
mock을 실제 Edge Function과 Supabase 데이터로 연결한다.

## 구현 범위

```text
supabase/functions/get_today_payload
supabase/functions/calculate_discover_recommendations
supabase/functions/create_dday_event
supabase/functions/update_dday_forecast_snapshot

typed request/response
create_dday_event server flow
get_today_payload stub
frontend service → Edge Function 연결
mock fallback 유지
```

## 완료 기준

```text
Edge Function 폴더 생성
frontend에서 Edge Function 호출 가능
create_dday_event가 auth check / validation / insert 구조를 가짐
weather_score_logs insert 구조 포함
service_role key가 client에 노출되지 않음
mock fallback 유지
빌드/타입체크 통과
```

---

# Phase J — QA / Polish / MVP Freeze

## 목표
기능을 더 추가하지 않고 안정화한다.

## 점검 항목

```text
build/typecheck/lint
route consistency
raw 0~100 score 미노출
client-side external weather API 호출 없음
Bottom Sheet가 modal state인지 확인
DISCOVER p0/p1/p2/p3가 flow state인지 확인
디자인 시스템 일관성
mobile safe area / touch target
docs 파일 무단 수정 여부
```

## 완료 기준

```text
빌드/타입체크 통과
중요 UI 흐름 동작
디자인 일관성 유지
raw score 미노출
client 외부 API 호출 없음
QA report 작성
MVP freeze 가능 상태
```

---

# Phase 운영 원칙

```text
한 번에 한 Phase만 진행한다.
각 Phase 시작 전 관련 문서를 먼저 읽게 한다.
각 Phase 종료 후 변경 파일과 빌드 결과를 보고받는다.
docs 폴더는 read-only로 유지한다.
이전 Phase의 디자인/구조를 임의로 뒤집지 않는다.
새 기능 추가보다 acceptance criteria 충족을 우선한다.
```

---

# 추천 진행 순서

```text
A → B → C → D → E → F → G → H → I → J
```

Weather Score Engine Foundation인 Phase E는 D-DAY 저장 구현 전에 반드시 들어가야 한다. D-DAY 저장 시 `score_snapshot`과 `weather_score_logs` 구조가 필요하기 때문이다.
