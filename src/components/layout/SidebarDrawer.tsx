import { useEffect, useState, type CSSProperties } from "react";
import { ChevronRight, X } from "lucide-react";
import { Link } from "react-router-dom";
import logoUrl from "../../../assets/logo.png";
import { colors, radius, shadows, spacing, typography } from "../../design/tokens";
import {
  AUTH_STATE_CHANGED_EVENT,
  readAuthSession,
  signInWithGoogle,
  signOut,
} from "../../features/auth/authState";

interface SidebarDrawerProps {
  open: boolean;
  onClose: () => void;
}

const menuItems = [
  { label: "마이페이지", to: "/mypage" },
  { label: "위치 설정", to: "/location/select" },
  { label: "알림·설정", to: "/settings" }
] as const;

export function SidebarDrawer({ open, onClose }: SidebarDrawerProps) {
  const [session, setSession] = useState(() => readAuthSession());

  useEffect(() => {
    const refresh = () => setSession(readAuthSession());
    window.addEventListener(AUTH_STATE_CHANGED_EVENT, refresh);
    window.addEventListener("storage", refresh);
    refresh();
    return () => {
      window.removeEventListener(AUTH_STATE_CHANGED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  if (!open) {
    return null;
  }

  const overlayStyle: CSSProperties = {
    position: "fixed",
    inset: 0,
    zIndex: 35,
    background: "rgba(20, 26, 36, 0.34)",
    display: "flex",
    justifyContent: "center"
  };

  return (
    <div className="sidebarOverlay" style={overlayStyle} role="presentation" onClick={onClose}>
      <div className="sidebarFrame">
      <aside
        className="sidebarPanel"
        aria-label="사이드 메뉴"
        style={{
          background: colors.surface,
          boxShadow: shadows.floating,
          borderTopLeftRadius: radius.xxl,
          borderBottomLeftRadius: radius.xxl
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sidebarContent">
          <div>
            <div className="sidebarHeader">
              <div style={{ display: "flex", alignItems: "center", gap: spacing.sm, minWidth: 0 }}>
                <img alt="ggg" src={logoUrl} style={{ width: 58, height: "auto", flex: "0 0 auto" }} />
                <p style={{ margin: 0, color: colors.textPrimary, ...typography.title2 }}>ggg</p>
              </div>
              <button className="iconButton sidebarCloseButton" type="button" onClick={onClose} aria-label="사이드 메뉴 닫기">
                <X aria-hidden="true" size={18} strokeWidth={2.2} />
              </button>
            </div>
            <p style={{ margin: `${spacing.xs}px 0 ${spacing.xl}px`, color: colors.textSecondary, ...typography.body2 }}>
              날씨와 날짜에 맞춘 로컬 콘텐츠 신호
            </p>
            <div
              className="sidebarAccountCard"
              style={{
                borderRadius: radius.xl,
                background: colors.surfaceWarm,
                padding: spacing.lg,
                marginBottom: spacing.xl
              }}
            >
              <p style={{ margin: 0, color: colors.textPrimary, ...typography.title3 }}>
                {session ? session.name ?? "로그인됨" : "비회원 모드"}
              </p>
              <p style={{ margin: `${spacing.xs}px 0 ${spacing.md}px`, color: colors.textSecondary, ...typography.caption }}>
                {session ? session.email ?? "Google 계정으로 로그인했어요." : "저장과 알림은 로그인 후 사용할 수 있어요."}
              </p>
              {session ? (
                <button
                  className="sidebarAuthButton"
                  type="button"
                  onClick={signOut}
                >
                  로그아웃
                </button>
              ) : (
                <button
                  className="sidebarAuthButton"
                  type="button"
                  onClick={signInWithGoogle}
                >
                  Google로 로그인
                </button>
              )}
            </div>
            <nav style={{ display: "grid", gap: spacing.sm }}>
              {menuItems.map((item) => (
                <Link key={item.to} className="drawerLink" to={item.to} onClick={onClose}>
                  {item.label}
                  <ChevronRight aria-hidden="true" size={18} strokeWidth={2.2} />
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </aside>
      </div>
    </div>
  );
}
