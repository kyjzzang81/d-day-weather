# ONBOARDING & ACTIVITY PREFERENCE Product Spec (MVP)

## Version
**v1.0** — 2-Step Onboarding + 선호 활동 설정

## Document Type
Product / Feature Specification

## Status
MVP Draft

---

# 1. 문서 목적

이 문서는 ggg 앱의 첫 실행 온보딩과 선호 활동 설정 화면을 정의한다.

이번 버전의 핵심 결정은 다음이다.

```text
첫 실행 온보딩은 2단계로 최소화한다.
활동 선호와 알림 권한은 첫 실행에서 강제하지 않는다.
TODAY의 활동 추천은 사용자가 설정한 선호 활동만 보여준다.
```

---

# 2. 핵심 원칙

## 2-1. 먼저 효용을 보여준다

첫 실행에서 긴 설정을 요구하지 않는다.  
사용자는 최대한 빨리 TODAY에 진입해 “오늘 나가도 괜찮은지” 확인해야 한다.

## 2-2. 위치는 첫 실행에서 필요하다

TODAY는 현재 위치 기반 화면이므로, 위치 설정은 온보딩에 포함한다.

## 2-3. 선호 활동은 점진적으로 받는다

활동 선호는 필수 온보딩이 아니라, TODAY의 활동 추천 섹션에서 필요성을 느낀 뒤 설정하게 한다.

## 2-4. 알림 권한은 D-DAY 저장 이후 요청한다

사용자가 아직 저장한 일정이 없는 상태에서는 알림의 가치가 낮다.  
알림 권한은 첫 D-DAY 저장 직후 요청한다.

---

# 3. 첫 실행 온보딩 플로우

## 3-1. 전체 플로우

```text
앱 첫 실행
→ Step 1. 가치 소개
→ Step 2. 위치 설정
→ TODAY 진입
```

## 3-2. 제외 항목

첫 실행 온보딩에서는 아래를 제외한다.

```text
활동 선호 선택
알림 권한 요청
로그인/회원가입 강제
구독 유도
AI 챗봇형 안내
```

---

# 4. Step 1 — 가치 소개

## 4-1. 목적

사용자가 ggg를 일반 날씨앱이 아니라, 날씨 기반 외출/여행 의사결정 앱으로 이해하게 한다.

## 4-2. 화면 카피

```text
날씨가 아니라,
오늘 할 일을 판단해드려요.

오늘 나가도 괜찮은지,
언제 어디로 가면 좋은지,
일정이 가까워질수록 무엇을 준비해야 하는지 알려드려요.
```

## 4-3. 보조 설명

```text
TODAY
오늘 나가도 괜찮은지 확인

DISCOVER
좋은 날짜·장소·활동 찾기

D-DAY
저장한 일정의 날씨 변화 추적
```

## 4-4. CTA

```text
시작하기
```

---

# 5. Step 2 — 위치 설정

## 5-1. 목적

TODAY가 동/읍/면/리 단위로 오늘 외출 판단을 제공할 수 있도록 위치를 설정한다.

## 5-2. 화면 카피

```text
지금 있는 동네 기준으로
오늘 외출하기 좋은지 알려드릴게요.

현재 위치를 사용하면
성수동, 탄현면, 사계리처럼
동네 단위로 날씨와 활동 추천을 볼 수 있어요.
```

## 5-3. CTA

```text
[현재 위치 사용]
[지역 직접 선택]
```

## 5-4. 위치 권한 허용 시

```text
현재 위치 권한 요청
→ GPS 좌표 확인
→ 동/읍/면/리 reverse geocoding
→ TODAY 진입
```

## 5-5. 위치 권한 거부 시

```text
현재 위치를 알 수 없어요.
지역을 직접 선택하면 TODAY를 사용할 수 있어요.

[지역 선택하기]
[나중에 하기]
```

## 5-6. 지역 직접 선택

```text
지역 선택
→ 시/도
→ 시/군/구
→ 동/읍/면/리 검색 또는 선택
→ TODAY 진입
```

---

# 6. TODAY 활동 선호 미설정 상태

## 6-1. 기본 정책

처음 실행한 사용자는 선호 활동이 없다.  
이 경우 TODAY의 활동 추천 섹션에는 기본 활동 리스트를 보여주지 않고, 설정 유도 카드를 보여준다.

## 6-2. UI 카피

