# WEATHER SCORE ENGINE IMPLEMENTATION SPEC (MVP)

## Version
**v1.1** — Weather Score Policy v1.2 정합 반영본

## Document Type
Engineering / Product Logic Specification

## Status
MVP Draft

---

# 0. 문서 역할 및 기준 문서

이 문서는 `WEATHER-SCORE-POLICY-SPEC-v1.2`를 실제 코드로 구현하기 위한 **개발 구현 명세**다.

정책 기준은 다음 문서를 따른다.

```text
WEATHER-SCORE-POLICY-SPEC-v1.2
```

정책/임계값/카테고리/데이터 기간/안전 하한선/UI 표현이 본 문서와 충돌할 경우,
`WEATHER-SCORE-POLICY-SPEC-v1.2`를 우선 기준으로 한다.

본 문서는 다음을 정의한다.

```text
Edge Function 중심 계산 구조
shared score engine package
입력/출력 TypeScript interface
계산 함수 인터페이스
Indoor Alternative Bonus 구현
복수 활동 / 날짜 범위 계산
weather_score_logs 저장 방식
D-DAY score_snapshot 저장 방식
```

---


---

# v1.0 → v1.1 변경 요약

| 영역 | v1.0 | v1.1 |
|---|---|---|
| 문서 역할 | 구현 명세 단독 | Policy Spec v1.2 구현 문서로 명시 |
| 기준 문서 | 별도 명시 없음 | `WEATHER-SCORE-POLICY-SPEC-v1.2` 우선 |
| 충돌 처리 | 없음 | 정책/임계값/카테고리/기간은 Policy Spec 우선 |
| 문서 체계 | Weather Score Engine Spec과 역할 중복 가능 | Policy / Implementation 역할 분리 |
| 추가 구현 요소 | Edge Function, 로그, 실내 보너스 | 유지 |

# 1. 문서 목적

이 문서는 ggg 앱의 TODAY / DISCOVER / D-DAY에서 공통으로 사용하는 **Weather Score Engine**의 구현 방식을 정의한다.

Weather Score Engine은 날씨 데이터를 활동별 적합도 점수로 변환하고, 화면별 라벨과 이유 문구를 생성한다.

```text
Weather data
→ Activity-specific scoring
→ Fatal rule
→ Theme overlay
→ Indoor alternative bonus
→ Grade mapping
→ Reason generation
→ Score result / log
```

---

# 2. 핵심 결정사항

| 항목 | 결정 |
|---|---|
| 내부 점수 | 0~100 |
| UI 등급 | 4단계 |
| Grade threshold | 85 / 70 / 50 유지 |
| 계산 위치 | Edge Function 중심 |
| 공통 로직 | shared score engine package |
| 클라이언트 계산 | 최소화, payload 렌더링 중심 |
| 계산 결과 로그 | `weather_score_logs`에 저장 |
| D-DAY 저장 점수 | `user_dday_events.score_snapshot`에 embedded 저장 |
| GPS 로그 | exact lat/lon 저장 지양, geohash/둔화 좌표 사용 |
| 복수 활동 점수 | 평균 60% + 최저값 40% |
| 실내 활동 | 비/악천후 시 대안성 보너스 적용 |
| 위험 날씨 | 실내 활동도 안전 패널티 적용 |
| family_kids | 미세먼지 / UV / 체감온도 기준 강화 |

---

# 3. Score Engine 실행 위치

## 3-1. 기본 원칙

Weather Score Engine의 핵심 계산은 Edge Function에서 수행한다.

```text
Client
→ Edge Function
→ Supabase DB / Cache / External API
→ shared score engine
→ response payload
→ optional score log insert
```

## 3-2. 이유

```text
계산 기준 일관성 유지
외부 API key 보호
D-DAY score_snapshot과 화면 score 불일치 방지
계산 버전 관리
로그 기반 품질 분석
```

## 3-3. Shared Package

