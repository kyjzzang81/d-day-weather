# LOCATION & REGION SELECTION Product Spec (MVP)

## Version
**v1.0** — 위치 변경 / 지역 선택 공통 화면

## Document Type
Product / Feature Specification

## Status
MVP Draft

---

# 1. 문서 목적

이 문서는 ggg 앱에서 공통으로 사용하는 **위치 변경 / 지역 선택 화면**을 정의한다.

이 화면은 다음 기능에서 재사용된다.

```text
온보딩 Step 2 — 위치 설정
TODAY — 위치 변경
DISCOVER — 내 주변 / 지역 선택
D-DAY 새로 만들기 — 도시/지역 선택
설정 — 위치 설정
```

ggg는 TODAY에서 동/읍/면/리 단위 위치 표시를 사용하고, 내부적으로는 weather grid/station에 매핑해 날씨 데이터를 계산한다. 따라서 위치 선택 화면은 단순 주소 검색이 아니라, **사용자 표시 위치와 날씨 계산 위치를 연결하는 공통 인프라 화면**이다.

---

# 2. 핵심 역할

## 2-1. 사용자 관점

사용자가 앱에서 날씨와 추천을 볼 기준 위치를 선택한다.

```text
현재 위치로 볼래요
다른 지역을 직접 선택할래요
최근에 본 지역으로 볼래요
```

## 2-2. 시스템 관점

선택된 위치를 다음 구조로 변환한다.

```text
사용자 입력 또는 GPS 좌표
→ 행정구역 단위 resolve
→ 표시 위치명 생성
→ weather grid/station 매핑
→ 각 화면에 location context 전달
```

---

# 3. 사용 위치

| 진입점 | 사용 목적 | 선택 후 이동 |
|---|---|---|
| 온보딩 Step 2 | 첫 위치 설정 | TODAY |
| TODAY 헤더 `위치 변경` | TODAY 기준 위치 변경 | TODAY 재계산 |
| DISCOVER `내 주변` | 현재 위치 주변 추천 | DISCOVER 결과 |
| DISCOVER `지역 선택` | 특정 지역 기준 추천 | DISCOVER 결과 |
| D-DAY 새로 만들기 | 일정 도시/지역 입력 | D-DAY 생성 폼 |
| 설정 `위치 설정` | 기본 위치 관리 | 설정 또는 TODAY |

---

# 4. 위치 단위 정책

## 4-1. 사용자 표시 단위

가능한 가장 작은 행정 단위를 우선 표시한다.

```text
동 / 읍 / 면 / 리
```

예:

```text
성수동
탄현면 법흥리
안덕면 사계리
```

## 4-2. 내부 계산 단위

날씨 계산은 실제 예보 API가 제공하는 격자/관측소 기준으로 수행한다.

```text
display_location ≠ weather_calculation_location
```

사용자에게는 동네 단위로 보이지만, 내부적으로는 가장 적합한 weather grid/station을 사용한다.

## 4-3. 표시명 축약 규칙

| 원본 주소 | 화면 표시 |
|---|---|
| 서울특별시 성동구 성수동1가 | 성수동 |
| 경기도 파주시 탄현면 법흥리 | 탄현면 법흥리 |
| 제주특별자치도 서귀포시 안덕면 사계리 | 안덕면 사계리 |
| 부산광역시 해운대구 우동 | 해운대구 우동 |

## 4-4. 지역 단위 허용 범위

| 단위 | 허용 여부 | 사용 화면 |
|---|---|---|
| 시/도 | 허용 | DISCOVER 전국/광역 탐색 |
| 시/군/구 | 허용 | DISCOVER, D-DAY |
| 동/읍/면/리 | 허용 | TODAY, DISCOVER, 위치 설정 |
| POI | 위치 선택 화면에서는 비권장 | DISCOVER 장소 검색에서 처리 |

---

# 5. 화면 구조

## 5-1. 기본 화면

```text
위치 선택

[동/읍/면/리 또는 지역명 검색]

현재 위치
[현재 위치 사용]

최근 위치
[성수동] [탄현면 법흥리] [제주 안덕면]

지역 선택
서울
경기
부산
제주
...

[닫기]
```

## 5-2. 온보딩 진입 시

온보딩에서는 화면 타이틀을 더 친근하게 바꾼다.

```text
어디 기준으로 볼까요?

지금 있는 동네 기준으로
오늘 외출하기 좋은지 알려드릴게요.

[현재 위치 사용]
[지역 직접 선택]
```

## 5-3. TODAY 진입 시

```text
위치 변경

[동네 이름을 검색해보세요]

현재 위치 사용
최근 위치
지역 직접 선택
```

## 5-4. D-DAY 새로 만들기 진입 시

D-DAY에서는 “현재 위치”보다 “도시/지역 검색”을 우선한다.

