# API / DATA ACCESS SPEC (MVP)

## Version
**v1.1** — Weather Score Logs / Score Engine 반영본

## Document Type
API / Data Access Specification

## Status
MVP Draft

---

# 1. v1.0 → v1.1 변경 요약

| 영역 | v1.0 | v1.1 |
|---|---|---|
| Score 계산 | Edge Function 중심 | 유지 |
| Score log | 미정 | `weather_score_logs` 저장 |
| D-DAY 저장 | score_snapshot 저장 | score_snapshot + score log |
| TODAY GPS log | 미정 | exact lat/lon 저장 지양, geohash 사용 |
| 실내 활동 | 일반 score | 비/악천후 시 대안성 보너스 |
| Edge Function | 후보 수준 | score logging 책임 추가 |

---

# 2. 문서 목적

이 문서는 ggg 앱 MVP에서 각 화면이 데이터를 어떻게 조회, 계산, 저장하는지 정의한다.

현재 데이터 저장소는 **Supabase PostgreSQL**이며, Weather Score Engine은 Edge Function 중심으로 실행한다. 계산 결과는 필요 시 `weather_score_logs`에 저장한다.

---

# 3. 핵심 결정사항

| 항목 | 결정 |
|---|---|
| TODAY 현재 위치 | GPS lat/lon 기반 |
| TODAY 외부 API 호출 | 클라이언트 직접 호출 금지 |
| TODAY 데이터 조립 | Supabase Edge Function |
| TODAY Score 계산 | Edge Function |
| TODAY 로그 | optional / sampling 가능 |
| DISCOVER Score 계산 | RPC 또는 Edge Function |
| DISCOVER 로그 | optional / sampling 가능 |
| D-DAY 저장 | 로그인 사용자만 Supabase 저장 |
| D-DAY 저장 Score | `score_snapshot` + `weather_score_logs` |
| 알림 판단 Score | `weather_score_logs` 저장 |
| API Key | 서버/Edge Function에서만 사용 |
| 클라이언트 계산 | 최소화 |

---

# 4. Edge Function 목록

MVP에서 필요한 Edge Function은 다음이다.

```text
get_today_payload
refresh_dong_weather_cache
calculate_discover_recommendations
calculate_dday_score
create_dday_event
update_dday_forecast_snapshot
log_weather_score
```

## 책임 구분

| Function | 책임 |
|---|---|
| `get_today_payload` | GPS 기반 TODAY payload 생성 |
| `refresh_dong_weather_cache` | 동 단위 캐시 갱신 |
| `calculate_discover_recommendations` | DISCOVER 추천 계산 |
| `calculate_dday_score` | D-DAY 점수 계산 |
| `create_dday_event` | D-DAY 저장 + snapshot + log |
| `update_dday_forecast_snapshot` | D-14 이후 score 갱신 |
| `log_weather_score` | score log 저장 공통 처리 |

---

# 5. TODAY Data Access

## 5-1. 기본 흐름

```text
TODAY 진입
→ GPS 권한 확인
→ GPS lat/lon 획득
→ get_today_payload 호출
→ Edge Function에서 reverse geocoding으로 동 단위 표시명 생성
→ dong_weather_cache 확인
→ 필요 시 외부 API 호출
→ Weather Score Engine 계산
→ optional weather_score_logs 저장
→ TODAY payload 반환
```

현재 구현은 클라이언트에서 외부 날씨 API를 직접 호출하지 않는다.  
브라우저는 Supabase Edge Function만 호출하고, Open-Meteo / reverse geocoding / Supabase cache 접근은 Edge Function 책임이다.

## 5-2. get_today_payload Input

```json
{
  "lat": 37.5446,
  "lon": 127.0559,
  "display_location_hint": "성수동",
  "preferred_activity_categories": ["urban", "cafe", "indoor"],
  "theme_overlay": "family_kids"
}
```

현재 프론트 호출은 `theme_overlay`를 아직 보내지 않는다.  
선호 활동은 localStorage에서 읽은 `preferred_activity_categories`를 전달한다.

## 5-2-1. get_today_payload Current Response

현재 TODAY 화면은 아래 typed payload를 기대한다.

```json
{
  "source": "live",
  "locationLabel": "성수동",
  "updatedAtLabel": "5월 22일 (금) 09:30 기준",
  "grade": "gorgeous",
  "reasons": ["비 가능성이 낮아 외출 부담이 적어요", "바람과 공기 상태가 무난해요"],
  "metrics": [
    {
      "label": "강수확률",
      "current": { "value": "20%", "tone": "great" },
      "peak": { "value": "35%", "tone": "good" },
      "detail": "지금은 20%지만, 오늘 낮 중 최대 35%까지 예보돼요."
    }
  ],
  "supportMetrics": [{ "label": "습도", "value": "52%" }],
  "prepHints": ["우산은 선택"],
  "activityImpacts": [{ "label": "피크닉/도시산책", "summary": "가볍게 걷기 좋아요", "grade": "great" }],
  "dayFlow": [{ "label": "오전", "value": "추천", "grade": "great" }],
  "activities": [],
  "ddaySummary": null,
  "hourlyWeather": []
}
```

