# D-DAY CREATE FORM Product Spec (MVP)

## Version
**v1.0** — D-DAY 새로 만들기 직접 입력 폼

## Document Type
Product / Feature Specification

## Status
MVP Draft

---

# 1. 문서 목적

이 문서는 ggg 앱의 **D-DAY 새로 만들기 직접 입력 폼**을 정의한다.

D-DAY는 추천 화면이 아니라, 사용자가 이미 정한 일정을 저장하고 시간축에 따라 날씨 정보와 준비 정보를 관리하는 화면이다.  
따라서 D-DAY 새로 만들기는 DISCOVER처럼 추천을 받는 플로우가 아니라, 사용자가 직접 아래 정보를 입력하는 폼이다.

```text
일정명
날짜/기간
도시/지역
활동 카테고리
옵션
알림
```

DISCOVER에서 D-DAY 저장으로 진입한 경우에는 이 폼을 새로 채우지 않고, DISCOVER 결과의 메타데이터를 prefill하여 저장 확인 단계로 연결한다.

---

# 2. 핵심 역할

## 2-1. 사용자 관점

사용자가 이미 정한 일정 정보를 빠르게 저장한다.

```text
부산 여행
6월 21일 ~ 6월 23일
부산
해변
```

## 2-2. 시스템 관점

입력된 일정 정보를 D-DAY 이벤트로 저장하고, 남은 날짜에 따라 시간축 단계에 자동 배치한다.

```text
입력 정보
→ dday_event 생성
→ activity category/profile 매핑
→ weather score 계산
→ 현재 D-DAY stage 결정
→ 알림 스케줄 등록
```

---

# 3. 진입점

| 진입점 | 동작 |
|---|---|
| D-DAY 탭 → 새로 만들기 | 빈 폼으로 시작 |
| TODAY → 다음 일정 찾아보기 | DISCOVER로 보내는 것이 기본. 필요 시 빈 폼 진입 가능 |
| DISCOVER → D-DAY로 저장 | 폼 생략 또는 prefill 상태로 확인 화면 진입 |
| 마이페이지 → 저장된 D-DAY → 새 일정 | 빈 폼으로 시작 |

---

# 4. 전체 플로우

## 4-1. 직접 입력 플로우

```text
D-DAY 탭
→ 새로 만들기
→ 일정명 입력
→ 날짜/기간 선택
→ 도시/지역 선택
→ 활동 카테고리 선택
→ 옵션 선택
→ 알림 확인
→ 저장 확인 Bottom Sheet
→ D-DAY 저장
→ 알림 권한 안내
→ D-DAY 상세 화면
```

## 4-2. DISCOVER prefill 플로우

```text
DISCOVER 결과
→ D-DAY로 저장
→ 저장 확인 Bottom Sheet
→ 필요 시 일부 항목 수정
→ D-DAY 저장
→ 알림 권한 안내
→ D-DAY 상세 화면
```

---

# 5. 화면 구조

## 5-1. 기본 폼

```text
새 D-DAY 만들기

일정 이름
[예: 부산 여행]

날짜
[날짜 또는 기간 선택]

어디로 가시나요?
[도시/지역 선택]

무엇을 할 예정인가요?
[활동 카테고리 선택]

옵션
[ ] 아이와 함께

알림
D-84 / D-28 / D-14 / D-7 / D-1 / D-0 기본 ON

[다음]
```

## 5-2. 모바일 화면 와이어프레임

```text
┌─────────────────────────┐
│ 새 D-DAY 만들기          │
│                         │
│ 일정 이름                │
│ ┌─────────────────────┐ │
│ │ 부산 여행             │ │
│ └─────────────────────┘ │
│                         │
│ 날짜                     │
│ ┌─────────────────────┐ │
│ │ 6/21 ~ 6/23          │ │
│ └─────────────────────┘ │
│                         │
│ 어디로 가시나요?          │
│ ┌─────────────────────┐ │
│ │ 부산                  │ │
│ └─────────────────────┘ │
│                         │
│ 무엇을 할 예정인가요?      │
│ 자주 쓰는 활동            │
│ [해변] [카페/맛집]        │
│ 전체 활동                │
│ [등산] [캠핑] [사진/뷰]   │
│                         │
│ 옵션                     │
│ [ ] 아이와 함께           │
│                         │
│ 알림                     │
│ D-84 D-28 D-14 D-7 D-1 D-0│
│ 기본 ON                  │
│                         │
│ [다음]                   │
└─────────────────────────┘
```

---

# 6. 입력 항목 상세

