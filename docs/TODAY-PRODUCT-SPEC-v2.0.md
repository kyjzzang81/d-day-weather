# TODAY Product Spec

## Version
**v2.0** - 오늘의 추천과 LocalContent 연결 반영본

## Status
MVP Draft

---

# 1. 핵심 변경

TODAY는 현재 위치의 날씨 상태를 보여주는 화면에서 한 걸음 확장해, 오늘 바로 해볼 만한 로컬 콘텐츠를 함께 제안한다.

사용자 화면 표현:

```text
오늘의 추천
가볼 만한 것
저장
```

내부 추천 단위:

```text
LocalContent
```

---

# 2. 화면 역할

```text
현재 위치 기준으로 오늘 날씨 신호를 빠르게 확인하고,
그 날씨에 맞는 로컬 콘텐츠를 발견하게 한다.
```

Place/POI는 위치 보조 정보이며, TODAY 카드의 중심은 `LocalContent`다.

---

# 3. 화면 구조

```text
TODAY
├── Header
│   ├── 현재 위치
│   ├── 데이터 기준 시각 + 새로고침
│   ├── 상황 선택
│   ├── 알림
│   └── 마이페이지
├── Hero Signal Card
│   ├── signal grade
│   ├── 상황별 판단 문구
│   └── 날씨 그래픽
├── 날씨 체크
│   └── 상황별 핵심 지표 4개
├── 오늘 흐름
├── 오늘의 추천
│   ├── specific_content
│   └── curated_content
└── 더보기 버튼
```

---

# 3-1. Header 정책

Header는 Home, Discover, Saved, Detail, 설정성 화면에서 같은 레이아웃을 사용한다.

Home Header 구성:

```text
현재 위치 label
updatedAtLabel
새로고침 icon
상황 선택 dropdown
알림 icon
마이페이지 icon
```

새로고침 동작:

```text
Header updatedAtLabel 오른쪽 새로고침
→ Today payload cache 무시
→ get_today_payload 재호출
```

MVP에서는 전역 Sidebar Drawer를 사용하지 않는다. Header 오른쪽의 마이페이지 아이콘은 `/mypage`로 직접 이동한다.

---

# 3-2. Data Cache 정책

TODAY payload는 `localStorage` cache를 사용한다.

```text
key: ggg.todayPayload.v1
TTL: 1시간
```

동작:

```text
TODAY 진입
→ 1시간 이내 cache가 있으면 cache 사용
→ cache가 없거나 만료되면 현재 위치 확인 후 get_today_payload 호출

사용자 수동 새로고침
→ cache 삭제
→ get_today_payload 재호출
```

fallback mock 데이터는 실제 최신 시간처럼 보이지 않게 `예시 데이터 기준`으로 표시한다.

---

# 4. 오늘의 추천

TODAY의 추천 섹션은 선호 활동만 보여주는 구조에서 LocalContent 추천 구조로 확장한다.

노출 대상:

```text
현재 위치 또는 선택 지역과 가까운 LocalContent
오늘 운영 중이거나 오늘 추천 가능한 LocalContent
날씨 신호가 있는 LocalContent
```

예:

```text
오늘의 추천

성수 팝업 구경
ggg 추천 · 성수동 · 연인·친구
GOOD · 예보 기준
실내 중심 · 도보 이동

나이키 성수 팝업
팝업 · 성수동 · 6/12~6/30
GOOD · 예보 기준
실내 · 기간 한정
```

---

# 5. specific_content와 curated_content

## specific_content

오늘 운영 중이거나 가까운 날짜에 운영되는 실제 콘텐츠다.

표시 우선순위:

```text
공식명
기간/운영시간
장소/지역
출처 badge
날씨 신호
```

## curated_content

날씨, 상황, 지역 자원을 조합해 ggg가 제안하는 추천이다.

표시 우선순위:

```text
행동형 제목
상황/대상
지역
추천 이유
날씨 신호
```

---

# 6. 카드 액션