Edge Function에서 사용하는 계산 로직은 별도 shared package로 분리한다.

```text
/packages/weather-score-engine
```

클라이언트는 같은 로직을 직접 실행하지 않고, 서버에서 계산된 결과를 렌더링한다.

---

# 4. 적용 화면

| 화면 | 계산 기준 | 데이터 소스 | 저장 여부 |
|---|---|---|---|
| TODAY | GPS lat/lon 현재/예보 | Edge Function + cache/API | log 저장 가능 |
| DISCOVER P0 | 날짜/범위/활동 추천 | cities + forecast/climate/poi | log 저장 가능 |
| DISCOVER P1 | 지역+활동 → 시기 추천 | climate/activity score | log 저장 가능 |
| DISCOVER P2 | 날짜+활동 → 지역 추천 | city loop + score | log 저장 가능 |
| DISCOVER P3 | 날짜+지역 → 활동/장소 추천 | forecast/climate + poi | log 저장 가능 |
| D-DAY 생성 | 저장 일정 초기 판단 | forecast or climate | snapshot + log |
| D-DAY 상세 | 현재 단계 판단 | stage별 data source | snapshot update + log |
| 알림 | 변동/위험 조건 판단 | forecast update | log 저장 가능 |

---

# 5. 입력 데이터 구조

## 5-1. Score Input

```ts
type ScoreSourceType = "forecast" | "climate" | "mixed";
type LocationType = "gps" | "city" | "poi";
type ThemeOverlay = "family_kids" | null;

interface WeatherScoreInput {
  requestId?: string;
  screen: "today" | "discover" | "dday_create" | "dday_detail" | "notification";
  sourceType: ScoreSourceType;
  locationType: LocationType;

  cityId?: string;
  dongAreaId?: string;
  poiId?: string;
  geohash?: string;

  dateRange: {
    from: string; // YYYY-MM-DD
    to: string;   // YYYY-MM-DD
  };

  activityCategories: ActivityCategoryCode[];
  themeOverlay?: ThemeOverlay;

  weather: WeatherMetrics[];
  options?: ScoreOptions;
}
```

## 5-2. Weather Metrics

```ts
interface WeatherMetrics {
  date: string;
  timeBlock?: "morning" | "afternoon" | "evening" | "all_day";

  temperature?: number;              // °C
  apparentTemperature?: number;      // °C
  humidity?: number;                 // %
  precipitationProbability?: number; // 0~100
  precipitationAmount?: number;      // mm
  rainHours?: number;                // 0~24
  windSpeed?: number;                // m/s or normalized km/h converted
  windGusts?: number;                // m/s
  cloudCover?: number;               // %
  pm25?: number;                     // μg/m³
  pm10?: number;                     // μg/m³
  uvIndex?: number;
  weatherCode?: number;
  sunrise?: string;
  sunset?: string;
}
```

## 5-3. Score Options

```ts
interface ScoreOptions {
  scoreEngineVersion: string;
  labelContext: "discover" | "today" | "dday";
  shouldLog?: boolean;
  allowIndoorAlternativeBonus?: boolean;
}
```

---

# 6. 출력 데이터 구조

## 6-1. Score Result

```ts
interface ScoreResult {
  overall: EventScore;
  activityScores: ActivityScore[];
  dailyScores?: DailyScore[];
  appliedRules: string[];
  sourceType: ScoreSourceType;
  scoreEngineVersion: string;
  calculatedAt: string;
}
```

## 6-2. Event Score

```ts
interface EventScore {
  score: number; // 0~100
  grade: "gorgeous" | "great" | "good" | "uhm.." | "강력추천" | "추천" | "보통" | "비추천";
  reasons: Reason[];
  fatal: boolean;
  confidence: "low" | "medium" | "high";
}
```

## 6-3. Activity Score

```ts
interface ActivityScore {
  activityCategory: ActivityCategoryCode;
  displayName: string;
  score: number;
  grade: string;
  fatal: boolean;
  reasons: Reason[];
  metricBreakdown: Record<string, number>;
}
```

