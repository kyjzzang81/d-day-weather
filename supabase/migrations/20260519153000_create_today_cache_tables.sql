-- TODAY cache tables for Edge Function
create table if not exists public.dong_areas (
  id text primary key,
  sido text not null,
  sigungu text not null,
  dong text not null,
  display_name text not null,
  lat double precision not null,
  lon double precision not null,
  geohash text,
  city_id text references public.cities(id),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.dong_weather_cache (
  dong_area_id text primary key references public.dong_areas(id),
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

create index if not exists idx_dong_areas_geohash
  on public.dong_areas (geohash);

create index if not exists idx_dong_areas_city_id
  on public.dong_areas (city_id);

create index if not exists idx_dong_areas_name
  on public.dong_areas (sido, sigungu, dong);

create index if not exists idx_dong_weather_cache_expires_at
  on public.dong_weather_cache (expires_at);

alter table public.dong_areas enable row level security;
alter table public.dong_weather_cache enable row level security;

drop policy if exists "public read dong_areas" on public.dong_areas;
create policy "public read dong_areas"
on public.dong_areas
for select
to anon, authenticated
using (is_active = true);
