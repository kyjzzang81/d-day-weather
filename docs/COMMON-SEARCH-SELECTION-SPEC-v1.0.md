# COMMON SEARCH & SELECTION Product Spec (MVP)

## Version
**v1.0** — 공통 검색 / 선택 정책

## Document Type
Product / UX Specification

## Status
MVP Draft

---

# 1. 문서 목적

이 문서는 ggg 앱에서 공통으로 사용하는 **검색 / 선택 정책**을 정의한다.

ggg에서는 여러 화면에서 검색과 선택이 반복된다.

```text
DISCOVER → 장소/지역 검색
D-DAY 새로 만들기 → 도시/지역 선택
위치 변경 → 동/읍/면/리 검색
TODAY 활동 카드 → DISCOVER prefill
활동 선택 → 활동 카테고리 선택
```

다만 모든 검색을 하나의 화면으로 통합하지 않는다.  
검색 목적이 화면마다 다르기 때문에, 공통 컴포넌트를 사용하되 **검색 대상과 결과 타입은 화면별로 제한**한다.

---

# 2. 핵심 결정사항

| 항목 | 결정 |
|---|---|
| DISCOVER P1 검색 결과 | 지역 + POI |
| 활동 검색 | MVP 제외 |
| 활동 선택 방식 | 10개 활동 카테고리 칩 선택 |
| 최근 기록 | 최근 검색어가 아니라 최근 선택 저장 |
| DISCOVER POI 검색 | MVP 포함 |
| D-DAY 직접 입력 POI 검색 | MVP 제외 |
| 위치 변경 POI 검색 | MVP 제외 |
| 검색 결과 없음 | 공통 Empty 문구 사용 |
| 검색 결과 정렬 | 정확도 → 대표성/거리/최근 |

---

# 3. 검색 유형 분류

MVP에서 검색은 4종류로 나눈다.

| 검색 유형 | 사용 화면 | 검색 대상 |
|---|---|---|
| 위치 검색 | TODAY / 온보딩 / 설정 | 동·읍·면·리, 시군구 |
| 지역 검색 | D-DAY 새로 만들기 | 도시, 시군구, 동네 |
| 장소/지역 검색 | DISCOVER P1 | 지역 + POI |
| 활동 선택 | DISCOVER / D-DAY | 활동 카테고리 10개 |

---

# 4. 공통 검색 원칙

## 4-1. 화면 목적에 맞게 검색 대상을 제한한다

예:

```text
D-DAY 직접 입력 = 지역/도시 중심
DISCOVER = 지역 + POI 가능
위치 변경 = 행정구역 중심
활동 선택 = 카테고리 칩 선택
```

## 4-2. 검색 결과는 타입별로 구분한다

검색 결과는 사용자가 결과의 성격을 이해할 수 있도록 섹션을 나누어 표시한다.

예:

```text
검색어: 성수

지역
- 성수동
- 성동구

장소
- 서울숲
- 성수 카페거리
```

## 4-3. 활동은 자유 검색하지 않는다

활동은 Weather Score Engine의 10개 활동 카테고리에 정확히 매핑되어야 한다.  
MVP에서는 검색창 대신 칩 선택 UI를 사용한다.

---

# 5. 화면별 검색 정책

## 5-1. 위치 변경 / 지역 선택 검색

### 사용 화면

```text
온보딩 Step 2
TODAY 위치 변경
설정 → 위치 설정
DISCOVER 내 주변 위치 기준
```

### 검색 대상

```text
시/도
시/군/구
동/읍/면/리
```

### 제외

```text
POI
활동
상호명
카페/식당/관광지
```

### 결과 예시

```text
검색 결과

동/읍/면/리
성수동
서울특별시 성동구

시/군/구
성동구
서울특별시
```

### 선택 후

```text
선택 위치
→ location context 생성
→ TODAY / DISCOVER / 설정으로 반환
```

---

