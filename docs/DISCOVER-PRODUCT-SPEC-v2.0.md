# DISCOVER Product Spec

## Version
**v2.0** - 지역 콘텐츠 탐색 반영본

## Status
MVP Draft

---

# 1. 핵심 변경

DISCOVER는 지역/장소 추천 화면이 아니라 지역 콘텐츠 탐색 화면이다.

```text
추천 단위: LocalContent
위치 정보: LocalContent에 연결된 POI/Place
결과 목록: specific_content + curated_content 혼합
최종 행동: 저장, 날짜 저장, 콘텐츠 상세 진입
```

---

# 2. 화면 역할

사용자가 콘텐츠명, 지역, 날짜, 상황 중 하나 이상을 단서로 가지고 있을 때 날씨 기반 신호를 붙여 가볼 만한 것을 찾게 돕는다.

검색창 placeholder:

```text
지역이나 콘텐츠 검색
```

---

# 3. 검색 목적

## 3-1. 특정 콘텐츠 검색

사용자가 이미 알고 있는 콘텐츠명을 검색한다.

예:

```text
나이키 성수 팝업
파주북소리 축제
헤이리 특정 전시회
금촌 플리마켓
```

결과는 공식명, 기간, 지역, 출처를 명확히 보여준다.

```text
나이키 성수 팝업
팝업 · 성수동 · 6/12~6/30
GOOD · 예보 기준
```

## 3-2. 추천형 탐색

사용자가 날짜, 지역, 상황만 선택한다.

예:

```text
6월 15일 성수에서 볼 만한 것
비 오는 날 파주 추천
아이와 갈 실내 콘텐츠
연인·친구와 볼 만한 전시/팝업
```

결과는 `specific_content`와 `curated_content`를 함께 보여준다.

```text
헤이리마을 전시 보기
ggg 추천 · 헤이리 · 실내
GOOD · 최근 10년 경향 기준
```

---

# 4. Discover 구조

```text
DISCOVER
├── 검색창: 지역이나 콘텐츠 검색
├── 날짜: 오늘 / 이번 주말 / 날짜 선택
├── 상황: 일상 / 액티비티 / 휴식 / 아이와 / 연인·친구
├── 태그 필터
│   ├── 콘텐츠 유형
│   ├── 지역
│   ├── 공간
│   ├── 날씨
│   └── 행동 조건
└── 추천 리스트
    ├── specific_content
    └── curated_content
```

---

# 4-1. 태그 필터 구조

Discover의 필터는 단순 조건 칩이 아니라 LocalContent에 붙는 분류 데이터를 기준으로 한다.

화면 배치:

```text
콘텐츠 유형 = 검색/날짜 영역 아래 가로 캐러셀
지역/공간/날씨/행동 조건 = 날짜 영역 오른쪽 `필터` 버튼 → bottom sheet
```

## 콘텐츠 유형

```text
전체
팝업
축제
공연
마켓
탐방
페어
전시
프로그램
책·도서관
키즈 프로그램
트래킹
등산
런닝
레저스포츠
스포츠 관람
아웃도어 게임
테마 카페
복합문화공간
소품·편집 스토어
```

콘텐츠 유형은 “무엇을 볼지/할지”를 고르는 1차 탐색 축이다. 추후 운영 콘텐츠가 늘어나면 Supabase `content_tags` seed로 추가한다.

유형 캐러셀 상태:

```text
active = 선택된 유형. 배경을 채우지 않고 테두리와 태그명 색상만 강조한다.
unactive = 선택 가능 유형.
none = 현재 날짜/상황/지역/필터 기준으로 콘텐츠가 없는 유형. 뒤쪽으로 정렬하고 비활성 UI로 표시한다.
```

## 지역

지역은 Discover 기본 추천 범위와 사용자의 탐색 범위를 결정한다.

기본값:

```text
내 주변
```

`내 주변`은 사용자의 현재 위치 또는 설정 위치가 매핑된 로컬 권역이다. 예를 들어 현재 위치가 `경기 파주시 금촌동`이면 기본 추천은 금촌 권역을 우선한다. 결과가 부족하면 상위 지역 또는 가까운 권역까지 확장할 수 있다.

지역 필터 예:

```text
내 주변
전체
금촌
운정
문산
헤이리
출판도시
임진각
성수동
```

