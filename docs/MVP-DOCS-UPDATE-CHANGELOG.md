# ggg MVP Docs Update Changelog

## 2026-05-28 Update — Frontend Implementation Alignment

현재 구현된 프론트엔드 기준으로 Home, Header, 날씨 체크, 저장 바텀시트, 마이페이지/설정/알림 화면 문서를 정리했다.

## 업데이트된 문서

1. `TODAY-PRODUCT-SPEC-v2.0.md`
2. `UI-DESIGN-SYSTEM-SPEC-v1.0.md`
3. `NAVIGATION-ROUTING-SPEC-v1.0.md`
4. `SIDEBAR-MYPAGE-SETTINGS-SPEC-v1.0.md`
5. `SAVED-CONTENTS-PRODUCT-SPEC-v1.0.md`
6. `MVP-DOCS-UPDATE-CHANGELOG.md`
7. `CODEX-PHASE-EXECUTION-PLAN-v2.0.md`

## 핵심 변경

- 전역 Sidebar Drawer를 MVP 메인 진입 구조에서 제거하고, Header 오른쪽 `마이페이지` 아이콘으로 `/mypage`에 직접 이동하도록 정리했다.
- Header는 위치/시간, 수동 새로고침, 상황 선택, 알림, 마이페이지 진입을 담는 공통 구조로 정의했다.
- TODAY Hero는 상황 조건에 따라 문구가 달라지며, 날씨 체크도 상황별 핵심 지표를 다르게 보여준다.
- 날씨 체크 지표에 `자외선`, `습도`를 추가하고 전용 그래픽 asset 키를 문서화했다.
- `먼지`는 값과 상태가 중복되지 않도록 `좋음 / 외출 가능`처럼 value와 status label을 분리한다.
- TODAY 진입 시 1시간 localStorage cache를 우선 사용하고, Header 새로고침은 cache를 무시하고 재호출한다.
- 홈 하단 CTA는 큰 검색 카드 대신 작은 회색 `더보기` 버튼으로 단순화했다.
- SaveReminderSheet는 콘텐츠 요약 카드, 신호 badge, 알림 옵션 카드 중심으로 재정리했다.
- `/mypage`, `/location/select`, `/settings`, `/notifications`의 MVP 화면 역할과 현재 구현 범위를 반영했다.

---

## 2026-05-27 Update — Region Tags for Discover

Discover 기본 추천과 지역 필터를 위해 LocalContent의 지역 구조를 `regionLabel` 표시값에서 `content_regions` 기반 권역 모델로 확장했다.

## 업데이트된 문서

1. `LOCAL-CONTENT-MODEL-SPEC-v1.0.md`
2. `DISCOVER-PRODUCT-SPEC-v2.0.md`
3. `SUPABASE-DATA-MODEL-SPEC-v2.0.md`
4. `API-DATA-ACCESS-SPEC-v2.0.md`
5. `CODEX-PHASE-EXECUTION-PLAN-v2.0.md`
6. `MVP-DOCS-UPDATE-CHANGELOG.md`

## 핵심 변경

- `regionLabel`은 카드/상세 표시용으로 유지하고, 추천/필터 기준은 `content_regions` / `local_content_regions`로 분리한다.
- 지역은 행정 지역과 로컬 권역을 함께 관리한다.
- Discover 필터 bottom sheet에 `지역`을 추가한다.
- 기본 추천은 현재 위치가 매핑된 권역을 우선하고, 결과가 부족하면 상위 지역 또는 인접 권역으로 확장한다.
- 사용자 화면의 기본 지역 필터는 `내 주변`으로 표현한다.

---

## 2026-05-27 Update — LocalContent Tag Taxonomy

Discover 필터와 LocalContent 데이터 모델을 4분류 태그 체계로 확장했다.

## 업데이트된 문서

1. `LOCAL-CONTENT-MODEL-SPEC-v1.0.md`
2. `DISCOVER-PRODUCT-SPEC-v2.0.md`
3. `SUPABASE-DATA-MODEL-SPEC-v2.0.md`
4. `API-DATA-ACCESS-SPEC-v2.0.md`
5. `CODEX-PHASE-EXECUTION-PLAN-v2.0.md`
6. `MVP-DOCS-UPDATE-CHANGELOG.md`

## 핵심 변경

