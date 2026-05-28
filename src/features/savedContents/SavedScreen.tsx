import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EmptyState } from "../../components/common/EmptyState";
import { PrimaryButton } from "../../components/common/PrimaryButton";
import { SignalBadge } from "../../components/common/SignalBadge";
import { AppHeader } from "../../components/layout/AppHeader";
import { getTodayDateContext } from "../dateSignal/dateSignalUtils";
import type { DateContext } from "../dateSignal/dateSignalTypes";
import { getLocalContentById, getLocalContentSubtitle } from "../localContent/localContentUtils";
import type { LocalContent } from "../localContent/localContentTypes";
import { readLocationContext } from "../location/locationContext";
import { SaveReminderSheet } from "./SaveReminderSheet";
import { markSavedContentVisited, readSavedContents, SAVED_CONTENTS_CHANGED_EVENT } from "./savedContentStore";
import type { SavedContent, SavedContentStatus } from "./savedContentTypes";

const tabs: Array<{ label: string; status: "all" | SavedContentStatus }> = [
  { label: "전체", status: "all" },
  { label: "예정", status: "planned" },
  { label: "가보고 싶어요", status: "wishlist" },
  { label: "다녀왔어요", status: "visited" },
];

export function SavedScreen({ onMenuClick }: { onMenuClick: () => void }) {
  const navigate = useNavigate();
  const [items, setItems] = useState<SavedContent[]>(() => readSavedContents());
  const [activeTab, setActiveTab] = useState<"all" | SavedContentStatus>("all");
  const [saveTarget, setSaveTarget] = useState<LocalContent | null>(null);
  const [dateContext] = useState<DateContext>(() => getTodayDateContext());
  const [locationContext] = useState(() => readLocationContext());

  useEffect(() => {
    const refresh = () => setItems(readSavedContents());
    window.addEventListener(SAVED_CONTENTS_CHANGED_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(SAVED_CONTENTS_CHANGED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const visibleItems = useMemo(() => {
    const filtered = activeTab === "all" ? items : items.filter((item) => item.status === activeTab);
    return [...filtered].sort((a, b) => {
      if (a.status === "planned" && b.status === "planned") {
        return (a.targetDate ?? "").localeCompare(b.targetDate ?? "");
      }
      return b.createdAt.localeCompare(a.createdAt);
    });
  }, [activeTab, items]);

  const refresh = () => setItems(readSavedContents());
  const openDateSave = (item: SavedContent) => {
    const content = getLocalContentById(item.contentId);
    if (content) setSaveTarget(content);
  };
  const markVisited = (item: SavedContent) => {
    markSavedContentVisited(item.id);
    refresh();
  };

  return (
    <>
      <AppHeader
        locationLabel={locationContext.locationLabel}
        updatedAtLabel={locationContext.updatedAtLabel}
        menuPlacement="right"
        onMenuClick={onMenuClick}
      />
      <main className="screenStack">
        <div className="savedContentTabs" role="tablist" aria-label="저장 탭">
          {tabs.map((tab) => (
            <button
              key={tab.status}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.status}
              data-active={activeTab === tab.status}
              onClick={() => setActiveTab(tab.status)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {visibleItems.length === 0 ? (
          <EmptyState
            title="아직 저장한 콘텐츠가 없어요."
            description="날짜와 콘텐츠를 정해두면 가까워졌을 때 다시 확인할 수 있어요."
            action={
              <Link to="/discover">
                <PrimaryButton>콘텐츠 찾기</PrimaryButton>
              </Link>
            }
          />
        ) : (
          <section className="savedContentList">
            {visibleItems.map((item) => {
              const content = getLocalContentById(item.contentId);
              return (
                <article className="savedContentCard" key={item.id} data-status={item.status}>
                  <button className="savedContentCardMain" type="button" onClick={() => navigate(`/content/${item.contentId}`)}>
                    <span className="savedContentDate">
                      {item.status === "planned" ? item.dateLabel : item.status === "visited" ? item.visitedAt : "가보고 싶어요"}
                    </span>
                    <strong>{item.title}</strong>
                    <span>{content ? getLocalContentSubtitle(content) : "저장한 콘텐츠"}</span>
                    {item.signalGrade ? <SignalBadge grade={item.signalGrade} basisLabel={item.basisLabel} compact /> : null}
                    {item.status === "planned" ? <em>{item.reminder.label}</em> : null}
                  </button>
                  <div className="savedContentActions">
                    {item.status === "wishlist" && content ? (
                      <button type="button" onClick={() => openDateSave(item)}>
                        날짜 정하기
                      </button>
                    ) : null}
                    {item.status !== "visited" ? (
                      <button type="button" onClick={() => markVisited(item)}>
                        다녀왔어요
                      </button>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </main>

      <SaveReminderSheet
        open={Boolean(saveTarget)}
        content={saveTarget}
        dateContext={dateContext}
        onClose={() => setSaveTarget(null)}
        onSaved={refresh}
      />
    </>
  );
}
