# Local Content Model Spec

## Version
**v1.0** - 날씨 기반 로컬 콘텐츠 추천 모델

## Status
MVP Draft

---

# 1. 핵심 결정

ggg의 추천 단위는 Place가 아니라 `LocalContent`다.

```text
LocalContent = 사용자가 오늘 또는 특정 날짜에 해볼 만한 지역 콘텐츠
Place/POI = LocalContent에 연결되는 위치 정보
```

Place/POI 개념은 계속 필요하다. 다만 사용자에게 추천하고 저장하는 중심 객체는 장소 자체가 아니라 콘텐츠다.

---

# 2. 콘텐츠 종류

## 2-1. specific_content

실제로 운영 중인 구체 콘텐츠다. 공식명, 운영 주체, 기간, 장소가 명확하다.

예:

```text
나이키 성수 팝업
헤이리마을 특정 전시회
파주북소리 축제
금촌 플리마켓
OO도서관 어린이 프로그램
OO문화재단 공연
마을해설 탐방 프로그램
브랜드 팝업
특정 전시회
특정 축제
```

특징:

- 공식명 `title`이 있다.
- `organizerName`이 있다.
- `startDate`, `endDate`가 있을 수 있다.
- `operatingHours`가 있을 수 있다.
- `officialUrl`이 있을 수 있다.
- `poiId` 또는 `placeName`이 있다.
- 검색 유입의 주요 대상이다.
- 사용자는 이 콘텐츠가 열리는 날짜의 날씨 신호를 확인하러 들어올 수 있다.

## 2-2. curated_content

ggg가 날씨, 날짜, 상황, 지역 자원을 조합해 제안하는 콘텐츠다. 공식명은 없지만 사용자가 행동하기 쉽게 만든 추천이다.

예:

```text
헤이리마을 전시 보기
성수 팝업 구경
비 오는 날 출판도시에서 책 읽기
오전 금촌 중앙공원 산책
아이와 실내 문화공간 가기
연인·친구와 전시 보고 카페 가기
미세먼지 나쁜 날 도서관 가기
```

특징:

- `contentSource = "ggg_curated"`다.
- 여러 `specific_content` 또는 `place`를 묶을 수 있다.
- 날짜가 없는 상시형일 수 있다.
- 날씨, 날짜, 상황에 따라 생성 또는 노출될 수 있다.
- 검색보다 추천 피드에서 주로 발견된다.

---

# 3. TypeScript 타입

```ts
type ContentKind = "specific_content" | "curated_content";

type ContentSource =
  | "official"
  | "partner"
  | "brand"
  | "ggg_curated"
  | "user_submitted";

type ContentType =
  | "place_based"
  | "trail"
  | "exhibition"
  | "festival"
  | "popup"
  | "program"
  | "village_tour"
  | "kids_program"
  | "market"
  | "performance"
  | "library"
  | "cafe"
  | "fair"
  | "trekking"
  | "hiking"
  | "running"
  | "leisure_sports"
  | "sports_watching"
  | "outdoor_game"
  | "theme_cafe"
  | "culture_complex"
  | "select_shop";

type ContentTypeTag =
  | "popup"
  | "festival"
  | "performance"
  | "market"
  | "village_tour"
  | "fair"
  | "exhibition"
  | "program"
  | "library"
  | "kids_program"
  | "trekking"
  | "hiking"
  | "running"
  | "leisure_sports"
  | "sports_watching"
  | "outdoor_game"
  | "theme_cafe"
  | "culture_complex"
  | "select_shop";

type SpaceTag =
  | "indoor"
  | "outdoor"
  | "mixed";

type WeatherConditionTag =
  | "rain"
  | "dust"
  | "heat"
  | "cold"
  | "wind"
  | "snow";

type ActionTag =
  | "limited_period"
  | "kid_friendly"
  | "parking"
  | "free"
  | "reservation_required"
  | "no_reservation"
  | "stroller_friendly"
  | "pet_friendly"
  | "near_station"
  | "night_available";

type RegionTag = string;

type DateType =
  | "always"
  | "scheduled"
  | "seasonal"
  | "temporary";

type LocalContent = {
  id: string;
  title: string;

  contentKind: ContentKind;
  contentSource: ContentSource;
  contentType: ContentType;

  dateType: DateType;
  startDate?: string;
  endDate?: string;
  operatingHours?: string;

  organizerName?: string;
  officialUrl?: string;

  poiId?: string;
  placeName?: string;
  regionLabel: string;
  distanceLabel?: string;

  spaceType: SpaceTag;
  weatherSensitivity: "low" | "medium" | "high";

  targetModes: Array<"daily" | "activity" | "rest" | "with_child" | "date_friends">;

  contentTypeTags: ContentTypeTag[];
  regionTags: RegionTag[];
  spaceTags: SpaceTag[];
  weatherGoodTags: WeatherConditionTag[];
  weatherAvoidTags: WeatherConditionTag[];
  actionTags: ActionTag[];

  verifiedBadges: string[];

  grade?: GradeCode;
  basisLabel?: "예보 기준" | "최근 10년 경향 기준";
};
```

