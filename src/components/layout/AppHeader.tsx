import type { CSSProperties } from "react";
import { Bell, Menu } from "lucide-react";
import logoUrl from "../../../assets/logo.png";
import { colors, spacing, typography } from "../../design/tokens";

interface AppHeaderProps {
  title?: string;
  locationLabel?: string;
  updatedAtLabel?: string;
  onMenuClick?: () => void;
}

export function AppHeader({ locationLabel, updatedAtLabel, onMenuClick }: AppHeaderProps) {
  const headerStyle: CSSProperties = {
    minHeight: 64,
    flex: "0 0 64px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    padding: `${spacing.md}px 0`
  };

  return (
    <header style={headerStyle}>
      <button className="iconButton" type="button" aria-label="메뉴 열기" onClick={onMenuClick}>
        <Menu aria-hidden="true" size={20} strokeWidth={2.2} />
      </button>
      <div style={{ minWidth: 0, flex: 1, display: "flex", alignItems: "center", gap: spacing.sm }}>
        <img alt="" src={logoUrl} style={{ width: 42, height: "auto", flex: "0 0 auto" }} />
        {locationLabel ? (
          <div style={{ minWidth: 0 }}>
            <p style={{ margin: 0, color: colors.textSecondary, ...typography.caption }}>
              {locationLabel}
              {updatedAtLabel ? ` · ${updatedAtLabel}` : ""}
            </p>
          </div>
        ) : null}
      </div>
      <button className="iconButton" type="button" aria-label="알림">
        <Bell aria-hidden="true" size={19} strokeWidth={2.2} />
      </button>
    </header>
  );
}
