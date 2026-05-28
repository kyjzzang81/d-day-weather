import { CalendarDays } from "lucide-react";
import { BottomSheet } from "../../components/common/BottomSheet";
import { dateContextLabel, getDateContext, getTodayDateContext, getWeekendDateContext } from "./dateSignalUtils";
import type { DateContext } from "./dateSignalTypes";

interface DateSelectSheetProps {
  open: boolean;
  selected: DateContext;
  onSelect: (context: DateContext) => void;
  onClose: () => void;
}

export function DateSelectSheet({ open, selected, onSelect, onClose }: DateSelectSheetProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const calendarDays = Array.from({ length: firstDay + daysInMonth }, (_, index) =>
    index < firstDay ? null : new Date(year, month, index - firstDay + 1),
  );
  const quickOptions = [getTodayDateContext(), getWeekendDateContext()];

  const select = (context: DateContext) => {
    onSelect(context);
    onClose();
  };

  return (
    <BottomSheet open={open} title="날짜 선택" onClose={onClose}>
      <div className="sheetStack">
        <div className="dateQuickOptionRow">
          {quickOptions.map((context) => (
            <button
              key={context.targetDate}
              className="dateChip"
              type="button"
              data-active={context.targetDate === selected.targetDate}
              onClick={() => select(context)}
            >
              {context.label.replace(" 기준", "")}
            </button>
          ))}
        </div>
        <section className="calendarPicker" aria-label="달력에서 날짜 선택">
          <div className="calendarPickerHeader">
            <span><CalendarDays size={16} strokeWidth={2.3} aria-hidden="true" /> {year}년 {month + 1}월</span>
          </div>
          <div className="calendarWeekdayRow" aria-hidden="true">
            {["일", "월", "화", "수", "목", "금", "토"].map((weekday) => (
              <span key={weekday}>{weekday}</span>
            ))}
          </div>
          <div className="calendarDayGrid">
            {calendarDays.map((date, index) => {
              if (!date) {
                return <span aria-hidden="true" key={`empty-${index}`} />;
              }

              const context = getDateContext(date);
              const isSelected = context.targetDate === selected.targetDate;
              const isToday = context.targetDate === getTodayDateContext().targetDate;
              const isPast = date.getTime() < today.getTime();

              return (
                <button
                  key={context.targetDate}
                  className="calendarDayButton"
                  type="button"
                  data-selected={isSelected}
                  data-today={isToday}
                  data-past={isPast}
                  disabled={isPast}
                  onClick={() => {
                    if (!isPast) select(context);
                  }}
                >
                  <strong>{date.getDate()}</strong>
                  {isToday ? <span>오늘</span> : null}
                </button>
              );
            })}
          </div>
        </section>
        <p className="dateBasisCaption">{dateContextLabel(selected)}</p>
      </div>
    </BottomSheet>
  );
}
