# ggg — Final Product Requirements Document (PRD)

## Version
**v2.5** — MVP 통합 기준본

## Document Type
Product Requirements Document

## Status
MVP Final Draft

## Last Updated
2026-05-19

---

# 0. 문서 역할

이 문서는 ggg MVP의 **최종 통합 PRD**다.

지금까지 분리되어 정의한 화면, 데이터, API, Score Engine, 라우팅, 마이그레이션 문서를 하나의 제품 기준으로 통합한다.

세부 구현은 각 하위 스펙 문서를 기준으로 하되, 제품 범위·우선순위·화면 구조·정책 충돌 시 본 문서를 우선한다.

---

# 1. 기준 문서

본 PRD v2.5는 아래 문서를 통합 기준으로 한다.

| 영역 | 기준 문서 |
|---|---|
| 기존 PRD | `ggg-PRD-v2.4-final.md` |
| TODAY | `TODAY-PRODUCT-SPEC-v1.1.md` |
| DISCOVER | `DISCOVER-PRODUCT-SPEC-v1.2.md` |
| D-DAY | `D-DAY-Product-Spec-v2.1.md` |
| D-DAY 직접 입력 | `D-DAY-CREATE-FORM-SPEC-v1.0.md` |
| D-DAY 저장 확인/알림 권한 | `D-DAY-SAVE-CONFIRMATION-NOTIFICATION-SPEC-v1.1.md` |
| 온보딩/선호 활동 | `ONBOARDING-ACTIVITY-PREFERENCE-SPEC-v1.0.md` |
| 위치/지역 선택 | `LOCATION-REGION-SELECTION-SPEC-v1.0.md` |
| 공통 검색/선택 | `COMMON-SEARCH-SELECTION-SPEC-v1.0.md` |
| 공통 Empty/Loading/Error | `COMMON-EMPTY-LOADING-ERROR-STATES-SPEC-v1.0.md` |
| 알림 설정 | `NOTIFICATION-SETTINGS-SPEC-v1.0.md` |
| 사이드바/마이페이지/설정 | `SIDEBAR-MYPAGE-SETTINGS-SPEC-v1.0.md` |
| Weather Score 정책 | `WEATHER-SCORE-POLICY-SPEC-v1.2.md` |
| Weather Score 구현 | `WEATHER-SCORE-ENGINE-IMPLEMENTATION-SPEC-v1.1.md` |
| API/Data Access | `API-DATA-ACCESS-SPEC-v1.1.md` |
| Supabase Data Model | `SUPABASE-DATA-MODEL-SPEC-v1.1.md` |
| Supabase Migration Plan | `SUPABASE-MIGRATION-PLAN-v1.0.md` |
| Navigation/Routing | `NAVIGATION-ROUTING-SPEC-v1.0.md` |
| 과거 데이터 전략 | `ggg과거데이터 사용 전략.md` |

---

# 2. v2.4 → v2.5 변경 요약

| 영역 | v2.4 | v2.5 |
|---|---|---|
| 데이터 저장소 | 일부 미정 | Supabase PostgreSQL 기준 확정 |
| TODAY 데이터 호출 | 위치 기반 원칙 | GPS lat/lon → Edge Function 확정 |
| TODAY 위치 | 동네 단위 표시 | GPS 기반 동 단위 표시 + 동 단위 캐시 보조 |
| 직접 지역 선택 | 일부 동 단위 혼재 | 시/군/구 단위, `cities` 기준 |
| D-DAY 저장 | 저장 정책 정의 | 로그인 사용자만 저장 가능 |
| 로그인 | 추가 정의 필요 | Google / Apple / Kakao |
| Score 계산 | 정책 중심 | Policy + Implementation 문서 분리 |
| Score log | 없음 | `weather_score_logs` 도입 |
| D-DAY Score | snapshot | `score_snapshot` + score log |
| API 호출 | 화면별 미정 | Edge Function / Supabase Direct Query 기준 확정 |
| 라우팅 | 미정 | Bottom Tabs + flow state + modal state 확정 |
| Supabase Migration | 없음 | SQL 실행 계획 확정 |
| 실내 활동 판단 | 일반 날씨 점수 | 비/악천후 시 실내 대안성 보너스 |
| 알림 권한 | 첫 D-DAY 저장 후 요청 | 유지, 세부 설정 확정 |
| Bottom Sheet | 일부 정의 | route가 아닌 modal state로 확정 |

