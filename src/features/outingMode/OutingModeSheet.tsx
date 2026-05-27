import { useEffect, useRef, useState } from "react";
import { BottomSheet } from "../../components/common/BottomSheet";
import { PrimaryButton } from "../../components/common/PrimaryButton";
import { getOutingModeLabel, outingModeOptions } from "./outingModeOptions";
import type { OutingMode } from "./outingModeTypes";

interface OutingModeSheetProps {
  open: boolean;
  value: OutingMode;
  onChange: (mode: OutingMode) => void;
  onClose: () => void;
}

export function OutingModeSheet({ open, value, onChange, onClose }: OutingModeSheetProps) {
  return (
    <BottomSheet open={open} title="오늘은" onClose={onClose}>
      <div className="sheetStack">
        <div className="situationSheetOptionList">
          {outingModeOptions.map((option) => (
            <button
              key={option.value}
              className="situationSheetOption"
              type="button"
              data-selected={option.value === value}
              onClick={() => onChange(option.value)}
            >
              <span>{option.label}</span>
              <i aria-hidden="true" />
            </button>
          ))}
        </div>
        <PrimaryButton onClick={onClose}>이렇게 볼게요</PrimaryButton>
      </div>
    </BottomSheet>
  );
}

export function SituationButton({
  mode,
  onClick,
  variant = "default",
}: {
  mode: OutingMode;
  onClick: () => void;
  variant?: "default" | "header";
}) {
  return (
    <button className="situationButton" type="button" data-variant={variant} onClick={onClick}>
      {getOutingModeLabel(mode)} <span aria-hidden="true">▼</span>
    </button>
  );
}

export function SituationDropdown({
  mode,
  onChange,
}: {
  mode: OutingMode;
  onChange: (mode: OutingMode) => void;
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const closeOnOutside = (event: PointerEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("pointerdown", closeOnOutside);
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      window.removeEventListener("pointerdown", closeOnOutside);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div className="situationDropdownWrap" ref={dropdownRef}>
      <SituationButton
        mode={mode}
        variant="header"
        onClick={() => setOpen((nextOpen) => !nextOpen)}
      />
      {open ? (
        <div className="situationDropdownMenu" role="listbox" aria-label="상황 선택">
          {outingModeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={option.value === mode}
              data-selected={option.value === mode}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              <span>{option.label}</span>
              <i aria-hidden="true" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
