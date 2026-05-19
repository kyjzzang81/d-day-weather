# D-DAY SAVE CONFIRMATION & NOTIFICATION PERMISSION Spec (MVP)

## Version
**v1.1** — Weather Score Log 반영본

## Document Type
Product / Feature Specification

## Status
MVP Draft

---

# 1. v1.0 → v1.1 변경 요약

| 영역 | v1.0 | v1.1 |
|---|---|---|
| 저장 시 Score | score_snapshot 중심 | score_snapshot + weather_score_logs |
| Score 계산 실패 | 저장 가능 | 유지, 실패 로그 가능 |
| 실내 활동 | 활동별 판단 표시 | 비/악천후 시 대안성 보너스 반영 |
| 로그 저장 실패 | 정의 없음 | 사용자 흐름 차단하지 않음 |
| 저장 결과 | D-DAY 상세 이동 | score_log_id optional 반환 가능 |

---

# 2. 문서 목적

이 문서는 ggg 앱의 **D-DAY 저장 확인 Bottom Sheet**와 **첫 D-DAY 저장 후 알림 권한 안내 화면**을 정의한다.

D-DAY 저장 확인 Bottom Sheet는 D-DAY 직접 입력과 DISCOVER 저장 플로우에서 공통으로 사용된다.

---

# 3. 핵심 결정사항

| 항목 | 결정 |
|---|---|
| 저장 확인 UI | Bottom Sheet |
| 사용 위치 | D-DAY 직접 입력 / DISCOVER 저장 공통 |
| 점수 라벨 | D-DAY 행동형 라벨 사용 |
| 활동 1개 | 전체 판단 중심 |
| 활동 2~3개 | 전체 판단 + 활동별 판단 |
| 실내 활동 | 비/악천후 시 상대적으로 추천될 수 있음 |
| 저장 시 Score | `score_snapshot` 저장 |
| 계산 이력 | `weather_score_logs` 저장 |
| Bottom Sheet 수정 가능 | 일정명 / 아이와 함께 옵션 / 알림 |
| Bottom Sheet 수정 불가 | 날짜 / 지역 / 활동 |
| 날짜·지역·활동 변경 | 이전 화면으로 돌아가서 수정 |
| 알림 권한 요청 | 첫 D-DAY 저장 직후 |
| 로그 저장 실패 | 사용자 저장 흐름 차단하지 않음 |

---

# 4. Bottom Sheet 기본 구조

```text
D-DAY로 저장할까요?

부산 여행
6월 21일 ~ 6월 23일
2박 3일

부산
해변 · 카페/맛집 · 전시/문화

전체 일정
추천

핵심 이유
비 가능성 낮음
오후 바람은 약간 주의

활동별 보기
해변        보통
카페/맛집   강력추천
전시/문화   강력추천

옵션
[x] 아이와 함께

알림
[x] D-14 실제 예보 도착
[x] D-7  짐 싸기
[x] D-1  최종 점검
[x] D-0  당일 안내

[D-DAY로 저장]
```

---

# 5. 활동별 판단

## 5-1. 활동 1개

활동이 1개인 경우 별도 활동별 보기 영역은 생략할 수 있다.

```text
부산 · 해변

추천

비 가능성 낮음
바람 안정적
```

## 5-2. 활동 2~3개

활동이 2개 이상이면 전체 일정 판단과 활동별 판단을 모두 보여준다.

```text
전체 일정
추천

활동별 보기
해변        보통
카페/맛집   강력추천
전시/문화   강력추천
```

## 5-3. 실내 활동 대안성 보너스

비, 강풍, 미세먼지 등으로 야외 활동이 불리한 경우 실내 활동은 상대적으로 더 추천될 수 있다.

예:

```text
해변        보통
카페/맛집   강력추천
전시/문화   강력추천
```

단, 호우/태풍급 위험 날씨에서는 실내 활동도 이동 위험 때문에 safety cap을 적용한다.

---

# 6. Score / Grade 표현

D-DAY 저장 확인 Bottom Sheet는 행동형 라벨을 사용한다.

| Score | D-DAY 표현 |
|---:|---|
| 85~100 | 강력추천 |
| 70~84 | 추천 |
| 50~69 | 보통 |
| 0~49 | 비추천 |

DISCOVER에서 진입하더라도 저장 확인 단계에서는 D-DAY 라벨로 변환한다.

```text
gorgeous → 강력추천
great → 추천
good → 보통
uhm.. → 비추천
```

---

# 7. 저장 시 Score 처리

D-DAY 저장 시 아래 두 가지를 모두 수행한다.

```text
1. user_dday_events.score_snapshot 저장
2. weather_score_logs에 계산 이력 저장
```

## 7-1. score_snapshot

