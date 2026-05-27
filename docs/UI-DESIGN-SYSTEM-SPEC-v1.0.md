# UI Design System Spec

## Version
**v1.0** - GGG Weather Signal, KakaoPay-inspired App UI

## Status
MVP Draft

---

# 0. Foundation Reference

ggg의 제품 콘셉트는 `GGG Weather Signal`로 유지하되, 화면 조형은 카카오페이 앱처럼 밝고 둥근 피드형 UI로 정렬한다.

참조 기준:

```text
KakaoPay-like mobile app structure
Large white cards
Light gray background
Bold black typography
Soft graphic blocks
Floating bottom navigation
```

적용 결정:

- Primary action과 선택 상태는 기존 ggg blue를 유지한다.
- 기존 green, orange, red status color는 유지하되 green은 보조 컬러로 사용한다.
- 신호 체계는 `좋음 = blue`, `보통 = black`, `좋지 않음 = orange`를 기본으로 한다.
- 배경은 밝은 gray, 주요 섹션은 큰 white card로 구성한다.
- 카드 그림자는 낮게, border는 최소화한다.
- Typography는 더 크고 굵게, 핵심 제목은 800 weight 중심으로 둔다.
- ggg 고유 모티프인 signal dot, LocalContent card, date signal 구조는 유지한다.

---

# 1. Brand Concept

## Brand Name

```text
GGG Weather Signal
```

## One-line Definition

ggg는 날씨와 날짜에 맞춰 오늘 가볼 만한 로컬 콘텐츠의 신호를 보여주는 앱이다.

## Product Description

ggg는 단순 날씨앱이나 장소 추천앱이 아니다. 날짜, 날씨, 상황에 맞춰 사용자가 오늘 또는 특정 날짜에 해볼 만한 로컬 콘텐츠를 발견하고 저장하게 돕는다.

콘텐츠 범위:

```text
전시
팝업
축제
둘레길
마을탐방
도서관 프로그램
북카페
ggg 큐레이션 콘텐츠
```

## Brand Keywords

```text
Weather Signal
Local Content Guide
Service Blue
KakaoPay-like Cards
Bold Black Typography
Soft Graphic Blocks
Pretendard
4px Grid
Low Shadow
Strong Hierarchy
Useful, but memorable
```

## Design Goals

- 사용자가 앱을 열자마자 오늘의 상태를 직관적으로 이해해야 한다.
- 추천 콘텐츠는 실용적이지만 기억에 남아야 한다.
- 장소/콘텐츠 카드는 빠르게 비교 가능해야 한다.
- 날씨 신호는 앱 전체에 반복되는 브랜드 모티프가 되어야 한다.

---

# 2. Visual Principles

## 2-1. Hero는 결론만 말한다

- Hero에서는 비, 바람, 먼지 수치를 반복하지 않는다.
- Hero는 `오늘의 신호`와 짧은 판단 문장만 보여준다.
- 세부 지표는 `날씨 체크`에서 보여준다.

## 2-2. 날씨 정보는 Signal로 표현한다

- `GOOD`, `CAUTION`, `BAD` 같은 등급은 단순 배지가 아니라 signal dot과 함께 반복한다.
- Signal dot은 앱의 핵심 브랜드 모티프다.
- 사용자는 숫자를 먼저 해석하는 것이 아니라 신호를 먼저 읽어야 한다.

## 2-3. 콘텐츠 카드는 정보형이지만 밋밋하면 안 된다

- `title`은 콘텐츠명 중심으로 쓴다.
- `subtitle`은 지역/장소 + 유형 + 기간/거리로 구성한다.
- `grade`와 `basisLabel`은 명확히 노출한다.
- `verifiedBadges`는 1~2줄까지만 노출한다.

## 2-4. Blue는 행동과 선택이다

- Primary CTA, 선택 상태, active tab은 SocarFrame primary blue를 사용한다.
- 콘텐츠 저장, 날짜 선택, 필터 선택처럼 사용자가 행동하는 곳은 blue를 중심으로 정리한다.
- Blue를 상태 신호로 오해하지 않도록 GOOD/CAUTION/BAD와 역할을 분리한다.

