-- 007_seed_activity_categories.sql
-- ggg MVP activity category seed

insert into activity_categories (
  code,
  display_name,
  activity_profile,
  sort_order,
  is_active
)
values
  ('beach', '해변', 'outdoor_exposed', 10, true),
  ('hiking', '등산/트레킹', 'outdoor_active', 20, true),
  ('camping', '캠핑', 'outdoor_stay', 30, true),
  ('scenic', '일출/일몰', 'outdoor_exposed', 40, true),
  ('photo', '사진/뷰', 'outdoor_exposed', 50, true),
  ('urban', '피크닉/도시산책', 'outdoor_relax', 60, true),
  ('cafe', '카페/맛집', 'indoor_social', 70, true),
  ('festival', '축제/이벤트', 'outdoor_relax', 80, true),
  ('spa', '온천/리조트', 'indoor_stay', 90, true),
  ('indoor', '전시/문화', 'indoor_visit', 100, true)
on conflict (code) do update set
  display_name = excluded.display_name,
  activity_profile = excluded.activity_profile,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active,
  updated_at = now();