## 6-4. Reason

```ts
interface Reason {
  code: string;
  message: string;
  severity: "positive" | "neutral" | "caution" | "danger";
  metric?: string;
}
```

---

# 7. Activity Categories

MVP 활동 카테고리는 10개다.

| Code | Display | Activity Profile |
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

---

# 8. Grade Mapping

## 8-1. Threshold

| Score | DISCOVER | TODAY / D-DAY |
|---:|---|---|
| 85~100 | gorgeous | 강력추천 |
| 70~84 | great | 추천 |
| 50~69 | good | 보통 |
| 0~49 | uhm.. | 비추천 |

## 8-2. Context별 라벨

```ts
function mapGrade(score: number, context: "discover" | "today" | "dday") {
  if (context === "discover") {
    if (score >= 85) return "gorgeous";
    if (score >= 70) return "great";
    if (score >= 50) return "good";
    return "uhm..";
  }

  if (score >= 85) return "강력추천";
  if (score >= 70) return "추천";
  if (score >= 50) return "보통";
  return "비추천";
}
```

---

# 9. Metric Normalization

각 날씨 지표는 0~100 범위로 정규화한다.  
100은 해당 활동에 매우 적합, 0은 매우 부적합을 의미한다.

## 9-1. 공통 지표

| Metric | 설명 | 기본 방향 |
|---|---|---|
| precipitationProbability | 강수확률 | 낮을수록 좋음 |
| precipitationAmount | 강수량 | 낮을수록 좋음 |
| rainHours | 강수 지속시간 | 낮을수록 좋음 |
| windSpeed | 평균 풍속 | 활동별 최적 범위 다름 |
| windGusts | 돌풍 | 낮을수록 좋음 |
| temperature | 기온 | 활동별 최적 범위 다름 |
| apparentTemperature | 체감온도 | 활동별 최적 범위 다름 |
| humidity | 습도 | 중간값 선호 |
| cloudCover | 구름 | 활동별 다름 |
| pm25 | 초미세먼지 | 낮을수록 좋음 |
| uvIndex | UV | 낮거나 중간 선호 |

## 9-2. 기본 정규화 예시

```ts
function lowerIsBetter(value: number, goodMax: number, badMin: number): number {
  if (value <= goodMax) return 100;
  if (value >= badMin) return 0;
  return 100 * (1 - (value - goodMax) / (badMin - goodMax));
}

function gaussianScore(value: number, optimal: number, sigma: number): number {
  return 100 * Math.exp(-0.5 * Math.pow((value - optimal) / sigma, 2));
}
```

---

# 10. 활동별 Weighting

## 10-1. Outdoor Exposed: beach / scenic / photo

| Metric | Weight |
|---|---:|
| precipitation | 0.30 |
| wind | 0.20 |
| temperature/apparent | 0.20 |
| cloud/visibility | 0.15 |
| pm25 | 0.10 |
| uv | 0.05 |

## 10-2. Outdoor Active: hiking

| Metric | Weight |
|---|---:|
| precipitation | 0.25 |
| wind | 0.20 |
| apparent temperature | 0.20 |
| pm25 | 0.15 |
| humidity | 0.10 |
| cloud | 0.10 |

## 10-3. Outdoor Stay: camping

| Metric | Weight |
|---|---:|
| precipitation amount/rain hours | 0.30 |
| wind/gusts | 0.25 |
| night temperature | 0.20 |
| humidity | 0.10 |
| pm25 | 0.10 |
| cloud | 0.05 |

## 10-4. Outdoor Relax: urban / festival

| Metric | Weight |
|---|---:|
| precipitation | 0.30 |
| wind | 0.20 |
| apparent temperature | 0.20 |
| pm25 | 0.15 |
| uv | 0.10 |
| humidity | 0.05 |

## 10-5. Indoor Social: cafe

