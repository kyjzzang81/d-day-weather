-- 001_create_master_tables.sql
-- ggg MVP master/reference tables

create extension if not exists pgcrypto;

create table if not exists activity_categories (
  code text primary key,
  display_name text not null,
  activity_profile text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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