## 2-5. Status color는 신호다

- `GOOD` / `GREAT` 계열은 blue를 사용한다.
- 보통/주의 전 단계는 black 계열을 사용한다.
- 좋지 않음은 orange 계열을 사용한다.
- Green은 성공/저장 완료/보조 positive feedback에 사용한다.
- Red는 오류, 위험, 알림 dot처럼 제한적으로 사용한다.

## 2-6. Typography는 구조다

- 화면 제목과 카드 제목은 black text strong 계열로 명확히 보이게 한다.
- 본문과 meta는 primary/secondary/tertiary 계층을 지킨다.
- 주요 제목과 CTA는 800 weight 중심으로 둔다.

## 2-7. Light gray 배경과 큰 white card를 사용한다

- App background는 거의 흰색에 가까운 light gray를 사용한다.
- 일반 카드는 큰 radius의 white surface로 구성한다.
- Border는 최소화하고 낮은 shadow로만 층을 만든다.

---

# 3. Color System

## 3-1. Core

```css
--color-ink: #141A24;
--color-bg: #F3F4F6;
--color-surface: #FFFFFF;
--color-surface-muted: #F7F8FA;
--color-line: #EEF0F3;
--color-primary: #0078FF;
--color-primary-soft: #EBF5FF;
```

## 3-2. Text

```css
--color-text-strong: #141A24;
--color-text-primary: #191F28;
--color-text-secondary: #6B7078;
--color-text-tertiary: #A7ADB7;
--color-text-disabled: #D4D8E1;
--color-text-inverse: #FFFFFF;
```

## 3-3. Action / Brand

```css
--color-service-socar: #0078FF;
--color-primary-regular: #0078FF;
--color-primary-strong: #0069FF;
--color-primary-heavy: #0052E0;
--color-primary-weak: #EBF5FF;
```

## 3-4. Status

```css
--color-good: #0078FF;
--color-good-soft: #EBF5FF;
--color-normal: #141A24;
--color-normal-soft: #F7F8FA;
--color-warning: #FF8800;
--color-warning-soft: #FFF8E6;
--color-positive-support: #04CA81;
--color-positive-support-soft: #E6FEF0;
--color-danger: #FF3A5B;
--color-danger-soft: #FFF0F3;
--color-neutral: #697383;
--color-neutral-soft: #F7F8FA;
```

## 3-5. Usage

| Role | Token |
|---|---|
| App background | `--color-bg` |
| Card background | `--color-surface` |
| Hero background | `--color-surface` with soft graphic block |
| Primary button | `--color-primary-regular` |
| Selection / active | `--color-primary-regular` |
| Good signal | `--color-primary-regular` |
| Normal signal | `--color-ink` |
| Bad signal | `--color-warning` |
| Error / alert | `--color-danger` |
| Border | `--color-line` |

## 3-6. Forbidden Usage

- 보라색 그라데이션 중심 UI
- 모든 CTA를 오렌지로 처리
- 카드마다 다른 강한 색상 사용
- 색상만으로 상태를 구분하는 디자인
- Primary action을 검정 버튼으로 고정하는 디자인

---

# 4. Typography

타이포그래피는 SocarFrame Typography scale을 따른다.

## 4-1. Font

```text
Pretendard
Fallback: system-ui, Apple SD Gothic Neo, Noto Sans KR
```

한국어 가독성을 고려해 `700 / 600 / 500 / 400` 계층을 명확히 한다.

## 4-2. Scale

| Style | Size / Weight | Usage |
|---|---:|---|
| Display1 | 40px / 700 | Hero signal label |
| Heading1 | 26px / 700 | 화면 핵심 제목 |
| Heading2 | 24px / 700 | 큰 섹션 제목 |
| Heading3 | 22px / 700 | 상세 화면 제목 |
| Title1 | 18px / 600 | 카드 묶음, sheet 제목 |
| Title2 | 16px / 600 | 카드 title |
| Title3 | 14px / 600 | 주요 meta |
| Body2 | 16px / 400 | 본문 |
| Body3 | 14px / 400 | 일반 설명 |
| Caption1 | 12px / 600 | badge, status label |
| Caption2 | 12px / 500 | 보조 label |