D-DAY 화면 표시용 현재 score다.

```json
{
  "score": 78,
  "grade": "추천",
  "reasons": ["비 가능성 낮음", "오후 바람 주의"],
  "activity_scores": [
    {
      "activity_category": "beach",
      "score": 62,
      "grade": "보통",
      "fatal": false
    },
    {
      "activity_category": "cafe",
      "score": 91,
      "grade": "강력추천",
      "fatal": false
    }
  ],
  "applied_rules": [
    "multi_activity_average_min_blend",
    "indoor_rain_bonus"
  ],
  "calculated_at": "2026-05-19T08:30:00Z"
}
```

## 7-2. weather_score_logs

분석/디버깅/품질 개선용 계산 로그다.

```text
D-DAY 저장 시 필수 insert
D-DAY forecast 업데이트 시 필수 insert
알림 트리거 판단 시 필수 insert
```

## 7-3. 차이

| 항목 | score_snapshot | weather_score_logs |
|---|---|---|
| 목적 | 화면 표시용 현재 상태 | 분석/디버깅/이력 |
| 위치 | user_dday_events embedded | 별도 테이블 |
| 갱신 | 현재 상태로 업데이트 | 계산할 때마다 insert |
| 사용자 화면 | 직접 사용 | MVP에서는 직접 노출 안 함 |

---

# 8. 수정 가능 항목

## 8-1. Bottom Sheet에서 수정 가능

```text
일정명
아이와 함께 옵션
알림 체크
```

## 8-2. Bottom Sheet에서 수정 불가

```text
날짜
지역
활동
```

날짜, 지역, 활동을 바꾸려면 Bottom Sheet를 닫고 이전 화면으로 돌아간다.

---

# 9. 알림 표시 정책

저장 시점 기준 이미 지난 알림은 숨기고 가능한 알림만 노출한다.

예: D-10 일정 저장

```text
[x] D-7  짐 싸기
[x] D-1  최종 점검
[x] D-0  당일 안내
```

---

# 10. 저장 후 플로우

```text
D-DAY로 저장
→ create_dday_event Edge Function
→ auth check
→ score 계산
→ user_dday_events insert
→ weather_score_logs insert
→ planned_items insert if needed
→ notification settings 적용
→ 알림 권한 상태 확인
→ 필요 시 알림 권한 안내
→ D-DAY 상세 이동
```

## 10-1. Output 예시

```json
{
  "dday_event_id": "uuid",
  "score_snapshot": {},
  "score_log_id": "uuid",
  "should_show_notification_permission": true
}
```

---

# 11. Error 상태

## 11-1. Score 계산 실패

D-DAY 저장은 허용한다.

```text
날씨 적합도를 계산하지 못했어요.
일정은 저장할 수 있지만 점수는 나중에 업데이트돼요.

[그래도 저장]
[다시 시도]
```

## 11-2. Log 저장 실패

로그 저장 실패는 사용자 흐름을 막지 않는다.

```text
D-DAY 저장은 성공
weather_score_logs 저장 실패
→ 사용자에게는 저장 성공으로 처리
→ 운영 로그/에러 모니터링
```

## 11-3. 저장 실패

```text
D-DAY를 저장하지 못했어요.
잠시 후 다시 시도해주세요.

[다시 시도]
```

---

# 12. 알림 권한 안내

첫 D-DAY 저장 직후, 알림 권한이 아직 결정되지 않은 경우 안내한다.

```text
일정 알림을 받아볼까요?

이 일정의 날씨 변화와 준비 시점을 알려드릴게요.

D-14 실제 예보 도착
D-7 짐 싸기 체크
D-1 최종 점검
D-0 당일 시간대별 안내

[알림 받기]
[나중에]
```

---

# 13. MVP 포함 / 제외

## 포함

```text
D-DAY 저장 확인 Bottom Sheet
score_snapshot 저장
weather_score_logs 저장
활동별 판단 표시
실내 활동 대안성 보너스 결과 표시
일정명/옵션/알림 수정
날짜/지역/활동 수정 불가
첫 D-DAY 저장 후 알림 권한 안내
Score 계산 실패 시 저장 허용
Log 저장 실패 시 사용자 흐름 유지
```

## 제외

```text
Bottom Sheet 내 날짜 수정
Bottom Sheet 내 지역 수정
Bottom Sheet 내 활동 수정
score log 사용자 직접 조회
score history 화면
고급 알림 설정
```

---

# 14. 최종 요약

```text
D-DAY 저장 확인
→ 전체 일정 판단
→ 활동별 판단
→ score_snapshot 저장
→ weather_score_logs 저장
→ 로그 실패는 사용자 흐름 차단하지 않음
→ 알림 권한 안내
```