```text
오늘 어울리는 활동

선호 활동을 선택해주세요.
자주 하는 활동을 설정하면
오늘 어떤 활동이 좋은지 알려드릴게요.

[선호 활동 설정하기]
```

## 6-3. CTA 동작

```text
[선호 활동 설정하기]
→ 선호 활동 설정 화면
```

---

# 7. 선호 활동 설정 화면

## 7-1. 진입점

```text
TODAY → 선호 활동 설정하기
사이드바 → 선호 활동 변경
마이페이지 → 선호 활동 변경
```

## 7-2. 화면 목적

사용자가 TODAY에서 보고 싶은 활동 카테고리를 선택한다.  
TODAY는 선택된 활동만 활동 추천 섹션에 노출한다.

## 7-3. 화면 카피

```text
선호 활동 설정

오늘 화면에서 보고 싶은 활동을 선택해주세요.
선택한 활동만 TODAY에 보여드릴게요.

1~5개 선택 가능
```

## 7-4. 활동 목록

Weather Score Engine v1.2의 활동 카테고리 10개를 사용한다.

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

## 7-5. 선택 규칙

| 항목 | 결정 |
|---|---|
| 최소 선택 | 1개 |
| 권장 선택 | 3~5개 |
| 최대 선택 | 5개 |
| 선택 필수 여부 | TODAY 활동 추천을 보려면 필요 |
| 정렬 방식 | 선택 순서대로 TODAY에 노출 |
| 우선순위 드래그 | MVP 제외 |
| 저장 후 이동 | 직전 화면으로 복귀 |

## 7-6. 추가 옵션

```text
추가 옵션

[ ] 아이와 함께 외출할 일이 많아요
```

선택 시:

```text
default_theme_overlay = family_kids
```

## 7-7. family_kids 설명

```text
아이와 함께라면
미세먼지, UV, 체감온도 기준을 더 엄격하게 반영해요.
```

이 값은 기본값이며, D-DAY 저장 시 개별 일정에서 변경할 수 있다.

## 7-8. 저장 CTA

```text
[저장]
```

## 7-9. 저장 완료

```text
선호 활동이 저장됐어요.
```

저장 후 TODAY의 활동 추천 섹션을 즉시 갱신한다.

---

# 8. 선호 활동 설정 완료 후 TODAY 표시

## 8-1. 표시 정책

TODAY의 활동 추천 섹션에는 사용자가 설정한 선호 활동만 보여준다.

## 8-2. 예시

사용자가 아래 활동을 선택한 경우:

```text
피크닉/도시산책
카페/맛집
전시/문화
사진/뷰
```

TODAY 표시:

```text
오늘 어울리는 활동

피크닉/도시산책
강력추천
비 가능성 낮음 · 바람 약함

카페/맛집
추천
날씨 영향 적음

전시/문화
추천
비가 와도 안정적

사진/뷰
보통
오후 미세먼지 보통
```

---

# 9. DISCOVER 반영 정책

DISCOVER는 탐색 화면이므로 선호 활동만으로 제한하지 않는다.

## 9-1. 표시 방식

```text
활동 선택

선호 활동
[피크닉/도시산책] [카페/맛집] [전시/문화]

전체 활동
[해변] [등산/트레킹] [캠핑] [일출/일몰] ...
```

## 9-2. 원칙

- 선호 활동은 상단 우선 노출
- 전체 활동은 항상 접근 가능
- P0/P1/P2/P3 탐색 가능성을 막지 않음

---

# 10. D-DAY 새로 만들기 반영 정책

D-DAY 새로 만들기에서도 선호 활동을 우선 노출한다.

```text
활동 카테고리 선택

자주 쓰는 활동
[피크닉/도시산책] [카페/맛집] [전시/문화]

전체 활동
[해변] [등산/트레킹] [캠핑] ...
```

D-DAY 생성 시 활동 카테고리 1개는 필수다.

---

# 11. 사이드바 / 마이페이지 반영

## 11-1. 사이드바 메뉴

```text
마이페이지
- 저장된 D-DAY
- 완료된 D-DAY
- 선호 활동 변경
- 계정 관리

설정
- 알림 설정
- 위치 설정
- 데이터/개인정보
- 약관 및 정책
```

## 11-2. 선호 활동 변경

```text
선호 활동 변경
→ 선호 활동 설정 화면
```

---

# 12. 알림 권한 요청 정책

## 12-1. 온보딩에서는 요청하지 않음

