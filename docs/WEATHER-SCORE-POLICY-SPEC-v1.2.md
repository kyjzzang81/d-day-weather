# WEATHER SCORE POLICY SPEC (MVP)

## Version
**v1.2** — Weather Score 정책 기준 문서

## Document Type
Product / Policy Specification

## Status
MVP Draft — policy baseline

---

# 0. 문서 역할

이 문서는 ggg의 Weather Score에 대한 **상위 정책 기준 문서**다.

이 문서는 다음을 정의한다.

```text
점수 판단 기준
활동 카테고리
Activity Profile 매핑
데이터 기간 전략
Fatal Rule / 안전 하한선
Theme Overlay
UI Grade / 도트 / 색상 표현
```

개발 구현 방식, TypeScript 인터페이스, Edge Function 구조, 로그 저장 방식은 별도 문서인
`WEATHER-SCORE-ENGINE-IMPLEMENTATION-SPEC`에서 정의한다.

정책/임계값/카테고리/데이터 기간이 구현 문서와 충돌할 경우, 본 문서를 우선 기준으로 한다.

### v1.1 → v1.2 변경 요약

| 영역 | v1.1 | v1.2 |
|---|---|---|
| **Activity Profile 명칭** | outdoor_exposed / outdoor_relax 등 단독 | **유지** + Activity Category 10개 매핑표 명시 |
| **점수 임계** | 90/75/55/0 | **85/70/50/0** (룰셋 v1.0 정합) |
| **데이터 기간** | "D-90 장기 패턴, D-14 실제 예보" 모호 | **단계별 데이터 기간 매트릭스 신설** (평균 15년 / 극단 10년 / 강수 30년 / 변동성 30년 풀) |
| **Theme Overlay** | family_kids + pet_friendly | **family_kids만 MVP**, pet은 Phase 2 보류 |
| **Category-Profile 매핑** | 일부 예시만 | **10개 전체 매핑표** |

---

# 1. 문서 목적

이 문서는 ggg의 장소 기반 날씨 점수 계산 구조를 정의한다.

ggg의 weather score는 단순히 날씨가 좋은지 나쁜지를 판단하는 것이 아니라, 사용자가 선택한 장소와 활동 맥락에 따라 **"이 일정이 실행하기 좋은 상태인가?"** 를 판단하기 위한 의사결정 점수다.

핵심 원칙은 다음과 같다.

> 동일한 날짜와 동일한 날씨라도, 장소의 category와 activity profile에 따라 score는 다르게 계산된다.

예시:

```text
비 10mm

해수욕장: uhm..
미술관: great
카페: great
캠핑: uhm..
```

---

# 2. 전체 계산 구조

Weather Score Engine은 아래 흐름으로 동작한다.

```text
Place
→ Activity Category (사용자 노출)
→ Activity Profile (내부 계산)
→ Base Weather Weighting (룰셋 v1.0)
→ Theme Overlay
→ Penalty Calculation
→ Fatal Rule / Range Rule (안전 하한선)
→ 0~100 Score
→ UI Grade
```

| 단계 | 역할 |
|---|---|
| Place | 사용자가 저장하거나 탐색하는 장소 |
| Activity Category | 사용자에게 보이는 활동 분류 (10개, 룰셋 v1.0) |
| Activity Profile | 날씨 점수 계산을 위한 내부 행동 유형 |
| Base Weather Weighting | 활동 유형별 날씨 민감도 (룰셋 v1.0 가중치 매트릭스) |
| Theme Overlay | 아이 동반 등 사용자 맥락 보정 |
| Penalty Calculation | 날씨 요소별 감점 계산 |
| Fatal Rule / Range Rule | 안전 하한선 또는 일정 범위 기준 보정 |
| Score | DB에 저장되는 0~100 정량 점수 |
| UI Grade | 사용자에게 노출되는 4단계 등급 |

---

# 3. 핵심 개념 정의

## 3-1. Category → Activity Category (v1.2 갱신)

v1.2에서는 룰셋 v1.0의 10개 활동 카테고리를 사용자 노출 단위로 채택한다.

| 사용자 노출 (한글) | 코드 |
|---|---|
| 해변 | beach |
| 등산/트레킹 | hiking |
| 캠핑 | camping |
| 일출/일몰 | scenic |
| 사진/뷰 | photo |
| 피크닉/도시산책 | urban |
| 카페/맛집 | cafe |
| 축제/이벤트 | festival |
| 온천/리조트 | spa |
| 전시/문화 | indoor |