---

# 3. 서비스 정의

ggg는 날씨 정보를 단순히 보여주는 앱이 아니라, 사용자가 **오늘 무엇을 할지, 언제 어디로 갈지, 저장한 일정에서 무엇을 준비해야 할지**를 판단하게 돕는 날씨·기후 기반 외출/여행 의사결정 앱이다.

## 3-1. 한 줄 정의

> 날씨가 아니라, 오늘 할 일과 여행하기 좋은 시기를 판단합니다.

## 3-2. 핵심 가치

```text
오늘 나가도 괜찮은가?
언제 가면 좋은가?
어디가 좋은가?
무엇을 하면 좋은가?
저장한 일정은 어떻게 준비해야 하는가?
```

## 3-3. MVP 핵심 화면

```text
TODAY
DISCOVER
D-DAY
```

---

# 4. MVP 목표

## 4-1. 제품 목표

MVP는 사용자가 날씨를 보고 직접 해석하는 부담을 줄이고, 활동·지역·날짜 맥락에 따라 실행 가능한 판단을 제공하는 것을 목표로 한다.

## 4-2. MVP 성공 기준

```text
사용자가 현재 위치 기준 오늘 외출 판단을 빠르게 이해한다.
사용자가 날짜/지역/활동 중 일부만 입력해도 추천 결과를 얻는다.
사용자가 마음에 드는 결과를 D-DAY로 저장한다.
저장된 D-DAY는 시간축에 따라 날씨 판단과 준비 알림을 제공한다.
```

## 4-3. MVP에서 검증할 가설

| 가설 | 검증 방식 |
|---|---|
| 날씨를 활동별 점수로 바꾸면 사용자가 빠르게 판단한다 | TODAY 활동 카드 사용률 |
| 날짜/지역/활동 탐색 플로우가 D-DAY 저장으로 이어진다 | DISCOVER → D-DAY 저장 전환율 |
| 선호 활동을 설정하면 TODAY 재방문 가치가 높아진다 | 선호 활동 설정률, TODAY 재방문 |
| D-DAY 시간축 알림이 저장 일정 관리의 가치를 만든다 | D-DAY 저장 수, 알림 설정 유지율 |

---

# 5. 사용자와 주요 시나리오

## 5-1. 주요 사용자

| 사용자 | 니즈 |
|---|---|
| 오늘 외출 판단자 | 지금 위치 기준으로 오늘 나가도 괜찮은지 알고 싶다 |
| 여행 계획자 | 특정 지역에서 언제 가면 좋은지 알고 싶다 |
| 일정 확정자 | 이미 정한 일정의 날씨 변화를 계속 추적하고 싶다 |
| 가족 동반 사용자 | 아이와 함께 가도 괜찮은 날씨인지 더 엄격히 판단하고 싶다 |

## 5-2. 핵심 시나리오

### Scenario A — TODAY

```text
앱 실행
→ 현재 위치 확인
→ 오늘 전체 외출 판단 확인
→ 선호 활동별 추천도 확인
→ 필요 시 DISCOVER로 이동
```

### Scenario B — DISCOVER P1

```text
제주에서 해변 언제 가면 좋을까?
→ 지역: 제주
→ 활동: 해변
→ 12개월/주차별 추천
→ 좋은 시기 선택
→ D-DAY 저장
```

### Scenario C — DISCOVER P2

```text
5월 연휴에 캠핑 가고 싶은데 어디?
→ 날짜: 5월 연휴
→ 활동: 캠핑
→ 지역 추천 Top N
→ D-DAY 저장
```

### Scenario D — DISCOVER P3

```text
6월 21일 부산 가는데 뭐 하지?
→ 날짜: 6월 21일
→ 지역: 부산
→ 활동/장소 추천
→ D-DAY 저장
```

### Scenario E — D-DAY

```text
부산 여행 저장
→ D-28 준비 시작
→ D-14 실제 예보 도착
→ D-7 짐 싸기
→ D-1 최종 점검
→ D-0 당일 시간대별 안내
```

---

# 6. 정보 구조

## 6-1. Bottom Tabs

```text
TODAY
DISCOVER
D-DAY
```

| 탭 | 역할 |
|---|---|
| TODAY | 오늘 현재 위치 기준 판단 |
| DISCOVER | 날짜/지역/활동 탐색 |
| D-DAY | 저장 일정 관리 |