## 6-1. 일정명

### 필수 여부

필수.

### 입력 방식

텍스트 입력.

### Placeholder

```text
예: 부산 여행, 서울숲 피크닉, 강릉 캠핑
```

### 자동 생성

사용자가 일정명을 비운 상태로 날짜/지역/활동을 선택하면 자동 제안한다.

| 조건 | 자동 일정명 |
|---|---|
| 지역 + 활동 | 부산 해변 여행 |
| POI + 활동 | 서울숲 피크닉 |
| 지역 + family_kids | 부산 아이와 여행 |
| 활동만 있고 지역 없음 | 해변 일정 |
| 지역만 있고 활동 없음 | 부산 여행 |

### 수정 가능 여부

사용자가 자유롭게 수정 가능.

---

## 6-2. 날짜/기간

### 필수 여부

필수.

### 지원 유형

| 유형 | 설명 |
|---|---|
| 단일 날짜 | 당일 일정 |
| 날짜 범위 | 여행/외출 기간 |

### 날짜 선택 UX

```text
1차 탭: 시작일 선택
2차 탭: 종료일 선택
3차 탭: 새 시작일로 초기화
```

### 빠른 선택

```text
[오늘]
[내일]
[이번 주말]
[다음 주말]
[직접 선택]
```

### 기본 규칙

| 선택 | 처리 |
|---|---|
| 오늘 | 단일 날짜 |
| 내일 | 단일 날짜 |
| 이번 주말 | 토~일 범위 |
| 다음 주말 | 다음 토~일 범위 |
| 직접 선택 | 캘린더 range 선택 |

### 유효성

- 시작일은 오늘 이후여야 한다.
- 종료일은 시작일보다 빠를 수 없다.
- MVP에서는 최대 14일 범위까지 허용한다.
- 14일 초과 일정은 Phase 1.5에서 검토한다.

---

## 6-3. 도시/지역

### 필수 여부

필수.

### 입력 방식

공통 `LOCATION & REGION SELECTION` 화면 사용.

```text
어디로 가시나요?
[도시나 지역을 검색해보세요]
```

### 허용 단위

| 단위 | 허용 |
|---|---|
| 시/도 | 허용 |
| 시/군/구 | 허용 |
| 동/읍/면/리 | 허용 |
| POI | MVP에서는 D-DAY 직접 입력 폼에서 제외. DISCOVER 저장 시 가능 |

### 선택 후 반환값

```json
{
  "location_id": "kr_busan",
  "display_name": "부산",
  "admin_level": "sido",
  "lat": 35.1796,
  "lng": 129.0756,
  "weather_grid_id": "string",
  "weather_station_id": "string"
}
```

### 표시 예시

```text
부산
경주시
탄현면 법흥리
```

---

## 6-4. 활동 카테고리

### 필수 여부

필수.

### 원칙

활동 카테고리는 Weather Score Engine v1.2의 10개 활동 카테고리를 사용한다.

| 코드 | 노출명 | Activity Profile |
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

### 선호 활동 설정 완료 사용자

선호 활동을 먼저 노출한다.

```text
무엇을 할 예정인가요?

자주 쓰는 활동
[피크닉/도시산책] [카페/맛집] [전시/문화]

전체 활동
[해변] [등산/트레킹] [캠핑] [일출/일몰] ...
```

### 선호 활동 미설정 사용자

전체 활동만 노출한다.

```text
무엇을 할 예정인가요?

[해변]
[등산/트레킹]
[캠핑]
[일출/일몰]
[사진/뷰]
[피크닉/도시산책]
[카페/맛집]
[축제/이벤트]
[온천/리조트]
[전시/문화]
```

### 선택 규칙

- Primary Activity 1개만 선택한다.
- 복수 활동은 Phase 2에서 검토한다.
- activity_profile은 내부 계산용이며 사용자에게 노출하지 않는다.

---

## 6-5. 옵션

### MVP 옵션

```text
[ ] 아이와 함께
```

### 내부 처리

선택 시:

```text
theme_overlay = family_kids
```

### 기본값

사용자의 `default_theme_overlay`가 `family_kids`인 경우 기본 ON.

```text
user_preferences.default_theme_overlay = family_kids
→ 아이와 함께 기본 체크
```

### 설명

```text
아이와 함께라면 미세먼지, UV, 체감온도 기준을 더 엄격하게 반영해요.
```

### 제외

```text
반려견 동반
커플/기념일 모드
고령자 동반
건강 상태 기반 설정
```

---

## 6-6. 알림

### 기본 정책