```text
어디로 가시나요?

[도시나 지역을 검색해보세요]

최근 선택
추천 지역
지역 직접 선택
```

---

# 6. 검색 UX

## 6-1. 검색 대상

```text
시/도
시/군/구
동/읍/면/리
```

## 6-2. 검색 결과 구조

검색 결과는 행정 단위별로 표시한다.

```text
검색 결과

동/읍/면/리
성수동
서울특별시 성동구

시/군/구
성동구
서울특별시

시/도
서울특별시
```

## 6-3. 검색 결과 카드

```text
성수동
서울특별시 성동구
```

```text
탄현면 법흥리
경기도 파주시
```

## 6-4. 검색 결과 정렬

MVP 기본 정렬:

```text
1. 정확한 이름 매칭
2. 사용자의 현재 위치와 가까운 결과
3. 최근 선택한 지역
4. 주요 도시/대표 지역
```

현재 위치 권한이 없으면 2번은 제외한다.

---

# 7. 현재 위치 사용

## 7-1. 권한 미결정 상태

```text
현재 위치를 사용하면
동네 기준으로 오늘 날씨와 활동 추천을 볼 수 있어요.

[현재 위치 사용]
```

클릭 시 OS 위치 권한 요청.

## 7-2. 권한 허용

```text
GPS 좌표 획득
→ reverse geocoding
→ 표시 위치 생성
→ weather grid/station 매핑
→ 직전 화면으로 복귀
```

## 7-3. 권한 거부

```text
현재 위치를 사용할 수 없어요.
지역을 직접 선택하면 TODAY를 볼 수 있어요.

[지역 선택하기]
[닫기]
```

## 7-4. 위치 정확도 낮음

```text
위치를 대략적으로 확인했어요.
더 정확한 동네 날씨를 보려면 위치 정확도를 높여주세요.

[위치 정확도 높이기]
[이 위치로 계속]
```

## 7-5. GPS 실패

```text
현재 위치를 확인하지 못했어요.
지역을 직접 선택해주세요.

[지역 선택하기]
[다시 시도]
```

---

# 8. 지역 직접 선택

## 8-1. 목적

위치 권한 없이도 사용자가 원하는 지역을 선택하게 한다.

## 8-2. 선택 단계

```text
시/도 선택
→ 시/군/구 선택
→ 동/읍/면/리 선택
```

## 8-3. UI 예시

```text
지역 선택

시/도
[서울] [경기] [부산] [제주]

시/군/구
[성동구] [마포구] [종로구]

동/읍/면/리
[성수동] [왕십리동] [옥수동]
```

## 8-4. 최소 선택 단위

화면별로 최소 선택 단위가 다르다.

| 화면 | 최소 선택 단위 | 권장 선택 단위 |
|---|---|---|
| TODAY | 동/읍/면/리 | 동/읍/면/리 |
| DISCOVER 내 주변 | 현재 위치 또는 동/읍/면/리 | 동/읍/면/리 |
| DISCOVER 지역 선택 | 시/군/구 이상 가능 | 도시/구 |
| D-DAY 새로 만들기 | 시/군/구 이상 가능 | 도시/지역 |
| 설정 기본 위치 | 동/읍/면/리 | 동/읍/면/리 |

---

# 9. 최근 위치

## 9-1. 목적

반복 사용 시 위치 선택을 빠르게 한다.

## 9-2. 저장 기준

사용자가 위치를 선택하거나 현재 위치를 resolve한 경우 최근 위치에 저장한다.

## 9-3. 저장 개수

MVP에서는 최대 5개.

## 9-4. UI

```text
최근 위치

[성수동]
[탄현면 법흥리]
[안덕면 사계리]
```

## 9-5. 삭제

MVP에서는 최근 위치 개별 삭제는 제외 가능하다.  
설정에서 전체 삭제는 Phase 1.5 검토.

---

# 10. 기본 위치

## 10-1. 정의

사용자가 명시적으로 저장한 기본 위치.

```text
default_location
```

## 10-2. 사용 위치

| 화면 | 활용 |
|---|---|
| TODAY | 위치 권한이 없을 때 기본 위치로 시작 |
| DISCOVER | 내 주변 추천 fallback |
| 설정 | 기본 위치 변경 |

## 10-3. 설정 방식

위치 선택 완료 후 선택 사항으로 제공.

```text
이 위치를 기본 위치로 사용할까요?

[기본 위치로 설정]
[이번만 사용]
```

MVP에서는 온보딩에서 직접 선택한 지역은 기본 위치로 저장한다.

---

# 11. 선택 후 반환 값

위치 선택 화면은 선택 결과를 공통 location context로 반환한다.

```json
{
  "location_id": "kr_seoul_seongdong_seongsu",
  "display_name": "성수동",
  "admin_level": "dong",
  "sido": "서울특별시",
  "sigungu": "성동구",
  "eup_myeon_dong": "성수동",
  "ri": null,
  "lat": 37.5446,
  "lng": 127.0559,
  "weather_grid_id": "string",
  "weather_station_id": "string",
  "source": "gps | search | manual | recent",
  "is_default": false
}
```