## 5-2. D-DAY 새로 만들기 지역 검색

### 사용 화면

```text
D-DAY 새로 만들기
→ 어디로 가시나요?
```

### 검색 대상

```text
시/도
시/군/구
동/읍/면/리
대표 도시/지역
```

### 제외

```text
POI
구체 장소
카페/식당/관광지
```

### 이유

D-DAY 직접 입력은 빠른 일정 등록이 목적이다.  
구체 장소 탐색과 POI 선택은 DISCOVER의 역할이다.

### UI 예시

```text
어디로 가시나요?

[도시나 지역 검색]

추천 지역
[부산] [제주] [강릉] [경주] [여수]

검색 결과
부산
부산광역시

해운대구
부산광역시

성수동
서울특별시 성동구
```

### 선택 후

```text
선택 지역
→ D-DAY form.location에 prefill
→ D-DAY 새로 만들기 폼으로 복귀
```

---

## 5-3. DISCOVER P1 장소/지역 검색

### 사용 화면

```text
DISCOVER
→ 장소는 정했어요
→ 어디로 가고 싶나요?
```

### 검색 대상

```text
지역
POI
테마형 장소
```

### 결과 섹션

```text
지역
- 제주도
- 부산
- 강릉

장소
- 서울숲
- 광안리해수욕장
- 국립현대미술관
```

### 활동은 섞지 않음

DISCOVER P1 검색 결과에는 활동을 섞지 않는다.

이유:

- P1의 사용자 상태는 “장소는 정했어요”다.
- 장소 검색 중 활동까지 섞이면 플로우가 흐려진다.
- 활동 선택은 지역 선택 후 별도 단계에서 처리한다.

### 지역 선택 후

```text
지역 선택
→ 활동 선택 화면으로 이동
```

### POI 선택 후

```text
POI 선택
→ category 기반 activity_profile 자동 추론
→ 추천 시기 결과 화면
```

---

## 5-4. 활동 선택

### 사용 화면

```text
DISCOVER P1 지역 선택 후
DISCOVER P2 활동 선택
D-DAY 새로 만들기 활동 선택
선호 활동 설정 화면
```

### 방식

검색창을 두지 않고, 활동 카테고리 칩을 사용한다.

### 활동 카테고리

```text
해변
등산/트레킹
캠핑
일출/일몰
사진/뷰
피크닉/도시산책
카페/맛집
축제/이벤트
온천/리조트
전시/문화
```

### 선호 활동 설정 사용자

```text
활동 선택

선호 활동
[피크닉/도시산책] [카페/맛집]

전체 활동
[해변]
[등산/트레킹]
[캠핑]
[일출/일몰]
[사진/뷰]
[피크닉/도시산책]
[카페/맛집]
[축제/이벤트]
[온천/리조트]
[전시/문화]
```

### 선호 활동 미설정 사용자

```text
활동 선택

전체 활동
[해변]
[등산/트레킹]
[캠핑]
[일출/일몰]
[사진/뷰]
[피크닉/도시산책]
[카페/맛집]
[축제/이벤트]
[온천/리조트]
[전시/문화]
```

### MVP 제외

```text
활동 자유 검색
활동 태그 검색
활동 자동완성
```

---

# 6. 검색 결과 정렬 규칙

## 6-1. 공통 정렬 우선순위

```text
1. 정확한 이름 매칭
2. 시작 문자열 매칭
3. 인기/대표 지역 또는 장소
4. 현재 위치와의 거리
5. 최근 선택 이력
```

## 6-2. 화면별 정렬 우선

| 화면 | 정렬 우선 |
|---|---|
| 위치 변경 | 정확도 → 거리 → 최근 위치 |
| D-DAY 지역 선택 | 정확도 → 대표 지역 → 최근 선택 |
| DISCOVER 장소 검색 | 정확도 → 인기/대표성 → 거리 |
| 활동 선택 | 선호 활동 → 전체 활동 고정 순서 |