## 6-2. 전역 사이드바

```text
프로필 영역

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

## 6-3. 보조 화면

```text
온보딩
선호 활동 설정
위치/지역 선택
D-DAY 새로 만들기
D-DAY 저장 확인 Bottom Sheet
알림 권한 안내 Bottom Sheet
로그인 유도 Bottom Sheet
마이페이지
설정
```

---

# 7. 온보딩

## 7-1. 원칙

MVP 온보딩은 짧게 유지한다. 사용자가 앱의 효용을 보기 전에 긴 설정을 요구하지 않는다.

## 7-2. 첫 실행 플로우

```text
앱 첫 실행
→ Step 1. 가치 소개
→ Step 2. 위치 설정
→ TODAY 진입
```

## 7-3. 첫 실행에서 제외

```text
활동 선호 선택
알림 권한 요청
로그인 강제
구독 유도
AI 챗봇형 안내
```

## 7-4. 위치 설정

온보딩 Step 2에서 현재 위치 사용 또는 지역 직접 선택을 제공한다.

```text
[현재 위치 사용]
[지역 직접 선택]
```

현재 위치 사용 시 TODAY는 GPS lat/lon 기반으로 데이터를 불러온다.

---

# 8. 선호 활동 정책

## 8-1. 활동 카테고리

MVP 활동 카테고리는 10개다.

| 코드 | 노출명 | 내부 Profile |
|---|---|---|
| beach | 해변 | outdoor_exposed |
| hiking | 등산/트레킹 | outdoor_active |
| camping | 캠핑 | outdoor_stay |
| scenic | 일출/일몰 | outdoor_exposed |
| photo | 사진/뷰 | outdoor_exposed |
| urban | 피크닉/도시산책 | outdoor_relax |
| cafe | 카페/맛집 | indoor_social |
| festival | 축제/이벤트 | outdoor_relax |
| spa | 온천/리조트 | indoor_stay |
| indoor | 전시/문화 | indoor_visit |

## 8-2. 선호 활동 설정

```text
선택 가능 개수: 1~5개
온보딩에서는 강제하지 않음
TODAY에서 미설정 상태일 때 설정 CTA 노출
사이드바/마이페이지에서 변경 가능
```

## 8-3. 화면별 적용

| 화면 | 적용 방식 |
|---|---|
| TODAY | 선택한 선호 활동만 노출 |
| DISCOVER | 선호 활동 우선 노출 + 전체 활동 유지 |
| D-DAY | 선호 활동 우선 노출 + 전체 활동 유지 |

---

# 9. TODAY

## 9-1. 화면 역할

TODAY는 오늘 현재 위치에서 밖에 나가도 괜찮은지, 무엇을 조심해야 하는지, 사용자가 선호하는 활동 기준으로 어떤 활동이 어울리는지 빠르게 판단하게 하는 화면이다.

## 9-2. 위치 기준

```text
현재 위치: GPS lat/lon 기반
표시명: reverse geocoding 기반 동/읍/면/리 단위
데이터 호출: Edge Function
캐시: dong_weather_cache 또는 geohash cache
```

TODAY 현재 위치는 `cities` 기반 직접 선택과 분리한다. 사용자의 현재 GPS 좌표를 기준으로 API payload를 생성한다.

## 9-3. 화면 구조

```text
TODAY
├── 위치/시간 헤더
├── 오늘 판단 Hero
├── 핵심 지표
│   ├── 강수확률
│   ├── 강수량
│   ├── 바람
│   └── 미세먼지
├── 오늘의 흐름
│   ├── 일출
│   ├── 오전
│   ├── 오후
│   ├── 저녁
│   └── 일몰
├── 오늘 어울리는 활동
│   ├── 미설정: 선호 활동 설정 CTA
│   └── 설정 완료: 선호 활동만 노출
├── 오늘/내일 D-DAY
└── DISCOVER CTA
```

## 9-4. 선호 활동 미설정

```text
선호 활동을 선택해주세요.
자주 하는 활동을 설정하면
오늘 어떤 활동이 좋은지 알려드릴게요.