### Activity Category 원칙

- 장소당 대표 category는 1개만 지정한다.
- 복수 category는 Phase 2 이후 검토한다.
- category는 사용자 노출용 개념이며, score 계산은 activity profile을 사용한다.

---

## 3-2. Activity Profile (v1.2 매핑표 명시)

Activity Profile은 날씨 score 계산을 위한 내부 행동 유형이다.

### Category → Profile 매핑표 (v1.2 신설)

| Activity Category (노출) | Activity Profile (내부) | 행동 특성 |
|---|---|---|
| 해변 (beach) | outdoor_exposed | 야외 노출, 직사광선 |
| 등산/트레킹 (hiking) | outdoor_active | 야외 활동, 신체 부하 |
| 캠핑 (camping) | outdoor_stay | 야외 체류, 야간 노출 |
| 일출/일몰 (scenic) | outdoor_exposed | 야외 노출, 단시간 |
| 사진/뷰 (photo) | outdoor_exposed | 야외 노출 |
| 피크닉/도시산책 (urban) | outdoor_relax | 야외 휴식, 도심 |
| 카페/맛집 (cafe) | indoor_social | 실내 + 짧은 이동 |
| 축제/이벤트 (festival) | outdoor_relax | 야외 군중, 장시간 |
| 온천/리조트 (spa) | indoor_stay | 실내 + 야외 노천 부분 |
| 전시/문화 (indoor) | indoor_visit | 실내 전체 |

### Activity Profile 원칙

- MVP에서는 category와 activity profile을 위 표대로 매핑한다.
- 하나의 category는 하나의 activity profile만 가진다.
- activity profile은 사용자에게 직접 노출하지 않는다.
- weather weighting은 activity profile 기준으로 관리한다.

---

## 3-3. Theme Overlay (v1.2 축소)

Theme Overlay는 장소 자체가 아니라 사용자 상황을 반영하는 보정값이다.

예:

```text
서울숲
→ activity_category: urban (피크닉/도시산책)
→ activity_profile: outdoor_relax
→ family_kids overlay 적용 시 UV·PM2.5 안전 임계 강화
```

### Theme Overlay 원칙

```text
Category = 활동 특성
Activity Profile = 날씨 판단 방식
Theme Overlay = 사용자 상황
```

**v1.2 변경**: MVP 1.0에서는 family_kids만 지원. pet_friendly는 Phase 2 보류.

| theme | 설명 | MVP 1.0 |
|---|---|---|
| family_kids | 아이 동반 | ✅ 포함 |
| pet_friendly | 반려견 동반 | ❌ Phase 2 |

**가족 페르소나와의 관계**: 가족 페르소나(Persona C)는 Phase 2 보류이지만, family_kids **overlay는 옵션 보정으로 MVP 포함**. 페르소나와 overlay는 별개 개념.

MVP에서는 하나의 일정에 하나의 theme overlay만 적용한다. UI상 theme overlay도 1개만 선택 가능하다.

---

## 3-4. Weather Factor

Weather factor는 score 계산에 사용되는 핵심 날씨 요소다.

| key | 설명 | 단위 | 기본 사용 시점 |
|---|---|---:|---|
| rain_probability | 강수확률 | % | D-84~D-0 |
| rain_amount | 강수량 | mm/day | D-84~D-0 |
| wind_speed | 바람세기 | m/s | D-84~D-0 |
| pm25 | 초미세먼지 | ㎍/m³ | D-14~D-0 |
| uv_index | 자외선 | index | D-14~D-0 |
| feels_like_temp | 체감온도 | °C | D-14~D-0 |
| humidity | 습도 | % | D-14~D-0 |

**v1.2 변경**: humidity 추가, 시점 단계명을 D-DAY spec v2.0과 정합 (D-90→D-84, D-30→D-28).

### 데이터 해석 원칙 (v1.2 갱신 — §6 데이터 기간 매트릭스 참조)

- **D-84, D-28**에서는 **기상청 평년 + 최근 10년 트렌드 기반 추정값** 사용.
- **D-14부터**는 **Open-Meteo 14일 예보** 기반 실제 데이터 사용.
- **D-7부터**는 정밀 단기 예보로 갱신.
- **D-1, D-0**은 KMA 단기 + 실시간 관측 우선.
- D-84, D-28에서도 rain/wind/temp 관련 판단은 제공하되, **"예보"가 아니라 "패턴"임을 사용자에게 명시**.