## 6-3. 위치 권한이 없는 경우

현재 위치와의 거리 정렬은 제외한다.

---

# 7. 최근 선택

## 7-1. 원칙

MVP에서는 검색어 자체가 아니라 **최근 선택한 결과**를 저장한다.

## 7-2. 저장 대상

```text
최근 위치
최근 지역
최근 DISCOVER 대상
```

## 7-3. 저장하지 않는 것

```text
활동 검색어
오타 검색어
빈 검색어
검색만 하고 선택하지 않은 키워드
```

## 7-4. 최대 저장 개수

| 유형 | 최대 개수 |
|---|---|
| 최근 위치 | 5개 |
| 최근 지역 | 5개 |
| 최근 DISCOVER 대상 | 5개 |

## 7-5. UI 예시

```text
최근 선택

[성수동]
[부산]
[서울숲]
[광안리해수욕장]
```

---

# 8. 추천 검색어

검색창 진입 직후, 입력값이 없는 상태에서는 추천 검색어 또는 추천 지역을 보여준다.

## 8-1. 위치 변경

```text
추천 지역

[현재 위치 사용]
[성수동]
[제주 안덕면]
```

## 8-2. D-DAY 새로 만들기

```text
추천 지역

[부산]
[제주]
[강릉]
[경주]
[여수]
```

## 8-3. DISCOVER

```text
추천 검색

[제주]
[서울숲]
[광안리해수욕장]
[강릉]
[경주]
```

---

# 9. 검색 결과 없음

공통 Empty 문구를 사용한다.

## 9-1. 지역/위치 검색 결과 없음

```text
검색 결과가 없어요.
다른 지역명으로 검색해보세요.

예: 성수동, 부산, 제주 안덕면
```

## 9-2. DISCOVER POI 검색 결과 없음

```text
검색 결과가 없어요.
다른 지역명이나 장소명으로 검색해보세요.

예: 서울숲, 광안리해수욕장, 국립현대미술관
```

---

# 10. 선택 후 Prefill 규칙

## 10-1. 위치 변경에서 선택

```text
선택 위치
→ TODAY location context 업데이트
→ TODAY 재계산
```

## 10-2. D-DAY 새로 만들기에서 선택

```text
선택 지역
→ D-DAY form.location에 prefill
→ D-DAY 새로 만들기 폼으로 복귀
```

## 10-3. DISCOVER P1에서 지역 선택

```text
지역 선택
→ Activity 선택 화면으로 이동
```

## 10-4. DISCOVER P1에서 POI 선택

```text
POI 선택
→ category 기반 activity_profile 자동 추론
→ 추천 시기 결과 화면
```

## 10-5. TODAY 활동 카드에서 DISCOVER 진입

```text
활동 prefill
날짜 = 오늘
범위 = 내 주변
→ DISCOVER 결과
```

---

# 11. 검색 결과 데이터 모델

## 11-1. 공통 search_result

```json
{
  "id": "kr_seoul_seongdong_seongsu",
  "type": "region | location | poi | activity",
  "display_name": "성수동",
  "subtitle": "서울특별시 성동구",
  "category_code": null,
  "activity_category": null,
  "lat": 37.5446,
  "lng": 127.0559,
  "weather_grid_id": "string",
  "source": "location_master | poi_master | activity_master"
}
```

## 11-2. Region 예시

```json
{
  "id": "kr_busan",
  "type": "region",
  "display_name": "부산",
  "subtitle": "부산광역시",
  "admin_level": "sido",
  "lat": 35.1796,
  "lng": 129.0756,
  "weather_grid_id": "string",
  "source": "location_master"
}
```

## 11-3. Location 예시

```json
{
  "id": "kr_seoul_seongdong_seongsu",
  "type": "location",
  "display_name": "성수동",
  "subtitle": "서울특별시 성동구",
  "admin_level": "dong",
  "lat": 37.5446,
  "lng": 127.0559,
  "weather_grid_id": "string",
  "source": "location_master"
}
```

