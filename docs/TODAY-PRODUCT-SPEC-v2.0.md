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
├── 위치/시간 헤더
├── 오늘 날씨 Hero
├── 핵심 지표
│   ├── 강수확률
│   ├── 강수량
│   ├── 바람
│   └── 미세먼지
├── 오늘의 흐름
├── 오늘의 추천
│   ├── specific_content
│   └── curated_content
├── 오늘/내일 일정 요약
└── Discover CTA
```

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

# 7. Discover CTA

기본 CTA:

```text
가볼 만한 것 더 보기
```

상황별 CTA:

```text
오늘 가기 좋은 것 보기
비 와도 괜찮은 곳 보기
이번 주말 추천 보기
아이와 갈 곳 보기
```

CTA는 Discover의 날짜/지역/상황을 prefill한다.

---

# 8. 데이터 연동

TODAY payload는 기존 날씨 payload에 LocalContent 추천을 추가한다.

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

# 9. MVP 포함 / 제외

## 포함

```text
현재 위치 기준 날씨
오늘의 흐름
오늘의 추천 LocalContent 카드
specific_content와 curated_content 혼합 노출
콘텐츠 상세 연결
저장 연결
Discover prefill CTA
```

## 제외

```text
개인별 자동 일정 생성
리뷰/메모
지도 기반 추천
복잡한 알림 룰 편집
```
