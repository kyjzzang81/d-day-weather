import type { CSSProperties } from "react";
import { CalendarDays, Compass, House } from "lucide-react";
import { NavLink } from "react-router-dom";
import { colors, layout, radius, spacing, typography } from "../../design/tokens";

const tabs = [
  { to: "/today", label: "TODAY", Icon: House },
  { to: "/discover", label: "DISCOVER", Icon: Compass },
  { to: "/dday", label: "D-DAY", Icon: CalendarDays }
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
    borderTop: `1px solid ${colors.border}`,
    background: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(18px)",
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
                  background: isActive ? colors.accentSoft : colors.surface,
                  color: isActive ? colors.accent : colors.textTertiary,
                  borderRadius: radius.pill
                }}
              >
                <Icon aria-hidden="true" size={20} strokeWidth={2.25} />
              </span>
              <span
                style={{
                  color: isActive ? colors.accent : colors.textSecondary,
                  ...typography.caption,
                  fontWeight: isActive ? 700 : 500
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
