# NOTIFICATION SETTINGS Product Spec (MVP)

## Version
**v1.0** — 알림 설정 화면

## Document Type
Product / Feature Specification

## Status
MVP Draft

---

# 1. 문서 목적

이 문서는 ggg 앱의 **알림 설정 화면**을 정의한다.

알림 설정 화면은 사용자가 앱 전체 알림 정책을 관리하는 곳이다.  
D-DAY 저장 확인 Bottom Sheet가 “특정 일정의 알림을 설정하는 화면”이라면, 알림 설정 화면은 앱 전체의 알림 수신 정책을 관리한다.

---

# 2. 핵심 결정사항

| 항목 | 결정 |
|---|---|
| 전체 알림 | 기본 OFF |
| 기본 D-DAY 알림 | 기본 ON, 단 전체 알림 OFF이면 비활성/OFF |
| 변동 알림 | 기본 OFF |
| 안전 알림 | 기본 OFF |
| 마케팅 알림 | 기본 OFF |
| 조용한 시간대 | MVP 미포함 |
| 안전 알림의 조용한 시간대 예외 | 해당 없음 |
| 기기 알림 권한 꺼짐 | 기기 설정 이동 CTA 제공 |
| 일정별 알림 | D-DAY 저장 확인 또는 D-DAY 상세에서 관리 |

---

# 3. 알림 설정의 역할

## 3-1. 사용자 관점

사용자는 아래 알림을 받을지 직접 결정한다.

```text
D-DAY 시간축 알림을 받을지
예보 변동 알림을 받을지
위험 날씨 알림을 받을지
마케팅/추천 알림을 받을지
```

## 3-2. 시스템 관점

시스템은 전역 알림 설정을 기준으로 일정별 알림 발송 여부를 판단한다.

```text
기기 알림 권한
+ 전체 알림 설정
+ 알림 유형별 설정
+ 일정별 알림 설정
→ 실제 발송 여부 결정
```

---

# 4. 진입점

## 4-1. 기본 진입

```text
사이드바
→ 설정
→ 알림 설정
```

## 4-2. 보조 진입

```text
D-DAY 상세
→ 알림 관리
→ 알림 설정
```

```text
알림 권한 거부 상태
→ 설정에서 다시 켤 수 있어요
→ 알림 설정
```

---

# 5. 알림 설정 화면 구조

## 5-1. 기본 화면

```text
알림 설정

기기 알림 권한
현재 상태: 허용됨

전체 알림
[D-DAY 알림 받기] OFF

기본 D-DAY 알림
[D-84 시기 판단] 비활성
[D-28 준비 시작] 비활성
[D-14 실제 예보 도착] 비활성
[D-7 짐 싸기] 비활성
[D-1 최종 점검] 비활성
[D-0 당일 안내] 비활성

변동 알림
[예보가 크게 바뀌면 알려주기] OFF

안전 알림
[위험 날씨 알림 받기] OFF

마케팅 알림
[날씨 기반 추천/혜택 알림] OFF
```

## 5-2. 전체 알림 ON 상태

```text
알림 설정

기기 알림 권한
현재 상태: 허용됨

전체 알림
[D-DAY 알림 받기] ON

기본 D-DAY 알림
[D-84 시기 판단] ON
[D-28 준비 시작] ON
[D-14 실제 예보 도착] ON
[D-7 짐 싸기] ON
[D-1 최종 점검] ON
[D-0 당일 안내] ON

변동 알림
[예보가 크게 바뀌면 알려주기] OFF

안전 알림
[위험 날씨 알림 받기] OFF

마케팅 알림
[날씨 기반 추천/혜택 알림] OFF
```

---

# 6. 기기 알림 권한

## 6-1. 역할

OS 수준의 푸시 알림 권한 상태를 보여준다.

## 6-2. 상태값

| 상태 | 표시 |
|---|---|
| granted | 알림 권한이 허용되어 있어요 |
| denied | 알림 권한이 꺼져 있어요 |
| not_determined | 아직 알림 권한을 요청하지 않았어요 |

## 6-3. 권한 허용 상태

```text
기기 알림 권한
알림 권한이 허용되어 있어요.
```

## 6-4. 권한 거부 상태

```text
기기 알림 권한
알림 권한이 꺼져 있어요.
D-DAY 알림을 받으려면 기기 설정에서 알림을 켜주세요.

[기기 설정으로 이동]
```

## 6-5. 권한 미결정 상태

```text
기기 알림 권한
아직 알림 권한을 요청하지 않았어요.
D-DAY 알림을 받으려면 알림 권한이 필요해요.

[알림 권한 요청]
```

---

# 7. 전체 알림

## 7-1. 기본값

```text
전체 알림 = OFF
```

## 7-2. 역할

앱 전체 D-DAY 알림의 상위 스위치다.

```text
전체 알림 OFF
→ 기본 D-DAY 알림 비활성
→ 변동 알림 OFF
→ 안전 알림 OFF
→ 마케팅 알림 OFF
```

## 7-3. 전체 알림 OFF 상태

