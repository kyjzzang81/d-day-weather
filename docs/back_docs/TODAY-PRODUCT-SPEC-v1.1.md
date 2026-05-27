# TODAY Product Spec (MVP)

## Version
**v1.2** — 현재 구현 기준 실시간 TODAY / 선호 활동 / 지표 구조 반영

## Document Type
Product / Feature Specification

## Status
MVP Draft

---

# 1. 변경 요약

## 1-1. v1.0 → v1.1

| 영역 | v1.0 | v1.1 |
|---|---|---|
| 온보딩 연계 | 활동 기본 6개 노출 | 선호 활동 미설정 시 설정 유도 |
| 활동 추천 섹션 | 기본 6개 + 더보기 | 사용자가 설정한 선호 활동만 노출 |
| 선호 활동 설정 | 선택 사항, 별도 정의 미흡 | TODAY CTA + 사이드바에서 변경 가능 |
| 첫 실행 | 온보딩에서 활동 선택 가능성 | 온보딩은 가치 소개 + 위치 설정만 |
| 활동 더보기 | 10개 전체 확장 | TODAY에서는 제외. DISCOVER에서 전체 탐색 |

## 1-2. v1.1 → v1.2

| 영역 | v1.1 | v1.2 / 현재 구현 |
|---|---|---|
| TODAY 데이터 | mock 중심 | `get_today_payload` Edge Function 호출 구조 |
| 위치 처리 | GPS → reverse geocoding 명세 | client geolocation → Edge Function → Nominatim reverse geocoding |
| 날씨 원천 | 추후 확정 | Edge Function에서 Open-Meteo forecast + air-quality 호출 |
| 캐시 | 서버 cache 원칙 | client 30분 localStorage cache + server `dong_weather_cache` 30분 TTL |
| 핵심 지표 | 단일 값 | `지금` + `오늘 최대` 이중 값 |
| 활동 선호 | 1~5개 | 현재 UI는 최대 3개, 기본값 `urban/photo/cafe` |
| 활동 이미지 | 미정 | `assets/activity-icons/optimized/*.webp` 사용 |
| 오류 상태 | 일반 오류 | 위치 오류와 실시간 연결 오류를 분리해 표시 |

---

# 2. 화면 정의

## 화면명
`TODAY`

## 화면 위치
Bottom Tab의 TODAY 탭

## 핵심 역할
> 오늘 현재 위치에서 밖에 나가도 괜찮은지, 무엇을 조심해야 하는지, 사용자가 선호하는 활동 기준으로 어떤 활동이 어울리는지 빠르게 판단하게 하는 화면

---

# 3. 핵심 UX 원칙

## 3-1. 빠른 판단 우선

TODAY는 10~30초 안에 오늘 상태를 이해할 수 있어야 한다.

## 3-2. A+B 혼합 구조

```text
상단: 오늘 전체 외출 판단
중단: 핵심 날씨 지표
하단: 선호 활동별 오늘 추천도
```

## 3-3. 활동 추천은 선호 활동 기반

TODAY는 전체 활동 탐색 화면이 아니다.  
사용자가 설정한 선호 활동만 보여준다.

---

# 4. 화면 전체 구조

```text
TODAY
├── 위치/시간 헤더
│   └── 동/읍/면/리 단위 표시
├── 오늘 판단 Hero
│   └── 행동형 등급 사용
├── 핵심 지표
│   ├── 강수확률
│   ├── 강수량
│   ├── 바람
│   └── 미세먼지
├── 오늘의 흐름
│   ├── 일출
│   ├── 오전
│   ├── 오후
│   ├── 저녁
│   └── 일몰
├── 오늘 어울리는 활동
│   ├── 미설정: 선호 활동 설정 유도
│   └── 설정 완료: 선호 활동만 노출
├── 오늘/내일 D-DAY
│   └── D-0/D-1 일정만 요약
└── DISCOVER CTA
```

---

# 5. 선호 활동 미설정 상태

## 현재 구현 메모

현재 코드(`src/features/activityPreferences/activityPreferenceStore.ts`)는 저장된 값이 없을 때도 기본 선호 활동을 반환한다.

```text
DEFAULT_ACTIVITY_PREFERENCES = ["urban", "photo", "cafe"]
localStorage key = ggg.activityPreferences.v1
```

따라서 현재 구현에서는 첫 진입 시에도 `피크닉/산책`, `사진/뷰`, `카페/맛집`이 표시된다.  
제품 정책상 반드시 미설정 CTA를 보여주려면, 기본값 반환을 제거하고 미설정 상태를 별도로 저장해야 한다.

## 5-1. 노출 조건

```text
user_preferences.activity_preference_set = false
또는
preferred_activity_categories is empty
```

## 5-2. UI

```text
오늘 어울리는 활동

선호 활동을 선택해주세요.
자주 하는 활동을 설정하면
오늘 어떤 활동이 좋은지 알려드릴게요.

[선호 활동 설정하기]
```

## 5-3. CTA

```text
[선호 활동 설정하기]
→ 선호 활동 설정 화면
```

---

# 6. 선호 활동 설정 완료 상태

