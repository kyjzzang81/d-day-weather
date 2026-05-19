import type { CSSProperties } from "react";
import { ChevronRight, X } from "lucide-react";
import { Link } from "react-router-dom";
import logoUrl from "../../../assets/logo.png";
import { colors, radius, shadows, spacing, typography } from "../../design/tokens";

interface SidebarDrawerProps {
  open: boolean;
  onClose: () => void;
}

const menuItems = [
  { label: "마이페이지", to: "/mypage" },
  { label: "저장된 D-DAY", to: "/dday" },
  { label: "선호 활동 변경", to: "/activity-preferences" },
  { label: "위치 설정", to: "/location/select" },
  { label: "설정", to: "/settings" }
] as const;

export function SidebarDrawer({ open, onClose }: SidebarDrawerProps) {
  if (!open) {
    return null;
  }

  const overlayStyle: CSSProperties = {
    position: "fixed",
    inset: 0,
    zIndex: 35,
    background: "rgba(31, 41, 51, 0.24)",
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
          borderTopRightRadius: radius.xxl,
          borderBottomRightRadius: radius.xxl
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
              오늘 날씨, 나의 일정 가이드
            </p>
            <div
              style={{
                borderRadius: radius.xl,
                background: colors.backgroundSoftBlue,
                padding: spacing.lg,
                marginBottom: spacing.xl
              }}
            >
              <p style={{ margin: 0, color: colors.textPrimary, ...typography.title3 }}>비회원 모드</p>
              <p style={{ margin: `${spacing.xs}px 0 0`, color: colors.textSecondary, ...typography.caption }}>
                로그인 기능은 이후 단계에서 연결합니다.
              </p>
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
