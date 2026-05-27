# Saved Contents Product Spec

## Version
**v1.0** - SavedContent 중심 저장 화면

## Status
MVP Draft

---

# 1. 핵심 결정

저장 대상은 장소가 아니라 `SavedContent`다.

```text
사용자 화면명: 저장
내부 모델: SavedContent
권장 테이블: user_saved_contents
```

Place/POI는 저장 대상의 중심이 아니라 `LocalContent`에 연결되는 위치 정보로 남긴다.

---

# 2. 저장 상태

| 내부 상태 | 사용자 화면 표현 | 의미 |
|---|---|---|
| `wishlist` | 가보고 싶어요 | 날짜 없이 저장한 콘텐츠 |
| `planned` | 예정 | 날짜를 정해 저장한 콘텐츠 |
| `visited` | 다녀왔어요 | 방문 완료 콘텐츠 |
| `deleted` | 미노출 | 삭제 처리 |

---

# 3. 저장 화면

## 화면명

```text
저장
```

## 탭

```text
전체
예정
가보고 싶어요
다녀왔어요
```

## 전체

모든 활성 저장 항목을 최근 저장순 또는 가까운 날짜순으로 보여준다.

## 예정

날짜가 정해진 콘텐츠다.

```text
content_id
target_date
date_label
reminder_settings
signal_snapshot
```

특정 콘텐츠 일정의 날씨를 보러 들어온 사용자가 가장 자주 저장하는 상태다.

## 가보고 싶어요

날짜 없이 콘텐츠만 저장한 상태다.

UI:

```text
날짜 정하기 CTA
지역/콘텐츠 정보
최근 확인한 날씨 신호가 있으면 보조로 표시
```

## 다녀왔어요

방문 완료 상태다.

```text
visited_at 표시
리뷰/메모는 MVP 이후
```

---

# 4. 저장 진입점

```text
오늘의 추천 카드
Discover 결과 카드
콘텐츠 상세
검색 결과
```

저장 CTA 표현:

```text
저장
날짜 저장
가보고 싶어요
예정에 추가
다녀왔어요
```

---

# 5. user_saved_contents 스키마

```sql
create table if not exists user_saved_contents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  content_id text references local_contents(id),
  title text not null,

  status text not null default 'wishlist'
    check (status in ('wishlist', 'planned', 'visited', 'deleted')),

  target_date date,
  date_label text,

  date_basis text
    check (date_basis in ('forecast', 'historical_trend')),

  basis_label text,

  signal_grade text,
  signal_snapshot jsonb,

  reminder_settings jsonb not null default '{}'::jsonb,

  visited_at date,

  source text not null default 'discover'
    check (source in ('discover', 'content_detail', 'today', 'manual')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

---

# 6. 저장 정책

## 비로그인

MVP에서는 로그인 후 저장을 기본으로 한다. 비로그인 사용자가 저장을 누르면 로그인 유도 후 원래 콘텐츠로 돌아온다.

## 중복 저장

동일 사용자의 동일 `content_id`는 활성 상태에서 하나의 대표 저장 항목을 유지한다.

```text
wishlist -> planned 전환 가능
planned -> visited 전환 가능
visited -> wishlist 되돌리기는 MVP 이후
```

`target_date`가 다른 여러 예정 저장을 허용할지는 후속 정책으로 둔다. MVP는 하나의 대표 저장 항목을 권장한다.

## 콘텐츠 삭제/비활성

`local_contents.is_active = false`가 되어도 사용자의 저장 이력은 보존한다. 화면에서는 `title`, `signal_snapshot`, `visited_at` 등 저장 당시 정보를 사용할 수 있다.

---

# 7. 알림

`planned` 상태에서만 날짜 기반 리마인더를 기본 제공한다.

```text
target_date
date_basis
signal_snapshot
reminder_settings
```

날씨 신호가 바뀌는 알림은 MVP 이후 고도화 항목이다.

---

# 8. 이벤트

```text
saved_opened
saved_tab_changed
content_saved
saved_content_status_changed
saved_content_target_date_set
saved_content_reminder_changed
saved_content_opened
```
