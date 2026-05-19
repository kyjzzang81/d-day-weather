# SUPABASE DATA MODEL SPEC (MVP)

## Version
**v1.1** — Weather Score Logs 반영본

## Document Type
Data / Database Specification

## Status
MVP Draft

---

# 1. v1.0 → v1.1 변경 요약

| 영역 | v1.0 | v1.1 |
|---|---|---|
| Score 결과 저장 | `score_snapshot` 중심 | `score_snapshot` + `weather_score_logs` |
| Score log | 미정 | 신규 테이블 추가 |
| GPS 위치 로그 | 미정 | exact lat/lon 저장 지양, geohash 사용 |
| D-DAY score | embedded snapshot | 유지 |
| 분석/디버깅 | 별도 정의 없음 | score log 누적 |
| 마이그레이션 | P0 목록 | `weather_score_logs` 추가 |

---

# 2. 문서 목적

이 문서는 ggg 앱의 현재 기획 버전 기준으로 **Supabase PostgreSQL 데이터 모델**을 정의한다.

기존 Supabase 자산은 유지하되, TODAY / DISCOVER / D-DAY / 선호 활동 / 알림 / POI / Score Engine 로그 구조를 현재 기획에 맞게 정리한다.

---

# 3. 핵심 결정사항

| 항목 | 결정 |
|---|---|
| 저장소 | Supabase PostgreSQL |
| 인증 기준 | Supabase Auth `auth.uid()` |
| 비로그인 D-DAY 저장 | 불가 |
| TODAY 현재 위치 | GPS lat/lon 기반 API call |
| TODAY 현재 위치 원천 DB 저장 | 하지 않음 |
| TODAY 위치 로그 | exact lat/lon 지양, geohash 사용 |
| TODAY 동 단위 보조 데이터 | `dong_areas` + `dong_weather_cache` |
| 직접 지역 선택 | 시/군/구 단위, `cities` 사용 |
| POI | 신규 `poi_master` |
| 사용자 D-DAY 테이블 | `user_dday_events` |
| D-DAY POI 저장 | `user_dday_planned_items` |
| D-DAY 표시 점수 | `user_dday_events.score_snapshot` |
| Score 계산 로그 | 신규 `weather_score_logs` |
| Notification settings | user 단위 + event 단위 모두 사용 |

---

# 4. 기존 유지 테이블

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

---

# 5. 신규 / 변경 필요 테이블

```text
dong_areas
dong_weather_cache
poi_master
activity_categories
user_profiles
user_preferences
user_locations
recent_selections
user_dday_events
user_dday_planned_items
user_notification_settings
weather_score_logs
```

---

# 6. 주요 테이블 정의

## 6-1. `cities`

직접 지역 선택, DISCOVER, D-DAY 저장의 기준 지역 테이블이다.

```text
직접 지역 선택 = 시/군/구 단위
D-DAY 저장 = user_dday_events.city_id
DISCOVER 추천 = cities.id 기준
```

기존 컬럼을 유지한다.

```sql
cities
- id text primary key
- name_en text
- name_ko text
- country text
- lat double precision
- lon double precision
- alt integer
- region text
- is_popular boolean
- station_name text
- created_at timestamptz
```

추가 검토 컬럼:

```sql
timezone text
admin_level text default 'sigungu'
is_active boolean default true
```

---

## 6-2. `dong_areas`

TODAY 현재 위치의 동 단위 표시와 예보 캐시 기준을 제공하는 보조 테이블이다.