## 6-1. 노출 조건

```text
activity_preference_set = true
preferred_activity_categories.length >= 1
```

## 6-2. 표시 정책

- 사용자가 선택한 활동만 노출한다.
- 선택 순서대로 노출한다.
- TODAY에서는 전체 활동 더보기를 제공하지 않는다.
- 전체 활동 탐색은 DISCOVER에서 수행한다.

## 6-3. 예시

```text
오늘 어울리는 활동

피크닉/산책
강력추천
비 가능성 낮음 · 바람 약함

카페/맛집
추천
날씨 영향 적음

전시/실내
추천
비가 와도 안정적

사진/뷰
보통
오후 미세먼지 보통
```

---

# 7. 선호 활동 설정 화면 연결

## 7-1. TODAY 진입점

```text
TODAY 활동 섹션
→ 선호 활동 설정하기
```

## 7-2. 사이드바 진입점

```text
사이드바
→ 마이페이지
→ 선호 활동 변경
```

## 7-3. 저장 후 처리

```text
선호 활동 저장
→ /today로 복귀
→ TODAY 활동 추천 섹션 즉시 갱신
```

---

# 8. 활동 카테고리 목록

Weather Score Engine v1.2의 10개 활동 카테고리를 사용한다.

| 코드 | 노출명 |
|---|---|
| beach | 계곡/강 |
| hiking | 등산/트래킹 |
| camping | 테마 탐방 |
| scenic | 일출/일몰 |
| photo | 사진/뷰 |
| urban | 피크닉/산책 |
| cafe | 카페/맛집 |
| festival | 축제/이벤트 |
| spa | 온천/리조트 |
| indoor | 전시/실내 |

아이콘은 아래 경로의 WebP 파일을 사용한다.

```text
assets/activity-icons/optimized/activity-{code}.webp
```

---

# 9. 선호 활동 선택 규칙

| 항목 | 결정 |
|---|---|
| 최소 선택 | 1개 |
| 권장 선택 | 3개 |
| 최대 선택 | 3개 |
| 정렬 | 선택 순서 |
| 우선순위 드래그 | MVP 제외 |
| 스킵 | 현재 UI에서는 별도 스킵 없음 |
| 기본 선택 | `urban`, `photo`, `cafe` |

---

# 10. 위치/시간 헤더

## 10-1. 위치 표시 단위

```text
동 / 읍 / 면 / 리 단위
```

예:

```text
성수동 · 오늘 08:30
탄현면 법흥리 · 오늘 08:30
안덕면 사계리 · 오늘 08:30
```

## 10-2. 내부 처리

```text
client GPS 좌표 획득
→ get_today_payload Edge Function 호출
→ Edge Function에서 reverse geocoding
→ 동/읍/면/리 표시명 생성
→ Open-Meteo forecast + air-quality 호출
→ dong_weather_cache 확인/저장
→ TODAY payload 생성
```

현재 reverse geocoding은 Edge Function의 `_shared/reverseGeocode.ts`에서 Nominatim을 사용한다.

---

# 11. 오늘 판단 Hero

## 11-1. 구성

```text
[오늘 판단 문장]
[행동형 등급]
[핵심 이유 2개]
```

## 11-2. Hero 제외 정보

일출/일몰은 Hero에 포함하지 않는다.  
일출/일몰은 `오늘의 흐름` 섹션에서만 노출한다.

## 11-3. 카피 예시

```text
오늘은 야외 활동하기 좋아요
강력추천

비 가능성 낮음 · 바람 안정적
```

```text
오늘은 실내 활동이 더 좋아요
비추천

강수량이 많고 바람도 강해요
```

---

# 12. 핵심 지표

## 기본 4개

```text
강수확률
강수량
바람
미세먼지
```

## 현재 구현 표시 방식

각 지표는 단일 값이 아니라 `지금`과 `오늘 최대`를 함께 가진다.

```json
{
  "label": "강수확률",
  "current": { "value": "20%", "tone": "great" },
  "peak": { "value": "35%", "tone": "good" },
  "detail": "지금은 비 부담이 낮아요. 오후에는 확률이 조금 올라갈 수 있어요."
}
```

화면 카드에서는 값이 같으면 단일 값만 표시하고, 다르면 `오늘 최대` 보조 값을 함께 표시한다.  
상세 Bottom Sheet에서는 지표별 `지금` / `오늘 최대` / 설명을 함께 보여준다.

## 보조 지표

```text
체감온도
습도
UV
```

---

# 13. 오늘의 흐름

## 구성

```text
오늘의 흐름

🌅 일출 05:18

오전  강력추천
비 낮음 · 바람 약함

오후  보통
15시 이후 바람 증가

저녁  추천
비 가능성 낮음

🌇 일몰 19:42
```

## 시간 구간

| 구간 | 시간 |
|---|---|
| 오전 | 06:00~12:00 |
| 오후 | 12:00~18:00 |
| 저녁 | 18:00~24:00 |

## 상세 보기

`자세히 보기`를 누르면 Bottom Sheet로 06:00~23:00의 1시간 단위 날씨를 표시한다.