전체 알림이 OFF이면 모든 알림 유형은 실제 발송되지 않는다.

UI에서는 하위 알림을 비활성 처리한다.

```text
전체 알림
[D-DAY 알림 받기] OFF

기본 D-DAY 알림
D-DAY 알림을 켜면 단계별 알림을 설정할 수 있어요.
```

## 7-4. 전체 알림 ON 전환

사용자가 전체 알림을 ON으로 전환하면 아래 기본값을 적용한다.

| 알림 유형 | 기본값 |
|---|---|
| 기본 D-DAY 알림 | ON |
| 변동 알림 | OFF |
| 안전 알림 | OFF |
| 마케팅 알림 | OFF |

---

# 8. 기본 D-DAY 알림

## 8-1. 기본값

```text
전체 알림 ON 상태에서 기본 D-DAY 알림은 ON
전체 알림 OFF 상태에서는 비활성/OFF
```

## 8-2. 알림 시점

```text
D-84 시기 판단
D-28 준비 시작
D-14 실제 예보 도착
D-7 짐 싸기
D-1 최종 점검
D-0 당일 안내
```

## 8-3. UI

```text
기본 D-DAY 알림

[x] D-84 시기 판단
[x] D-28 준비 시작
[x] D-14 실제 예보 도착
[x] D-7 짐 싸기
[x] D-1 최종 점검
[x] D-0 당일 안내
```

## 8-4. 개별 OFF

전체 알림이 ON인 경우, 사용자는 각 단계 알림을 개별 OFF할 수 있다.

```text
D-84 시기 판단 OFF
D-28 준비 시작 ON
D-14 실제 예보 도착 ON
...
```

## 8-5. 일정별 알림과의 관계

실제 발송 여부는 아래 조건을 모두 만족해야 한다.

```text
기기 알림 권한 = granted
전체 알림 = ON
해당 단계 기본 알림 = ON
해당 일정의 해당 단계 알림 = ON
해당 알림 시점이 아직 지나지 않음
```

---

# 9. 변동 알림

## 9-1. 기본값

```text
변동 알림 = OFF
```

## 9-2. 역할

D-14 이후 실제 예보가 크게 바뀌었을 때 알려준다.

## 9-3. 트리거 예시

```text
평균 기온 ±5°C 이상 변동
강수 확률 ±30%p 이상 변동
등급 변경
안전 하한선 위반
```

## 9-4. UI

```text
변동 알림

[ ] 예보가 크게 바뀌면 알려주기

D-14 이후 실제 예보가 바뀌어 일정 판단이 달라질 때 알려드려요.
```

## 9-5. 전체 알림과의 관계

전체 알림이 OFF이면 변동 알림도 OFF이며 비활성 처리한다.

---

# 10. 안전 알림

## 10-1. 기본값

```text
안전 알림 = OFF
```

## 10-2. 역할

위험 날씨 조건이 발생했을 때 알려준다.

## 10-3. 안전 조건 예시

```text
강풍
호우
폭염
한파
PM2.5 매우나쁨
UV 위험
```

## 10-4. UI

```text
안전 알림

[ ] 위험 날씨 알림 받기

저장한 일정에 강풍·호우·폭염 등 위험 날씨가 예상되면 알려드려요.
```

## 10-5. 전체 알림과의 관계

전체 알림이 OFF이면 안전 알림도 OFF이며 비활성 처리한다.

---

# 11. 마케팅 알림

## 11-1. 기본값

```text
마케팅 알림 = OFF
```

## 11-2. 역할

날씨 기반 추천, 혜택, 프로모션성 정보를 제공한다.

## 11-3. UI

```text
마케팅 알림

[ ] 날씨 기반 추천/혜택 알림

날씨에 맞는 지역, 장소, 혜택 정보를 받아볼 수 있어요.
```

## 11-4. MVP 정책

MVP에서는 설정 항목은 노출하되, 실제 마케팅 발송 기능은 Phase 1.5 이후 활성화할 수 있다.

## 11-5. 전체 알림과의 관계

전체 알림이 OFF이면 마케팅 알림도 OFF이며 비활성 처리한다.

---

# 12. 조용한 시간대

## 12-1. MVP 정책

조용한 시간대 설정은 MVP에 포함하지 않는다.

```text
조용한 시간대 = 없음
```

## 12-2. 제외 이유

- MVP 알림 설정을 단순하게 유지한다.
- 알림 발송량을 우선 최소화한다.
- 변동 알림, 안전 알림, 마케팅 알림이 기본 OFF이므로 야간 알림 피로 가능성을 낮춘다.

---

# 13. 알림 발송 결정 로직

## 13-1. 기본 D-DAY 알림 발송 조건

```text
기기 권한 = granted
AND 전체 알림 = ON
AND 기본 D-DAY 알림 해당 단계 = ON
AND 일정별 해당 단계 알림 = ON
AND 알림 시점이 아직 지나지 않음
```

## 13-2. 변동 알림 발송 조건

```text
기기 권한 = granted
AND 전체 알림 = ON
AND 변동 알림 = ON
AND 일정별 변동 알림 = ON
AND D-14 이후
AND 변동 트리거 발생
```

