# SIDEBAR / MY PAGE / SETTINGS Product Spec (MVP)

## Version
**v1.0** — 사이드바, 마이페이지, 설정 화면

## Document Type
Product / Feature Specification

## Status
MVP Draft

---

# 1. 문서 목적

이 문서는 ggg 앱의 **사이드바, 마이페이지, 설정 화면**을 정의한다.

ggg의 주요 탭은 아래 3개다.

```text
TODAY
DISCOVER
D-DAY
```

사이드바는 주요 탐색 화면이 아니라, 사용자가 저장한 일정, 선호 활동, 알림, 위치, 계정, 데이터/정책 정보를 관리하는 보조 진입점이다.

---

# 2. 핵심 결정사항

| 항목 | 결정 |
|---|---|
| 사이드바 프로필 영역 | 포함 |
| 저장된 D-DAY 전체 리스트 | 마이페이지에 포함 |
| 완료된 D-DAY | MVP 포함, 단순 리스트 |
| 다시 일정 만들기 | MVP 제외, Phase 1.5 |
| 데이터 출처 화면 | 포함 |
| 계정 관리 | MVP 포함 |
| 로그인 방식 | Google / Apple / Kakao |
| 설정 화면 | 포함 |
| 마케팅 알림 | 알림 설정 화면에 노출, 기본 OFF |

---

# 3. 전체 구조

## 3-1. 사이드바 구조

```text
사이드바

[프로필 영역]

마이페이지
- 저장된 D-DAY
- 완료된 D-DAY
- 선호 활동 변경

설정
- 알림 설정
- 위치 설정
- 계정 관리
- 데이터 출처
- 개인정보 처리방침
- 서비스 이용약관
- 문의하기
- 앱 버전
```

## 3-2. 주요 역할

| 영역 | 역할 |
|---|---|
| 프로필 영역 | 로그인 상태 표시, 로그인 유도 |
| 마이페이지 | 사용자 저장 데이터와 선호 정보 관리 |
| 설정 | 앱 동작, 권한, 계정, 정책 관리 |

---

# 4. 사이드바

## 4-1. 역할

사이드바는 TODAY, DISCOVER, D-DAY 어디서든 접근 가능한 보조 메뉴다.

```text
TODAY / DISCOVER / D-DAY
→ 메뉴 버튼
→ 사이드바 오픈
```

## 4-2. 로그인 전 사이드바

```text
ggg

로그인하고
D-DAY를 안전하게 저장하세요.

[로그인]

마이페이지
- 저장된 D-DAY
- 완료된 D-DAY
- 선호 활동 변경

설정
- 알림 설정
- 위치 설정
- 계정 관리
- 데이터 출처
- 개인정보 처리방침
- 서비스 이용약관
- 문의하기
- 앱 버전 v1.0.0
```

## 4-3. 로그인 후 사이드바

```text
ggg

YongJin
yongjin@example.com
[프로필 관리]

마이페이지
- 저장된 D-DAY
- 완료된 D-DAY
- 선호 활동 변경

설정
- 알림 설정
- 위치 설정
- 계정 관리
- 데이터 출처
- 개인정보 처리방침
- 서비스 이용약관
- 문의하기
- 앱 버전 v1.0.0
```

## 4-4. 사이드바 닫기

```text
닫기 X
배경 탭
스와이프 닫기
```

---

# 5. 로그인 화면

## 5-1. 진입점

```text
사이드바 프로필 영역 → 로그인
계정 관리 → 로그인
D-DAY 저장/동기화 필요 시 로그인 유도
```

## 5-2. 로그인 방식

MVP에서 아래 3개를 지원한다.

```text
Google
Apple
Kakao
```

## 5-3. 로그인 화면 구조

```text
로그인

D-DAY를 안전하게 저장하고
여러 기기에서 확인하세요.

[Google로 계속하기]
[Apple로 계속하기]
[Kakao로 계속하기]

로그인하면 서비스 이용약관 및
개인정보 처리방침에 동의하게 됩니다.

[닫기]
```

## 5-4. 비로그인 사용 정책

| 기능 | 비로그인 사용 |
|---|---|
| TODAY 보기 | 가능 |
| DISCOVER 탐색 | 가능 |
| 선호 활동 로컬 저장 | 가능 |
| D-DAY 로컬 저장 | 가능 |
| 클라우드 동기화 | 로그인 필요 |
| 여러 기기 동기화 | 로그인 필요 |
| 계정 삭제 | 로그인 필요 |

