# DISCOVER Product Spec (MVP)

## Version
**v1.2** — 선호 활동 우선 노출 반영본

## Document Type
Product / Feature Specification

## Status
MVP Draft

---

# 1. v1.1 → v1.2 변경 요약

| 영역 | v1.1 | v1.2 |
|---|---|---|
| 선호 활동 | 별도 명시 약함 | 활동 선택 화면에서 선호 활동 우선 노출 |
| TODAY 연계 | DISCOVER CTA 중심 | TODAY 선호 활동 카드 CTA에서 prefill 진입 |
| 활동 제한 | 전체 활동 선택 가능 | 전체 활동 유지, 선호 활동은 상단 우선 표시 |
| 온보딩 | 활동 선택 가능성 | 온보딩 제외, 사이드바/TODAY에서 설정 |

---

# 2. 화면 정의

DISCOVER는 사용자가 날짜, 장소, 활동 중 하나 이상을 단서로 가지고 있을 때, 날씨 기반 score를 통해 좋은 날짜·활동·장소를 발견하고 D-DAY에 저장하도록 돕는 화면이다.

## 핵심 역할

```text
사용자가 "언제 갈지" 또는 "어디 갈지" 또는 "무엇을 할지" 중 하나만 정해도,
나머지를 날씨 기반으로 발견하게 하는 탐색 화면
```

## 최종 CTA

```text
D-DAY로 저장
```

---

# 3. 선호 활동 반영 원칙

## 3-1. DISCOVER는 선호 활동으로 제한하지 않는다

DISCOVER는 탐색 화면이다.  
따라서 사용자의 선호 활동이 설정되어 있어도 전체 활동을 선택할 수 있어야 한다.

## 3-2. 선호 활동은 우선 노출한다

활동 선택 화면에서 선호 활동을 상단에 보여준다.

```text
활동 선택

선호 활동
[피크닉/도시산책] [카페/맛집] [전시/문화]

전체 활동
[해변] [등산/트레킹] [캠핑] [일출/일몰] ...
```

## 3-3. 선호 활동 미설정 시

선호 활동 섹션을 노출하지 않고 전체 활동만 보여준다.

```text
활동 선택

전체 활동
[해변] [등산/트레킹] [캠핑] ...
```

---

# 4. TODAY에서 DISCOVER로 진입하는 경우

TODAY의 선호 활동 카드에서 CTA를 누르면 DISCOVER로 prefill 진입한다.

## 예시

```text
TODAY
→ 피크닉/도시산책 카드
→ [근처 피크닉 장소 보기]
```

## prefill 값

```json
{
  "flow": "p0_or_p3",
  "date": "today",
  "scope": "nearby",
  "activity_category": "urban",
  "source": "today_activity_card"
}
```

## 진입 후 동작

```text
날짜 = 오늘
범위 = 내 주변
활동 = 선택한 선호 활동
→ 장소 추천 결과 노출
```

---

# 5. P0 — 아직 못 정했어요

## 기본값

```text
날짜 = 이번 주말
추천 범위 = 내 주변
활동 = 전체
```

## 선호 활동 설정 시

P0 활동 추천 결과에서 선호 활동을 우선 정렬한다.

```text
이번 주말에 어울리는 활동

선호 활동
피크닉/도시산책  gorgeous
카페/맛집        great

다른 활동
해변             good
캠핑             uhm..
```

---

# 6. P1 — 장소는 정했어요

## 지역 선택 후 활동 선택

선호 활동이 있으면 상단 우선 노출한다.

```text
제주도에서 무엇을 하고 싶나요?

선호 활동
[사진/뷰] [카페/맛집]

전체 활동
[해변] [등산/트레킹] [캠핑] ...
```

## POI 선택

POI 선택 시 기존과 동일하게 category 기반 activity_profile을 자동 추론한다.

---

# 7. P2 — 날짜 + 활동

## 활동 선택

선호 활동이 있으면 상단 우선 노출한다.

```text
무엇을 하고 싶나요?

선호 활동
[피크닉/도시산책] [전시/문화]

전체 활동
[해변] [등산/트레킹] [캠핑] ...
```

---

# 8. P3 — 날짜 + 지역

## 활동 추천 결과

P3는 날짜+지역 기준으로 활동을 추천하므로, score를 우선한다.  
단, 동일 등급 또는 유사 score인 경우 선호 활동을 우선 정렬할 수 있다.

```text
정렬 우선순위:
1. score
2. 안전 하한선 위반 여부
3. 선호 활동 여부
4. 지역 내 장소 수
```

---

# 9. 활동 카테고리

Weather Score Engine v1.2의 10개 활동 카테고리를 사용한다.

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

# 10. 선호 활동 변경 진입

DISCOVER 활동 선택 화면 하단에 보조 링크를 둘 수 있다.

```text
선호 활동을 바꾸고 싶나요?
[선호 활동 변경]
```

단, MVP에서는 필수 노출이 아니라 선택 사항이다.  
주 진입점은 TODAY와 사이드바다.

---

# 11. 이벤트 추가

```text
discover_preferred_activity_section_viewed
discover_preferred_activity_selected
discover_activity_preference_edit_clicked
discover_prefilled_from_today
```

## 필드

```json
{
  "source": "today_activity_card | discover | sidebar",
  "preferred_activity_set": true,
  "selected_activity": "urban"
}
```

---

# 12. 최종 요약

```text
DISCOVER
→ 전체 활동 탐색 가능
→ 선호 활동은 상단 우선 노출
→ TODAY 활동 CTA에서 날짜/범위/활동 prefill 진입
```
