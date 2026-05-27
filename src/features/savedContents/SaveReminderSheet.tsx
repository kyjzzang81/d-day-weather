import { useState } from "react";
import { BottomSheet } from "../../components/common/BottomSheet";
import { PrimaryButton } from "../../components/common/PrimaryButton";
import { SignalBadge } from "../../components/common/SignalBadge";
import type { DateContext } from "../dateSignal/dateSignalTypes";
import type { LocalContent } from "../localContent/localContentTypes";
import { reminderOptions, saveContentPlanned } from "./savedContentStore";
import type { ReminderType, SavedContent } from "./savedContentTypes";

interface SaveReminderSheetProps {
  open: boolean;
  content: LocalContent | null;
  dateContext: DateContext;
  onClose: () => void;
  onSaved?: (saved: SavedContent) => void;
}

export function SaveReminderSheet({ open, content, dateContext, onClose, onSaved }: SaveReminderSheetProps) {
  const [selectedReminder, setSelectedReminder] = useState<ReminderType>("day_before_9am");

  const save = () => {
    if (!content) return;

    const saved = saveContentPlanned(content, dateContext, selectedReminder);
    onSaved?.(saved);
    onClose();
  };

  return (
    <BottomSheet open={open && Boolean(content)} title="언제 알림 받을까요?" onClose={onClose}>
      {content ? (
        <div className="saveReminderSheet">
          <section className="saveReminderSummary">
            <strong>{content.title}</strong>
            <span>{dateContext.label} · {dateContext.basisLabel}</span>
            <SignalBadge grade={content.grade} basisLabel={content.basisLabel} compact />
          </section>

          <div className="saveReminderOptions">
            {reminderOptions.map((option) => (
              <button
                key={option.type}
                className="saveReminderOption"
                type="button"
                data-selected={selectedReminder === option.type}
                onClick={() => setSelectedReminder(option.type)}
              >
                {option.label}
              </button>
            ))}
          </div>

          <PrimaryButton onClick={save}>저장하기</PrimaryButton>
        </div>
      ) : null}
    </BottomSheet>
  );
}
