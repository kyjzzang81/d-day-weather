import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { colors, layout, radius, shadows, spacing, typography } from "../../design/tokens";

interface BottomSheetProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export function BottomSheet({ open, title, children, onClose }: BottomSheetProps) {
  const [mounted, setMounted] = useState(open);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      setClosing(false);
      return;
    }

    if (!mounted) {
      return;
    }

    setClosing(true);
    const timer = window.setTimeout(() => {
      setMounted(false);
      setClosing(false);
    }, 260);

    return () => window.clearTimeout(timer);
  }, [mounted, open]);

  if (!mounted) {
    return null;
  }

  const overlayStyle: CSSProperties = {
    position: "fixed",
    inset: 0,
    zIndex: 40,
    background: "rgba(20, 26, 36, 0.42)",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center"
  };

  const sheetStyle: CSSProperties = {
    width: "100%",
    maxWidth: layout.mobileMaxWidth,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    background: colors.surface,
    boxShadow: shadows.bottomSheet,
    padding: `${spacing.md}px ${spacing.xl}px ${spacing.xxxl}px`
  };

  return (
    <div aria-modal="true" className="sheetOverlay" data-state={closing ? "closing" : "open"} role="dialog" style={overlayStyle}>
      <section className="sheetPanel" data-state={closing ? "closing" : "open"} style={sheetStyle}>
        <div className="sheetHandle" />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: spacing.md }}>
          <h2 style={{ margin: 0, color: colors.textStrong, ...typography.title2 }}>{title}</h2>
          <button className="iconButton" type="button" onClick={onClose} aria-label="닫기">
            ×
          </button>
        </div>
        <div style={{ marginTop: spacing.lg }}>{children}</div>
      </section>
    </div>
  );
}