| Metric | Weight |
|---|---:|
| 이동 불편도 | 0.25 |
| 위험 날씨 | 0.25 |
| 실내 대안성 | 0.25 |
| 체감온도 | 0.10 |
| 미세먼지 | 0.10 |
| 기타 | 0.05 |

## 10-6. Indoor Visit: indoor

| Metric | Weight |
|---|---:|
| 이동 불편도 | 0.25 |
| 위험 날씨 | 0.25 |
| 실내 대안성 | 0.30 |
| 미세먼지 | 0.10 |
| 체감온도 | 0.05 |
| 기타 | 0.05 |

## 10-7. Indoor Stay: spa

| Metric | Weight |
|---|---:|
| 이동 불편도 | 0.20 |
| 위험 날씨 | 0.25 |
| 실내 대안성 | 0.25 |
| 체감온도 | 0.15 |
| 미세먼지 | 0.10 |
| 기타 | 0.05 |

---

# 11. Indoor Alternative Bonus

## 11-1. 적용 대상

```text
cafe
indoor
spa
```

## 11-2. 목적

비, 강풍, 폭염, 한파, 미세먼지 등으로 야외 활동이 불리할 때 실내 활동이 상대적으로 더 추천될 수 있도록 한다.

## 11-3. 적용 조건

아래 중 하나 이상이면 보너스 후보가 된다.

```text
precipitationProbability >= 40%
precipitationAmount >= 1mm
outdoorActivityAverageScore < 60
pm25 grade >= 나쁨
apparentTemperature extreme
windSpeed high
```

## 11-4. 보너스 기준

| 상황 | Bonus |
|---|---:|
| 약한 비 | +5~8 |
| 보통 비 | +3~5 |
| 미세먼지 나쁨 | +4~6 |
| 야외 활동 평균 score < 60 | +5 |
| 강한 비 / 호우 | 0 또는 패널티 |
| 태풍급/위험 조건 | 보너스 없음, safety cap 적용 |

## 11-5. 안전 제한

실내 활동도 이동이 필요하므로 위험 날씨에서는 점수를 제한한다.

| 조건 | 처리 |
|---|---|
| 호우/태풍급 | 최대 `보통` 또는 `추천` |
| 강풍 심각 | 최대 `추천` |
| 외출 자체 위험 | 최대 `보통` |

## 11-6. 함수

```ts
function applyIndoorAlternativeBonus(
  score: ActivityScore,
  weather: WeatherMetrics,
  context: ScoreContext
): ActivityScore
```

---

# 12. Fatal Rules

Fatal Rule은 평균 점수로 위험 조건이 희석되는 것을 막는다.

## 12-1. 공통 Fatal 후보

```text
호우 수준 강수량
강풍 / 돌풍
폭염 / 한파
PM2.5 매우나쁨
UV 위험
폭설 / 결빙
```

## 12-2. 활동별 Fatal 예시

| 활동 | Fatal 조건 |
|---|---|
| beach | 강풍, 호우, 번개성 weather code, UV 위험 |
| hiking | 호우, 강풍, 폭염, 한파, PM2.5 매우나쁨 |
| camping | 강수량 과다, rain_hours 과다, 강풍, 야간 한파 |
| scenic | 구름 매우 많음, 강수, 강풍 |
| photo | 강수, PM2.5 매우나쁨, 구름/시정 악화 |
| urban | 강수량 과다, 강풍, PM2.5 매우나쁨 |
| festival | 강수, 강풍, 폭염/한파 |
| cafe | 호우/강풍으로 이동 위험 |
| indoor | 호우/강풍으로 이동 위험 |
| spa | 교통/이동 위험 수준 악천후 |



## 12-4. Policy Spec 기준 적용

Fatal Rule의 상세 임계값은 `WEATHER-SCORE-POLICY-SPEC-v1.2`의 안전 하한선 표를 기준으로 한다.
본 구현 문서의 Fatal Rule 예시는 구현 방향을 설명하기 위한 것이며, 실제 하드 컷오프 값은 Policy Spec을 우선 적용한다.

