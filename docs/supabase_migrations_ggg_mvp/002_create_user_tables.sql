-- 002_create_user_tables.sql
-- ggg MVP user/profile/preference/location/recent tables

create table if not exists user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  email text,
  auth_provider text check (auth_provider in ('google', 'apple', 'kakao')),
  profile_image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists user_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  preferred_activity_categories text[] not null default '{}',
  activity_preference_set boolean not null default false,
  default_theme_overlay text check (default_theme_overlay in ('family_kids')),
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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

create unique index if not exists uq_recent_selections_user_target
  on recent_selections (user_id, selection_type, target_id);
