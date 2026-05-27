-- Region taxonomy for LocalContent Discover filters and nearby defaults.

create table if not exists public.content_regions (
  id text primary key,

  label text not null,
  region_type text not null
    check (region_type in ('city', 'district', 'neighborhood', 'destination_area')),

  parent_region_id text references public.content_regions(id),
  city_id text,

  latitude double precision,
  longitude double precision,

  sort_order int not null default 0,
  is_active boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
begin
  if to_regclass('public.cities') is not null
     and not exists (
       select 1
       from pg_constraint
       where conname = 'content_regions_city_id_fkey'
         and conrelid = 'public.content_regions'::regclass
     ) then
    alter table public.content_regions
      add constraint content_regions_city_id_fkey
      foreign key (city_id) references public.cities(id);
  end if;
end $$;

create table if not exists public.local_content_regions (
  content_id text not null references public.local_contents(id) on delete cascade,
  region_id text not null references public.content_regions(id),

  is_primary boolean not null default false,
  created_at timestamptz not null default now(),

  primary key (content_id, region_id)
);

create index if not exists idx_content_regions_parent
  on public.content_regions (parent_region_id);

create index if not exists idx_content_regions_active
  on public.content_regions (is_active, sort_order);

create index if not exists idx_local_content_regions_region
  on public.local_content_regions (region_id, content_id);

create index if not exists idx_local_content_regions_content
  on public.local_content_regions (content_id);

insert into public.content_regions (
  id,
  label,
  region_type,
  parent_region_id,
  latitude,
  longitude,
  sort_order,
  is_active
)
values
  ('paju', '파주시', 'city', null, 37.7599, 126.7802, 10, true),
  ('paju_geumchon', '금촌', 'neighborhood', 'paju', 37.7598, 126.7755, 20, true),
  ('paju_unjeong', '운정', 'neighborhood', 'paju', 37.7257, 126.7517, 30, true),
  ('paju_munsan', '문산', 'neighborhood', 'paju', 37.8567, 126.7850, 40, true),
  ('paju_heyri', '헤이리', 'destination_area', 'paju', 37.7875, 126.6977, 50, true),
  ('paju_bookcity', '출판도시', 'destination_area', 'paju', 37.7088, 126.6872, 60, true),
  ('paju_imjingak', '임진각', 'destination_area', 'paju', 37.8893, 126.7400, 70, true),
  ('seoul_seongsu', '성수동', 'neighborhood', null, 37.5446, 127.0557, 80, true)
on conflict (id) do update set
  label = excluded.label,
  region_type = excluded.region_type,
  parent_region_id = excluded.parent_region_id,
  latitude = excluded.latitude,
  longitude = excluded.longitude,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active,
  updated_at = now();

with region_map(content_id, region_id, is_primary) as (
  values
    ('mock_nike_seongsu_popup', 'seoul_seongsu', true),
    ('mock_seongsu_popup_walk', 'seoul_seongsu', true),

    ('mock_heyri_kimwhanki_exhibition', 'paju', false),
    ('mock_heyri_kimwhanki_exhibition', 'paju_heyri', true),
    ('mock_heyri_theme_cafe', 'paju', false),
    ('mock_heyri_theme_cafe', 'paju_heyri', true),

    ('mock_paju_booksori_festival', 'paju', false),
    ('mock_paju_booksori_festival', 'paju_bookcity', true),
    ('mock_rainy_bookcity_reading', 'paju', false),
    ('mock_rainy_bookcity_reading', 'paju_bookcity', true),

    ('mock_geumchon_flea_market', 'paju', false),
    ('mock_geumchon_flea_market', 'paju_geumchon', true),
    ('mock_paju_library_kids_program', 'paju', false),
    ('mock_paju_library_kids_program', 'paju_geumchon', true),
    ('mock_geumchon_morning_run', 'paju', false),
    ('mock_geumchon_morning_run', 'paju_geumchon', true),

    ('mock_paju_leisure_sports', 'paju', false),
    ('mock_paju_leisure_sports', 'paju_imjingak', true)
)
insert into public.local_content_regions (content_id, region_id, is_primary)
select content_id, region_id, is_primary
from region_map
where exists (
  select 1
  from public.local_contents
  where local_contents.id = region_map.content_id
)
on conflict (content_id, region_id) do update set
  is_primary = excluded.is_primary;

alter table public.content_regions enable row level security;
alter table public.local_content_regions enable row level security;

drop policy if exists "public read active content regions" on public.content_regions;
create policy "public read active content regions"
on public.content_regions
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "public read local content regions" on public.local_content_regions;
create policy "public read local content regions"
on public.local_content_regions
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.local_contents
    where local_contents.id = local_content_regions.content_id
      and local_contents.is_active = true
  )
);