## 13-3. 안전 알림 발송 조건

```text
기기 권한 = granted
AND 전체 알림 = ON
AND 안전 알림 = ON
AND 일정별 안전 알림 = ON
AND 안전 하한선 위반
```

## 13-4. 마케팅 알림 발송 조건

```text
기기 권한 = granted
AND 전체 알림 = ON
AND 마케팅 알림 = ON
AND 마케팅 캠페인 조건 충족
```

---

# 14. 첫 D-DAY 저장 후 알림 요청과의 관계

## 14-1. 첫 저장 직후

첫 D-DAY 저장 직후에는 알림 권한 안내 Bottom Sheet를 보여준다.

```text
일정 알림을 받아볼까요?
```

## 14-2. 사용자가 알림 받기를 선택한 경우

```text
OS 권한 요청
→ 권한 허용 시 notification_permission_status = granted
→ 전체 알림 = ON으로 설정
→ 기본 D-DAY 알림 = ON
→ 변동 알림 = OFF
→ 안전 알림 = OFF
→ 마케팅 알림 = OFF
```

## 14-3. 사용자가 나중에를 선택한 경우

```text
notification_permission_status = not_determined
전체 알림 = OFF 유지
```

## 14-4. 사용자가 권한을 거부한 경우

```text
notification_permission_status = denied
전체 알림 = OFF 유지
```

---

# 15. 상태별 UI

## 15-1. 전체 알림 OFF

```text
전체 알림이 꺼져 있어요.
D-DAY 알림을 받으려면 전체 알림을 켜주세요.
```

## 15-2. 기기 권한 OFF

```text
기기 알림 권한이 꺼져 있어요.
알림을 받으려면 기기 설정에서 알림을 켜주세요.

[기기 설정으로 이동]
```

## 15-3. 변동 알림 OFF

```text
예보가 크게 바뀌어도 별도 알림은 보내지 않아요.
```

## 15-4. 안전 알림 OFF

```text
위험 날씨 알림이 꺼져 있어요.
저장한 일정의 위험 날씨를 알림으로 받지 않아요.
```

## 15-5. 마케팅 알림 OFF

```text
추천/혜택 알림을 받지 않아요.
```

---

# 16. 데이터 모델

## 16-1. user_notification_settings

```json
{
  "user_id": "string",
  "notification_permission_status": "granted | denied | not_determined",
  "global_notifications_enabled": false,
  "default_dday_notifications": {
    "d84": true,
    "d28": true,
    "d14": true,
    "d7": true,
    "d1": true,
    "d0": true
  },
  "forecast_change_notifications_enabled": false,
  "safety_notifications_enabled": false,
  "marketing_notifications_enabled": false,
  "quiet_hours_enabled": false,
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

## 16-2. 주의

`default_dday_notifications`는 기본값 자체는 true로 유지한다.  
다만 `global_notifications_enabled = false`이면 실제 발송은 되지 않는다.

---

# 17. 계측 이벤트

```text
notification_settings_opened
notification_permission_status_viewed
notification_device_settings_clicked
notification_global_toggled
notification_dday_stage_toggled
notification_forecast_change_toggled
notification_safety_toggled
notification_marketing_toggled
notification_settings_saved
notification_settings_error
```

## 이벤트 필드 예시

```json
{
  "permission_status": "granted | denied | not_determined",
  "global_notifications_enabled": false,
  "forecast_change_enabled": false,
  "safety_enabled": false,
  "marketing_enabled": false,
  "enabled_dday_stage_count": 6
}
```

---

# 18. MVP 포함 / 제외

## 18-1. 포함

- 알림 설정 화면
- 기기 알림 권한 상태 표시
- 기기 설정 이동 CTA
- 전체 알림 ON/OFF
- 기본 D-DAY 단계별 알림 ON/OFF
- 변동 알림 ON/OFF
- 안전 알림 ON/OFF
- 마케팅 알림 ON/OFF
- 전체 알림 OFF 시 하위 알림 비활성
- 첫 D-DAY 저장 후 알림 요청 결과와 연동
- 기본 계측 이벤트

## 18-2. 제외

- 조용한 시간대
- 알림 시간 직접 지정
- 알림 소리/진동 설정
- 일정별 상세 알림 설정 화면
- 마케팅 알림 세부 카테고리
- 알림 빈도 제한 UI
- 야간 알림 제한 UI
- 긴급 알림 별도 권한 처리
- 푸시 알림 템플릿 관리 화면

---

# 19. 최종 요약

```text
알림 설정
→ 전체 알림 기본 OFF
→ 전체 알림 ON 시 기본 D-DAY 알림 ON
→ 변동/안전/마케팅 알림은 기본 OFF
→ 조용한 시간대 없음
→ 기기 권한 꺼짐 시 설정 이동 안내
```

MVP에서는 사용자의 알림 피로도를 줄이기 위해, 필수 시간축 알림 외의 변동·안전·마케팅 알림은 모두 기본 OFF로 시작한다.
