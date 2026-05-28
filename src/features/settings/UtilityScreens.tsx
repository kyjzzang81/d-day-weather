import { Bell, ChevronRight, LocateFixed, MapPin, ShieldCheck, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppHeader } from "../../components/layout/AppHeader";
import {
  AUTH_STATE_CHANGED_EVENT,
  readAuthSession,
  signInWithGoogle,
  signOut,
} from "../auth/authState";
import { readLocationContext } from "../location/locationContext";

export function MyPageScreen({ onMenuClick }: { onMenuClick: () => void }) {
  const [session, setSession] = useState(() => readAuthSession());
  const [locationContext] = useState(() => readLocationContext());

  useEffect(() => {
    const refresh = () => setSession(readAuthSession());
    window.addEventListener(AUTH_STATE_CHANGED_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(AUTH_STATE_CHANGED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return (
    <>
      <AppHeader
        locationLabel={locationContext.locationLabel}
        updatedAtLabel={locationContext.updatedAtLabel}
        menuPlacement="right"
        onMenuClick={onMenuClick}
      />
      <main className="screenStack">
        <section className="utilityHeroCard">
          <span className="utilityHeroIcon"><UserRound size={24} strokeWidth={2.2} /></span>
          <p>{session ? "로그인됨" : "비회원 모드"}</p>
          <h1>{session?.name ?? session?.email ?? "내 ggg"}</h1>
          <span>{session ? "저장과 알림 설정을 사용할 수 있어요." : "로그인하면 콘텐츠 저장과 알림을 사용할 수 있어요."}</span>
          <button type="button" onClick={session ? signOut : signInWithGoogle}>
            {session ? "로그아웃" : "Google로 로그인"}
          </button>
        </section>

        <section className="utilityListCard">
          <UtilityLink to="/dday" title="저장한 콘텐츠" description="예정, 가보고 싶어요, 다녀왔어요" />
          <UtilityLink to="/settings" title="알림·설정" description="알림 방식과 앱 설정 관리" />
          <UtilityLink to="/location/select" title="위치 설정" description={locationContext.locationLabel} />
        </section>
      </main>
    </>
  );
}

export function LocationSelectScreen({ onMenuClick }: { onMenuClick: () => void }) {
  const [locationContext] = useState(() => readLocationContext());
  return (
    <>
      <AppHeader
        locationLabel={locationContext.locationLabel}
        updatedAtLabel={locationContext.updatedAtLabel}
        menuPlacement="right"
        onMenuClick={onMenuClick}
      />
      <main className="screenStack">
        <section className="utilityHeroCard">
          <span className="utilityHeroIcon"><LocateFixed size={24} strokeWidth={2.2} /></span>
          <p>위치 설정</p>
          <h1>현재 위치 기준으로 추천해요</h1>
          <span>홈에서 위치 권한을 허용하면 현재 위치의 날씨와 지역 추천을 사용합니다.</span>
        </section>
        <section className="utilityListCard">
          <div className="utilityInfoRow">
            <MapPin size={20} strokeWidth={2.2} />
            <div>
              <strong>현재 적용 위치</strong>
              <span>{locationContext.locationLabel}</span>
            </div>
          </div>
          <div className="utilityNoticeBox">
            위치 검색과 고정 지역 선택은 다음 단계에서 연결합니다. 지금은 브라우저 위치 권한으로 받은 현재 위치를 사용해요.
          </div>
        </section>
      </main>
    </>
  );
}

export function SettingsScreen({ onMenuClick }: { onMenuClick: () => void }) {
  const [locationContext] = useState(() => readLocationContext());
  return (
    <>
      <AppHeader
        locationLabel={locationContext.locationLabel}
        updatedAtLabel={locationContext.updatedAtLabel}
        menuPlacement="right"
        onMenuClick={onMenuClick}
      />
      <main className="screenStack">
        <section className="utilityHeroCard">
          <span className="utilityHeroIcon"><ShieldCheck size={24} strokeWidth={2.2} /></span>
          <p>알림·설정</p>
          <h1>필요한 신호만 받기</h1>
          <span>저장한 콘텐츠의 날짜와 날씨 변화 중심으로 알림을 정리합니다.</span>
        </section>
        <section className="utilityListCard">
          <SettingRow title="저장 콘텐츠 알림" description="날짜 전날, 당일 아침, 날씨 변화 알림" active />
          <SettingRow title="위치 기반 추천" description="현재 위치가 속한 지역 콘텐츠 우선 노출" active />
          <SettingRow title="마케팅 알림" description="이벤트와 신규 콘텐츠 소식" />
        </section>
      </main>
    </>
  );
}

export function NotificationsScreen({ onMenuClick }: { onMenuClick: () => void }) {
  const [locationContext] = useState(() => readLocationContext());
  return (
    <>
      <AppHeader
        locationLabel={locationContext.locationLabel}
        updatedAtLabel={locationContext.updatedAtLabel}
        menuPlacement="right"
        onMenuClick={onMenuClick}
      />
      <main className="screenStack">
        <section className="utilityHeroCard">
          <span className="utilityHeroIcon"><Bell size={24} strokeWidth={2.2} /></span>
          <p>알림</p>
          <h1>아직 새 알림이 없어요</h1>
          <span>저장한 콘텐츠의 날짜가 가까워지거나 날씨 신호가 바뀌면 여기서 확인할 수 있어요.</span>
        </section>
        <section className="utilityListCard">
          <div className="utilityInfoRow">
            <Bell size={20} strokeWidth={2.2} />
            <div>
              <strong>알림 준비 중</strong>
              <span>실제 푸시 알림은 다음 단계에서 연결합니다.</span>
            </div>
          </div>
          <UtilityLink to="/dday" title="저장 화면으로 이동" description="저장한 콘텐츠와 알림 상태 보기" />
        </section>
      </main>
    </>
  );
}

function UtilityLink({ to, title, description }: { to: string; title: string; description: string }) {
  return (
    <Link className="utilityNavRow" to={to}>
      <span>
        <strong>{title}</strong>
        <em>{description}</em>
      </span>
      <ChevronRight size={18} strokeWidth={2.2} />
    </Link>
  );
}

function SettingRow({ title, description, active = false }: { title: string; description: string; active?: boolean }) {
  return (
    <div className="utilitySettingRow">
      <span>
        <strong>{title}</strong>
        <em>{description}</em>
      </span>
      <button type="button" data-active={active} aria-label={`${title} ${active ? "켜짐" : "꺼짐"}`} />
    </div>
  );
}