## 12-3. Fatal 처리

```text
Fatal 발생
→ 해당 활동 score cap 적용
→ reason에 danger/caution 문구 추가
```

예:

```text
해변 + 강풍 fatal
→ score 최대 49
→ grade 비추천
```

---

# 13. Theme Overlay: family_kids

## 13-1. 목적

아이와 함께하는 외출은 체감온도, 미세먼지, UV 기준을 더 엄격하게 적용한다.

## 13-2. 적용 지표

```text
apparentTemperature
pm25
uvIndex
precipitation
wind
```

## 13-3. 처리 방식

```text
미세먼지 threshold 강화
UV penalty 강화
체감온도 extreme penalty 강화
강수/바람 caution reason 우선 노출
```

## 13-4. 함수

```ts
function applyThemeOverlay(
  score: ActivityScore,
  overlay: "family_kids" | null,
  weather: WeatherMetrics
): ActivityScore
```

---

# 14. Source Type별 계산

## 14-1. Climate 기반

사용 시점:

```text
D-90
D-30
DISCOVER 장기 시기 추천
```

데이터:

```text
climate_normals
activity_weather_score
rain_risk_calendar
weather_stability_index
best_travel_week
```

특성:

```text
장기 평균 기반
confidence = low 또는 medium
D-14 이후 forecast로 업데이트
```

## 14-2. Forecast 기반

사용 시점:

```text
TODAY
D-14
D-7
D-1
D-0
DISCOVER 가까운 날짜
```

데이터:

```text
forecast_weather
dong_weather_cache
external API payload
```

특성:

```text
실제 예보 기반
confidence = medium 또는 high
변동 가능
```

## 14-3. Mixed 기반

사용 시점:

```text
예보가 일부 날짜만 있고 나머지는 climate로 보정하는 range
```

예:

```text
10박 11일 중 앞 7일 forecast, 뒤 4일 climate
```

MVP에서는 D-DAY 날짜 범위를 최대 14일로 제한하므로 forecast 우선, 부족분은 climate fallback 가능.

---

# 15. 단일 날짜 Score

## 15-1. 계산 순서

```text
1. activity category별 metric weight 로딩
2. weather metrics 정규화
3. weighted score 계산
4. indoor alternative bonus 적용
5. family_kids overlay 적용
6. fatal rule 적용
7. grade mapping
8. reasons 생성
```

## 15-2. 함수

```ts
function calculateActivityScore(
  weather: WeatherMetrics,
  activityCategory: ActivityCategoryCode,
  options: ScoreOptions
): ActivityScore
```

---

# 16. 날짜 Range Score

## 16-1. 목적

D-DAY가 2박 3일, 3박 4일 등 범위 일정일 때 전체 적합도를 계산한다.

## 16-2. 계산 방식

```text
range score = 일별 score 평균 70% + 최저 일별 score 30%
```

## 16-3. 이유

- 여행 전체 만족도는 평균 날씨의 영향을 받는다.
- 단 하루라도 매우 나쁘면 체감 만족도가 떨어진다.
- 최저값만 쓰면 너무 보수적이다.

## 16-4. Output

```ts
interface RangeScore {
  score: number;
  grade: string;
  dailyScores: DailyScore[];
  worstDate?: string;
  bestDate?: string;
  reasons: Reason[];
}
```

---

# 17. 복수 활동 Score

## 17-1. 확정 규칙

```text
대표 score = 선택 활동 score 평균 60% + 최저 활동 score 40%
```

## 17-2. Fatal Rule

| 조건 | 대표 등급 처리 |
|---|---|
| 활동 1개 Fatal | 대표 등급 최대 `보통` |
| 활동 2개 이상 Fatal | 대표 등급 최대 `비추천` |
| Fatal 없음 | 대표 score 기준 |

