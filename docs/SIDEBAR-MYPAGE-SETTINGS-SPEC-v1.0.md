# My Page / Settings / Notifications Product Spec (MVP)

## Version
**v1.0** — 사이드바 제거 후 Header action 기반 정리본

## Document Type
Product / Feature Specification

## Status
MVP Draft

---

# 1. 문서 목적

이 문서는 ggg 앱의 **마이페이지, 위치 설정, 알림·설정, 알림 화면**을 정의한다.

초기 문서에서는 전역 Sidebar Drawer를 보조 진입점으로 정의했지만, 현재 MVP 구현에서는 Sidebar를 사용하지 않는다. Header 오른쪽의 마이페이지 아이콘이 `/mypage`로 직접 이동한다.

---

# 2. 핵심 결정사항

| 항목 | 결정 |
|---|---|
| 전역 Sidebar Drawer | MVP 메인 구조에서 제거 |
| Header 마이페이지 icon | `/mypage` 직접 이동 |
| Header 알림 icon | `/notifications` 직접 이동 |
| 로그인 방식 | Google 우선 |
| 저장 기능 | 로그인 필요 |
| 마이페이지 | 계정 상태, 로그인/로그아웃, 저장/설정/위치 진입 |
| 위치 설정 | 현재 적용 위치와 권한 안내 중심 |
| 설정 화면 | 저장 콘텐츠 알림, 위치 기반 추천, 마케팅 알림 토글 |
| 알림 화면 | 현재는 empty state와 저장 화면 진입 제공 |

---

# 3. Header 진입 구조

공통 Header action:

```text
알림 icon
→ /notifications

마이페이지 icon
→ /mypage
```

Home Header는 상황 선택 dropdown을 함께 노출한다.

```text
현재 위치 / 기준 시각
상황 선택
알림
마이페이지
```

Sidebar Drawer는 더 이상 기본 탐색 구조로 사용하지 않는다.

---

# 4. 마이페이지

## 4-1. 역할

마이페이지는 사용자의 계정 상태와 개인 설정 진입점을 제공한다.

## 4-2. 화면 구조

```text
Header

계정 Hero Card
- 로그인 상태
- 이름 또는 이메일
- 로그인/로그아웃 버튼

List Card
- 저장한 콘텐츠
- 알림·설정
- 위치 설정
```

## 4-3. 로그인 전

```text
비회원 모드
로그인하면 콘텐츠 저장과 알림을 사용할 수 있어요.

[Google로 로그인]
```

## 4-4. 로그인 후

```text
로그인됨
user@example.com

[로그아웃]
```

---

# 5. 위치 설정

## 5-1. 역할

위치 설정은 현재 앱이 사용하는 위치 기준을 보여주고, 위치 권한 사용 방식을 안내한다.

## 5-2. 화면 구조

```text
Header

위치 설정 Hero Card
- 현재 위치 기준으로 추천해요
- 브라우저 위치 권한 안내

List Card
- 현재 적용 위치
- 위치 권한 안내
```

현재 구현:

```text
현재 적용 위치 = readLocationContext()
고정 지역 선택 / 위치 검색 = 후속 단계
```

---

# 6. 알림·설정

## 6-1. 역할

설정 화면은 저장 콘텐츠 알림과 위치 기반 추천 같은 앱 동작 설정을 관리한다.

## 6-2. 화면 구조

```text
Header

알림·설정 Hero Card
- 필요한 신호만 받기
- 저장 콘텐츠와 날씨 변화 중심 안내

List Card
- 저장 콘텐츠 알림
- 위치 기반 추천
- 마케팅 알림
```

현재 구현은 UI 토글만 제공한다. 실제 푸시 알림 권한, 서버 스케줄링, 사용자별 설정 저장은 후속 Phase에서 연결한다.

---

# 7. 알림 화면

## 7-1. 역할

Header 알림 icon에서 진입하는 화면이다.

## 7-2. 화면 구조

```text
Header

알림 Hero Card
- 아직 새 알림이 없어요
- 저장한 콘텐츠의 날짜 또는 날씨 변화가 있을 때 표시

List Card
- 알림 준비 중
- 저장 화면으로 이동
```

현재 구현은 empty state 중심이며, 실제 알림 목록은 push notification/notification log 구현 이후 연결한다.

---

# 8. 저장과 로그인 정책

콘텐츠 저장은 로그인 사용자만 가능하다.

비로그인 사용자가 저장을 누르면 현재 화면 위에 Login Required Bottom Sheet를 띄운다.

```text
title: 로그인이 필요해요!
message: 콘텐츠를 저장하려면 로그인이 필요해요.
CTA: 로그인하기
```

로그인 방식:

```text
Google 우선
Apple / Kakao = 후속 검토
```

---

# 9. MVP 제외

```text
전역 Sidebar Drawer
사이드바 내 저장/선호 활동 메뉴
마이페이지 하위 상세 route
고정 지역 검색/선택 저장
실제 push notification
알림 로그 DB
계정 삭제
약관/개인정보 웹뷰
```

---

# 10. 구현 파일

현재 구현 기준:

```text
src/components/layout/AppHeader.tsx
src/features/settings/UtilityScreens.tsx
src/features/auth/authState.ts
src/features/location/locationContext.ts
src/features/savedContents/SaveReminderSheet.tsx
```