`contentType`은 대표 유형(primary type)으로 유지한다. Discover 필터, 추천 로직, CRUD 가능한 분류 체계는 아래 태그 배열을 기준으로 한다.

```text
contentTypeTags = 콘텐츠의 유형
regionTags = 콘텐츠가 속한 행정/로컬 권역
spaceTags = 콘텐츠가 진행되는 공간
weatherGoodTags = 해당 날씨에 상대적으로 추천하기 좋은 조건
weatherAvoidTags = 해당 날씨에 피하거나 감점해야 하는 조건
actionTags = 사용자가 행동을 결정하는 데 필요한 조건
```

`regionLabel`은 카드와 상세에 보여주는 표시용 문자열이다. 추천/검색/필터링의 기준은 `regionTags` 또는 DB의 `content_regions` / `local_content_regions`를 사용한다.

`spaceTags`는 `indoor`, `outdoor`, `mixed`만 사용한다. 탐방, 트래킹, 런닝처럼 움직이면서 하는 콘텐츠는 `moving` 같은 공간 조건을 만들지 않고 콘텐츠 유형으로 표현한다.

`verifiedBadges`는 카드에 노출할 짧은 표시 문구이며, 검색/추천 필터의 원천 데이터로 사용하지 않는다.

---

# 3-1. 태그 분류

## 콘텐츠 유형 태그

```text
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

추후 콘텐츠 운영 범위가 넓어지면 `content_tags` seed로 추가한다.

## 지역 태그

지역은 단순 표시값이 아니라 추천 범위와 필터를 결정하는 구조화된 권역 데이터다. `regionLabel` 하나로 처리하지 않고, 별도 지역 태그를 둔다.

지역 태그는 두 층으로 관리한다.

```text
행정 지역 = 시/군/구 단위. 예: 경기 파주시, 서울 성동구
로컬 권역 = 사용자가 실제로 이해하는 생활/방문 권역. 예: 금촌, 운정, 문산, 헤이리, 출판도시, 임진각, 성수동
```

사용자 화면의 지역 필터는 로컬 권역 중심으로 보여준다.

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

`내 주변`은 고정 태그가 아니라 현재 위치에서 매핑된 기본 추천 범위다. 예를 들어 현재 위치가 `경기 파주시 금촌동`이면 기본 추천은 `금촌`을 우선하고, 결과가 부족하면 `파주시 전체` 또는 인접 권역으로 확장한다.

하나의 LocalContent는 여러 지역 태그를 가질 수 있다.

```text
파주북소리 축제
→ paju
→ paju_bookcity

헤이리마을 전시 보기
→ paju
→ paju_heyri

