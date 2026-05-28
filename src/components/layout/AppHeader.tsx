import type { CSSProperties, ReactNode } from "react";
import { Bell, MapPin, RefreshCw, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { colors, spacing, typography } from "../../design/tokens";

interface AppHeaderProps {
  title?: string;
  locationLabel?: string;
  updatedAtLabel?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  menuPlacement?: "left" | "right";
  onMenuClick?: () => void;
  onNotificationClick?: () => void;
  beforeNotification?: ReactNode;
}

export function AppHeader({
  title,
  locationLabel,
  updatedAtLabel,
  onRefresh,
  isRefreshing = false,
  menuPlacement = "left",
  onNotificationClick,
  beforeNotification,
}: AppHeaderProps) {
  const navigate = useNavigate();
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
      aria-label="마이페이지"
      onClick={() => navigate("/mypage")}
    >
      <UserRound aria-hidden="true" size={20} strokeWidth={2.2} />
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
              <button
                className="appHeaderRefresh"
                type="button"
                onClick={onRefresh}
                disabled={!onRefresh || isRefreshing}
                aria-label="날씨 데이터 새로고침"
              >
                {updatedAtLabel}
                <RefreshCw
                  className={isRefreshing ? "isSpinning" : undefined}
                  size={11}
                  strokeWidth={2.4}
                  aria-hidden="true"
                />
              </button>
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
        <button
          className="iconButton"
          type="button"
          aria-label="알림"
          onClick={onNotificationClick ?? (() => navigate("/notifications"))}
        >
          <Bell aria-hidden="true" size={19} strokeWidth={2.2} />
        </button>
        {menuPlacement === "right" ? menuButton : null}
      </div>
    </header>
  );
}