## 5-5. 로그인 후 처리

```text
로그인 성공
→ 기존 로컬 데이터 동기화 확인
→ 사이드바 또는 직전 화면 복귀
```

## 5-6. 로그인 실패

```text
로그인하지 못했어요.
잠시 후 다시 시도해주세요.

[다시 시도]
[닫기]
```

---

# 6. 마이페이지

## 6-1. 역할

마이페이지는 사용자가 저장한 일정과 선호 활동을 관리하는 화면이다.

## 6-2. 화면 구조

```text
마이페이지

[프로필 카드]
YongJin
yongjin@example.com

내 일정
- 저장된 D-DAY
- 완료된 D-DAY

나의 설정
- 선호 활동 변경
```

## 6-3. 로그인 전 마이페이지

```text
마이페이지

D-DAY를 안전하게 저장하려면 로그인해보세요.
여러 기기에서도 일정을 확인할 수 있어요.

[Google로 계속하기]
[Apple로 계속하기]
[Kakao로 계속하기]

내 일정
- 저장된 D-DAY
- 완료된 D-DAY

나의 설정
- 선호 활동 변경
```

---

# 7. 저장된 D-DAY

## 7-1. 역할

사용자가 저장한 전체 예정 일정을 관리한다.

D-DAY 탭이 가까운 일정 중심이라면, 저장된 D-DAY 화면은 전체 일정 리스트 관리 화면이다.

## 7-2. 화면 구조

```text
저장된 D-DAY

다가오는 일정

부산 여행
6/21 ~ 6/23 · D-28
부산 · 해변 / 카페/맛집
추천

서울숲 피크닉
5/30 · D-7
성수동 · 피크닉/도시산책
보통

제주도 가족여행
7/12 ~ 7/15 · D-49
제주 · 해변 / 사진/뷰
강력추천

[일정 추가]
```

## 7-3. 리스트 카드 정보

| 항목 | 설명 |
|---|---|
| 일정명 | 사용자가 저장한 title |
| 날짜/기간 | start_date ~ end_date |
| D-Day | D-28, D-7 등 |
| 지역 | display_location |
| 활동 | 최대 3개 |
| 현재 등급 | 강력추천/추천/보통/비추천 |

## 7-4. 카드 클릭 시

```text
D-DAY 상세 화면으로 이동
```

## 7-5. 일정 추가

```text
[일정 추가]
→ D-DAY 새로 만들기 직접 입력 폼
```

## 7-6. 정렬

MVP 기본 정렬:

```text
다가오는 날짜 오름차순
```

---

# 8. 완료된 D-DAY

## 8-1. 결정사항

완료된 D-DAY는 MVP에 포함한다.  
단, MVP에서는 단순 리스트로 제공한다.

## 8-2. 역할

이미 지난 일정을 보관하고 확인한다.

## 8-3. 화면 구조

```text
완료된 D-DAY

제주 여행
2026.04.12 ~ 04.14
제주 · 해변 / 카페/맛집

강릉 캠핑
2026.03.20 ~ 03.22
강릉 · 캠핑

여수 여행
2026.02.10 ~ 02.12
여수 · 해변 / 전시/문화
```

## 8-4. MVP 기능

```text
상세 보기
삭제
```

## 8-5. 다시 일정 만들기

MVP에서는 제외한다.

```text
다시 일정 만들기 = Phase 1.5
```

Phase 1.5 검토안:

```text
완료된 D-DAY
→ 다시 일정 만들기
→ D-DAY 새로 만들기 폼
→ 기존 지역/활동 prefill
→ 날짜만 새로 선택
```

---

# 9. 선호 활동 변경

## 9-1. 진입점

```text
사이드바
→ 마이페이지
→ 선호 활동 변경
```

또는:

```text
TODAY
→ 선호 활동 설정하기
```

## 9-2. 연결 화면

기존 `ONBOARDING & ACTIVITY PREFERENCE Spec v1.0`의 선호 활동 설정 화면을 사용한다.

## 9-3. 핵심 정책

```text
1~5개 선택 가능
선택한 활동만 TODAY에 노출
DISCOVER / D-DAY에서는 선호 활동 우선 노출
```

---

# 10. 설정 화면

## 10-1. 역할

설정 화면은 앱 동작, 권한, 계정, 정책 정보를 관리한다.

