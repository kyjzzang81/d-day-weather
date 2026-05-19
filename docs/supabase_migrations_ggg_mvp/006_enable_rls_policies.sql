-- 006_enable_rls_policies.sql
-- ggg MVP Row Level Security policies

-- 1. Public read master/reference tables

alter table activity_categories enable row level security;
alter table poi_master enable row level security;
alter table dong_areas enable row level security;

drop policy if exists "public read activity_categories" on activity_categories;
create policy "public read activity_categories"
on activity_categories
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "public read poi_master" on poi_master;
create policy "public read poi_master"
on poi_master
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "public read dong_areas" on dong_areas;
create policy "public read dong_areas"
on dong_areas
for select
to anon, authenticated
using (is_active = true);


-- 2. User-owned tables

alter table user_profiles enable row level security;
alter table user_preferences enable row level security;
alter table user_notification_settings enable row level security;
alter table user_locations enable row level security;
alter table recent_selections enable row level security;
alter table user_dday_events enable row level security;
alter table user_dday_planned_items enable row level security;

-- user_profiles
drop policy if exists "users read own profile" on user_profiles;
create policy "users read own profile"
on user_profiles
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "users insert own profile" on user_profiles;
create policy "users insert own profile"
on user_profiles
for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "users update own profile" on user_profiles;
create policy "users update own profile"
on user_profiles
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "users delete own profile" on user_profiles;
create policy "users delete own profile"
on user_profiles
for delete
to authenticated
using (user_id = auth.uid());

-- user_preferences
drop policy if exists "users manage own preferences" on user_preferences;
create policy "users manage own preferences"
on user_preferences
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- user_notification_settings
drop policy if exists "users manage own notification settings" on user_notification_settings;
create policy "users manage own notification settings"
on user_notification_settings
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- user_locations
drop policy if exists "users manage own locations" on user_locations;
create policy "users manage own locations"
on user_locations
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- recent_selections
drop policy if exists "users manage own recent selections" on recent_selections;
create policy "users manage own recent selections"
on recent_selections
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- user_dday_events
drop policy if exists "users manage own dday events" on user_dday_events;
create policy "users manage own dday events"
on user_dday_events
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- user_dday_planned_items
drop policy if exists "users manage own dday planned items" on user_dday_planned_items;
create policy "users manage own dday planned items"
on user_dday_planned_items
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());


-- 3. Service-role / Edge Function focused tables

alter table dong_weather_cache enable row level security;
alter table weather_score_logs enable row level security;

-- No broad anon/authenticated policies for dong_weather_cache writes.
-- Edge Functions should use service_role for refresh.
-- Optional public read can be added later through a controlled RPC if needed.

-- weather_score_logs is analytics/debug data.
-- MVP: client direct access is not allowed by default.
-- Edge Functions should insert using service_role.

-- Note:
-- Supabase service_role bypasses RLS. Keep service_role key server-side only.