## 17-3. 함수

```ts
function calculateMultiActivityScore(
  activityScores: ActivityScore[],
  context: ScoreContext
): EventScore
```

---

# 18. Reason 생성

## 18-1. 목적

점수의 근거를 사용자에게 짧게 설명한다.

## 18-2. 개수

| 화면 | Reason 개수 |
|---|---:|
| TODAY Hero | 2개 |
| TODAY 활동 카드 | 1~2개 |
| DISCOVER 카드 | 2개 |
| D-DAY 저장 확인 | 2개 |
| D-DAY 상세 | 2~3개 |
| 알림 | 1개 핵심 변화 |

## 18-3. 우선순위

```text
1. Fatal / danger
2. Caution
3. Positive
4. Neutral
```

## 18-4. 예시 문구

```text
비 가능성이 낮아요
오후 바람은 약간 주의가 필요해요
미세먼지가 좋아요
비가 와도 실내 활동 영향이 적어요
아이와 함께라면 UV를 조금 주의하세요
```

## 18-5. 함수

```ts
function generateReasons(
  scoreResult: ScoreResult,
  context: "today" | "discover" | "dday"
): Reason[]
```

---

# 19. Score Logging

## 19-1. 로그 저장 목적

```text
계산 결과 디버깅
score 품질 분석
사용자 화면에서 왜 이 점수가 나왔는지 추적
D-DAY 저장 당시 계산 근거 보존
weight 조정/AB test 분석
```

## 19-2. 테이블

```text
weather_score_logs
```

## 19-3. 저장 시점

| 상황 | 저장 |
|---|---|
| TODAY payload 생성 | optional, sampling 가능 |
| DISCOVER 추천 계산 | optional, sampling 가능 |
| D-DAY 저장 | 필수 |
| D-DAY 상세 forecast 업데이트 | 필수 |
| 알림 트리거 판단 | 필수 |
| 개발/디버깅 환경 | verbose 가능 |

## 19-4. GPS 로그 정책

TODAY는 GPS 기반이므로 exact lat/lon 저장은 지양한다.

```text
정확한 lat/lon 저장 X
geohash 또는 둔화 좌표만 저장
display_location은 저장 가능
```

## 19-5. 로그 result 예시

```json
{
  "overall": {
    "score": 82,
    "grade": "추천",
    "label_context": "dday",
    "reasons": [
      "비 가능성은 낮아요",
      "오후 바람은 약간 주의가 필요해요"
    ]
  },
  "activity_scores": [
    {
      "activity_category": "beach",
      "score": 62,
      "grade": "보통",
      "fatal": false,
      "reasons": ["오후 바람이 다소 강해요"]
    },
    {
      "activity_category": "cafe",
      "score": 91,
      "grade": "강력추천",
      "fatal": false,
      "reasons": ["비가 와도 활동 영향이 적어요"]
    }
  ],
  "applied_rules": [
    "multi_activity_average_min_blend",
    "indoor_rain_bonus",
    "family_kids_overlay"
  ]
}
```

---

# 20. weather_score_logs Schema

```sql
create table if not exists weather_score_logs (
  id uuid primary key default gen_random_uuid(),

  user_id uuid references auth.users(id) on delete set null,
  dday_event_id uuid references user_dday_events(id) on delete set null,

  screen text not null check (
    screen in ('today', 'discover', 'dday_create', 'dday_detail', 'notification')
  ),

  source_type text not null check (
    source_type in ('forecast', 'climate', 'mixed')
  ),

  location_type text not null check (
    location_type in ('gps', 'city', 'poi')
  ),

  city_id text references cities(id),
  dong_area_id text references dong_areas(id),
  poi_id text references poi_master(id),

  geohash text,

  date_from date not null,
  date_to date not null,

  activity_categories text[] not null default '{}',
  theme_overlay text check (theme_overlay in ('family_kids')),

  score_engine_version text not null,
  input_summary jsonb not null default '{}'::jsonb,
  result jsonb not null default '{}'::jsonb,

  calculated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
```