첫 실행 온보딩에서는 알림 권한을 요청하지 않는다.

## 12-2. 요청 타이밍

```text
첫 D-DAY 저장 직후
```

## 12-3. 사전 안내 카피

```text
이 일정의 날씨 변화와 준비 시점을 알려드릴게요.

D-14 실제 예보 도착
D-7 짐 싸기 체크
D-1 최종 점검
당일 시간대별 안내까지 받아볼 수 있어요.

[알림 받기]
[나중에]
```

---

# 13. 데이터 모델

## 13-1. user_preferences

```json
{
  "user_id": "string",
  "preferred_activity_categories": [
    "urban",
    "cafe",
    "indoor"
  ],
  "activity_preference_set": true,
  "default_theme_overlay": "family_kids | null",
  "location_permission_status": "granted | denied | not_determined",
  "notification_permission_status": "granted | denied | not_determined",
  "onboarding_completed": true,
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

## 13-2. preferred_activity_categories

| 코드 | 노출명 |
|---|---|
| beach | 해변 |
| hiking | 등산/트레킹 |
| camping | 캠핑 |
| scenic | 일출/일몰 |
| photo | 사진/뷰 |
| urban | 피크닉/도시산책 |
| cafe | 카페/맛집 |
| festival | 축제/이벤트 |
| spa | 온천/리조트 |
| indoor | 전시/문화 |

---

# 14. Empty / Skip / Error 상태

## 14-1. 선호 활동 미설정

```text
선호 활동을 선택해주세요.
자주 하는 활동을 설정하면
오늘 어떤 활동이 좋은지 알려드릴게요.

[선호 활동 설정하기]
```

## 14-2. 위치 권한 거부

```text
현재 위치를 사용할 수 없어요.
지역을 선택하면 TODAY를 볼 수 있어요.

[지역 선택하기]
```

## 14-3. 활동 저장 실패

```text
선호 활동을 저장하지 못했어요.
잠시 후 다시 시도해주세요.

[다시 시도]
```

## 14-4. 알림 권한 거부

```text
알림이 꺼져 있어요.
D-DAY 저장 후 설정에서 다시 켤 수 있어요.
```

---

# 15. 계측 이벤트

```text
onboarding_started
onboarding_value_viewed
onboarding_location_started
onboarding_location_permission_requested
onboarding_location_permission_granted
onboarding_location_permission_denied
onboarding_region_selected
onboarding_completed

activity_preference_prompt_viewed
activity_preference_opened
activity_preference_activity_selected
activity_preference_activity_unselected
activity_preference_saved
activity_preference_updated
activity_preference_save_failed
```

## 이벤트 필드 예시

```json
{
  "selected_activity_count": 4,
  "selected_activities": ["urban", "cafe", "indoor", "photo"],
  "default_theme_overlay": "family_kids",
  "activity_preference_set": true,
  "location_permission_status": "granted",
  "notification_permission_status": "not_determined"
}
```

---

# 16. MVP 포함 / 제외

## 16-1. 포함

- 첫 실행 온보딩 2단계
- 위치 권한 안내
- 지역 직접 선택 대체 경로
- TODAY 선호 활동 미설정 카드
- 선호 활동 설정 화면
- 선호 활동 1~5개 선택
- family_kids 기본 옵션
- 사이드바 `선호 활동 변경`
- DISCOVER/D-DAY에서 선호 활동 우선 노출
- 첫 D-DAY 저장 후 알림 권한 요청

## 16-2. 제외

- 첫 실행 활동 선호 강제
- 첫 실행 알림 권한 요청
- 활동 우선순위 드래그 정렬
- 개인별 weather tolerance 설정
- pet_friendly overlay
- 가족 페르소나 전용 온보딩
- 구독 유도
- AI 챗봇형 온보딩
- 복수 theme overlay
- 건강 상태 기반 설정

---

# 17. 최종 요약

```text
첫 실행
→ 가치 소개
→ 위치 설정
→ TODAY 진입

TODAY 활동 추천
→ 선호 활동 미설정 시 설정 유도
→ 선호 활동 설정 후 선택한 활동만 노출

사이드바
→ 선호 활동 변경
→ TODAY/DISCOVER/D-DAY에 반영
```

MVP의 온보딩은 짧게 유지하고, 선호 활동은 사용자가 TODAY에서 필요성을 느낀 시점에 설정하게 한다.
