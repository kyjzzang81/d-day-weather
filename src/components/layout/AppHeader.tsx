import type { CSSProperties, ReactNode } from "react";
import { Bell, MapPin, Menu, RefreshCw } from "lucide-react";
import { colors, spacing, typography } from "../../design/tokens";

interface AppHeaderProps {
  title?: string;
  locationLabel?: string;
  updatedAtLabel?: string;
  menuPlacement?: "left" | "right";
  onMenuClick?: () => void;
  beforeNotification?: ReactNode;
}

export function AppHeader({
  title,
  locationLabel,
  updatedAtLabel,
  menuPlacement = "left",
  onMenuClick,
  beforeNotification,
}: AppHeaderProps) {
  const headerStyle: CSSProperties = {
    minHeight: 64,
    flex: "0 0 64px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    padding: `${spacing.md}px 0`,
  };
  const menuButton = (
    <button
      className="iconButton"
      type="button"
      aria-label="메뉴 열기"
      onClick={onMenuClick}
    >
      <Menu aria-hidden="true" size={20} strokeWidth={2.2} />
    </button>
  );

  return (
    <header className="appHeader" style={headerStyle}>
      {menuPlacement === "left" ? menuButton : null}
      <div
        style={{
          minWidth: 0,
          flex: 1,
          display: "flex",
          alignItems: "center",
          gap: spacing.sm,
        }}
      >
        {locationLabel ? (
          <div className="appHeaderLocation">
            <strong>
              <MapPin size={15} strokeWidth={2.3} aria-hidden="true" />
              {locationLabel}
            </strong>
            {updatedAtLabel ? (
              <span>
                {updatedAtLabel}
                <RefreshCw size={11} strokeWidth={2.4} aria-hidden="true" />
              </span>
            ) : null}
          </div>
        ) : (
          <p
            style={{
              margin: 0,
              color: colors.textPrimary,
              ...typography.title3,
            }}
          >
            {title ?? "ggg"}
          </p>
        )}
      </div>
      <div className="appHeaderActions">
        {beforeNotification}
        <button className="iconButton" type="button" aria-label="알림">
          <Bell aria-hidden="true" size={19} strokeWidth={2.2} />
        </button>
        {menuPlacement === "right" ? menuButton : null}
      </div>
    </header>
  );
}