[선호 활동 설정하기]
```

## 9-5. 선호 활동 설정 완료

사용자가 선택한 활동만 표시한다. 전체 활동 탐색은 DISCOVER에서 담당한다.

## 9-6. 데이터 호출

```text
TODAY 진입
→ GPS 권한 확인
→ GPS lat/lon 획득
→ reverse geocoding으로 동 단위 표시명 생성
→ get_today_payload 호출
→ cache 확인
→ 필요 시 외부 API 호출
→ Weather Score Engine 계산
→ optional weather_score_logs 저장
→ TODAY payload 반환
```

---

# 10. DISCOVER

## 10-1. 화면 역할

DISCOVER는 사용자가 날짜, 장소, 활동 중 하나 이상을 단서로 가지고 있을 때, 날씨 기반 score를 통해 좋은 날짜·활동·장소를 발견하고 D-DAY에 저장하도록 돕는 화면이다.

## 10-2. 핵심 원칙

```text
탐색 화면이다.
선호 활동으로 제한하지 않는다.
선호 활동은 우선 노출한다.
최종 CTA는 D-DAY로 저장이다.
```

## 10-3. 플로우

| Flow | 입력 | 출력 |
|---|---|---|
| P0 | 아직 못 정함 | 날짜/지역/활동 추천 |
| P1 | 지역 + 활동 | 좋은 시기 추천 |
| P2 | 날짜 + 활동 | 지역 추천 |
| P3 | 날짜 + 지역 | 활동/장소 추천 |

## 10-4. P1

```text
지역 + 활동 → 시기 추천

예:
제주에서 해변 언제 가면 좋아?

출력:
12개월/주차별 등급
Top 3~5 추천 카드
캘린더 히트맵
```

## 10-5. P2

```text
날짜 + 활동 → 지역 추천

예:
5월 연휴에 캠핑 가고 싶은데 어디?

출력:
활동 적합 지역 Top N
점수 비교
```

## 10-6. P3

```text
날짜 + 지역 → 활동/장소 추천

예:
6월 21일 부산 가는데 뭐 해야 해?

출력:
활동별 추천
POI 추천
D-DAY 저장 CTA
```

## 10-7. 검색

DISCOVER P1 검색 결과는 지역 + POI를 포함한다. 활동은 검색 결과에 섞지 않고 별도 활동 선택 UI에서 처리한다.

```text
지역
- 제주
- 부산

장소
- 서울숲
- 광안리해수욕장
```

## 10-8. D-DAY 저장 연결

```text
DISCOVER 결과
→ D-DAY로 저장
→ 저장 확인 Bottom Sheet
→ 로그인 확인
→ create_dday_event
→ D-DAY 상세
```

---

# 11. D-DAY

## 11-1. 화면 역할

D-DAY는 사용자가 이미 정한 일정을 저장하고, 시간이 가까워질수록 날씨 정보와 행동 가이드를 단계적으로 제공하는 화면이다.

추천 받기는 DISCOVER가 담당하고, D-DAY는 직접 입력 + 저장 일정 관리가 핵심이다.

## 11-2. D-DAY 단계

```text
D-84: 시기 판단
D-28: 준비 시작
D-14: 실제 예보 도착
D-7: 짐 싸기
D-1: 최종 점검
D-0: 당일 안내
```

## 11-3. D-DAY 새로 만들기

입력 항목:

| 항목 | 필수 | 설명 |
|---|---:|---|
| 일정명 | 필수 | 자동 제안 가능 |
| 날짜/기간 | 필수 | 단일 날짜 또는 범위 |
| 도시/지역 | 필수 | `cities` 기준 |
| 활동 카테고리 | 필수 | 1~3개 |
| theme overlay | 선택 | family_kids |
| 알림 | 기본 ON | 저장 후 권한 요청 |

## 11-4. 날짜 범위

```text
최대 14일
```

## 11-5. 활동 선택

D-DAY에서는 선호 활동을 우선 노출하되, 전체 활동도 선택 가능하다.

```text
자주 쓰는 활동
[피크닉/도시산책] [카페/맛집]

전체 활동
[해변] [등산/트레킹] [캠핑] ...
```

## 11-6. 저장 확인 Bottom Sheet

```text
D-DAY로 저장할까요?

일정명
날짜/기간
지역
활동

전체 일정 판단
핵심 이유
활동별 판단
옵션
알림