---

# 4. Activity Profile 목록 (v1.2 카테고리 매핑 명시)

MVP에서는 아래 9개 activity profile을 사용한다 (룰셋 v1.0의 10개 카테고리가 9개 profile로 매핑됨 — outdoor_exposed에 3개 카테고리 매핑).

## 4-1. outdoor_exposed
**대표 카테고리**: 해변 / 일출/일몰 / 사진/뷰

**민감 요소**: UV (직사광선 노출), 풍속 (체감 저하), 강수, 미세먼지

**가중치 분포 (룰셋 v1.0 기반)**:
- 해변: 기온 0.30 / UV 0.20 / 풍속 0.20 / 강수 0.15 / PM2.5 0.10 / 습도 0.05
- scenic: 운량 0.25 / 강수 0.20 / 시정 0.20 / PM2.5 0.15 / 풍속 0.10 / 기온 0.10
- photo: PM2.5+시정 0.25 / 강수 0.20 / 풍속 0.20 / 기온 0.15 / 운량 0.15 / UV 0.05

## 4-2. outdoor_active
**대표 카테고리**: 등산/트레킹

**민감 요소**: 강수 (미끄럼), 풍속 (능선 위험), 기온 (체력 소모)

**가중치 분포**:
- 강수 0.30 / 풍속 0.25 / 기온 0.15 / PM2.5 0.10 / UV 0.10 / 습도 0.10

## 4-3. outdoor_stay
**대표 카테고리**: 캠핑

**민감 요소**: 강수 (지반·텐트), 풍속 (텐트 폴), 기온 (야간 저체온), 습도 (장비)

**가중치 분포**:
- 강수 0.25 / 풍속 0.25 / 기온 0.20 / 습도 0.15 / PM2.5 0.10 / UV 0.05

## 4-4. outdoor_relax
**대표 카테고리**: 피크닉/도시산책 / 축제/이벤트

**민감 요소**: 강수, 기온 (체류 시간 길음), 풍속, PM2.5

**가중치 분포**:
- 도시여행(urban): 기온 0.30 / 강수 0.25 / PM2.5 0.20 / 풍속 0.10 / 습도 0.10 / UV 0.05
- 축제(festival): 강수 0.30 / 풍속 0.20 / 기온 0.20 / UV 0.10 / PM2.5 0.10 / 습도 0.10

## 4-5. indoor_social
**대표 카테고리**: 카페/맛집

**민감 요소**: 매우 낮음 (실내 비중 높음). 이동 시간만 영향.

**가중치 분포**:
- 기온 0.30 / PM2.5 0.20 / 습도 0.20 / 강수 0.15 / 풍속 0.10 / UV 0.05

## 4-6. indoor_visit
**대표 카테고리**: 전시/문화 (박물관)

**민감 요소**: 거의 없음. 악천후 시 오히려 추천도 ↑.

**가중치 분포 (역방향 적용)**:
- 강수 0.30 (역방향) / PM2.5 0.35 (역방향) / 풍속 0.10 / 기온 0.10 / 습도 0.10 / UV 0.05

## 4-7. indoor_stay
**대표 카테고리**: 온천/리조트

**민감 요소**: 기온 (역방향, 추울수록 점수 ↑), 풍속 (노천탕 영향)

**가중치 분포**:
- 기온 0.30 (역방향, 0-15°C 강력추천) / 습도 0.20 / 풍속 0.20 / 강수 0.15 / PM2.5 0.10 / UV 0.05

상세 가중치는 룰셋 v1.0 `RULESET-v1.0.md` 참조.

---

# 5. 점수 산출 공식 (v1.2 임계값 갱신)

## 5-1. 기본 산출식

룰셋 v1.0 정합:

```
Score = (Σ wᵢ × Sᵢ) × ∏ Hⱼ

- Sᵢ: 6~7개 지표의 4등급 점수 (강력추천 100 / 추천 75 / 보통 50 / 비추천 20)
- wᵢ: 활동별 가중치 (가중치 합 = 1.0)
- Hⱼ: 안전 하한선 페널티 (위반 시 0, 미위반 시 1)
```

## 5-2. UI Grade 매핑 (v1.2 임계값 갱신)

| 점수 | DISCOVER 표현 | D-DAY/TODAY 표현 |
|---|---|---|
| 85~100 | gorgeous | 강력추천 |
| 70~84 | great | 추천 |
| 50~69 | good | 보통 |
| 0~49 | uhm.. | 비추천 |

