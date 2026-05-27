# API / DATA ACCESS SPEC

## Version
**v2.0** - LocalContent / SavedContent 반영본

## Status
MVP Draft

---

# 1. 핵심 결정

API와 데이터 접근의 추천 중심 객체는 `LocalContent`다.

```text
local_contents
→ Discover / Today / Content Detail의 primary source

poi_master
→ LocalContent에 연결되는 위치 정보

user_saved_contents
→ 사용자 저장 primary table

content_tags / local_content_tags
→ Discover 필터, 추천 로직, CRUD 가능한 태그 분류

content_regions / local_content_regions
→ 현재 위치 기반 기본 추천, 지역 필터, 권역 fallback
```

---

# 2. 주요 Edge Function / RPC

```text
get_today_payload
search_local_contents
calculate_discover_recommendations
get_content_detail
save_local_content
update_saved_content_status
calculate_content_weather_signal
log_weather_score
```

| Function | 책임 |
|---|---|
| `get_today_payload` | 현재 위치 날씨와 오늘의 추천 LocalContent 반환 |
| `search_local_contents` | 특정 콘텐츠명, 지역, 태그 조건 검색 |
| `calculate_discover_recommendations` | 날짜/지역/상황/태그/날씨 기준 추천 목록 계산 |
| `get_content_detail` | 콘텐츠 상세와 연결 POI/날씨 신호 반환 |
| `save_local_content` | `user_saved_contents` 생성/갱신 |
| `update_saved_content_status` | wishlist/planned/visited 상태 변경 |
| `calculate_content_weather_signal` | 콘텐츠와 날짜 기준 신호 계산 |
| `log_weather_score` | 계산 로그 저장 |

---

# 3. TODAY Data Access

```text
TODAY 진입
→ GPS 권한 확인
→ get_today_payload 호출
→ Edge Function에서 날씨 payload 생성
→ 현재 위치/날짜에 맞는 local_contents 조회
→ Weather Score Engine으로 콘텐츠별 신호 계산
→ TODAY payload 반환
```

응답에는 기존 날씨 정보와 `recommendedContents`를 포함한다.

```json
{
  "locationLabel": "성수동",
  "grade": "great",
  "metrics": [],
  "dayFlow": [],
  "recommendedContents": []
}
```

---

# 4. DISCOVER Data Access

## 4-1. 특정 콘텐츠 검색

```text
input keyword
→ local_contents.title 우선 검색
→ content_kind/content_source/date range/tag 필터
→ 필요 시 poi_master.display_name 보조 검색
→ 콘텐츠별 날짜 신호 계산
→ LocalContentCard 반환
```

필터 input:

```ts
type SearchLocalContentsInput = {
  query?: string;
  cityId?: string;
  regionId?: string;
  includeNearbyRegions?: boolean;
  targetDate?: string;
  targetMode?: "daily" | "activity" | "rest" | "with_child" | "date_friends";

  tagIds?: string[];
  contentTypeTagIds?: string[];
  spaceTagIds?: string[];
  weatherTagIds?: string[];
  actionTagIds?: string[];
};
```

우선순위:

```text
1. title exact/prefix match
2. official/partner/brand source
3. 선택 날짜에 운영 중
4. 지역 일치 또는 현재 위치 권역 우선
5. is_active = true
```

## 4-2. 추천형 탐색

```text
date + city/region + targetMode + tag filters
→ local_contents 후보 조회
→ region_id가 있으면 local_content_regions join
→ local_content_tags / content_tags join
→ scheduled/temporary 콘텐츠 날짜 필터
→ always/seasonal 콘텐츠 노출 가능 여부 계산
→ weather_good / weather_avoid tags를 날씨 신호 계산에 반영
→ 날씨 신호 계산
→ specific_content와 curated_content를 섞어 반환
```

태그 처리 원칙:

```text
content_type tags = 사용자가 보고 싶은 콘텐츠 종류
space tags = 콘텐츠가 진행되는 공간
weather_good tags = 해당 날씨에 추천 가중치
weather_avoid tags = 해당 날씨에 감점 또는 제외 후보
action tags = 기간 한정, 무료, 아이와 추천, 주차 가능 등 행동 조건
```

지역 처리 원칙:

```text
기본 region = 현재 위치 또는 설정 위치가 매핑된 content_regions.id
내 주변 = 현재 권역 우선 + 결과 부족 시 상위 지역/인접 권역 fallback
전체 = 지역 필터를 적용하지 않음
명시 지역 선택 = 해당 region_id 또는 하위 region_id 기준 필터
region_label = 표시용. 필터 조건으로 사용하지 않음
```

예:

```text
비 오는 날 + 실내
→ indoor space, weather_good rain 콘텐츠 우선
→ outdoor + weather_avoid rain 콘텐츠 감점

더운 날
→ weather_avoid heat가 있는 야외 콘텐츠 감점
→ indoor 또는 weather_good heat 콘텐츠 우선
```

---

# 5. Content Detail Data Access

```text
/content/:contentId
→ get_content_detail(contentId, selectedDate)
→ local_contents 조회
→ poi_id가 있으면 poi_master 조회
→ content_regions / local_content_regions 조회
→ content_tags / local_content_tags 조회
→ 날짜 기준 weather signal 계산
→ related specific_content 또는 linked places 조회
```

`specific_content` 상세는 공식 정보 우선, `curated_content` 상세는 추천 이유와 기반 장소 우선으로 payload를 구성한다.

상세 payload는 태그를 그룹별로 반환한다.

```ts
type ContentDetailTags = {
  contentTypes: ContentTag[];
  spaces: ContentTag[];
  weatherGood: ContentTag[];
  weatherAvoid: ContentTag[];
  actions: ContentTag[];
};
```

---

# 6. SavedContent Data Access

## 6-1. 저장

```text
save_local_content
→ auth check
→ local_contents 존재 확인
→ user_saved_contents upsert
→ status 결정
```

상태 결정:

```text
target_date 있음 -> planned
target_date 없음 -> wishlist
visited_at 있음 -> visited
```

## 6-2. 저장 목록

```text
user_saved_contents
→ status in ('wishlist', 'planned', 'visited')
→ local_contents left join
→ planned는 target_date 우선 정렬
→ wishlist는 created_at desc
```

---

# 7. Search Index

권장 인덱스:

```text
local_contents.title
local_contents.city_id
local_contents.content_type
local_contents.space_type
local_contents.content_kind
local_contents.content_source
local_contents.start_date / end_date
local_contents.is_active
content_regions.is_active / sort_order
local_content_regions.region_id / content_id
content_tags.group_key / is_active / sort_order
local_content_tags.tag_id / content_id
poi_master.display_name
```

PostgreSQL full-text 또는 trigram 검색은 콘텐츠 수가 늘어나는 시점에 도입한다.

---

# 8. Cache Strategy

```text
TODAY weather payload: 30분 TTL
TODAY recommendedContents: 30분 TTL
Discover search results: query/date/filter 기준 짧은 TTL 가능
Content Detail: 콘텐츠 정보는 장기 cache, 날짜 신호는 날짜/예보 갱신 기준 cache
SavedContent: 저장/상태 변경 후 즉시 invalidate
```

---

# 9. RLS / Security

Public read:

```text
cities
activity_categories
poi_master
local_contents active rows
content_tags active rows
local_content_tags
```

User-owned CRUD:

```text
user_saved_contents
user_preferences
user_locations
recent_selections
user_dday_events
```

Service role / Edge Function:

```text
weather cache write
weather_score_logs insert/read analytics
external API calls
```