## 4-3. Principles

- 한 화면에 가장 강한 텍스트는 Hero와 콘텐츠 카드 title이다.
- 설명 문구는 길게 쓰지 않는다.
- 카드 내부에서 굵은 텍스트를 남발하지 않는다.
- status label은 짧고 굵게 보여준다.
- 숫자보다 signal label을 먼저 읽히게 한다.
- Letter spacing은 Display 계열에서만 제한적으로 사용한다.

---

# 5. Radius / Border / Shadow

## 5-1. Radius

```css
--radius-xs: 8px;
--radius-sm: 10px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-xl: 20px;
--radius-xxl: 28px;
--radius-sheet: 32px;
--radius-pill: 999px;
```

Usage:

| Component | Radius |
|---|---:|
| Hero card | 28px |
| Content card | 24px |
| Weather check card | 20px |
| Small chip | pill |
| Bottom sheet | 32px top radius |
| Thumbnail | 16px |

## 5-2. Border

```css
--border-default: 1px solid #EEF0F3;
--border-weak: 1px solid #F7F8FA;
--border-accent: 1.5px solid #0078FF;
```

## 5-3. Shadow

```css
--shadow-card: 0 1px 2px rgba(20, 26, 36, 0.03);
--shadow-raised: 0 10px 28px rgba(20, 26, 36, 0.08);
--shadow-sheet: 0 -14px 36px rgba(20, 26, 36, 0.18);
```

## 5-4. Principles

- 일반 카드는 큰 white surface와 낮은 shadow 중심이다.
- 모든 카드가 둥둥 떠 보이면 안 된다.
- sheet, floating CTA, sticky header에만 강한 shadow를 허용한다.
- Border는 최소화하고 필요한 구분선만 사용한다.

---

# 6. Signal Motif

Signal dot은 ggg의 핵심 시각 모티프다.

## 6-1. Usage

Signal dot 사용 위치:

```text
Hero의 GOOD / CAUTION / BAD 앞
시간별 변화 dot timeline
콘텐츠 카드의 grade
저장된 콘텐츠 카드의 상태
bottom tab active indicator
날짜 선택 상태
알림 상태
```

## 6-2. Signal Dot

```text
size: 8~12px
GOOD/GREAT: blue
CAUTION: black
BAD: orange
Neutral: gray
```

## 6-3. Signal Line

시간별 변화에서 사용한다.

```text
09   12   15   18
●────●────●────●
GOOD GOOD CAUTION GOOD
```

## 6-4. Principles

- 점과 선은 장식이 아니라 상태를 읽는 구조여야 한다.
- Dot motif는 너무 많이 남발하지 않는다.
- 한 카드에는 signal dot 1개를 기본으로 한다.
- Signal dot은 label과 함께 사용한다.

---

# 7. Layout System

## 7-1. Mobile-first Layout

```text
화면 최대 너비: 기존 mobile shell 유지
screen padding: 18~20px
section gap: 20px
card gap: 12px
chip gap: 8px
```

## 7-2. Home Layout

```text
1. Header
2. Situation selector
3. Hero full card
4. Weather check horizontal cards
5. Time signal / 시간별 변화
6. Today recommendations
7. Search CTA
```

## 7-3. Scroll Behavior

- Hero는 초기 진입 시 크게 보인다.
- 스크롤 후에는 compact 상태로 축소 가능하다.
- Hero compact는 signal label + 짧은 title만 남긴다.

---

# 8. Components

## 8-1. Hero Signal Card

역할:

```text
오늘의 결론을 보여준다.
```

구성:

```text
situation selector: 일상 ▼
label: 오늘의 신호
weather icon or illustration
signal: ● GOOD
title: 오늘은 무난해요
description: 비와 바람 부담이 크지 않아요.
```