raw 0-100 score는 클라이언트에 표시하지 않는다.

## 5-2-2. 현재 Edge Function 구현

```text
supabase/functions/get_today_payload
├── Open-Meteo forecast
│   └── temperature_2m, precipitation, precipitation_probability,
│       weather_code, wind_speed_10m, relative_humidity_2m,
│       sunrise, sunset
├── Open-Meteo air-quality
│   └── pm2_5, uv_index
├── Nominatim reverse geocoding
├── dong_weather_cache read/write
└── TODAY payload 생성
```

서버 캐시는 `dongAreaId = geo_{lat.toFixed(3)}_{lon.toFixed(3)}` 기준으로 동작한다.  
이 값은 MVP용 geohash 대체 key이며, 정식 geohash precision은 후속 결정 사항이다.

## 5-3. GPS 로그 정책

TODAY 요청 로그를 저장하는 경우 exact lat/lon은 저장하지 않는다.

```text
geohash 저장
display_location 저장 가능
exact lat/lon 장기 저장 지양
```

## 5-4. TODAY score log 저장

TODAY는 자주 호출될 수 있으므로 log 저장은 optional 또는 sampling 방식으로 운영한다.

```text
개발/QA: 100% 저장 가능
운영 MVP: sampling 저장 권장
D-DAY 저장/알림 판단: 100% 저장
```

---

# 6. DISCOVER Data Access

## 6-1. 기본 원칙

DISCOVER는 `cities` 기반 장기 기후/예보/스코어 데이터를 사용한다.

```text
cities
→ climate_normals
→ activity_weather_score
→ best_travel_week
→ rain_risk_calendar
→ forecast_weather
→ poi_master
```

## 6-2. Score 계산

복잡한 추천 계산은 `calculate_discover_recommendations`에서 수행한다.

```text
input
→ candidate city/poi/activity 조회
→ Weather Score Engine 계산
→ 결과 반환
→ optional weather_score_logs 저장
```

## 6-3. 실내 활동 보정

DISCOVER P3처럼 날짜+지역 기준으로 활동을 추천할 때, 비/강풍/미세먼지 등으로 야외 활동 점수가 낮으면 실내 활동이 상대적으로 더 추천될 수 있다.

```text
비 오는 부산
→ 해변 score 하락
→ 카페/맛집, 전시/문화 score 상대 상승
```

단, 호우/태풍급 위험 날씨는 실내 활동도 safety cap을 적용한다.

---

# 7. D-DAY Data Access

## 7-1. Auth Requirement

D-DAY 저장은 로그인 사용자만 가능하다.

```text
비로그인 사용자
→ D-DAY 저장 시도
→ 로그인 유도
→ Google / Apple / Kakao 로그인
→ 저장 재개
```

## 7-2. create_dday_event

D-DAY 생성은 Edge Function을 권장한다.

### 책임

```text
auth check
입력 validation
score 계산
score_snapshot 생성
weather_score_logs insert
notification_settings 기본값 적용
planned_items insert
current_stage 계산
알림 권한/설정 상태 확인
```

### Input

```json
{
  "title": "부산 여행",
  "start_date": "2026-06-21",
  "end_date": "2026-06-23",
  "city_id": "busan",
  "activity_categories": ["beach", "cafe"],
  "theme_overlay": "family_kids",
  "source": "manual"
}
```

### Output

```json
{
  "dday_event_id": "uuid",
  "current_stage": "stage_2",
  "score_snapshot": {
    "score": 78,
    "grade": "추천",
    "reasons": ["비 가능성 낮음", "오후 바람 주의"],
    "activity_scores": []
  },
  "score_log_id": "uuid",
  "should_show_notification_permission": true
}
```

---

# 8. D-DAY Score Update

D-14 이후 예보가 들어오면 forecast 기반으로 score를 업데이트한다.

```text
D-90 / D-30
→ climate_normals / activity_weather_score 기반
→ 고정

D-14 / D-7 / D-1 / D-0
→ forecast_weather 기반
→ 업데이트 가능
```

업데이트 시 처리:

```text
1. score 재계산
2. user_dday_events.score_snapshot 업데이트
3. weather_score_logs insert
4. 등급 변화/위험 조건 발생 시 알림 후보 생성
```

---

# 9. weather_score_logs Data Access

## 9-1. Write

Score 계산을 수행한 Edge Function이 insert한다.

```text
service_role 또는 제한된 RPC/Edge Function
```

## 9-2. Read

