import { useState } from "react";
import { Bell, CalendarDays, CheckCircle2 } from "lucide-react";
import { BottomSheet } from "../../components/common/BottomSheet";
import { PrimaryButton } from "../../components/common/PrimaryButton";
import { SignalBadge } from "../../components/common/SignalBadge";
import { isUserLoggedIn, signInWithGoogle } from "../auth/authState";
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
  const loggedIn = isUserLoggedIn();

  const save = () => {
    if (!content) return;
    if (!loggedIn) return;

    const saved = saveContentPlanned(content, dateContext, selectedReminder);
    onSaved?.(saved);
    onClose();
  };

  return (
    <BottomSheet open={open && Boolean(content)} title={loggedIn ? "언제 알림 받을까요?" : "로그인이 필요해요!"} onClose={onClose}>
      {content && !loggedIn ? (
        <div className="loginRequiredSheet">
          <p>콘텐츠를 저장하려면 로그인이 필요해요.</p>
          <PrimaryButton onClick={signInWithGoogle}>로그인하기</PrimaryButton>
        </div>
      ) : null}
      {content && loggedIn ? (
        <div className="saveReminderSheet">
          <section className="saveReminderSummary">
            <div className="saveReminderThumbnail">
              {content.imageUrl ? <img src={content.imageUrl} alt="" /> : <CalendarDays size={22} strokeWidth={2.2} />}
            </div>
            <div className="saveReminderSummaryCopy">
              <strong>{content.title}</strong>
              <span>{content.regionLabel} · {dateContext.label}</span>
              <SignalBadge grade={content.grade} basisLabel={content.basisLabel} compact />
            </div>
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
                <span className="saveReminderOptionIcon">
                  {selectedReminder === option.type ? <CheckCircle2 size={18} strokeWidth={2.4} /> : <Bell size={18} strokeWidth={2.2} />}
                </span>
                <span>
                  <strong>{option.label}</strong>
                  <em>{getReminderDescription(option.type, dateContext)}</em>
                </span>
              </button>
            ))}
          </div>

          <PrimaryButton onClick={save}>저장하기</PrimaryButton>
        </div>
      ) : null}
    </BottomSheet>
  );
}

function getReminderDescription(type: ReminderType, dateContext: DateContext): string {
  switch (type) {
    case "day_before_9am":
      return `${dateContext.label} 하루 전 오전에 알려드려요.`;
    case "same_day_8am":
      return "방문 당일 아침에 다시 확인해요.";
    case "weather_change":
      return "비나 강풍 신호가 바뀌면 알려드려요.";
    default:
      return "알림 없이 저장 목록에만 담아둘게요.";
  }
}