- Discover의 단일 조건 칩 구조를 `콘텐츠 유형 / 공간 / 날씨 / 행동 조건` 태그 구조로 재정의했다.
- 공간 조건은 `실내 / 실외 / 실내+실외`만 사용하고, `이동형`은 제외했다.
- 탐방, 트래킹, 런닝처럼 움직이는 콘텐츠는 공간 조건이 아니라 콘텐츠 유형으로 표현한다.
- 날씨 태그는 `weatherGoodTags`와 `weatherAvoidTags`로 분리해 추천 가중치와 감점 조건을 구분한다.
- `verifiedBadges`는 화면 표시용 badge로 유지하되, 검색/추천 필터 원천은 `content_tags` / `local_content_tags`로 분리한다.
- Supabase 모델에 `content_tags`, `local_content_tags`, `local_contents.space_type` 추가를 권장했다.
- `search_local_contents`, `calculate_discover_recommendations`, `get_content_detail`, `calculate_content_weather_signal`에서 태그 기반 input/output과 랭킹 반영이 필요하다고 명시했다.

---

## 2026-05-27 Update — KakaoPay-like UI Shape

카카오페이 앱처럼 밝고 둥근 피드형 UI를 기준으로 디자인 시스템을 재정렬했다.

## 업데이트된 문서

1. `UI-DESIGN-SYSTEM-SPEC-v1.0.md`
2. `MVP-DOCS-UPDATE-CHANGELOG.md`

## 핵심 변경

- Primary blue, 기존 green/orange/red status color는 유지했다.
- 노란 CTA는 도입하지 않고, primary action은 blue를 계속 사용한다.
- 배경은 light gray, 주요 섹션은 큰 white card 중심으로 정리했다.
- Border를 줄이고 낮은 shadow와 큰 radius로 카드 층을 만든다.
- 제목과 CTA는 더 굵고 크게 보여주는 방향으로 정리했다.
- Signal color는 `좋음 = blue`, `보통 = black`, `좋지 않음 = orange`로 재정의했다.
- Green은 성공/저장 완료 같은 보조 positive feedback에 사용한다.

---

## 2026-05-26 Update — SocarFrame Foundation Alignment

SocarFrame Foundation 기준으로 ggg 디자인 시스템을 재정렬했다.

## 업데이트된 문서

1. `UI-DESIGN-SYSTEM-SPEC-v1.0.md`
2. `MVP-DOCS-UPDATE-CHANGELOG.md`

## 핵심 변경

- GGG Weather Signal 제품 콘셉트는 유지하되, 색상/타이포/간격/기본 UI 문법은 SocarFrame Foundation 기준으로 정리했다.
- Primary CTA와 선택 상태는 service blue 중심으로 변경했다.
- GOOD/GREAT, CAUTION, BAD는 SocarFrame status positive/caution/negative 색상으로 매핑했다.
- Typography는 Pretendard와 SocarFrame scale 기준으로 정리했다.
- Spacing은 4px grid 기준으로 명시했다.
- Signal dot, LocalContent card, date signal, SavedContent 패턴은 ggg 고유 구조로 유지했다.

---

## 2026-05-26 Update — GGG Weather Signal Design System

UI 방향을 `GGG Weather Signal`로 확정하고 디자인 시스템 문서를 업데이트했다.

## 업데이트된 문서

1. `UI-DESIGN-SYSTEM-SPEC-v1.0.md`
2. `MVP-DOCS-UPDATE-CHANGELOG.md`

## 핵심 변경

- UI 방향을 GGG Weather Signal로 확정했다.
- 공식앱/지도앱처럼 평범한 톤에서 브랜드 모티프 중심으로 전환했다.
- Signal dot, time signal line, paper card, primary CTA, status color를 핵심 패턴으로 정의했다.
- Hero는 결론 중심, 날씨 체크는 근거 중심으로 역할을 분리했다.
- 추천 단위를 Place가 아닌 LocalContent 중심으로 반영했다.
- `specific_content`와 `curated_content` 카드 패턴을 정의했다.
- Saved Places가 아니라 SavedContent/저장 화면 기준으로 디자인 패턴을 수정했다.
- 추후 구현 파일 후보를 Implementation Notes에 정리했다.

---

## 2026-05-26 Update
제품 방향을 Place 중심 탐색에서 날씨 기반 LocalContent 추천으로 확장

## 생성된 문서

1. `LOCAL-CONTENT-MODEL-SPEC-v1.0.md`
2. `SAVED-CONTENTS-PRODUCT-SPEC-v1.0.md`
3. `CODEX-PHASE-EXECUTION-PLAN-v2.0.md`
4. `TODAY-PRODUCT-SPEC-v2.0.md`
5. `DISCOVER-PRODUCT-SPEC-v2.0.md`
6. `API-DATA-ACCESS-SPEC-v2.0.md`
7. `SUPABASE-DATA-MODEL-SPEC-v2.0.md`
8. `UI-DESIGN-SYSTEM-SPEC-v1.0.md`

