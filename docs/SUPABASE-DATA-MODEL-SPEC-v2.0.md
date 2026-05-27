# SUPABASE DATA MODEL SPEC

## Version
**v2.0** - LocalContent / SavedContent 반영본

## Status
MVP Draft

---

# 1. 핵심 결정

기존 `poi_master`는 장소 마스터로 유지한다. 새 추천 중심 테이블은 `local_contents`다.

```text
poi_master = 장소/위치 정보
local_contents = 추천, 검색, 상세, 저장의 중심 콘텐츠
user_saved_contents = 사용자 저장
```

---

# 2. 유지 테이블

```text
cities
dong_areas
dong_weather_cache
activity_categories
poi_master
user_profiles
user_preferences
user_locations
recent_selections
user_dday_events
user_dday_planned_items
user_notification_settings
weather_score_logs
```

`nearby_places`는 호환/마이그레이션용으로만 유지한다.

---

# 3. 신규 권장 테이블: local_contents

```sql
create table if not exists local_contents (
  id text primary key,
  title text not null,

  content_kind text not null
    check (content_kind in ('specific_content', 'curated_content')),

  content_source text not null
    check (content_source in ('official', 'partner', 'brand', 'ggg_curated', 'user_submitted')),

  content_type text not null
    check (content_type in (
      'place_based',
      'trail',
      'exhibition',
      'festival',
      'popup',
      'program',
      'village_tour',
      'kids_program',
      'market',
      'performance',
      'library',
      'cafe',
      'fair',
      'trekking',
      'hiking',
      'running',
      'leisure_sports',
      'sports_watching',
      'outdoor_game',
      'theme_cafe',
      'culture_complex',
      'select_shop'
    )),

  date_type text not null
    check (date_type in ('always', 'scheduled', 'seasonal', 'temporary')),

  start_date date,
  end_date date,
  operating_hours text,

  organizer_name text,
  official_url text,

  poi_id text references poi_master(id),
  place_name text,
  city_id text references cities(id),
  region_label text not null,

  -- legacy/display compatibility. New filtering should use space_type + content tags.
  indoor_outdoor text not null
    check (indoor_outdoor in ('실내', '실외', '복합')),

  space_type text not null default 'indoor'
    check (space_type in ('indoor', 'outdoor', 'mixed')),

  weather_sensitivity text not null default 'medium'
    check (weather_sensitivity in ('low', 'medium', 'high')),

  target_modes text[] not null default '{}',
  verified_badges text[] not null default '{}',

  image_url text,
  is_active boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

---

# 4. local_contents 인덱스

```sql
create index if not exists idx_local_contents_title
  on local_contents (title);

create index if not exists idx_local_contents_city
  on local_contents (city_id);

create index if not exists idx_local_contents_type
  on local_contents (content_type);

create index if not exists idx_local_contents_kind
  on local_contents (content_kind);

create index if not exists idx_local_contents_source
  on local_contents (content_source);

create index if not exists idx_local_contents_dates
  on local_contents (start_date, end_date);

create index if not exists idx_local_contents_active
  on local_contents (is_active);

create index if not exists idx_local_contents_poi
  on local_contents (poi_id);
