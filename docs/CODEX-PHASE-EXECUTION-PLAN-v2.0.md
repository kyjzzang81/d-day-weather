# ggg MVP - Phase Execution Plan

## Version
**v2.0** - LocalContent 중심 전환 반영본

## Status
MVP Draft

---

# 1. 전체 방향

제품 추천 단위를 Place에서 `LocalContent`로 전환한다. Place/POI는 계속 유지하되 콘텐츠의 위치 정보로 사용한다.

```text
Phase A. Docs / Model Alignment
Phase B. Supabase LocalContent Foundation
Phase C. API / Service Types
Phase D. Discover LocalContent Flow
Phase E. Content Detail
Phase F. SavedContent
Phase G. Today Recommended Contents
Phase H. Weather Signal Integration
Phase I. QA / Migration Cleanup
```

---

# Phase A - Docs / Model Alignment

## 목표

문서와 타입 언어를 LocalContent 중심으로 맞춘다.

## 완료 기준

```text
LOCAL-CONTENT-MODEL-SPEC 작성
SAVED-CONTENTS-PRODUCT-SPEC 작성
Discover/Today/API/Data Model 문서 v2.0 작성
사용자 화면 표현 정리
```

---

# Phase B - Supabase LocalContent Foundation

## 목표

`local_contents`, `content_regions`, `local_content_regions`, `content_tags`, `local_content_tags`, `user_saved_contents` 테이블과 인덱스를 추가한다.

## 구현 범위

```text
local_contents migration
content_regions migration
local_content_regions migration
content_tags migration
local_content_tags migration
region seed
content_tags seed
user_saved_contents migration
weather_score_logs.content_id optional 추가
recent_selections selection_type = content 추가 검토
seed sample specific_content / curated_content
```

## 완료 기준

```text
poi_master는 유지
local_contents.poi_id optional 연결
space_type = indoor / outdoor / mixed 추가
지역 필터와 현재 위치 기본 추천을 위한 content_regions 구성
콘텐츠 유형 / 공간 / 날씨 / 행동 조건 태그 CRUD 가능
RLS 방향 반영
기본 seed로 Discover 카드 렌더 가능
```

---

# Phase C - API / Service Types

## 목표

프론트 타입과 데이터 접근 계층을 `LocalContent` 기준으로 만든다.

## 구현 범위

```text
LocalContent type
LocalContentCard type
ContentKind / ContentSource / ContentType / DateType
ContentTag / ContentTagGroup / LocalContentTag
SavedContent type
searchLocalContents service
getContentDetail service
saveLocalContent service
```

## 완료 기준

```text
기존 장소 추천 타입 의존 제거
POI 타입은 위치 정보로 유지
mock/fallback 데이터도 LocalContent 기준
```

---

# Phase D - Discover LocalContent Flow

## 목표

DISCOVER를 지역 콘텐츠 탐색 화면으로 전환한다.

## 구현 범위

```text
검색창 placeholder: 지역이나 콘텐츠 검색
날짜 선택: 오늘 / 이번 주말 / 날짜 선택
상황 선택: 일상 / 액티비티 / 휴식 / 아이와 / 연인·친구
태그 필터: 콘텐츠 유형 / 지역 / 공간 / 날씨 / 행동 조건
LocalContentCard list
specific_content와 curated_content 혼합 노출
```

## 완료 기준

```text
특정 콘텐츠 검색 가능
추천형 탐색 가능
태그 필터로 콘텐츠 유형 / 지역 / 공간 / 날씨 / 행동 조건 탐색 가능
기본 추천은 현재 위치가 매핑된 지역 권역을 우선 반영
카드가 콘텐츠 상세로 이동
카드에서 저장 가능
```

---

# Phase E - Content Detail

## 목표

기존 위치 중심 상세 화면을 콘텐츠 상세로 확장한다.

## 구현 범위

```text
/content/:contentId route
대표 이미지
title
source badge
기간/운영시간
장소/지역
날짜 선택
날씨 신호
콘텐츠 정보
길찾기 / 공식 페이지 / 날짜 저장 CTA
```

## 완료 기준

```text
specific_content는 공식 정보 우선
curated_content는 추천 이유와 기반 장소 우선
POI 연결 정보는 하위 섹션에 표시
```

---

# Phase F - SavedContent

## 목표

저장 화면과 저장 모델을 `SavedContent` 기준으로 만든다.

## 구현 범위

```text
저장 화면
전체 / 예정 / 가보고 싶어요 / 다녀왔어요 탭
user_saved_contents service
wishlist / planned / visited 상태 전환
날짜 정하기 CTA
```

## 완료 기준

```text
기존 장소 저장 타입과 테이블 의존 제거
사용자 화면에서 위치 중심 저장 표현 제거
콘텐츠 상세과 Discover에서 저장 가능
```

---

# Phase G - Today Recommended Contents

## 목표

TODAY에 `오늘의 추천` 섹션을 추가한다.

## 구현 범위

```text
get_today_payload recommendedContents 추가
현재 위치 기준 local_contents 후보 조회
LocalContentCard compact variant
Discover prefill CTA
```

## 완료 기준

```text
오늘 운영 중인 specific_content 노출 가능
오늘 추천 가능한 curated_content 노출 가능
TODAY에서 저장/상세 진입 가능
```

---

# Phase H - Weather Signal Integration

## 목표

콘텐츠와 날짜 기준 날씨 신호를 계산하고 표시한다.

## 구현 범위

```text
calculate_content_weather_signal
forecast / historical_trend basis
weather_good_tags / weather_avoid_tags 반영
space_type 반영
signal_snapshot 저장
weather_score_logs.content_id 기록
```

## 완료 기준

```text
specific_content 일정 날짜 신호 표시
curated_content 상시형 날짜 신호 표시
SavedContent에 signal_snapshot 저장
```

---

# Phase I - QA / Migration Cleanup

## 목표

Place 중심 잔여 표현과 타입 의존을 정리한다.

## 점검 항목

```text
위치만 추천하는 표현 제거
위치 중심 상세 표현을 콘텐츠 상세로 전환
위치 중심 저장 표현 제거
기존 장소 추천 타입 제거 또는 LocalContent로 대체
기존 장소 저장 타입 제거 또는 migration path 명시
POI는 local_contents 하위 위치 정보로 유지
```