---

# 12. 화면별 반환 처리

## 12-1. 온보딩

```text
location context 저장
→ onboarding_completed = true
→ TODAY 진입
```

## 12-2. TODAY

```text
location context 저장
→ TODAY weather fetch
→ TODAY score 재계산
→ 화면 갱신
```

## 12-3. DISCOVER

```text
location context를 recommendation scope로 사용
→ 추천 후보군 계산
→ 결과 화면 이동
```

## 12-4. D-DAY 새로 만들기

```text
location context를 city/region 필드에 prefill
→ 생성 폼으로 복귀
```

## 12-5. 설정

```text
default_location 업데이트
→ 설정 화면 복귀
```

---

# 13. Empty / Error 상태

## 13-1. 검색 결과 없음

```text
검색 결과가 없어요.
다른 지역명으로 검색해보세요.

예: 성수동, 파주시, 제주 안덕면
```

## 13-2. 지역 데이터 준비 중

```text
아직 이 지역의 데이터를 준비 중이에요.
가까운 상위 지역으로 볼 수 있어요.

[성동구로 보기]
[다른 지역 검색]
```

## 13-3. weather grid 매핑 실패

```text
날씨 데이터를 연결하지 못했어요.
가까운 지역 기준으로 볼까요?

[가까운 지역으로 보기]
[다른 지역 선택]
```

## 13-4. 위치 권한 거부

```text
현재 위치를 사용할 수 없어요.
지역을 직접 선택해주세요.

[지역 선택하기]
```

## 13-5. 네트워크 오류

```text
지역 정보를 불러오지 못했어요.
잠시 후 다시 시도해주세요.

[다시 시도]
```

---

# 14. 데이터 모델

## 14-1. user_locations

```json
{
  "id": "string",
  "user_id": "string",
  "location_id": "kr_seoul_seongdong_seongsu",
  "display_name": "성수동",
  "admin_level": "dong",
  "sido": "서울특별시",
  "sigungu": "성동구",
  "eup_myeon_dong": "성수동",
  "ri": null,
  "lat": 37.5446,
  "lng": 127.0559,
  "weather_grid_id": "string",
  "weather_station_id": "string",
  "source": "gps | search | manual",
  "is_default": true,
  "last_used_at": "datetime",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

## 14-2. location_master

```json
{
  "location_id": "kr_seoul_seongdong_seongsu",
  "display_name": "성수동",
  "admin_level": "dong",
  "sido": "서울특별시",
  "sigungu": "성동구",
  "eup_myeon_dong": "성수동",
  "ri": null,
  "lat": 37.5446,
  "lng": 127.0559,
  "weather_grid_id": "string",
  "weather_station_id": "string",
  "is_active": true
}
```

---

# 15. 계측 이벤트

```text
location_selector_opened
location_search_started
location_search_result_viewed
location_search_result_selected
location_current_use_clicked
location_permission_requested
location_permission_granted
location_permission_denied
location_reverse_geocode_success
location_reverse_geocode_failed
location_grid_mapping_success
location_grid_mapping_failed
location_recent_selected
location_manual_region_selected
location_default_set
location_selection_completed
location_selection_failed
```

## 이벤트 필드 예시

```json
{
  "entry_point": "onboarding | today | discover | dday_create | settings",
  "source": "gps | search | manual | recent",
  "admin_level": "dong | eup | myeon | ri | sigungu | sido",
  "display_name": "성수동",
  "has_weather_grid": true,
  "permission_status": "granted | denied | not_determined"
}
```

---

# 16. MVP 포함 / 제외

## 16-1. 포함

- 현재 위치 사용
- 위치 권한 요청
- 권한 거부 시 지역 직접 선택
- 동/읍/면/리 검색
- 시/도 → 시/군/구 → 동/읍/면/리 수동 선택
- 최근 위치 최대 5개
- 기본 위치 저장
- weather grid/station 매핑 결과 보관
- Empty/Error 상태
- 공통 location context 반환

## 16-2. 제외

- 지도에서 핀 찍기
- 주소 상세 입력
- POI 검색
- 최근 위치 개별 삭제
- 여러 기본 위치
- 위치별 별칭 설정
- GPS 이동 감지 자동 변경
- 백그라운드 위치 추적
- 해외 위치 정밀 지원

---

# 17. 최종 요약

```text
위치 선택 화면
→ 현재 위치 또는 지역 직접 선택
→ 동/읍/면/리 표시명 생성
→ weather grid/station 매핑
→ TODAY/DISCOVER/D-DAY/설정에 location context 반환
```

MVP에서는 지도 기반 위치 선택을 제외하고, 검색과 행정구역 선택 중심으로 구현한다.