[D-DAY로 저장]
```

## 11-7. Bottom Sheet 수정 정책

| 항목 | 수정 가능 |
|---|---:|
| 일정명 | 가능 |
| 아이와 함께 옵션 | 가능 |
| 알림 체크 | 가능 |
| 날짜 | 불가 |
| 지역 | 불가 |
| 활동 | 불가 |

날짜·지역·활동은 이전 화면으로 돌아가서 수정한다.

## 11-8. 저장 정책

```text
D-DAY 저장은 로그인 사용자만 가능
비로그인 사용자는 저장 시 로그인 유도
로그인 후 pendingDdayDraft 복구
```

## 11-9. Score 저장

D-DAY 저장 시 아래를 모두 수행한다.

```text
user_dday_events.score_snapshot 저장
weather_score_logs 저장
```

로그 저장 실패는 사용자 저장 흐름을 막지 않는다.

---

# 12. 알림

## 12-1. 권한 요청 시점

알림 권한은 온보딩에서 요청하지 않는다. 첫 D-DAY 저장 직후 요청한다.

## 12-2. 알림 설정 기본값

| 항목 | 기본값 |
|---|---|
| 전체 알림 | OFF |
| 기본 D-DAY 알림 | ON, 단 전체 알림 OFF이면 비활성/OFF |
| 변동 알림 | OFF |
| 안전 알림 | OFF |
| 마케팅 알림 | OFF |
| 조용한 시간대 | MVP 미포함 |

## 12-3. 발송 조건

```text
기기 권한 = granted
AND global_notifications_enabled = true
AND user default stage notification = true
AND event notification = true
AND scheduled time not passed
```

---

# 13. 로그인 / 계정

## 13-1. 로그인 방식

```text
Google
Apple
Kakao
```

## 13-2. 비로그인 사용 가능

| 기능 | 비로그인 |
|---|---:|
| TODAY 보기 | 가능 |
| DISCOVER 탐색 | 가능 |
| 온보딩 | 가능 |
| 선호 활동 설정 | 가능 |
| 데이터 출처/약관 보기 | 가능 |
| D-DAY 탭 진입 | 가능 |
| D-DAY 저장 | 불가 |
| 저장된 D-DAY 조회 | 불가 |
| 완료된 D-DAY 조회 | 불가 |
| 계정 삭제 | 불가 |

## 13-3. D-DAY 탭 비로그인 상태

```text
D-DAY를 저장하려면 로그인이 필요해요.
일정을 저장하고 날씨 변화를 받아보세요.

[Google로 계속하기]
[Apple로 계속하기]
[Kakao로 계속하기]
```

## 13-4. 계정 관리

MVP 포함:

```text
로그인
로그아웃
계정 삭제
```

---

# 14. 사이드바 / 마이페이지 / 설정

## 14-1. 사이드바

사이드바는 전역 Drawer다.

```text
TODAY / DISCOVER / D-DAY
→ 메뉴 버튼
→ 사이드바 오픈
```

## 14-2. 마이페이지

포함:

```text
저장된 D-DAY
완료된 D-DAY
선호 활동 변경
```

완료된 D-DAY는 MVP에 포함하되, 단순 리스트만 제공한다. 다시 일정 만들기는 Phase 1.5로 제외한다.

## 14-3. 설정

포함:

```text
알림 설정
위치 설정
계정 관리
데이터 출처
개인정보 처리방침
서비스 이용약관
문의하기
앱 버전
```

---

# 15. 위치 / 지역 정책

## 15-1. TODAY 현재 위치

```text
GPS lat/lon 기반
reverse geocoding으로 동/읍/면/리 단위 표시
Edge Function에서 데이터 조립
```

TODAY 현재 위치는 사용자의 실시간 위치 기반이며, `cities` 테이블 직접 선택과 분리한다.

## 15-2. 직접 지역 선택

직접 선택은 MVP에서 **시/군/구 단위**로 끊는다.

```text
직접 지역 선택
→ cities 사용
```

사용 화면:

```text
D-DAY 지역 선택
DISCOVER 지역 선택
설정 기본 위치
```

## 15-3. 동 단위 데이터

MVP에서는 동 단위 과거 기후 원천 데이터를 저장하지 않는다.

대신 TODAY 보조용으로 아래를 사용한다.

```text
dong_areas
dong_weather_cache
```

## 15-4. 충돌 해결

일부 하위 문서에서 동/읍/면/리 직접 선택을 넓게 허용하는 표현이 있어도, MVP v2.5에서는 아래 정책을 우선한다.

```text
TODAY 현재 위치 표시: 동 단위
직접 지역 선택: 시/군/구 단위
DISCOVER/D-DAY 저장 지역: cities 기준
```

---

# 16. 공통 검색 / 선택

## 16-1. 검색 유형

| 검색 유형 | 사용 화면 | 검색 대상 |
|---|---|---|
| 지역 검색 | D-DAY / DISCOVER / 설정 | `cities` |
| 장소/지역 검색 | DISCOVER P1 | `cities` + `poi_master` |
| 활동 선택 | DISCOVER / D-DAY | 10개 활동 칩 |
| 최근 선택 | 공통 | 실제 선택 결과 |

## 16-2. 검색 정책

```text
활동 자유 검색은 MVP 제외
최근 검색어가 아니라 최근 선택 저장
DISCOVER POI 검색은 MVP 포함
D-DAY 직접 입력 POI 검색은 MVP 제외
```

## 16-3. 최근 선택

```text
recent_selections
검색어가 아니라 실제 선택한 city/poi만 저장
```

---

# 17. 공통 상태 처리

## 17-1. 상태 유형

```text
Empty
Loading
Error
Permission
Unavailable
```

## 17-2. 원칙

```text
기술 오류 노출 금지
Skeleton 우선
항상 다음 행동 CTA 제공
권한 없음에는 대체 경로 제공
```

## 17-3. Score 계산 실패

D-DAY 저장은 허용한다.

```text
날씨 적합도를 계산하지 못했어요.
일정은 저장할 수 있지만 점수는 나중에 업데이트돼요.

