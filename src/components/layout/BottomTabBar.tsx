import type { CSSProperties } from "react";
import { CalendarDays, Compass, House } from "lucide-react";
import { NavLink } from "react-router-dom";
import { colors, layout, radius, spacing, typography } from "../../design/tokens";

const tabs = [
  { to: "/today", label: "홈", Icon: House },
  { to: "/discover", label: "발견", Icon: Compass },
  { to: "/dday", label: "저장", Icon: CalendarDays }
] as const;

export function BottomTabBar() {
  const navStyle: CSSProperties = {
    position: "relative",
    zIndex: 20,
    height: layout.bottomTabHeight,
    flex: `0 0 ${layout.bottomTabHeight}px`,
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    alignItems: "center",
    gap: spacing.sm,
    borderTop: 0,
    borderRadius: `${radius.xxl}px ${radius.xxl}px 0 0`,
    background: "rgba(255, 255, 255, 0.96)",
    backdropFilter: "blur(18px)",
    boxShadow: "0 -10px 28px rgba(20, 26, 36, 0.08)",
    margin: `0 -${spacing.lg2 - 2}px`,
    padding: `${spacing.sm}px ${spacing.lg}px ${spacing.md}px`
  };

  return (
    <nav aria-label="하단 탭" style={navStyle}>
      {tabs.map((tab) => (
        <NavLink key={tab.to} className="bottomTabLink" to={tab.to}>
          {({ isActive }) => {
            const Icon = tab.Icon;

            return (
            <div className="bottomTabItem" data-active={isActive}>
              <span
                className="bottomTabIcon"
                style={{
                  background: "transparent",
                  color: isActive ? colors.ink : colors.textDisabled,
                  borderRadius: radius.pill
                }}
              >
                <Icon aria-hidden="true" size={20} strokeWidth={2.25} />
              </span>
              <span
                style={{
                  color: isActive ? colors.ink : colors.textTertiary,
                  ...typography.caption,
                  fontWeight: isActive ? 800 : 600
                }}
              >
                {tab.label}
              </span>
            </div>
            );
          }}
        </NavLink>
      ))}
    </nav>
  );
}