**v1.2 변경**: 임계값 90/75/55 → 85/70/50 (룰셋 v1.0 + PRD v2.2 정합).

## 5-3. 화면별 표현 분기

| 화면 | 표현 |
|---|---|
| DISCOVER | 감정형 (gorgeous/great/good/uhm..) + 도트 |
| D-DAY | 행동형 (강력추천/추천/보통/비추천) + 도트 |
| TODAY | 행동형 (강력추천/추천/보통/비추천) |

---

# 6. 데이터 기간 매트릭스 (v1.2 신설)

ggg는 단일 30년 평년을 쓰지 않고, **단계별·변수별 차등 기간**을 적용한다 (PRD v2.2 §6, GLOSSARY v2.2.1 §7 참조).

## 6-1. 단계별 데이터 출처 매트릭스

| D-DAY 단계 | 사용 데이터 출처 |
|---|---|
| Stage 1: D-84 (시기 판단) | 기상청 평년 + 최근 10년 ASOS 트렌드 |
| Stage 2: D-28 (준비 시작) | 위 + 30년 풀 변동성 (P5/P95) |
| Stage 3: D-14 (예보 시작) | 위 + Open-Meteo 14일 예보 |
| Stage 4: D-7 (짐싸기) | Open-Meteo 14일 + 정밀 단기 |
| Stage 5: D-1 (최종 준비) | KMA 단기 + 실시간 관측 |
| DISCOVER 모든 플로우 | Stage 1과 동일 (평년 + 10년 트렌드) |

## 6-2. 변수별 데이터 기간 (Stage 1·2·DISCOVER 기준)

| 변수 | 권장 기간 | 근거 |
|---|---|---|
| 평균 기온 | **최근 15년 (2010–2024)** | Wilks(2013) MSE 최적, 한국 트렌드 +0.21°C/10년 |
| 폭염·열대야·극단치 | **최근 10년 (2015–2024)** | 30년 평년 대비 실제 위험 2~4배 과소표시 |
| 연·월 강수량 | **30년 평년 (KMA 1991–2020)** | 신호 대비 잡음 큼, n↑ 필요 |
| 집중호우·강수강도 | **최근 10~15년** | +17.83mm/10년 트렌드 뚜렷 |
| 일조·습도 | **최근 15~20년** | 중간 정도 트렌드 |
| 변동성 P5/P95 | **30년 풀** | Stage 2 변동성 산출용 |

## 6-3. Stage 3 이후 데이터 출처

D-14 이후로는 실제 예보 데이터를 사용하므로 위 기간 매트릭스 불필요.

| Stage | 주요 데이터 | 갱신 주기 |
|---|---|---|
| Stage 3 (D-14) | Open-Meteo 14일 예보 | 12시간 |
| Stage 4 (D-7) | Open-Meteo + KMA 정밀 | 6시간 |
| Stage 5 (D-1) | KMA 단기 + 실시간 관측 | 1시간 (D-1) / 30분 (D-0) |

## 6-4. 사용자 노출 데이터 출처 카피

- 메인 카피: **"기상청 30년 평년에 최근 10년 추세를 더한 분석"**
- 결과 화면 배지: "30년 + 최근 10년 기상청 데이터 기반"
- 데이터 푸터: "기상청 1991–2020 평년값 및 2015–2024 ASOS 관측 자료(62개 지점)"
- 통계 카피 (★ 차별화): "지난 30년 중 87% 적합" / "역대 5월 11일 중 5번째로 추움"

---

# 7. 안전 하한선 (Fatal Rule)

활동 점수와 무관하게 "비추천 + 안전 경고"로 강제하는 임계. 모든 야외 활동에 공통 적용.

룰셋 v1.0 §공통 안전 하한선 정합:

| 위험 요소 | 하드 컷오프 임계 |
|---|---|
| 폭염 | 일 최고 체감 ≥ 35°C (폭염경보) / ≥ 38°C (폭염중대경보) |
| 한파 | 일 최저 체감 ≤ −15°C 또는 한파경보 |
| 강풍 | 평균풍속 ≥ 14 m/s 또는 강풍특보 |
| 호우 | 시간당 ≥ 30 mm 또는 호우주의보 |
| 미세먼지 | PM2.5 ≥ 76 ㎍/m³ (매우나쁨) 또는 주의보 ≥ 75 2시간 지속 |
| 자외선 | UVI ≥ 11 (위험) |
| 시정 | 짙은안개주의보 (시정 ≤ 200m) |
| 해상 (해변만) | 풍랑주의보 |