오전 금촌 중앙공원 산책
→ paju
→ paju_geumchon
```

## 공간 태그

```text
실내
실외
실내+실외
```

공간 태그는 콘텐츠가 어디서 진행되는지 빠르게 이해하게 하는 정보다. 날씨 적합도 계산에서도 사용한다.

## 날씨 태그

```text
비 오는 날
미세먼지 많음
더운 날
추운 날
바람 센 날
눈 오는 날
```

날씨 태그는 두 방향으로 관리한다.

```text
weatherGoodTags = 이 날씨에 추천하기 좋은 콘텐츠
weatherAvoidTags = 이 날씨에 피하거나 감점할 콘텐츠
```

예:

```text
실내 전시
→ weatherGoodTags: rain, dust, heat, cold

야외 마켓
→ weatherAvoidTags: rain, heat, cold, wind

트래킹
→ weatherAvoidTags: rain, dust, heat, cold, wind, snow
```

## 행동 조건 태그

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

---

# 4. LocalContentCard

## 필수 정보

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

## specific_content 카드

```text
title: 나이키 성수 팝업
subtitle: 팝업 · 성수동 · 6/12~6/30
sourceBadge: 공식 또는 브랜드
signal: GOOD · 예보 기준
badges: 실내, 기간 한정, 예약 불필요, 대기 가능성
```

표시 우선순위:

```text
실제 이름
기간/일정
운영 주체 또는 출처
날씨 신호
저장 CTA
```

## curated_content 카드

```text
title: 성수 팝업 구경
subtitle: ggg 추천 · 성수동 · 연인·친구
sourceBadge: ggg 추천
signal: GOOD · 예보 기준
badges: 실내 중심, 도보 이동, 카페 연결
```

표시 우선순위:

```text
추천 행동
상황/대상
지역
날씨 신호
저장 CTA
```

---

# 5. 사용자 화면 표현

사용자 화면에서 `콘텐츠`라는 단어를 과도하게 쓰지 않는다.

권장 표현:

```text
오늘의 추천
날짜별 추천
가볼 만한 것
지역이나 콘텐츠 검색
저장
예정
가보고 싶어요
다녀왔어요
```

피해야 할 표현:

```text
장소 추천만으로 한정하는 표현
외출 모드
판단 기준
검증 가능한 데이터 기반
예보 전 데이터 보완
실패 없는
완벽한
분위기 좋은
조용한
```

---

# 6. Place/POI 관계

`poi_master`는 장소 마스터로 유지한다.

```text
local_contents.poi_id -> poi_master.id
local_contents.place_name -> POI가 아직 없거나 임시 표기가 필요할 때 사용
```

관계 예:

```text
나이키 성수 팝업
→ LocalContent specific_content
→ poi_id: 성수동 특정 매장 또는 팝업 위치

성수 팝업 구경
→ LocalContent curated_content
→ 여러 specific_content와 POI 후보를 묶을 수 있음
```

---

# 7. 검색 목적

## 7-1. 특정 콘텐츠 검색

사용자가 이미 알고 있는 콘텐츠명을 검색한다.

예:

```text
나이키 성수 팝업
파주북소리 축제
헤이리 특정 전시회
금촌 플리마켓
```

목적:

```text
해당 콘텐츠가 열리는 날짜의 날씨 신호 확인
저장
알림 설정
공식 페이지 확인
```

## 7-2. 추천형 탐색

사용자가 날짜, 지역, 상황만 선택하고 가볼 만한 것을 추천받는다.

예:

```text
6월 15일 성수에서 볼 만한 것
비 오는 날 파주 추천
아이와 갈 실내 콘텐츠
연인·친구와 볼 만한 전시/팝업
```

목적:

```text
날씨와 상황에 맞는 specific_content와 curated_content를 함께 탐색
마음에 드는 항목 저장
날짜를 정해 예정으로 전환
```

---

# 8. Content Detail

콘텐츠 상세는 기존 위치 중심 상세 화면을 확장한 화면이다.

공통 구조:

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

상세 차이:

```text
specific_content
→ 공식 링크, 운영 주체, 기간을 우선 노출

curated_content
→ 추천 이유, 기반 장소, 대체 가능성을 우선 노출
```
