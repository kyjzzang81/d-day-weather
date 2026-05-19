-- 003_create_dday_tables.sql
-- ggg MVP D-DAY event tables

create table if not exists user_dday_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  start_date date not null,
  end_date date not null,
  city_id text not null references cities(id),
  display_location text not null,
  activity_categories text[] not null default '{}',
  primary_activity_category text references activity_categories(code),
  activity_profiles text[] not null default '{}',
  theme_overlay text check (theme_overlay in ('family_kids')),
  source text not null default 'manual' check (source in ('manual', 'discover')),
  score_snapshot jsonb,
  notification_settings jsonb not null default '{}'::jsonb,
  current_stage text,
  status text not null default 'active' check (status in ('active', 'completed', 'deleted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint chk_user_dday_date_order check (end_date >= start_date),
  constraint chk_user_dday_max_14_days check (end_date <= start_date + interval '13 days'),
  constraint chk_user_dday_activity_count check (
    array_length(activity_categories, 1) between 1 and 3
  )
);

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