```sql
create table if not exists dong_areas (
  id text primary key,
  sido text not null,
  sigungu text not null,
  dong text not null,
  display_name text not null,
  lat double precision not null,
  lon double precision not null,
  geohash text,
  city_id text references cities(id),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

중요:

```text
동 단위 과거 기후 원천 데이터 저장용이 아니다.
TODAY 표시/캐시 보조용이다.
```

---

## 6-3. `dong_weather_cache`

TODAY 동 단위 현재/단기 예보 캐시 테이블이다.

```sql
create table if not exists dong_weather_cache (
  dong_area_id text primary key references dong_areas(id),
  lat double precision not null,
  lon double precision not null,
  forecast_rows jsonb not null default '[]'::jsonb,
  current_weather jsonb not null default '{}'::jsonb,
  pm25_by_hour jsonb not null default '{}'::jsonb,
  uv_by_hour jsonb not null default '{}'::jsonb,
  sunrise text,
  sunset text,
  cached_at timestamptz not null default now(),
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

---

## 6-4. `activity_categories`

```sql
create table if not exists activity_categories (
  code text primary key,
  display_name text not null,
  activity_profile text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

Seed:

```text
beach      해변             outdoor_exposed
hiking     등산/트레킹       outdoor_active
camping    캠핑             outdoor_stay
scenic     일출/일몰         outdoor_exposed
photo      사진/뷰           outdoor_exposed
urban      피크닉/도시산책    outdoor_relax
cafe       카페/맛집         indoor_social
festival   축제/이벤트       outdoor_relax
spa        온천/리조트       indoor_stay
indoor     전시/문화         indoor_visit
```

---

## 6-5. `poi_master`

DISCOVER에서 검색 가능한 POI master 테이블이다.

```sql
create table if not exists poi_master (
  id text primary key,
  display_name text not null,
  subtitle text,
  city_id text references cities(id),
  category_code text,
  activity_category text references activity_categories(code),
  addr text,
  lat double precision,
  lon double precision,
  image_url text,
  source text,
  source_link text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

기존 `nearby_places`는 호환/마이그레이션용으로 유지한다.

---

## 6-6. `user_profiles`

```sql
create table if not exists user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  email text,
  auth_provider text check (auth_provider in ('google', 'apple', 'kakao')),
  profile_image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

---

## 6-7. `user_preferences`

```sql
create table if not exists user_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  preferred_activity_categories text[] not null default '{}',
  activity_preference_set boolean not null default false,
  default_theme_overlay text check (default_theme_overlay in ('family_kids')),
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

---

## 6-8. `user_locations`

사용자가 직접 선택한 기본 위치를 관리한다. TODAY GPS 현재 위치는 저장하지 않는다.

```sql
create table if not exists user_locations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  city_id text not null references cities(id),
  display_name text not null,
  is_default boolean not null default false,
  source text not null default 'manual' check (source in ('manual', 'recent', 'settings')),
  last_used_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

---

## 6-9. `recent_selections`

최근 검색어가 아니라 사용자가 실제 선택한 결과를 저장한다.

```sql
create table if not exists recent_selections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  selection_type text not null check (selection_type in ('city', 'poi')),
  target_id text not null,
  display_name text not null,
  subtitle text,
  source_screen text,
  last_selected_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
```

---

## 6-10. `user_dday_events`

사용자가 저장한 D-DAY 일정의 핵심 테이블이다.

```sql
create table if not exists user_dday_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  start_date date not null,
  end_date date not null,
  city_id text not null references cities(id),
  display_location text not null,
  activity_categories text[] not null default '{}',
  primary_activity_category text,
  activity_profiles text[] not null default '{}',
  theme_overlay text check (theme_overlay in ('family_kids')),
  source text not null default 'manual' check (source in ('manual', 'discover')),
  score_snapshot jsonb,
  notification_settings jsonb not null default '{}'::jsonb,
  current_stage text,
  status text not null default 'active' check (status in ('active', 'completed', 'deleted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

정책:

```text
비로그인 저장 불가
활동 1~3개
날짜 범위 최대 14일
score_snapshot embedded
```

---

## 6-11. `user_dday_planned_items`

DISCOVER에서 POI 기반으로 저장된 세부 장소를 D-DAY 일정에 연결한다.

```sql
create table if not exists user_dday_planned_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  dday_event_id uuid not null references user_dday_events(id) on delete cascade,
  poi_id text references poi_master(id),
  place_name text not null,
  activity_category text references activity_categories(code),
  activity_profile text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
```

---

## 6-12. `user_notification_settings`

```sql
create table if not exists user_notification_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  notification_permission_status text not null default 'not_determined'
    check (notification_permission_status in ('granted', 'denied', 'not_determined')),
  global_notifications_enabled boolean not null default false,
  default_dday_notifications jsonb not null default '{
    "d84": true,
    "d28": true,
    "d14": true,
    "d7": true,
    "d1": true,
    "d0": true
  }'::jsonb,
  forecast_change_notifications_enabled boolean not null default false,
  safety_notifications_enabled boolean not null default false,
  marketing_notifications_enabled boolean not null default false,
  quiet_hours_enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

---

## 6-13. `weather_score_logs`

## 역할

Weather Score Engine의 계산 결과를 로그로 저장한다.

이 테이블은 화면 표시의 primary source가 아니라, 분석/디버깅/품질 개선을 위한 누적 로그다.

| 용도 | 테이블 |
|---|---|
| D-DAY 화면 표시용 현재 점수 | `user_dday_events.score_snapshot` |
| 계산 이력/디버깅/분석 | `weather_score_logs` |
| 사전 계산된 활동별 기후 점수 | `activity_weather_score` |

## 스키마

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

## GPS 로그 정책

TODAY는 GPS 기반이므로 exact lat/lon은 저장하지 않는다.

```text
geohash 저장
display_location 저장 가능
정확 좌표 장기 저장 지양
```

---

# 7. Score Snapshot 구조

`user_dday_events.score_snapshot`은 현재 D-DAY 화면 표시용 JSONB다.

```json
{
  "score": 78,
  "grade": "추천",
  "reasons": ["rain_low", "wind_caution"],
  "activity_scores": [
    {
      "activity_category": "beach",
      "score": 62,
      "grade": "보통",
      "fatal": false
    },
    {
      "activity_category": "cafe",
      "score": 91,
      "grade": "강력추천",
      "fatal": false
    }
  ],
  "applied_rules": [
    "multi_activity_average_min_blend",
    "indoor_rain_bonus"
  ],
  "calculated_at": "2026-05-19T08:30:00Z"
}
```

---

# 8. RLS 정책 방향

## 8-1. Public Read

```text
cities
climate_normals
monthly_climate
forecast_weather
best_travel_week
rain_risk_calendar
weather_stability_index
activity_weather_score
climate_frequency
activity_categories
poi_master
dong_areas
home_cards
weather_character_map
```

## 8-2. Service Role / Edge Function 중심

```text
hourly_weather
daily_weather
collection_log
dong_weather_cache write
weather_score_logs insert/read for analytics
external API refresh
```

`weather_score_logs`는 클라이언트 직접 전체 조회를 허용하지 않는다.  
사용자 본인의 로그 조회가 필요해지면 제한된 view 또는 RPC를 별도로 둔다.

## 8-3. User-owned CRUD

```text
user_profiles
user_preferences
user_locations
recent_selections
user_dday_events
user_dday_planned_items
user_notification_settings
```

---

# 9. 인덱스 방향

## 9-1. 신규 필수 인덱스

```sql
create index if not exists idx_dong_areas_geohash
  on dong_areas (geohash);

create index if not exists idx_dong_areas_city_id
  on dong_areas (city_id);

create index if not exists idx_poi_master_city_activity
  on poi_master (city_id, activity_category);

create index if not exists idx_poi_master_active
  on poi_master (is_active);

create index if not exists idx_user_dday_events_user_date
  on user_dday_events (user_id, start_date);

create index if not exists idx_user_dday_events_user_status
  on user_dday_events (user_id, status);

create index if not exists idx_user_dday_planned_items_event
  on user_dday_planned_items (dday_event_id);

create index if not exists idx_recent_selections_user_time
  on recent_selections (user_id, last_selected_at desc);

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

# 10. 마이그레이션 우선순위

## P0 — MVP 필수

```text
1. activity_categories
2. user_profiles
3. user_preferences
4. user_notification_settings
5. user_dday_events
6. user_dday_planned_items
7. weather_score_logs
8. poi_master
9. dong_areas
10. dong_weather_cache
11. RLS 정책
12. 필수 인덱스
```

## P1 — MVP 이후

```text
1. nearby_places → poi_master 마이그레이션
2. activity_weather_score 10개 활동 재빌드
3. dong_weather_cache Edge Function 최적화
4. score_history 분리
5. user event audit log
```

---

# 11. MVP 제외

```text
동 단위 과거 기후 데이터
동 단위 시간별 원천 날씨 저장
D-DAY 비로그인 저장
D-DAY 직접 입력 내 POI 검색
score_history 별도 테이블
복수 기본 위치
최근 검색어 저장
활동 자유 검색
조용한 시간대 알림
구독/결제 테이블
정확한 GPS lat/lon 장기 저장
```

---

# 12. 최종 요약

```text
Supabase Data Model
→ 기존 weather/climate/feature 테이블 유지
→ cities는 시/군/구 직접 선택과 D-DAY/DISCOVER anchor
→ TODAY는 GPS lat/lon 기반 Edge Function
→ TODAY 표시/캐시 보조로 dong_areas + dong_weather_cache
→ POI는 신규 poi_master
→ D-DAY는 user_dday_events
→ D-DAY 표시 점수는 score_snapshot
→ 계산 이력은 weather_score_logs
→ 비로그인 D-DAY 저장은 불가
```