금지:

- 비/바람/먼지 수치를 Hero에 반복 노출하지 않는다.
- Hero 안에 날씨 체크 카드와 동일한 정보를 넣지 않는다.
- Hero를 일반 정보 카드처럼 평범하게 만들지 않는다.

## 8-2. Weather Check

역할:

```text
Hero 결론의 근거를 보여준다.
```

구성:

```text
section title: 날씨 체크
horizontal card row
비 / 바람 / 먼지 / 체감
value + statusLabel
```

형태:

```text
가로 정렬 카드
horizontal scroll 가능
카드별 72~88px width
```

예:

```text
비
20%
낮음

바람
2m/s
약함

먼지
좋음
외출 가능

체감
22°
적정
```

## 8-3. Time Signal

역할:

```text
시간 흐름을 보여준다.
```

구성:

```text
section title: 시간별 변화
right action: 더보기 >
dot timeline
오전 / 오후 / 저녁 또는 시간대 요약
```

필수:

- `더보기 >`가 반드시 있어야 한다.
- 더보기 클릭 시 1시간 단위 시간별 날씨 bottom sheet를 연다.
- Sheet title은 `시간별 날씨`다.

## 8-4. Local Content Card

역할:

```text
추천 대상은 Place가 아니라 LocalContent다.
```

구성:

```text
thumbnail
title
subtitle
source badge
signal grade
basis label
verified badges
save icon optional
```

specific_content 카드 예:

```text
나이키 성수 팝업
팝업 · 성수동 · 6/12~6/30
● GOOD · 예보 기준
실내 · 기간 한정 · 예약 불필요
```

curated_content 카드 예:

```text
성수 팝업 구경
ggg 추천 · 성수동 · 연인·친구
● GOOD · 예보 기준
실내 중심 · 도보 이동 · 카페 연결
```

원칙:

- `title`에는 콘텐츠명을 넣는다.
- 특정 콘텐츠는 공식명을 명확히 쓴다.
- curated 콘텐츠는 행동 중심 제목을 쓴다.
- 장소명만 `title`로 쓰지 않는다.

## 8-5. Situation Selector

사용자 화면에서 `외출 모드`라는 표현을 쓰지 않는다.

상단:

```text
일상 ▼
액티비티 ▼
휴식 ▼
아이와 ▼
연인·친구 ▼
```

Bottom Sheet:

```text
title: 오늘은

Options:
일상
액티비티
휴식
아이와
연인·친구

Button:
이렇게 볼게요
```

옵션 설명 문구는 쓰지 않는다.

## 8-6. Date Selector

Discover에서 사용한다.

Options:

```text
오늘
이번 주말
날짜 선택
```

선택 상태:

```text
primary blue fill 또는 blue outline
basis label은 작은 badge로 표시
```

Labels:

```text
오늘 기준
6월 15일 기준 · 예보 기준
6월 15일 기준 · 최근 10년 경향 기준
```

## 8-7. Save / Reminder Sheet

역할:

```text
콘텐츠를 날짜와 함께 저장한다.
```

Title:

```text
언제 알림 받을까요?
```

Options:

```text
하루 전 오전 9시
당일 오전 8시
날씨가 바뀌면
알림 없이 저장
```

CTA:

```text
저장하기
```

---

# 9. Screen Patterns

## 9-1. Home / Today

구조:

```text
Header
Situation selector
Hero Signal Card
Weather Check
Time Signal
Today Recommendations
Search CTA
```

섹션명:

```text
오늘의 신호
날씨 체크
시간별 변화
오늘의 추천
다른 콘텐츠도 볼까요?
```

## 9-2. Discover

구조:

```text
search input: 지역이나 콘텐츠 검색
date selector
situation selector
condition chips
content list
```

검색 목적:

```text
1. 특정 콘텐츠 검색
   - 나이키 성수 팝업
   - 파주북소리 축제
   - 헤이리 특정 전시회

2. 추천형 탐색
   - 6월 15일 성수에서 볼 만한 것
   - 비 오는 날 파주 추천
```

