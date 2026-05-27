-- LocalContent + tag taxonomy foundation
create extension if not exists pgcrypto;

create table if not exists public.local_contents (
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

  poi_id text,
  place_name text,
  city_id text,
  region_label text not null,

  -- Display compatibility. New filtering should use space_type + content tags.
  indoor_outdoor text not null default '실내'
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

alter table public.local_contents
  add column if not exists space_type text not null default 'indoor'
    check (space_type in ('indoor', 'outdoor', 'mixed'));

do $$
begin
  if to_regclass('public.poi_master') is not null
     and not exists (
       select 1
       from pg_constraint
       where conname = 'local_contents_poi_id_fkey'
         and conrelid = 'public.local_contents'::regclass
     ) then
    alter table public.local_contents
      add constraint local_contents_poi_id_fkey
      foreign key (poi_id) references public.poi_master(id);
  end if;

  if to_regclass('public.cities') is not null
     and not exists (
       select 1
       from pg_constraint
       where conname = 'local_contents_city_id_fkey'
         and conrelid = 'public.local_contents'::regclass
     ) then
    alter table public.local_contents
      add constraint local_contents_city_id_fkey
      foreign key (city_id) references public.cities(id);
  end if;
end $$;

create table if not exists public.content_tags (
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

create table if not exists public.local_content_tags (
  content_id text not null references public.local_contents(id) on delete cascade,
  tag_id text not null references public.content_tags(id),

  created_at timestamptz not null default now(),

  primary key (content_id, tag_id)
);

create table if not exists public.user_saved_contents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  content_id text references public.local_contents(id),
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

alter table if exists public.weather_score_logs
  add column if not exists content_id text references public.local_contents(id);

alter table if exists public.recent_selections
  drop constraint if exists recent_selections_selection_type_check;

alter table if exists public.recent_selections
  add constraint recent_selections_selection_type_check
  check (selection_type in ('city', 'poi', 'content'));

create index if not exists idx_local_contents_title
  on public.local_contents (title);

create index if not exists idx_local_contents_city
  on public.local_contents (city_id);

create index if not exists idx_local_contents_type
  on public.local_contents (content_type);

create index if not exists idx_local_contents_space_type
  on public.local_contents (space_type);

create index if not exists idx_local_contents_kind
  on public.local_contents (content_kind);

create index if not exists idx_local_contents_source
  on public.local_contents (content_source);

create index if not exists idx_local_contents_dates
  on public.local_contents (start_date, end_date);

create index if not exists idx_local_contents_active
  on public.local_contents (is_active);

create index if not exists idx_local_contents_poi
  on public.local_contents (poi_id);

create index if not exists idx_content_tags_group_active
  on public.content_tags (group_key, is_active, sort_order);

create index if not exists idx_local_content_tags_tag
  on public.local_content_tags (tag_id, content_id);

create index if not exists idx_local_content_tags_content
  on public.local_content_tags (content_id);

create index if not exists idx_user_saved_contents_user_status
  on public.user_saved_contents (user_id, status);

create index if not exists idx_user_saved_contents_user_target_date
  on public.user_saved_contents (user_id, target_date);

create index if not exists idx_user_saved_contents_content
  on public.user_saved_contents (content_id);

create index if not exists idx_user_saved_contents_created
  on public.user_saved_contents (user_id, created_at desc);

insert into public.content_tags (id, group_key, label, sort_order, is_active)
values
  ('content_type_popup', 'content_type', '팝업', 10, true),
  ('content_type_festival', 'content_type', '축제', 20, true),
  ('content_type_performance', 'content_type', '공연', 30, true),
  ('content_type_market', 'content_type', '마켓', 40, true),
  ('content_type_village_tour', 'content_type', '탐방', 50, true),
  ('content_type_fair', 'content_type', '페어', 60, true),
  ('content_type_exhibition', 'content_type', '전시', 70, true),
  ('content_type_program', 'content_type', '프로그램', 80, true),
  ('content_type_library', 'content_type', '책·도서관', 90, true),
  ('content_type_kids_program', 'content_type', '키즈 프로그램', 100, true),
  ('content_type_trekking', 'content_type', '트래킹', 110, true),
  ('content_type_hiking', 'content_type', '등산', 120, true),
  ('content_type_running', 'content_type', '런닝', 130, true),
  ('content_type_leisure_sports', 'content_type', '레저스포츠', 140, true),
  ('content_type_sports_watching', 'content_type', '스포츠 관람', 150, true),
  ('content_type_outdoor_game', 'content_type', '아웃도어 게임', 160, true),
  ('content_type_theme_cafe', 'content_type', '테마 카페', 170, true),
  ('content_type_culture_complex', 'content_type', '복합문화공간', 180, true),
  ('content_type_select_shop', 'content_type', '소품·편집 스토어', 190, true),

  ('space_indoor', 'space', '실내', 10, true),
  ('space_outdoor', 'space', '실외', 20, true),
  ('space_mixed', 'space', '실내+실외', 30, true),

  ('weather_good_rain', 'weather_good', '비 오는 날', 10, true),
  ('weather_good_dust', 'weather_good', '미세먼지 많음', 20, true),
  ('weather_good_heat', 'weather_good', '더운 날', 30, true),
  ('weather_good_cold', 'weather_good', '추운 날', 40, true),
  ('weather_good_wind', 'weather_good', '바람 센 날', 50, true),
  ('weather_good_snow', 'weather_good', '눈 오는 날', 60, true),

  ('weather_avoid_rain', 'weather_avoid', '비 오는 날', 10, true),
  ('weather_avoid_dust', 'weather_avoid', '미세먼지 많음', 20, true),
  ('weather_avoid_heat', 'weather_avoid', '더운 날', 30, true),
  ('weather_avoid_cold', 'weather_avoid', '추운 날', 40, true),
  ('weather_avoid_wind', 'weather_avoid', '바람 센 날', 50, true),
  ('weather_avoid_snow', 'weather_avoid', '눈 오는 날', 60, true),

  ('action_limited_period', 'action', '기간 한정', 10, true),
  ('action_kid_friendly', 'action', '아이와 추천', 20, true),
  ('action_parking', 'action', '주차 가능', 30, true),
  ('action_free', 'action', '무료', 40, true),
  ('action_reservation_required', 'action', '예약 필요', 50, true),
  ('action_no_reservation', 'action', '예약 없이', 60, true),
  ('action_stroller_friendly', 'action', '유모차 가능', 70, true),
  ('action_pet_friendly', 'action', '반려동물 가능', 80, true),
  ('action_near_station', 'action', '역 근처', 90, true),
  ('action_night_available', 'action', '야간 가능', 100, true)
on conflict (id) do update set
  group_key = excluded.group_key,
  label = excluded.label,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active,
  updated_at = now();

alter table public.local_contents enable row level security;
alter table public.content_tags enable row level security;
alter table public.local_content_tags enable row level security;
alter table public.user_saved_contents enable row level security;

drop policy if exists "public read active local contents" on public.local_contents;
create policy "public read active local contents"
on public.local_contents
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "public read active content tags" on public.content_tags;
create policy "public read active content tags"
on public.content_tags
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "public read local content tags" on public.local_content_tags;
create policy "public read local content tags"
on public.local_content_tags
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.local_contents
    where local_contents.id = local_content_tags.content_id
      and local_contents.is_active = true
  )
);

drop policy if exists "users manage own saved contents" on public.user_saved_contents;
create policy "users manage own saved contents"
on public.user_saved_contents
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());
