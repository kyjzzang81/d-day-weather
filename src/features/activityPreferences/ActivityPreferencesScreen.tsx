import { Check, ChevronLeft, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PrimaryButton } from "../../components/common/PrimaryButton";
import { radius, spacing, typography } from "../../design/tokens";
import { type ActivityCategoryCode } from "../today/todayPayload";
import { DEFAULT_ACTIVITY_PREFERENCES, MAX_ACTIVITY_PREFERENCES, activityPreferenceOptions } from "./activityPreferenceOptions";
import { readActivityPreferences, writeActivityPreferences } from "./activityPreferenceStore";

export function ActivityPreferencesScreen() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<ActivityCategoryCode[]>(() => readActivityPreferences());

  const selectedSet = useMemo(() => new Set(selected), [selected]);
  const canSubmit = selected.length > 0 && selected.length <= MAX_ACTIVITY_PREFERENCES;
  const helperText =
    selected.length >= MAX_ACTIVITY_PREFERENCES
      ? `최대 ${MAX_ACTIVITY_PREFERENCES}개까지 선택했어요.`
      : `최대 ${MAX_ACTIVITY_PREFERENCES}개 선택 가능`;

  const toggleCategory = (category: ActivityCategoryCode) => {
    setSelected((prev) => {
      if (prev.includes(category)) {
        if (prev.length === 1) return prev;
        return prev.filter((item) => item !== category);
      }

      if (prev.length >= MAX_ACTIVITY_PREFERENCES) {
        return prev;
      }

      return [...prev, category];
    });
  };

  const handleReset = () => {
    setSelected(DEFAULT_ACTIVITY_PREFERENCES);
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    writeActivityPreferences(selected);
    navigate("/today");
  };

  return (
    <>
      <header className="activityPreferencesHeader">
        <button className="iconButton" type="button" aria-label="뒤로 가기" onClick={() => navigate(-1)}>
          <ChevronLeft size={20} strokeWidth={2.2} />
        </button>
        <button className="iconButton" type="button" aria-label="기본 선택으로 초기화" onClick={handleReset}>
          <RotateCcw size={18} strokeWidth={2.2} />
        </button>
      </header>

      <main className="screenStack activityPreferencesScreen">
        <section className="activityPreferencesIntro">
          <h1 className="activityPreferencesTitle">선호하는 활동을 선택해주세요</h1>
          <p className="activityPreferencesHint">{helperText}</p>
        </section>

        <section className="activityPreferenceGrid">
          {activityPreferenceOptions.map((option) => {
            const isSelected = selectedSet.has(option.category);

            return (
              <button
                key={option.category}
                className="activityPreferenceCard"
                data-selected={isSelected}
                type="button"
                onClick={() => toggleCategory(option.category)}
                aria-pressed={isSelected}
              >
                <span className="activityPreferenceImageWrapper">
                  <img src={option.icon} alt="" aria-hidden="true" className="activityPreferenceImage" />
                </span>
                <span className="activityPreferenceLabel">{option.label}</span>
                {isSelected ? (
                  <span className="activityPreferenceCheck" aria-hidden="true">
                    <Check size={12} strokeWidth={3} />
                  </span>
                ) : null}
              </button>
            );
          })}
        </section>
      </main>

      <div className="activityPreferencesFooter">
        <PrimaryButton
          onClick={handleSubmit}
          disabled={!canSubmit}
          style={{ borderRadius: radius.lg, ...typography.title3, minHeight: 52, paddingBlock: spacing.md }}
        >
          완료 ({selected.length}/{MAX_ACTIVITY_PREFERENCES})
        </PrimaryButton>
      </div>
    </>
  );
}
