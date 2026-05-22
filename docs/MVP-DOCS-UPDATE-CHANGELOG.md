# ggg MVP Docs Update Changelog

## 2026-05-22 Update
현재 코드 기준 TODAY 실시간 데이터 구조, 선호 활동 구현, Supabase Edge Function/cache 상태 반영

## 업데이트된 문서

1. `TODAY-PRODUCT-SPEC-v1.1.md`
2. `API-DATA-ACCESS-SPEC-v1.1.md`
3. `SUPABASE-DATA-MODEL-SPEC-v1.1.md`
4. `CODEX-PHASE-EXECUTION-PLAN-v1.0.md`
5. `ONBOARDING-ACTIVITY-PREFERENCE-SPEC-v1.0.md`

## 핵심 변경

- TODAY는 `src/features/today/todayPayload.ts`의 typed payload 기반으로 동작
- 프론트는 Supabase Edge Function `get_today_payload`만 호출하고 외부 날씨 API는 직접 호출하지 않음
- `get_today_payload`는 Open-Meteo forecast + air-quality, Nominatim reverse geocoding, `dong_weather_cache`를 사용
- TODAY payload는 client localStorage에 30분 TTL로 cache
- 핵심 날씨 지표는 `지금` + `오늘 최대` 구조로 변경
- 위치 오류와 실시간 날씨 연결 오류를 구분해 표시
- 선호 활동은 현재 localStorage 기반이며 기본값은 `urban`, `photo`, `cafe`
- 활동 선호 UI는 최대 3개 선택으로 구현
- 활동/Discover 이미지는 optimized WebP asset을 사용
- 현재 `dong_weather_cache` migration은 실제 프로젝트 경로 `supabase/migrations/20260519153000_create_today_cache_tables.sql`에 존재
- TODAY 한정 Phase D / Phase I 일부가 구현됨

---

## Update
온보딩 2단계 축소 + TODAY 선호 활동 기반 노출 반영

## 생성/업데이트된 문서

1. `ONBOARDING-ACTIVITY-PREFERENCE-SPEC-v1.0.md`
2. `TODAY-PRODUCT-SPEC-v1.1.md`
3. `DISCOVER-PRODUCT-SPEC-v1.2.md`
4. `D-DAY-Product-Spec-v2.1.md`
5. `ggg-PRD-v2.4-final.md`

## 핵심 변경

- 첫 실행 온보딩은 `가치 소개 → 위치 설정 → TODAY 진입`으로 축소
- 활동 선호 선택은 첫 실행에서 제외
- TODAY 활동 추천은 선호 활동 미설정 시 CTA만 노출
- 선호 활동 설정 후 TODAY에는 선택한 활동만 표시
- 사이드바/마이페이지에 `선호 활동 변경` 추가
- DISCOVER와 D-DAY에서는 선호 활동을 우선 노출하되 전체 활동은 유지
- 알림 권한은 첫 D-DAY 저장 직후 요청
