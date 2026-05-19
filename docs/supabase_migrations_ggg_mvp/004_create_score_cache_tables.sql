-- 004_create_score_cache_tables.sql
-- ggg MVP TODAY cache and Weather Score logs

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
  created_at timestamptz not null default now(),

  constraint chk_weather_score_log_date_order check (date_to >= date_from)
);
