-- 005_create_indexes.sql
-- ggg MVP indexes

create index if not exists idx_activity_categories_active_sort
  on activity_categories (is_active, sort_order);

create index if not exists idx_dong_areas_geohash
  on dong_areas (geohash);

create index if not exists idx_dong_areas_city_id
  on dong_areas (city_id);

create index if not exists idx_dong_areas_name
  on dong_areas (sido, sigungu, dong);

create index if not exists idx_poi_master_city_activity
  on poi_master (city_id, activity_category);

create index if not exists idx_poi_master_active
  on poi_master (is_active);

create index if not exists idx_poi_master_display_name
  on poi_master (display_name);

create index if not exists idx_user_locations_user_default
  on user_locations (user_id, is_default);

create index if not exists idx_recent_selections_user_time
  on recent_selections (user_id, last_selected_at desc);

create index if not exists idx_user_dday_events_user_date
  on user_dday_events (user_id, start_date);

create index if not exists idx_user_dday_events_user_status
  on user_dday_events (user_id, status);

create index if not exists idx_user_dday_events_city_date
  on user_dday_events (city_id, start_date, end_date);

create index if not exists idx_user_dday_planned_items_event
  on user_dday_planned_items (dday_event_id);

create index if not exists idx_user_dday_planned_items_user
  on user_dday_planned_items (user_id);

create index if not exists idx_dong_weather_cache_expires_at
  on dong_weather_cache (expires_at);

create index if not exists idx_weather_score_logs_user_time
  on weather_score_logs (user_id, calculated_at desc);

create index if not exists idx_weather_score_logs_dday_time
  on weather_score_logs (dday_event_id, calculated_at desc);

create index if not exists idx_weather_score_logs_screen_time
  on weather_score_logs (screen, calculated_at desc);

create index if not exists idx_weather_score_logs_city_date
  on weather_score_logs (city_id, date_from, date_to);