## 11-4. POI 예시

```json
{
  "id": "poi_seoul_forest",
  "type": "poi",
  "display_name": "서울숲",
  "subtitle": "서울특별시 성동구 · 공원",
  "category_code": "category_nature_urban_park",
  "activity_category": "urban",
  "lat": 37.5444,
  "lng": 127.0374,
  "source": "poi_master"
}
```

## 11-5. Activity 예시

활동은 검색 결과에는 포함하지 않지만, 선택 UI에서는 동일한 모델을 사용할 수 있다.

```json
{
  "id": "activity_urban",
  "type": "activity",
  "display_name": "피크닉/도시산책",
  "activity_category": "urban",
  "activity_profile": "outdoor_relax",
  "source": "activity_master"
}
```

---

# 12. 화면별 허용 타입

| 화면 | 허용 타입 |
|---|---|
| 위치 변경 | location, region |
| 온보딩 위치 설정 | location, region |
| 설정 위치 변경 | location, region |
| D-DAY 새로 만들기 | region, location |
| DISCOVER P1 | region, location, poi |
| DISCOVER P2 범위 선택 | region, location |
| DISCOVER P3 지역 선택 | region, location |
| 활동 선택 | activity, but search excluded |

---

# 13. Empty / Error / Loading

## 13-1. Loading

```text
검색 결과를 찾고 있어요.
```

## 13-2. 결과 없음

```text
검색 결과가 없어요.
다른 검색어로 다시 시도해보세요.
```

## 13-3. 검색 실패

```text
검색 결과를 불러오지 못했어요.
잠시 후 다시 시도해주세요.

[다시 시도]
```

## 13-4. 데이터 준비 중

```text
아직 이 지역의 데이터를 준비 중이에요.
가까운 상위 지역 기준으로 볼 수 있어요.

[상위 지역으로 보기]
[다른 지역 선택]
```

---

# 14. 계측 이벤트

```text
search_opened
search_query_started
search_query_changed
search_results_viewed
search_result_selected
search_no_results_viewed
search_failed
recent_selection_viewed
recent_selection_selected
recommended_search_selected
activity_category_selected
activity_category_unselected
```

## 이벤트 필드 예시

```json
{
  "entry_point": "today | discover | dday_create | onboarding | settings",
  "search_type": "location | region | poi | activity",
  "query": "성수",
  "result_count": 12,
  "selected_result_type": "location",
  "selected_result_id": "kr_seoul_seongdong_seongsu",
  "source": "search | recent | recommended"
}
```

---

# 15. MVP 포함 / 제외

## 15-1. 포함

- 위치/지역 검색
- DISCOVER 지역 + POI 검색
- 최근 선택 5개
- 추천 검색어
- 검색 결과 타입 구분
- 검색 결과 없음 상태
- 선택 후 prefill 규칙
- 검색 결과 공통 데이터 모델
- 화면별 허용 타입 정의
- 기본 계측 이벤트

## 15-2. 제외

- 활동 자유 검색
- 지도 기반 검색
- 검색 자동완성 고도화
- 오타 교정
- 음성 검색
- 검색어 하이라이트 고도화
- 검색 필터
- 검색 결과 무한 스크롤
- D-DAY 직접 입력 내 POI 검색
- 위치 변경 내 POI 검색

---

# 16. 최종 요약

```text
공통 검색
→ 화면별 검색 대상 제한
→ DISCOVER P1은 지역 + POI
→ D-DAY 직접 입력은 지역 중심
→ 위치 변경은 행정구역 중심
→ 활동은 검색 없이 칩 선택
→ 최근 검색어가 아니라 최근 선택 저장
```

MVP에서는 검색 범위를 넓히기보다, 각 화면의 목적에 맞는 선택 경험을 제공하는 데 집중한다.