```text
시간
요약
grade label
기온
강수확률
바람
미세먼지
```

---

# 14. 활동 상세 Bottom Sheet

## 진입

선호 활동 카드 클릭 시 노출한다.

## 구성

```text
피크닉/산책

오늘은 강력추천이에요.

좋은 이유
- 비 가능성이 낮아요 (10%)
- 바람이 약하고 안정적이에요 (3m/s)

주의할 점
- 오후 UV는 조금 높아요

시간대별 추천
오전 06~12시  강력추천
오후 12~18시  추천
저녁 18~24시  추천

[근처 피크닉 장소 보기]
```

## CTA

```text
근처 {활동} 장소 보기
→ DISCOVER P0/P3
→ 날짜: 오늘
→ 범위: 내 주변
→ 활동: 해당 활동
```

---

# 15. 오늘/내일 D-DAY

## 노출 조건

```text
D-0 일정이 있는 경우
D-1 일정이 있는 경우
```

## UI

```text
오늘의 일정

부산 여행 D-0
오늘 오후 바람이 조금 강해요

[최종 준비 확인]
```

## 일정 없음

D-DAY 섹션은 숨기고, 하단 DISCOVER CTA만 유지한다.

---

# 16. DISCOVER CTA

## 기본 CTA

```text
이번 주말 뭐 하지?
```

## 상황별 CTA

| 조건 | CTA |
|---|---|
| 오늘 날씨 좋음 | 오늘 가기 좋은 곳 보기 |
| 주말 가까움 | 이번 주말 뭐 하지? |
| 비/강풍 | 실내 활동 추천받기 |
| D-DAY 없음 | 다음 일정 찾아보기 |
| 활동 카드 클릭 | 근처 {활동} 장소 보기 |

---

# 17. Empty / Loading / Error

## 현재 구현 Loading

```text
위치와 날씨를 확인하고 있어요.
실내에서는 조금 더 걸릴 수 있어요.
```

## 위치 권한 없음

```text
현재 위치를 확인해주세요.
위치 권한이 꺼져 있어요. 휴대폰 설정에서 이 사이트의 위치를 허용한 뒤 다시 시도해주세요.
지금은 예시 데이터로 화면을 유지하고 있어요.

[다시 불러오기]
```

모바일 앱 내 브라우저에서는 Safari/Chrome으로 열라는 힌트를 추가한다.

## 선호 활동 미설정

```text
선호 활동을 선택해주세요.
자주 하는 활동을 설정하면
오늘 어떤 활동이 좋은지 알려드릴게요.

[선호 활동 설정하기]
```

## 활동별 추천도 계산 실패

```text
오늘의 활동 추천을 준비하지 못했어요.
기본 날씨 정보는 확인할 수 있어요.

[다시 계산]
```

## 날씨 데이터 실패

```text
실시간 날씨 연결을 확인해주세요.
지금은 목업 데이터로 화면을 유지하고 있어요. 잠시 후 다시 시도할 수 있어요.

[다시 불러오기]
```

---

# 18. 데이터 모델 연동

TODAY는 아래 필드를 사용한다.

```json
{
  "preferred_activity_categories": ["urban", "cafe", "indoor"],
  "activity_preference_set": true,
  "default_theme_overlay": "family_kids | null"
}
```

현재 프론트 구현은 Supabase user preference 테이블 대신 localStorage를 사용한다.

```text
activity preferences key: ggg.activityPreferences.v1
today payload cache key: ggg.todayPayload.v1
today payload cache TTL: 30분
cache key 기준: preferred_activity_categories 정렬 문자열
```

---

# 19. 계측 이벤트

```text
today_opened
today_location_resolved
today_location_changed
today_hero_viewed
today_metric_card_viewed
today_time_block_clicked
today_activity_preference_prompt_viewed
today_activity_preference_cta_clicked
today_activity_card_viewed
today_activity_card_clicked
today_dday_card_clicked
today_discover_cta_clicked
today_weather_fetch_failed
```

---

# 20. MVP 포함 / 제외

## 포함

- 동/읍/면/리 단위 위치 표시
- 오늘 판단 Hero
- 핵심 지표 4개 + 지금/오늘 최대 표시
- 오늘의 흐름 + 일출/일몰
- 선호 활동 기본값/설정 화면
- 선호 활동 기반 활동 추천
- 활동 상세 Bottom Sheet
- D-DAY D-0/D-1 연동 자리
- DISCOVER CTA
- Edge Function 기반 실시간 TODAY payload 호출 구조
- 위치/날씨 실패 시 mock fallback

## 제외

- 전체 활동 10개 상시 노출
- 기본 6개 활동 자동 노출
- 활동 우선순위 드래그
- 지도 기반 장소 탐색
- 개인별 weather tolerance 설정
- 골든아워/블루아워 상세 추천

---

# 21. 최종 요약

```text
TODAY
→ 현재 위치 기준 오늘 판단
→ 현재 구현은 기본 선호 활동으로 시작
→ 설정 후 선호 활동만 활동 추천 노출
→ 활동 CTA는 DISCOVER로 연결
→ 실시간 데이터는 get_today_payload Edge Function에서 조립
```