## 20-1. 권장 인덱스

```sql
create index if not exists idx_weather_score_logs_user_time
  on weather_score_logs (user_id, calculated_at desc);

create index if not exists idx_weather_score_logs_dday_time
  on weather_score_logs (dday_event_id, calculated_at desc);

create index if not exists idx_weather_score_logs_screen_time
  on weather_score_logs (screen, calculated_at desc);

create index if not exists idx_weather_score_logs_city_date
  on weather_score_logs (city_id, date_from, date_to);
```

---

# 21. 함수 인터페이스

```ts
calculateWeatherScore(input: WeatherScoreInput): ScoreResult

calculateActivityScore(
  weather: WeatherMetrics,
  activityCategory: ActivityCategoryCode,
  options: ScoreOptions
): ActivityScore

calculateDateRangeScore(
  dailyScores: DailyScore[]
): RangeScore

calculateMultiActivityScore(
  activityScores: ActivityScore[],
  context: ScoreContext
): EventScore

applyThemeOverlay(
  score: ActivityScore,
  overlay: ThemeOverlay,
  weather: WeatherMetrics
): ActivityScore

applyIndoorAlternativeBonus(
  score: ActivityScore,
  weather: WeatherMetrics,
  context: ScoreContext
): ActivityScore

applyFatalRules(
  score: ActivityScore,
  weather: WeatherMetrics,
  activityCategory: ActivityCategoryCode
): ActivityScore

mapGrade(
  score: number,
  context: "discover" | "today" | "dday"
): string

generateReasons(
  scoreResult: ScoreResult,
  context: "today" | "discover" | "dday"
): Reason[]

logWeatherScore(
  input: WeatherScoreInput,
  result: ScoreResult
): Promise<void>
```

---

# 22. 화면별 적용

## 22-1. TODAY

```text
GPS lat/lon
→ get_today_payload
→ forecast/current weather 기반 score
→ 선호 활동만 계산
→ optional log 저장
```

## 22-2. DISCOVER

```text
cities/poi/activity input
→ climate or forecast 기반 score
→ gorgeous/great/good/uhm.. 라벨
→ optional log 저장
```

## 22-3. D-DAY 저장

```text
D-DAY 입력값
→ calculate_dday_score
→ score_snapshot 생성
→ user_dday_events 저장
→ weather_score_logs 필수 저장
```

## 22-4. D-DAY 상세 업데이트

```text
D-14 이후 forecast 변화
→ score 재계산
→ score_snapshot 업데이트
→ weather_score_logs 저장
→ 필요 시 알림 트리거
```

---

# 23. MVP 포함 / 제외

## 23-1. 포함

```text
0~100 score
4단계 grade mapping
10개 활동 카테고리
activity profile별 weighting
Fatal Rule
family_kids overlay
Indoor Alternative Bonus
단일 날짜 score
날짜 range score
복수 활동 score
Reason 생성
D-DAY score_snapshot
weather_score_logs
Edge Function 중심 계산
```

## 23-2. 제외

```text
AI 기반 reason 생성
개인별 weather tolerance 학습
AB test UI
score_history 별도 화면
정확한 GPS lat/lon 장기 저장
해양 파고/수온 전문 데이터
산악 고도별 날씨 보정
실시간 재난문자 연동
```

---

# 24. 최종 요약

```text
Weather Score Engine
→ Edge Function 중심 계산
→ shared package로 로직 관리
→ 0~100 score
→ 4단계 UI grade
→ 활동별 weighting
→ 실내 활동은 비/악천후 시 대안성 보너스
→ 위험 날씨는 fatal/cap 적용
→ D-DAY는 score_snapshot + weather_score_logs 모두 저장
```

MVP에서는 점수의 정확한 개인화보다, 활동별 판단 일관성·설명 가능성·로그 기반 개선 가능성에 집중한다.