## 9-3. Content Detail

구조:

```text
image
title
source/type/date
date selector
signal card
weather check
time signal
content info
CTAs:
  - 길찾기
  - 공식 페이지
  - 날짜 저장
```

## 9-4. Saved

화면명:

```text
저장
```

Tabs:

```text
전체
예정
가보고 싶어요
다녀왔어요
```

예정:

```text
날짜가 정해진 SavedContent
알림 가능
```

가보고 싶어요:

```text
날짜 없이 저장된 SavedContent
CTA: 날짜 정하기
```

다녀왔어요:

```text
방문 완료 상태
```

---

# 10. UX Writing Rules

## 10-1. Principles

- 짧게 쓴다.
- 설명하지 말고 보여준다.
- UI만 봐도 알 수 있는 안내문은 제거한다.
- 사용자 화면에서 내부 기획 용어를 쓰지 않는다.

## 10-2. Forbidden Terms

```text
외출 모드
판단 기준
검증 가능한 데이터 기반
예보 전 데이터 보완
장소 추천만으로 한정하는 표현
실패 없는
완벽한
분위기 좋은
조용한
```

## 10-3. Recommended Terms

```text
오늘의 신호
오늘은 무난해요
비와 바람 부담이 크지 않아요.
날씨 체크
시간별 변화
오늘의 추천
지역이나 콘텐츠 검색
예보 기준
최근 10년 경향 기준
날짜 저장
알림 설정
저장
예정
가보고 싶어요
다녀왔어요
```

---

# 11. Accessibility / Touch Target

- 모든 주요 버튼 최소 높이는 44px 이상이다.
- Chip 최소 높이는 36px 이상이다.
- Bottom sheet option row 최소 높이는 52px 이상이다.
- Status는 색상만으로 구분하지 않고 텍스트 label을 포함한다.
- Blue/green/orange 조합은 대비를 확인한다.
- 작은 badge는 11px 이하로 내려가지 않는다.
- 시간별 변화의 dot timeline은 텍스트 보조 label을 함께 제공한다.

---

# 12. Do / Don't

## Do

- Signal dot을 반복 모티프로 사용한다.
- Hero는 결론만 보여준다.
- 날씨 체크는 수치 근거를 보여준다.
- 콘텐츠 카드는 title을 강하게 보여준다.
- 특정 콘텐츠는 공식명을 명확히 쓴다.
- ggg 큐레이션 콘텐츠는 행동형 제목을 쓴다.
- CTA와 선택 상태는 primary blue를 기본으로 한다.

## Don't

- Hero에 비/바람/먼지를 반복 노출하지 않는다.
- 모든 카드를 강한 그림자로 띄우지 않는다.
- 보라색 그라데이션을 사용하지 않는다.
- 검정 버튼을 primary action으로 고정하지 않는다.
- 콘텐츠를 모두 장소명으로만 표현하지 않는다.
- `외출 모드`라는 말을 사용자 화면에 쓰지 않는다.
- 긴 설명 문구를 카드 안에 넣지 않는다.
- 추천 코스 기능을 MVP 핵심으로 넣지 않는다.

---

# 13. Implementation Notes

추후 코드 구현 시 참고할 내용이다.

## 13-1. File Candidates

```text
src/design/tokens.ts
src/design/grade.ts
src/components/common/GradeBadge.tsx
src/components/common/SignalDot.tsx
src/components/common/SignalBadge.tsx
src/components/common/ContentCard.tsx
src/components/common/DateSelector.tsx
src/features/today/TodayScreen.tsx
src/features/discover/DiscoverScreen.tsx
src/features/saved/SavedScreen.tsx
```

## 13-2. Notes

- 이 문서 작업에서는 코드 파일을 수정하지 않는다.
- 실제 토큰 반영은 다음 Phase에서 진행한다.
- 기존 grade 표현은 signal motif와 함께 재정리한다.
- LocalContent card는 Discover, Today, Saved에서 같은 정보 구조를 공유한다.