MVP에서 클라이언트는 weather_score_logs를 직접 조회하지 않는다.

```text
분석/운영/디버깅용
사용자 화면 primary source 아님
```

## 9-3. 저장 대상

| 상황 | 저장 |
|---|---|
| TODAY | optional / sampling |
| DISCOVER | optional / sampling |
| D-DAY create | 필수 |
| D-DAY detail update | 필수 |
| Notification trigger | 필수 |

---

# 10. Search Data Access

## 10-1. 지역 검색

```text
cities
```

## 10-2. POI 검색

```text
poi_master
```

## 10-3. 최근 선택 저장

```text
recent_selections
```

검색어가 아니라 실제 선택 결과만 저장한다.

---

# 11. Notification Data Access

## 11-1. User-level Settings

```text
user_notification_settings
```

## 11-2. Event-level Settings

```text
user_dday_events.notification_settings
```

## 11-3. 알림 판단 시 Score log

알림 트리거 판단을 위해 score를 재계산한 경우 `weather_score_logs`에 저장한다.

```text
notification screen/source
→ result 저장
→ grade change / fatal / safety condition 추적
```

---

# 12. Cache Strategy

## 12-1. Client Cache

```text
TODAY payload
user_preferences
activity_categories
cities list
```

현재 프론트 구현:

```text
TODAY payload cache key: ggg.todayPayload.v1
TTL: 30분
invalidate 기준: preferred_activity_categories 변경 또는 skipCache=true
activity preferences key: ggg.activityPreferences.v1
```

## 12-2. Server Cache

```text
city_weather_cache
dong_weather_cache
forecast_weather
```

현재 `get_today_payload`는 `dong_weather_cache`를 우선 사용한다.  
`SUPABASE_URL`과 `SUPABASE_SERVICE_ROLE_KEY`가 Edge Function 환경변수에 없으면 cache read/write를 건너뛰고 live payload만 반환한다.

## 12-3. Invalidation

| 데이터 | 기준 |
|---|---|
| TODAY payload | 30분~1시간 TTL |
| city forecast | 수집/갱신 시각 |
| dong forecast | expires_at |
| user preferences | 저장 시 즉시 갱신 |
| D-DAY list | create/update/delete 후 invalidate |
| activity categories | 앱 실행 중 장기 캐시 가능 |

---

# 13. Error Handling

## 13-1. D-DAY Score 실패

D-DAY 저장은 허용한다.

```text
날씨 적합도를 계산하지 못했어요.
일정은 저장할 수 있지만 점수는 나중에 업데이트돼요.
```

이 경우:

```text
user_dday_events는 저장 가능
score_snapshot은 null 또는 pending
weather_score_logs에는 실패 상태를 남길 수 있음
```

## 13-2. Log 저장 실패

로그 저장 실패는 사용자 흐름을 막지 않는다.

```text
D-DAY 저장 성공
weather_score_logs insert 실패
→ 사용자에게는 성공 처리
→ 운영 로그/에러 모니터링
```

---

# 14. RLS / Security

## 14-1. Public Read

```text
cities
activity_categories
poi_master
climate_normals
monthly_climate
forecast_weather
activity_weather_score
rain_risk_calendar
best_travel_week
weather_stability_index
climate_frequency
```

## 14-2. User-owned CRUD

```text
user_profiles
user_preferences
user_locations
recent_selections
user_dday_events
user_dday_planned_items
user_notification_settings
```

## 14-3. Edge Function / Service Role

```text
hourly_weather
daily_weather
collection_log
dong_weather_cache write
weather_score_logs insert/read analytics
external API refresh
```

---

# 15. MVP 포함 / 제외

## 15-1. 포함

```text
TODAY Edge Function
TODAY dong/geohash cache
DISCOVER DB/RPC 기반 추천
D-DAY 로그인 사용자 저장
D-DAY score_snapshot
weather_score_logs
검색: cities + poi_master
최근 선택 저장
알림 설정 조회/저장
실내 대안성 보너스 반영
기본 cache invalidation
```

## 15-2. 제외

```text
클라이언트 외부 API 직접 호출
비로그인 D-DAY 저장
동 단위 과거 기후 원천 DB
D-DAY 직접 입력 POI 검색
활동 자유 검색
score history user-facing screen
고급 알림 스케줄러 UI
지도 기반 검색
```

---

# 16. 최종 요약

```text
API/Data Access
→ TODAY는 GPS lat/lon 기반 Edge Function
→ DISCOVER는 cities/feature/poi 기반 DB + RPC
→ D-DAY는 로그인 사용자 Supabase 저장
→ Score 계산은 Edge Function 중심
→ D-DAY는 score_snapshot + weather_score_logs 저장
→ TODAY/DISCOVER log는 optional
→ 외부 API는 서버/Edge Function에서만 호출
```