**실내 활동(카페·박물관·온천 일부)에는 풍속·UV·미세먼지 하드컷이 적용되지 않으며**, 오히려 PM2.5 매우나쁨이나 호우 시 추천도 ↑.

---

# 8. Theme Overlay 보정 로직

## 8-1. family_kids (MVP 1.0 포함)

가족 동반 시 안전 강화 보정.

| 지표 | 일반 임계 | family_kids 임계 |
|---|---|---|
| UV | 강력추천 3-5 | 강력추천 3 이하 |
| PM2.5 | 강력추천 0-15 | 강력추천 0-10 |
| 기온 (체감) | 강력추천 활동별 | 폭염 임계 -3°C / 한파 임계 +3°C |
| 강수확률 | 활동별 | 활동별 임계 -10%p (더 엄격) |
| 실내 가중치 | 활동별 | indoor 카테고리 +15 보너스 |

## 8-2. pet_friendly (Phase 2 보류)

Phase 2 검토. v1.2 MVP에서 미적용.

---

# 9. 데이터 결측 시 Fallback

룰셋 v1.0과 정합 (룰셋 §데이터 결측 fallback 참조).

| 결측 지표 | 1차 대체 | 2차 대체 |
|---|---|---|
| PM2.5 | PM10 × 0.6 | CAI 등급 |
| 풍속 | 순간풍속 × 0.7 | 인접 AWS 평균 |
| 체감온도 | NWS Heat Index/Wind Chill | 기온만 표시 |
| UV | 위성 (천리안 2A) | 위도·시각·운량 추정 |
| 시정 | RH ≥ 95% + 풍속 < 2면 < 2km | PM10 농도 추정 |

**원칙**: 결측 지표는 가중치를 다른 지표로 비례 재분배하고 UI에 "데이터 부족" 배지를 표시한다.

---

# 10. UI Grade 출력 규칙

## 10-1. 점수 노출 금지

- DB 저장 점수 0~100은 UI에 노출 금지.
- 사용자에게는 4등급 라벨 + 도트 표시만 노출.

## 10-2. 색상 매핑

| Grade | 색상 |
|---|---|
| gorgeous / 강력추천 | 🟢 `#22C55E` |
| great / 추천 | 🟡 `#84CC16` |
| good / 보통 | ⚪ `#94A3B8` |
| uhm.. / 비추천 | 🔴 `#EF4444` |
| 안전 하한선 위반 | 🔴 + ⚠️ 아이콘 |

## 10-3. 도트 매핑

| Grade | Dot |
|---|---|
| gorgeous / 강력추천 | ●●● |
| great / 추천 | ●● |
| good / 보통 | ● |
| uhm.. / 비추천 | ◦ |

스크린리더 라벨 병기 의무.

---

# 11. v1.1 → v1.2 Changelog

### 변경
- §3-1 Category 정의를 룰셋 v1.0의 10개 활동 카테고리로 통일
- §3-2 Activity Profile 매핑표 전체 명시 (Category 10개 → Profile 7개)
- §3-3 Theme Overlay — family_kids만 MVP, pet_friendly Phase 2 보류
- §3-4 Weather Factor 시점 단계명 갱신 (D-90→D-84, D-30→D-28), humidity 추가
- §5-2 UI Grade 임계값 90/75/55 → 85/70/50 (룰셋 v1.0 정합)
- §5-3 화면별 표현 분기 명시
- §6 데이터 기간 매트릭스 신설 (단계별 + 변수별 차등)
- §7 안전 하한선 룰셋 v1.0 정합 (8개 항목)
- §8 family_kids 보정 로직 명시, pet_friendly 보류
- §9 데이터 결측 fallback 룰셋 정합
- §10 UI Grade 출력 규칙 명확화 (점수 비노출, 색상·도트)

### 추가
- §3-2 Category → Profile 매핑표 (10개 전체)
- §6 데이터 기간 매트릭스 (단계별, 변수별)
- §6-4 사용자 노출 데이터 출처 카피
- §8 Theme Overlay 보정 로직 (family_kids 임계값 강화)

### 제거
- 모호한 "장기 패턴" 기간 정의 (구체 기간 매트릭스로 대체)
- pet_friendly overlay (Phase 2 보류)
- 임계 90/75/55 (85/70/50로 갱신)