## 핵심 변경

- 추천 단위를 Place가 아니라 `LocalContent`로 정의했다.
- Place/POI는 삭제하지 않고 `LocalContent`에 연결되는 위치 정보로 유지한다.
- `specific_content`와 `curated_content`를 분리했다.
- 실제 운영 중인 콘텐츠는 공식명, 운영 주체, 기간, 장소, 공식 링크를 우선한다.
- ggg 추천 콘텐츠는 날씨, 날짜, 상황, 지역 자원을 조합한 행동형 추천으로 정의한다.
- 사용자 화면 표현은 `오늘의 추천`, `가볼 만한 것`, `지역이나 콘텐츠 검색`, `저장`처럼 자연스럽게 사용한다.
- 저장 대상은 장소 저장 모델이 아니라 `SavedContent`로 변경했다.
- 저장 화면명은 `저장`으로 하고 탭은 `전체`, `예정`, `가보고 싶어요`, `다녀왔어요`로 정의했다.
- Discover는 지역/장소 중심 화면이 아니라 지역 콘텐츠 탐색 화면으로 재정의했다.
- 콘텐츠 상세 화면 구조를 새로 정의했다.
- Supabase에는 `local_contents`, `user_saved_contents` 테이블을 권장 추가했다.
- 검색 목적을 `특정 콘텐츠 검색`과 `추천형 탐색`으로 나누었다.

## 후속 코드 작업 영향

- Discover 결과 카드 타입을 `LocalContentCard`로 전환해야 한다.
- 저장 서비스와 화면은 `user_saved_contents` 기준으로 새로 연결해야 한다.
- `poi_master`는 장소 마스터로 유지하되 콘텐츠 조회의 하위 정보로 사용한다.
- 검색 API는 `local_contents`를 우선 조회하고 필요할 때 `poi_master`를 함께 조회한다.

---

## 2026-05-22 Update
현재 코드 기준 TODAY 실시간 데이터 구조, 선호 활동 구현, Supabase Edge Function/cache 상태 반영

## 업데이트된 문서

1. `TODAY-PRODUCT-SPEC-v1.1.md`
2. `API-DATA-ACCESS-SPEC-v1.1.md`
3. `SUPABASE-DATA-MODEL-SPEC-v1.1.md`
4. `CODEX-PHASE-EXECUTION-PLAN-v1.0.md`
5. `ONBOARDING-ACTIVITY-PREFERENCE-SPEC-v1.0.md`

## 핵심 변경

- TODAY는 `src/features/today/todayPayload.ts`의 typed payload 기반으로 동작
- 프론트는 Supabase Edge Function `get_today_payload`만 호출하고 외부 날씨 API는 직접 호출하지 않음
- `get_today_payload`는 Open-Meteo forecast + air-quality, Nominatim reverse geocoding, `dong_weather_cache`를 사용
- TODAY payload는 client localStorage에 30분 TTL로 cache
- 핵심 날씨 지표는 `지금` + `오늘 최대` 구조로 변경
- 위치 오류와 실시간 날씨 연결 오류를 구분해 표시
- 선호 활동은 현재 localStorage 기반이며 기본값은 `urban`, `photo`, `cafe`
- 활동 선호 UI는 최대 3개 선택으로 구현
- 활동/Discover 이미지는 optimized WebP asset을 사용
- 현재 `dong_weather_cache` migration은 실제 프로젝트 경로 `supabase/migrations/20260519153000_create_today_cache_tables.sql`에 존재
- TODAY 한정 Phase D / Phase I 일부가 구현됨

---

## Update
온보딩 2단계 축소 + TODAY 선호 활동 기반 노출 반영

## 생성/업데이트된 문서

1. `ONBOARDING-ACTIVITY-PREFERENCE-SPEC-v1.0.md`
2. `TODAY-PRODUCT-SPEC-v1.1.md`
3. `DISCOVER-PRODUCT-SPEC-v1.2.md`
4. `D-DAY-Product-Spec-v2.1.md`
5. `ggg-PRD-v2.4-final.md`

## 핵심 변경

- 첫 실행 온보딩은 `가치 소개 → 위치 설정 → TODAY 진입`으로 축소
- 활동 선호 선택은 첫 실행에서 제외
- TODAY 활동 추천은 선호 활동 미설정 시 CTA만 노출
- 선호 활동 설정 후 TODAY에는 선택한 활동만 표시
- 사이드바/마이페이지에 `선호 활동 변경` 추가
- DISCOVER와 D-DAY에서는 선호 활동을 우선 노출하되 전체 활동은 유지
- 알림 권한은 첫 D-DAY 저장 직후 요청