D-DAY 알림은 기본 ON.

```text
D-84 시기 판단
D-28 준비 시작
D-14 실제 예보 도착
D-7 짐 싸기
D-1 최종 점검
D-0 당일 안내
```

### 화면 표시

```text
알림

일정이 가까워질수록 필요한 정보를 알려드릴게요.

[x] D-84 시기 판단
[x] D-28 준비 시작
[x] D-14 실제 예보 도착
[x] D-7  짐 싸기
[x] D-1  최종 점검
[x] D-0  당일 안내
```

### 과거 시점 처리

저장 시점 기준 이미 지난 알림은 자동 제외한다.

예:

```text
오늘이 D-10인 경우
D-84, D-28, D-14 제외
D-7, D-1, D-0만 활성
```

### 사용자가 개별 OFF 가능

MVP에서는 개별 체크 해제를 허용한다.

---

# 7. 저장 확인 Bottom Sheet 연결

폼 입력 후 `다음`을 누르면 저장 확인 Bottom Sheet를 띄운다.

```text
D-DAY로 저장할까요?

부산 · 해변
6월 21일 ~ 6월 23일
2박 3일

강력추천

비 가능성 낮음
바람 안정적

일정 이름
[부산 해변 여행]

옵션
[x] 아이와 함께

알림
[x] D-14 실제 예보 도착
[x] D-7  짐 싸기
[x] D-1  최종 점검
[x] D-0  당일 안내

[D-DAY로 저장]
```

저장 확인 Bottom Sheet는 별도 공통 스펙에서 상세 정의한다.

---

# 8. DISCOVER Prefill 처리

DISCOVER에서 D-DAY 저장으로 들어온 경우, 아래 값들이 prefill된다.

## 8-1. Prefill 가능 필드

| 필드 | 처리 |
|---|---|
| 일정명 | 자동 생성 |
| 날짜/기간 | DISCOVER 선택 range |
| 도시/지역 | DISCOVER target |
| 장소/POI | DISCOVER target이 POI인 경우 planned_item 또는 place로 저장 |
| 활동 카테고리 | DISCOVER selected activity |
| theme_overlay | DISCOVER 선택값 또는 user default |
| score_snapshot | DISCOVER 계산값 |
| weather_reason_summary | DISCOVER 근거 2개 |

## 8-2. Prefill 후 UX

DISCOVER 저장 진입 시에는 전체 폼을 다시 보여주지 않는다.

```text
DISCOVER
→ D-DAY로 저장
→ 저장 확인 Bottom Sheet
```

단, Bottom Sheet에서 일정명, 옵션, 알림은 수정 가능해야 한다.

---

# 9. 저장 후 처리

## 9-1. 저장 성공

```text
D-DAY event 생성
→ 알림 스케줄 생성
→ 현재 D-DAY stage 계산
→ 알림 권한 상태 확인
→ 필요 시 알림 권한 안내
→ D-DAY 상세 화면 이동
```

## 9-2. 현재 D-DAY stage 계산

| 남은 기간 | 진입 Stage |
|---|---|
| D-85 이상 | Stage 1: 시기 판단 |
| D-84 ~ D-29 | Stage 1: 시기 판단 |
| D-28 ~ D-15 | Stage 2: 준비 시작 |
| D-14 ~ D-8 | Stage 3: 예보 시작 |
| D-7 ~ D-2 | Stage 4: 짐싸기 |
| D-1 ~ D-0 | Stage 5: 최종 준비 |

## 9-3. 알림 권한 요청

첫 D-DAY 저장 직후, OS 권한 요청 전에 사전 안내를 표시한다.

```text
이 일정의 날씨 변화와 준비 시점을 알려드릴게요.

D-14 실제 예보 도착
D-7 짐 싸기 체크
D-1 최종 점검
당일 시간대별 안내까지 받아볼 수 있어요.

[알림 받기]
[나중에]
```

---

# 10. 유효성 검사

## 10-1. 필수값

| 필드 | 비어 있을 때 |
|---|---|
| 일정명 | 자동 생성 또는 입력 요청 |
| 날짜 | 날짜를 선택해주세요 |
| 도시/지역 | 지역을 선택해주세요 |
| 활동 카테고리 | 활동을 선택해주세요 |

## 10-2. 날짜 오류

```text
종료일은 시작일보다 빠를 수 없어요.
```

## 10-3. 범위 초과

```text
MVP에서는 최대 14일까지 저장할 수 있어요.
```

## 10-4. 지원하지 않는 지역