## 10-2. 화면 구조

```text
설정

알림
- 알림 설정

위치
- 위치 설정

계정
- 계정 관리

데이터 및 개인정보
- 데이터 출처
- 개인정보 처리방침
- 서비스 이용약관

지원
- 문의하기
- 앱 버전
```

## 10-3. 메뉴 목록

| 메뉴 | 연결 |
|---|---|
| 알림 설정 | NOTIFICATION SETTINGS |
| 위치 설정 | LOCATION & REGION SELECTION |
| 계정 관리 | 계정 관리 화면 |
| 데이터 출처 | 데이터 출처 화면 |
| 개인정보 처리방침 | 웹뷰 또는 외부 링크 |
| 서비스 이용약관 | 웹뷰 또는 외부 링크 |
| 문의하기 | 이메일 또는 문의 폼 |
| 앱 버전 | 현재 앱 버전 표시 |

---

# 11. 위치 설정

## 11-1. 역할

사용자의 기본 위치와 위치 권한 상태를 관리한다.

## 11-2. 화면 구조

```text
위치 설정

기본 위치
성수동

[기본 위치 변경]

현재 위치 권한
허용됨

[기기 위치 설정 열기]
```

## 11-3. 기본 위치 변경

```text
기본 위치 변경
→ LOCATION & REGION SELECTION 화면
→ 선택 위치를 default_location으로 저장
```

---

# 12. 알림 설정

## 12-1. 연결 화면

`NOTIFICATION SETTINGS Product Spec v1.0`을 사용한다.

## 12-2. 핵심 정책

```text
전체 알림 기본 OFF
전체 알림 ON 시 기본 D-DAY 알림 ON
변동 알림 OFF
안전 알림 OFF
마케팅 알림 OFF
조용한 시간대 없음
```

---

# 13. 계정 관리

## 13-1. 역할

로그인 상태 확인, 로그인/로그아웃, 계정 삭제를 관리한다.

## 13-2. 로그인 전

```text
계정 관리

로그인하지 않았어요.
D-DAY를 안전하게 저장하고 여러 기기에서 확인하려면 로그인해주세요.

[Google로 계속하기]
[Apple로 계속하기]
[Kakao로 계속하기]
```

## 13-3. 로그인 후

```text
계정 관리

로그인 정보
YongJin
yongjin@example.com

연결 계정
Google 계정

계정 관리
[로그아웃]
[계정 삭제]
```

## 13-4. 로그아웃

```text
로그아웃할까요?
이 기기에서 계정 연결이 해제됩니다.

[로그아웃]
[취소]
```

## 13-5. 계정 삭제

```text
계정을 삭제할까요?

계정을 삭제하면 저장된 D-DAY, 선호 활동, 설정 정보가 삭제되며 복구할 수 없어요.

[계정 삭제]
[취소]
```

## 13-6. 계정 삭제 확인

계정 삭제는 위험 작업이므로 2단계 확인을 사용한다.

```text
정말 삭제하시겠어요?

삭제 후에는 데이터를 복구할 수 없어요.

[영구 삭제]
[취소]
```

---

# 14. 데이터 출처

## 14-1. 결정사항

데이터 출처 화면은 MVP에 포함한다.

## 14-2. 역할

ggg가 사용하는 날씨/기후 데이터의 출처와 한계를 설명한다.

## 14-3. 화면 구조

```text
데이터 출처

기상 데이터
- 기상청 단기 예보
- Open-Meteo 보조 예보
- AirKorea 미세먼지/대기질

기타 데이터
- 일출/일몰 계산
- 과거 기후 데이터

주의 사항
예보는 실제 날씨와 다를 수 있어요.
중요한 야외 활동 전에는 최신 정보를 확인해주세요.
```

## 14-4. 주의 문구

```text
ggg의 날씨 점수는 의사결정을 돕기 위한 참고 정보입니다.
실제 날씨와 현장 상황은 달라질 수 있으므로, 중요한 야외 활동 전에는 최신 예보와 현장 공지를 함께 확인해주세요.
```

---

# 15. 문의하기

## 15-1. MVP 방식

MVP에서는 이메일 연결 또는 간단한 문의 폼을 사용한다.

```text
문의하기
→ 이메일 앱 열기
```

## 15-2. 기본 수집 항목

문의 폼을 제공하는 경우:

```text
문의 유형
문의 내용
연락처
앱 버전
기기 정보
```

