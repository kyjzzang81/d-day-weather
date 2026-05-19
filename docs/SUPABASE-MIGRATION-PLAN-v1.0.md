# SUPABASE MIGRATION PLAN (MVP)

## Version
**v1.0** — Supabase 신규 테이블 / RLS / Seed 실행 계획

## Document Type
Database Migration / Implementation Plan

## Status
MVP Draft

---

# 1. 문서 목적

이 문서는 ggg MVP 구현을 위해 Supabase PostgreSQL에 추가해야 하는 신규 테이블, 인덱스, RLS 정책, seed 데이터를 어떤 순서로 적용할지 정의한다.

현재 방향은 다음과 같다.

```text
기존 Supabase weather/climate/feature 테이블은 최대한 유지
신규 앱 기능에 필요한 테이블을 추가
RLS는 사용자 데이터 보호 중심으로 적용
activity_categories seed 포함
기존 nearby_places → poi_master 마이그레이션은 Phase 1.5
```

---

# 2. 핵심 결정사항

| 항목 | 결정 |
|---|---|
| Migration Plan 문서 | 생성 |
| SQL 파일 | 생성 |
| RLS SQL | 포함 |
| 기존 테이블 변경 | 최소화 |
| 신규 테이블 추가 | 중심 |
| activity seed | 포함 |
| 기존 `nearby_places` migration | Phase 1.5 |
| score_history 분리 | 제외 |
| 동 단위 과거 기후 테이블 | 제외 |

---

# 3. 전제

## 3-1. 기존 유지 테이블

아래 기존 테이블은 이번 MVP migration에서 직접 변경하지 않는다.

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

## 3-2. 신규 생성 테이블

```text
activity_categories
poi_master
dong_areas
user_profiles
user_preferences
user_notification_settings
user_locations
recent_selections
user_dday_events
user_dday_planned_items
dong_weather_cache
weather_score_logs
```

---

# 4. Migration 파일 구조

생성 SQL 파일은 다음 순서로 실행한다.

```text
supabase/migrations/
├── 001_create_master_tables.sql
├── 002_create_user_tables.sql
├── 003_create_dday_tables.sql
├── 004_create_score_cache_tables.sql
├── 005_create_indexes.sql
├── 006_enable_rls_policies.sql
└── 007_seed_activity_categories.sql
```

현재 산출물에서는 `/mnt/data/supabase_migrations_ggg_mvp/` 폴더에 동일한 파일명을 생성한다.

---

# 5. 실행 순서

## P0-1. Master / Reference Tables

파일:

```text
001_create_master_tables.sql
```

생성 테이블:

```text
activity_categories
poi_master
dong_areas
```

이유:

```text
activity_categories는 POI, D-DAY planned item, user preference에서 참조
poi_master는 DISCOVER 검색과 planned item에서 참조
dong_areas는 TODAY 캐시와 score log에서 참조
```

---

## P0-2. User Base Tables

파일:

```text
002_create_user_tables.sql
```

생성 테이블:

```text
user_profiles
user_preferences
user_notification_settings
user_locations
recent_selections
```

이유:

```text
Supabase Auth 기반 사용자 설정/선호/최근 선택/기본 위치 관리
```

---

## P0-3. D-DAY Tables

파일:

```text
003_create_dday_tables.sql
```

생성 테이블:

```text
user_dday_events
user_dday_planned_items
```

이유:

```text
D-DAY 저장은 로그인 사용자만 가능
planned_items는 DISCOVER POI 저장 시 사용
```

---

## P0-4. Score / Cache Tables

파일:

```text
004_create_score_cache_tables.sql
```

생성 테이블:

```text
dong_weather_cache
weather_score_logs
```

이유:

```text
TODAY 동 단위 예보 캐시
Weather Score Engine 계산 로그
```

---

## P0-5. Indexes

파일:

```text
005_create_indexes.sql
```

생성 인덱스:

```text
dong_areas geohash/city_id
poi_master city/activity/is_active
user_dday_events user/date/status
planned_items event
recent_selections user/time
weather_score_logs user/dday/screen/city
```

---

## P0-6. RLS Policies

파일:

```text
006_enable_rls_policies.sql
```

정책:

```text
Public read:
- activity_categories
- poi_master
- dong_areas

User-owned CRUD:
- user_profiles
- user_preferences
- user_notification_settings
- user_locations
- recent_selections
- user_dday_events
- user_dday_planned_items

Service-role / Edge Function 중심:
- dong_weather_cache
- weather_score_logs
```

주의:

```text
기존 테이블 cities, forecast_weather 등은 현재 운영 정책을 유지한다.
이번 SQL에서는 기존 테이블의 RLS를 변경하지 않는다.
```

---

## P0-7. Seed

파일:

```text
007_seed_activity_categories.sql
```

Seed 대상:

```text
10개 activity category
```

---

# 6. SQL 실행 전 체크리스트

## 6-1. Supabase Extension

`gen_random_uuid()` 사용을 위해 아래 extension이 필요하다.

```sql
create extension if not exists pgcrypto;
```

본 SQL 파일에는 포함되어 있다.

## 6-2. 기존 cities 테이블 확인

아래 컬럼이 존재해야 한다.

```text
cities.id
```

`poi_master`, `dong_areas`, `user_locations`, `user_dday_events`, `weather_score_logs`에서 참조한다.

## 6-3. Supabase Auth 확인

아래 참조를 사용한다.

```text
auth.users(id)
```

---

# 7. RLS 운영 원칙

## 7-1. Public Read Master

마스터 데이터는 익명 사용자도 읽을 수 있다.

```text
activity_categories
poi_master
dong_areas
```

## 7-2. User-owned Data

사용자 데이터는 `auth.uid() = user_id` 조건으로 본인만 접근한다.

```text
user_preferences
user_dday_events
user_notification_settings
...
```

## 7-3. Score Logs

`weather_score_logs`는 클라이언트 직접 조회를 기본 허용하지 않는다.

```text
insert/read는 Edge Function 또는 service_role 중심
사용자 화면에서 직접 노출하지 않음
```

---

# 8. Phase 1.5 이후 Migration 후보

```text
nearby_places → poi_master 마이그레이션
activity_weather_score 10개 활동 기준 재빌드
score_history 분리
D-DAY audit log
dong_weather_cache 최적화
POI full-text search
검색 rank 튜닝
```

---

# 9. 롤백 전략

MVP 초기 migration은 신규 테이블 추가 중심이므로 기존 데이터 영향은 제한적이다.

필요 시 아래 순서로 drop 가능하다.

```text
weather_score_logs
dong_weather_cache
user_dday_planned_items
user_dday_events
recent_selections
user_locations
user_notification_settings
user_preferences
user_profiles
poi_master
dong_areas
activity_categories
```

단, 실제 운영 데이터가 생성된 이후에는 drop 대신 soft migration을 권장한다.

---

# 10. 최종 요약

```text
Migration Plan
→ 기존 weather/climate 테이블은 보존
→ 신규 앱 기능 테이블 추가
→ activity seed 포함
→ 인덱스 추가
→ RLS 정책 적용
→ D-DAY / 알림 / 검색 / score log 구현 기반 완성
```