```

검색 품질이 필요해지는 시점에는 trigram 또는 full-text index를 추가한다.

---

# 5. 신규 권장 테이블: content_regions / local_content_regions

지역은 `local_contents.region_label` 문자열만으로 필터링하지 않는다. `region_label`은 화면 표시용이며, 추천 범위와 Discover 지역 필터는 `content_regions`와 `local_content_regions`를 기준으로 한다.

## 5-1. content_regions

```sql
create table if not exists content_regions (
  id text primary key,

  label text not null,
  region_type text not null
    check (region_type in ('city', 'district', 'neighborhood', 'destination_area')),

  parent_region_id text references content_regions(id),
  city_id text references cities(id),

  latitude double precision,
  longitude double precision,

  sort_order int not null default 0,
  is_active boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

MVP seed 예:

```text
paju = 파주시
paju_geumchon = 금촌
paju_unjeong = 운정
paju_munsan = 문산
paju_heyri = 헤이리
paju_bookcity = 출판도시
paju_imjingak = 임진각
seoul_seongsu = 성수동
```

## 5-2. local_content_regions

```sql
create table if not exists local_content_regions (
  content_id text not null references local_contents(id) on delete cascade,
  region_id text not null references content_regions(id),

  is_primary boolean not null default false,
  created_at timestamptz not null default now(),

  primary key (content_id, region_id)
);
```

인덱스:

```sql
create index if not exists idx_content_regions_parent
  on content_regions (parent_region_id);

create index if not exists idx_content_regions_active
  on content_regions (is_active, sort_order);

create index if not exists idx_local_content_regions_region
  on local_content_regions (region_id, content_id);

create index if not exists idx_local_content_regions_content
  on local_content_regions (content_id);
```

기본 추천 정책:

```text
1. 현재 위치 또는 선택 위치를 content_regions의 로컬 권역으로 매핑한다.
2. 기본 Discover 필터는 `내 주변`으로 표시한다.
3. 내부 추천은 현재 권역을 우선하고, 결과가 부족하면 상위 지역 또는 인접 권역으로 확장한다.
4. 사용자가 특정 지역을 선택하면 해당 region_id 기준으로 필터링한다.
```

---

# 6. 신규 권장 테이블: content_tags / local_content_tags

Discover 필터, 추천 로직, CRUD 가능한 분류 체계는 `content_tags`와 `local_content_tags`를 기준으로 관리한다. `local_contents.content_type`은 대표 유형(primary type)으로 유지하되, 다중 분류와 조건 필터는 태그 테이블을 사용한다.

## 6-1. content_tags

```sql
create table if not exists content_tags (
  id text primary key,

  group_key text not null
    check (group_key in ('content_type', 'space', 'weather_good', 'weather_avoid', 'action')),

  label text not null,
  description text,

  sort_order int not null default 0,
  is_active boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

Seed 예시:

```text
content_type:
popup, festival, performance, market, village_tour, fair,
exhibition, program, library, kids_program,
trekking, hiking, running, leisure_sports, sports_watching,
outdoor_game, theme_cafe, culture_complex, select_shop

space:
indoor, outdoor, mixed

weather_good / weather_avoid:
rain, dust, heat, cold, wind, snow

action:
limited_period, kid_friendly, parking, free,
reservation_required, no_reservation,
stroller_friendly, pet_friendly, near_station, night_available
```

공간 조건은 `indoor`, `outdoor`, `mixed`만 둔다. 탐방, 트래킹, 런닝처럼 움직이는 성격은 공간 조건이 아니라 콘텐츠 유형으로 표현한다.

## 6-2. local_content_tags

```sql
create table if not exists local_content_tags (
  content_id text not null references local_contents(id) on delete cascade,
  tag_id text not null references content_tags(id),

  created_at timestamptz not null default now(),

  primary key (content_id, tag_id)
);
```

인덱스:

```sql
create index if not exists idx_content_tags_group_active
  on content_tags (group_key, is_active, sort_order);

create index if not exists idx_local_content_tags_tag
  on local_content_tags (tag_id, content_id);

create index if not exists idx_local_content_tags_content
  on local_content_tags (content_id);

create index if not exists idx_local_contents_space_type
  on local_contents (space_type);
```

---

# 7. 신규 권장 테이블: user_saved_contents

```sql
create table if not exists user_saved_contents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  content_id text references local_contents(id),
  title text not null,

  status text not null default 'wishlist'
    check (status in ('wishlist', 'planned', 'visited', 'deleted')),

  target_date date,
  date_label text,

  date_basis text
    check (date_basis in ('forecast', 'historical_trend')),

  basis_label text,

  signal_grade text,
  signal_snapshot jsonb,

  reminder_settings jsonb not null default '{}'::jsonb,

  visited_at date,

  source text not null default 'discover'
    check (source in ('discover', 'content_detail', 'today', 'manual')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

인덱스:

```sql
create index if not exists idx_user_saved_contents_user_status
  on user_saved_contents (user_id, status);

create index if not exists idx_user_saved_contents_user_target_date
  on user_saved_contents (user_id, target_date);

create index if not exists idx_user_saved_contents_content
  on user_saved_contents (content_id);

create index if not exists idx_user_saved_contents_created
  on user_saved_contents (user_id, created_at desc);
```

---

# 8. poi_master 역할

`poi_master`는 삭제하지 않는다.

```text
공간의 이름
주소
좌표
도시 연결
장소 카테고리
기본 이미지
```

`local_contents.poi_id`가 있으면 상세 화면에서 길찾기, 거리, 지도, 주소 정보를 구성한다.

---

# 9. recent_selections 업데이트

`recent_selections.selection_type`은 `content`를 추가하는 방향을 권장한다.

```sql
selection_type text not null
  check (selection_type in ('city', 'poi', 'content'))
```

`target_id`는 `local_contents.id`를 저장할 수 있다.

---

# 10. weather_score_logs 업데이트

콘텐츠 단위 계산 로그를 남기려면 nullable `content_id`를 추가한다.

```sql
alter table weather_score_logs
  add column if not exists content_id text references local_contents(id);
```

`location_type`은 기존 `city`, `poi`, `gps`를 유지하되, 추천 단위는 `content_id`로 연결한다.

---

# 10. RLS 방향

Public read:

```text
local_contents where is_active = true
content_tags where is_active = true
local_content_tags
poi_master
cities
activity_categories
```

User-owned CRUD:

```text
user_saved_contents
user_preferences
user_locations
recent_selections
```

Service role:

```text
weather_score_logs
weather cache
external source refresh
```