지역 필터는 `regionLabel` 텍스트 검색이 아니라 `content_regions` / `local_content_regions` 기준으로 동작한다. `regionLabel`은 카드와 상세 표시용이다.

## 공간

```text
실내
실외
실내+실외
```

공간은 콘텐츠가 어디서 진행되는지 쉽게 이해하게 하는 조건이다. `이동형`은 공간 조건으로 만들지 않는다. 탐방, 트래킹, 런닝처럼 움직이는 콘텐츠는 콘텐츠 유형으로 표현한다.

## 날씨

```text
비 오는 날
미세먼지 많음
더운 날
추운 날
바람 센 날
눈 오는 날
```

날씨 태그는 `weatherGoodTags`와 `weatherAvoidTags` 양쪽에 쓰인다.

```text
weatherGoodTags = 이 날씨에 추천하기 좋은 콘텐츠
weatherAvoidTags = 이 날씨에 피하거나 감점할 콘텐츠
```

사용자 화면에서는 `비 오는 날`처럼 자연스러운 문구를 쓰고, 내부 로직은 해당 태그가 추천 가중치인지 회피 조건인지 구분한다.

## 행동 조건

```text
기간 한정
아이와 추천
주차 가능
무료
예약 필요
예약 없이
유모차 가능
반려동물 가능
역 근처
야간 가능
```

행동 조건은 사용자가 바로 갈 수 있는지 판단하는 정보다.

---

# 5. LocalContentCard

필수 필드:

```text
title
contentKind
contentType
regionLabel
placeName optional
dateLabel optional
distanceLabel optional
spaceType
contentTypeTags
spaceTags
weatherGoodTags/weatherAvoidTags
actionTags
grade
basisLabel
verifiedBadges
```

## specific_content UI

```text
나이키 성수 팝업
팝업 · 성수동 · 6/12~6/30
공식
GOOD · 예보 기준
실내 · 기간 한정 · 예약 불필요 · 대기 가능성
```

강조:

```text
실제 이름
일정/기간
운영 주체 또는 출처
```

## curated_content UI

```text
성수 팝업 구경
ggg 추천 · 성수동 · 연인·친구
GOOD · 예보 기준
실내 중심 · 도보 이동 · 카페 연결
```

강조:

```text
추천 상황
행동
날씨와 이동 맥락
```

---

# 6. 콘텐츠 상세 진입

모든 카드 클릭은 콘텐츠 상세로 진입한다.

```text
LocalContentCard
→ /content/:contentId
```

POI가 연결되어 있어도 상세 화면명은 콘텐츠 상세로 본다.

---

# 7. 콘텐츠 상세 구조

```text
대표 이미지
title
contentKind/source badge
contentType
기간/운영시간
장소/지역
날짜 선택
해당 날짜의 신호
날씨 체크
시간별 변화 또는 시간대별 경향
콘텐츠 정보
CTA
```

콘텐츠 정보:

```text
운영 주체
공식 링크
예약 여부
실내/실외
주차/유모차/화장실 등 가능한 경우
```

CTA:

```text
길찾기
공식 페이지
날짜 저장
```

차이:

```text
specific_content
→ 공식 링크/운영 주체/기간 우선

curated_content
→ 추천 이유/기반 장소/대체 가능성 우선
```

---

# 8. 정렬 원칙

```text
1. 선택 날짜에 열려 있거나 가능한 콘텐츠
2. 날씨 신호가 좋은 콘텐츠
3. 지역/거리 적합도
4. 사용자의 상황 선택
5. specific_content와 curated_content 다양성
```

특정 콘텐츠 검색에서는 exact title match와 official/brand/partner 출처를 우선한다.

---

# 9. 이벤트

```text
discover_opened
discover_search_submitted
discover_content_result_viewed
discover_content_card_clicked
discover_filter_changed
discover_date_changed
discover_target_mode_changed
discover_content_saved
discover_content_detail_opened
```

---

# 10. MVP 포함 / 제외

## 포함

```text
지역이나 콘텐츠 검색
날짜 선택
상황 선택
태그 필터
LocalContentCard 결과
specific_content와 curated_content 혼합 노출
콘텐츠 상세 연결
저장 연결
```

## 제외

```text
지도 기반 탐색
사용자 리뷰
복잡한 일정 빌더
여러 날짜 비교표
```