[그래도 저장]
[다시 시도]
```

## 17-4. 추천 결과 부족

```text
조건에 맞는 추천이 부족해요.
조건을 조금 넓혀볼까요?

[범위 넓히기]
[다른 날짜 보기]
[활동 전체로 보기]
```

---

# 18. Weather Score 정책

## 18-1. 내부 점수

```text
0~100점
DB 저장용
사용자에게 직접 노출하지 않음
```

## 18-2. UI Grade

| Score | DISCOVER | TODAY / D-DAY |
|---:|---|---|
| 85~100 | gorgeous | 강력추천 |
| 70~84 | great | 추천 |
| 50~69 | good | 보통 |
| 0~49 | uhm.. | 비추천 |

`uhm..`은 bad를 직접 노출하지 않는 우회 표현이다.

## 18-3. 계산 구조

```text
Place
→ Activity Category
→ Activity Profile
→ Base Weather Weighting
→ Theme Overlay
→ Penalty Calculation
→ Fatal Rule / Range Rule
→ 0~100 Score
→ UI Grade
```

## 18-4. 데이터 기간 전략

Stage 1/2와 DISCOVER 장기 판단은 기상청 평년과 최근 트렌드를 조합한다.

```text
평균 변수: 최근 15년
극단 기상: 최근 10년
강수량 안정값: 30년 평년
변동성: 30년 풀
```

사용자 노출 카피:

```text
기상청 30년 평년에 최근 10년 추세를 더한 분석
```

## 18-5. D-DAY 단계별 데이터

| 단계 | 데이터 |
|---|---|
| D-84 | 기상청 평년 + 최근 10년 ASOS 트렌드 |
| D-28 | 위 + 30년 풀 변동성 |
| D-14 | Open-Meteo 14일 예보 |
| D-7 | Open-Meteo + 정밀 단기 |
| D-1 | KMA 단기 + 실시간 관측 |
| D-0 | KMA 단기 + 실시간 관측 |

## 18-6. 실내 활동 대안성

비, 강풍, 미세먼지 등으로 야외 활동이 불리할 때 `cafe`, `indoor`, `spa`는 상대적으로 더 추천될 수 있다.

단, 호우/태풍급 위험 날씨에서는 실내 활동도 이동 위험 때문에 safety cap을 적용한다.

## 18-7. family_kids overlay

MVP에서는 `family_kids`만 지원한다.

```text
미세먼지 threshold 강화
UV penalty 강화
체감온도 extreme penalty 강화
강수/바람 caution reason 우선 노출
```

---

# 19. Data / Supabase

## 19-1. 저장소

```text
Supabase PostgreSQL
Supabase Auth
Supabase Edge Functions
```

## 19-2. 기존 유지 테이블

```text
cities
hourly_weather
daily_weather
climate_normals
monthly_climate
forecast_weather
city_weather_cache
climate_frequency
best_travel_week
rain_risk_calendar
weather_stability_index
activity_weather_score
collection_log
home_cards
weather_character_map
nearby_places
```

## 19-3. 신규 테이블

```text
activity_categories
poi_master
dong_areas
dong_weather_cache
user_profiles
user_preferences
user_locations
recent_selections
user_dday_events
user_dday_planned_items
user_notification_settings
weather_score_logs
```

## 19-4. 주요 데이터 원칙

```text
TODAY 현재 위치 원천 데이터는 저장하지 않음
TODAY 위치 로그는 exact lat/lon 지양, geohash 사용
D-DAY 저장은 user_dday_events
D-DAY 표시 점수는 score_snapshot
계산 로그는 weather_score_logs
POI는 poi_master
직접 선택 지역은 cities
```

---

# 20. API / Data Access

## 20-1. 기본 원칙

클라이언트는 외부 날씨 API를 직접 호출하지 않는다.

```text
Client
→ Supabase DB
→ Supabase Edge Function
```

## 20-2. Edge Functions

```text
get_today_payload
refresh_dong_weather_cache
calculate_discover_recommendations
calculate_dday_score
create_dday_event
update_dday_forecast_snapshot
log_weather_score
```

## 20-3. TODAY

```text
GPS lat/lon
→ get_today_payload
→ cache/API 조회
→ Weather Score 계산
→ payload 반환
```

## 20-4. DISCOVER

```text
cities
activity_weather_score
forecast_weather
climate_normals
poi_master
→ 추천 계산
```

## 20-5. D-DAY

```text
create_dday_event
→ auth check
→ validation
→ score 계산
→ user_dday_events insert
→ weather_score_logs insert
→ planned_items insert
→ notification settings 적용
```

---

# 21. Navigation / Routing

## 21-1. Main Routes

```text
/today
/discover
/dday
```

## 21-2. DISCOVER

P0/P1/P2/P3별 독립 route를 만들지 않는다.

```text
/discover
/discover/search
/discover/results
```

내부 `flow` state로 관리한다.

```ts
type DiscoverFlow = "p0" | "p1" | "p2" | "p3";
```

## 21-3. D-DAY

```text
/dday
/dday/create
/dday/:id
```

## 21-4. 보조 Routes

```text
/onboarding
/onboarding/location
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
/settings/privacy
/settings/terms
/settings/inquiry
```

## 21-5. Modal State

아래 UI는 route가 아니라 modal state로 처리한다.

```text
D-DAY 저장 확인 Bottom Sheet
알림 권한 안내 Bottom Sheet
로그인 유도 Bottom Sheet
삭제 확인 Dialog
로그아웃 확인 Dialog
계정 삭제 확인 Dialog
```

## 21-6. Pending Draft

비로그인 사용자가 D-DAY 저장 직전 로그인하는 경우 draft를 복구한다.

```text
D-DAY 저장 시도
→ 비로그인
→ pendingDdayDraft 저장
→ 로그인
→ draft 복구
→ 저장 확인 Bottom Sheet 재오픈
```

---

# 22. Supabase Migration

## 22-1. Migration 원칙

```text
기존 테이블 변경 최소화
신규 테이블 추가 중심
RLS 기본 정책 포함
activity_categories seed 포함
```

## 22-2. SQL 파일 구조

```text
001_create_master_tables.sql
002_create_user_tables.sql
003_create_dday_tables.sql
004_create_score_cache_tables.sql
005_create_indexes.sql
006_enable_rls_policies.sql
007_seed_activity_categories.sql
```

## 22-3. Phase 1.5로 제외

```text
nearby_places → poi_master 마이그레이션
activity_weather_score 10개 활동 기준 재빌드
score_history 분리
D-DAY audit log
POI full-text search
```

---

# 23. MVP 포함 범위

## 23-1. Core Product

```text
TODAY
DISCOVER
D-DAY
온보딩 2단계
선호 활동 설정
위치/지역 선택
D-DAY 저장 확인 Bottom Sheet
알림 권한 안내
사이드바
마이페이지
설정
```

## 23-2. Data / Backend

```text
Supabase Auth
Google / Apple / Kakao Login
Supabase PostgreSQL
Edge Functions
Weather Score Engine
weather_score_logs
activity_categories seed
RLS 기본 정책
```

## 23-3. Search / Recommendation

```text
cities 검색
poi_master 검색
DISCOVER P0/P1/P2/P3
활동 칩 선택
최근 선택 저장
D-DAY 저장 연결
```

## 23-4. Notification

```text
첫 D-DAY 저장 후 권한 요청
알림 설정 화면
D-DAY 단계별 기본 알림
전체 알림 OFF 기본값
마케팅 알림 OFF
```

---

# 24. MVP 제외 범위

```text
비로그인 D-DAY 저장
D-DAY edit route
D-DAY 다시 일정 만들기
동 단위 과거 기후 원천 DB
D-DAY 직접 입력 내 POI 검색
활동 자유 검색
지도 기반 검색
Deep link / share link
구독/결제
AI 기반 reason 생성
개인별 weather tolerance 학습
score history 사용자 화면
정확한 GPS lat/lon 장기 저장
인앱 고객센터 채팅
고급 알림 스케줄러
조용한 시간대
pet_friendly overlay
```

---

# 25. Phase 1.5 / Phase 2 후보

## Phase 1.5

```text
D-DAY 다시 일정 만들기
D-DAY edit route
nearby_places → poi_master 마이그레이션
POI full-text search
score_history 분리
D-DAY audit log
dong_weather_cache 최적화
완료된 D-DAY 재활용
```

## Phase 2

```text
복수 카테고리/태그
pet_friendly overlay
지도 기반 탐색
개인별 활동 민감도 학습
소셜 공유
동 단위 과거 기후 통계
해양/산악 전문 날씨 보정
구독/결제
```

---

# 26. 개발 착수 우선순위

## Phase A — App Shell

```text
프로젝트 초기 세팅
Bottom Tabs
Navigation / Routing
Sidebar Drawer
Modal State Layer
```

## Phase B — Supabase Foundation

```text
Migration 적용
activity_categories seed
Auth 설정
RLS 검증
기본 Supabase client 연결
```

## Phase C — User / Preferences

```text
Google / Apple / Kakao 로그인
user_profiles
user_preferences
선호 활동 설정
알림 설정 기본값
```

## Phase D — TODAY

```text
GPS 권한
현재 위치 표시
get_today_payload mock
TODAY UI
선호 활동 기반 활동 카드
```

## Phase E — D-DAY

```text
D-DAY create form
저장 확인 Bottom Sheet
로그인 유도
create_dday_event
D-DAY 상세
score_snapshot
weather_score_logs
```

## Phase F — DISCOVER

```text
DISCOVER intent/flow
cities search
poi search
P1/P2/P3 결과
D-DAY 저장 연결
```

## Phase G — Settings / MyPage

```text
사이드바
마이페이지
저장된 D-DAY
완료된 D-DAY
알림 설정
계정 관리
데이터 출처
```

---

# 27. 오픈 이슈

아래는 개발 착수 전 또는 구현 중 추가 결정이 필요한 항목이다.

| 항목 | 상태 |
|---|---|
| Open-Meteo / KMA / AirKorea 조합 우선순위 | Edge Function 구현 시 확정 |
| reverse geocoding provider | 구현 시 확정 |
| dong_areas 초기 seed 범위 | MVP 지역 범위 결정 필요 |
| poi_master 초기 데이터 범위 | MVP 도시/카테고리 기준 결정 필요 |
| activity_weather_score 10개 활동 재빌드 | Migration 이후 별도 작업 |
| score log sampling rate | 운영 단계에서 결정 |
| TODAY cache key geohash precision | Edge Function 구현 시 결정 |
| 데이터 출처 화면 최종 카피 | 출시 전 법무/정책 검토 |

---

# 28. 최종 요약

```text
ggg MVP
→ TODAY는 GPS 기반 오늘 판단
→ DISCOVER는 날짜/지역/활동 탐색
→ D-DAY는 저장 일정 관리
→ 선호 활동은 TODAY 개인화의 핵심
→ Weather Score는 활동별 0~100 내부 점수 + 4단계 UI 등급
→ D-DAY 저장은 로그인 필수
→ Supabase PostgreSQL + Edge Function 중심
→ Score 결과는 snapshot과 log로 관리
→ MVP는 단순하고 명확한 라우팅/모달 구조로 구현
```

본 PRD v2.5를 기준으로 다음 단계는 `CODEX-IMPLEMENTATION-BRIEF-v1.0` 작성이다.