```text
아직 이 지역의 날씨 데이터를 준비 중이에요.
가까운 지역 기준으로 저장할 수 있어요.
```

---

# 11. Empty / Error 상태

## 11-1. 지역 선택 실패

```text
지역 정보를 불러오지 못했어요.
잠시 후 다시 시도해주세요.

[다시 시도]
[직접 입력]
```

## 11-2. Score 계산 실패

```text
날씨 적합도를 계산하지 못했어요.
일정은 저장할 수 있지만, 점수는 나중에 업데이트돼요.

[그래도 저장]
[다시 시도]
```

## 11-3. 저장 실패

```text
D-DAY를 저장하지 못했어요.
잠시 후 다시 시도해주세요.

[다시 시도]
```

## 11-4. 알림 스케줄 실패

```text
일정은 저장됐지만 알림 설정에 실패했어요.
설정에서 다시 켤 수 있어요.
```

---

# 12. 데이터 모델

## 12-1. dday_events

```json
{
  "id": "string",
  "user_id": "string",
  "title": "부산 해변 여행",
  "start_date": "2026-06-21",
  "end_date": "2026-06-23",
  "location_id": "kr_busan",
  "display_location": "부산",
  "activity_category": "beach",
  "activity_profile": "outdoor_exposed",
  "theme_overlay": "family_kids | null",
  "source": "manual | discover",
  "score_snapshot": {
    "score": 87,
    "grade": "강력추천",
    "reasons": ["rain_low", "wind_stable"]
  },
  "notification_settings": {
    "d84": true,
    "d28": true,
    "d14": true,
    "d7": true,
    "d1": true,
    "d0": true
  },
  "current_stage": "stage_1 | stage_2 | stage_3 | stage_4 | stage_5",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

## 12-2. planned_items

DISCOVER에서 POI 기반으로 저장되거나 P3 다중 장소 선택이 있는 경우 사용한다.

```json
{
  "id": "string",
  "dday_event_id": "string",
  "place_id": "string",
  "place_name": "광안리해수욕장",
  "activity_category": "beach",
  "activity_profile": "outdoor_exposed",
  "sort_order": 1
}
```

---

# 13. 계측 이벤트

```text
dday_create_opened
dday_create_title_entered
dday_create_date_selected
dday_create_location_opened
dday_create_location_selected
dday_create_activity_section_viewed
dday_create_preferred_activity_section_viewed
dday_create_activity_selected
dday_create_theme_overlay_toggled
dday_create_notification_toggled
dday_create_next_clicked
dday_create_validation_failed
dday_save_sheet_opened
dday_saved
dday_save_failed
dday_notification_explainer_viewed
dday_notification_permission_requested
dday_notification_permission_granted
dday_notification_permission_denied
```

## 이벤트 필드 예시

```json
{
  "source": "manual | discover",
  "location_id": "kr_busan",
  "activity_category": "beach",
  "is_preferred_activity": true,
  "theme_overlay": "family_kids",
  "start_date": "2026-06-21",
  "end_date": "2026-06-23",
  "current_stage": "stage_1",
  "notification_enabled_count": 6
}
```

---

# 14. MVP 포함 / 제외

## 14-1. 포함

- D-DAY 직접 입력 폼
- 일정명 입력/자동 생성
- 단일 날짜/날짜 범위 선택
- 지역 선택 공통 화면 연결
- 활동 카테고리 10개 선택
- 선호 활동 우선 노출
- family_kids 옵션
- 알림 기본값 표시 및 개별 OFF
- 저장 확인 Bottom Sheet 연결
- DISCOVER prefill 처리
- 저장 후 알림 권한 안내
- 유효성 검사
- 기본 계측 이벤트

## 14-2. 제외

- 복수 활동 선택
- 지도 기반 장소 선택
- POI 직접 검색
- 숙소/교통 예약 연동
- 반복 일정
- 일정별 상세 메모
- 동행자 초대
- 공유 링크 생성
- 캘린더 앱 연동
- 결제/구독 제한

---

# 15. 최종 요약

```text
D-DAY 새로 만들기
→ 일정명
→ 날짜/기간
→ 도시/지역
→ 활동 카테고리
→ 옵션/알림
→ 저장 확인
→ D-DAY 저장
→ 알림 권한 안내
→ D-DAY 상세
```

MVP에서는 D-DAY 새로 만들기를 추천 탐색이 아닌 빠른 직접 입력 폼으로 유지한다.  
추천이 필요한 사용자는 DISCOVER에서 탐색한 뒤 D-DAY로 저장한다.