```text
카드 탭
→ 콘텐츠 상세

저장
→ SavedContent 생성 또는 상태 변경

날짜 저장
→ target_date = today
→ status = planned
```

사용자 화면에서는 위치 중심 저장 표현 대신 `저장`으로 표기한다.

---

# 7. 상황 조건 반영

Home Header의 상황 선택은 Hero와 오늘의 추천, 날씨 체크에 반영된다.

상황 옵션:

```text
일상
액티비티
휴식
아이와
연인·친구
```

Hero 문구는 `grade`와 `situation`을 함께 반영한다.

```text
일상: 오늘은 무난해요
액티비티: 움직이기 좋은 흐름이에요
휴식: 천천히 쉬기 괜찮아요
아이와: 아이와 움직이기 괜찮아요
연인·친구: 함께 보기 좋은 날이에요
```

오늘의 추천은 상황별 `targetModes` 기준으로 필터/정렬한다.

---

# 8. 날씨 체크

날씨 체크는 Hero 결론의 근거를 보여준다. 모든 상황에서 같은 지표를 고정하지 않고, 상황별로 먼저 확인해야 하는 4개 지표를 보여준다.

| 상황 | 날씨 체크 지표 |
|---|---|
| 일상 | 비 / 바람 / 먼지 / 체감 |
| 액티비티 | 비 / 바람 / 자외선 / 체감 |
| 휴식 | 먼지 / 습도 / 체감 / 비 |
| 아이와 | 비 / 먼지 / 체감 / 바람 |
| 연인·친구 | 비 / 바람 / 체감 / 먼지 |

표기 원칙:

```text
label
value
status label
```

먼지는 value와 status를 중복하지 않는다.

```text
좋음 / 좋음  (X)
좋음 / 외출 가능  (O)
보통 / 무난  (O)
나쁨 / 마스크 체크  (O)
```

날씨 체크 그래픽 asset:

```text
assets/weather_check_icons/optimized/weather-check-rain-*.png
assets/weather_check_icons/optimized/weather-check-wind-*.png
assets/weather_check_icons/optimized/weather-check-dust-*.png
assets/weather_check_icons/optimized/weather-check-feels-like-*.png
assets/weather_check_icons/optimized/weather-check-uv-*.png
assets/weather_check_icons/optimized/weather-check-humidity-*.png
```

---

# 9. 하단 더보기

Home 하단에는 큰 Discover CTA 카드를 두지 않는다. `오늘의 추천` 아래에 작은 회색 `더보기` 버튼만 둔다.

```text
[더보기]
→ /discover
```

---

# 10. 데이터 연동

TODAY payload는 기존 `get_today_payload` 호출 구조를 유지한다. 현재 프론트 MVP에서는 LocalContent 추천을 `mockLocalContents`에서 상황별로 필터링한다.

```json
{
  "source": "live",
  "locationLabel": "성수동",
  "updatedAtLabel": "5월 26일 (화) 09:30 기준",
  "grade": "great",
  "metrics": [],
  "dayFlow": [],
  "recommendedContents": [
    {
      "id": "content_seongsu_popup_walk",
      "title": "성수 팝업 구경",
      "contentKind": "curated_content",
      "contentType": "popup",
      "regionLabel": "성수동",
      "indoorOutdoor": "복합",
      "grade": "great",
      "basisLabel": "예보 기준",
      "verifiedBadges": ["실내 중심", "도보 이동"]
    }
  ]
}
```

---

# 11. MVP 포함 / 제외

## 포함

```text
현재 위치 기준 날씨
1시간 localStorage cache
수동 새로고침
상황별 Hero 문구
상황별 날씨 체크
오늘 흐름
오늘의 추천 LocalContent 카드
specific_content와 curated_content 혼합 노출
콘텐츠 상세 연결
저장 연결
더보기 버튼으로 Discover 연결
```

## 제외

```text
개인별 자동 일정 생성
리뷰/메모
지도 기반 추천
복잡한 알림 룰 편집
```