---

# 16. 앱 버전

## 16-1. 표시

```text
앱 버전
v1.0.0
```

## 16-2. 추가 정보

MVP에서는 앱 버전만 표시한다.  
업데이트 확인 기능은 Phase 1.5 이후 검토한다.

---

# 17. Empty / Error 상태

## 17-1. 저장된 D-DAY 없음

```text
아직 저장된 일정이 없어요.
좋은 날짜와 장소를 찾아볼까요?

[DISCOVER로 이동]
[직접 일정 만들기]
```

## 17-2. 완료된 D-DAY 없음

```text
완료된 일정이 아직 없어요.
저장한 일정이 지나면 이곳에서 확인할 수 있어요.
```

## 17-3. 로그인 실패

```text
로그인하지 못했어요.
잠시 후 다시 시도해주세요.

[다시 시도]
```

## 17-4. 계정 삭제 실패

```text
계정을 삭제하지 못했어요.
잠시 후 다시 시도해주세요.

[다시 시도]
```

## 17-5. 데이터 출처 로딩 실패

```text
데이터 출처 정보를 불러오지 못했어요.
잠시 후 다시 시도해주세요.
```

---

# 18. 데이터 모델 영향

## 18-1. user_profile

```json
{
  "user_id": "string",
  "display_name": "YongJin",
  "email": "yongjin@example.com",
  "auth_provider": "google | apple | kakao",
  "profile_image_url": "string | null",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

## 18-2. sidebar_counts

```json
{
  "saved_dday_count": 3,
  "completed_dday_count": 5,
  "preferred_activity_count": 3
}
```

---

# 19. 계측 이벤트

```text
sidebar_opened
sidebar_closed
sidebar_login_clicked
sidebar_menu_clicked

mypage_opened
mypage_saved_dday_clicked
mypage_completed_dday_clicked
mypage_activity_preference_clicked

saved_dday_list_opened
saved_dday_card_clicked
saved_dday_add_clicked

completed_dday_list_opened
completed_dday_card_clicked
completed_dday_deleted

settings_opened
settings_menu_clicked

login_opened
login_provider_clicked
login_success
login_failed

account_management_opened
logout_clicked
logout_success
account_delete_clicked
account_delete_confirmed
account_delete_success
account_delete_failed

data_sources_opened
inquiry_clicked
```

## 이벤트 필드 예시

```json
{
  "entry_point": "sidebar | mypage | settings",
  "auth_provider": "google | apple | kakao | none",
  "login_status": "logged_in | guest",
  "menu_name": "saved_dday | completed_dday | notification_settings",
  "saved_dday_count": 3,
  "completed_dday_count": 5
}
```

---

# 20. MVP 포함 / 제외

## 20-1. 포함

- 사이드바
- 로그인 전/후 프로필 영역
- Google 로그인
- Apple 로그인
- Kakao 로그인
- 마이페이지
- 저장된 D-DAY 리스트
- 완료된 D-DAY 단순 리스트
- 선호 활동 변경 진입
- 설정 화면
- 알림 설정 진입
- 위치 설정 진입
- 계정 관리
- 로그아웃
- 계정 삭제
- 데이터 출처 화면
- 개인정보 처리방침
- 서비스 이용약관
- 문의하기
- 앱 버전 표시
- Empty/Error 상태
- 기본 계측 이벤트

## 20-2. 제외

- 다시 일정 만들기
- 저장된 D-DAY 고급 필터
- 완료된 D-DAY 통계/리포트
- 프로필 이미지 편집
- 닉네임 편집
- 데이터 내보내기
- 여러 계정 연결
- 소셜 공유
- 인앱 고객센터 채팅
- 앱 업데이트 확인
- 구독/결제 관리

---

# 21. 최종 요약

```text
사이드바
→ 프로필 영역
→ 마이페이지
   ├── 저장된 D-DAY
   ├── 완료된 D-DAY
   └── 선호 활동 변경
→ 설정
   ├── 알림 설정
   ├── 위치 설정
   ├── 계정 관리
   ├── 데이터 출처
   ├── 개인정보 처리방침
   ├── 서비스 이용약관
   ├── 문의하기
   └── 앱 버전
```

MVP에서는 관리 기능을 과도하게 확장하지 않고, 저장 일정·선호 활동·알림·위치·계정·데이터 신뢰 정보에 집중한다.
