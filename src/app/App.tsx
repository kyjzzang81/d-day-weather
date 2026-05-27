import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { BottomTabBar } from "../components/layout/BottomTabBar";
import { SidebarDrawer } from "../components/layout/SidebarDrawer";
import { colors, radius, shadows, spacing, typography } from "../design/tokens";
import { ActivityPreferencesScreen } from "../features/activityPreferences/ActivityPreferencesScreen";
import { ContentDetailScreen } from "../features/contentDetail/ContentDetailScreen";
import { SavedScreen } from "../features/savedContents/SavedScreen";
import { DiscoverScreen } from "../features/discover/DiscoverScreen";
import { TodayScreen } from "../features/today/TodayScreen";

function PlaceholderScreen({ title, description }: { title: string; description: string }) {
  return (
    <main className="screenStack">
      <section
        style={{
          borderRadius: radius.xxl,
          background: colors.surface,
          boxShadow: shadows.card,
          padding: spacing.xl
        }}
      >
        <p style={{ color: colors.textSecondary, margin: 0, ...typography.body2 }}>준비 중</p>
        <h1 style={{ color: colors.textPrimary, margin: `${spacing.sm}px 0`, ...typography.title1 }}>{title}</h1>
        <p style={{ color: colors.textSecondary, margin: 0, ...typography.body2 }}>{description}</p>
      </section>
    </main>
  );
}

export function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  return (
    <div className="appViewport">
      <div className="mobileShell">
        <Routes>
          <Route path="/" element={<Navigate to="/today" replace />} />
          <Route path="/today" element={<TodayScreen onMenuClick={openDrawer} />} />
          <Route path="/discover" element={<DiscoverScreen onMenuClick={openDrawer} />} />
          <Route path="/dday" element={<SavedScreen onMenuClick={openDrawer} />} />
          <Route path="/content/:contentId" element={<ContentDetailScreen onMenuClick={openDrawer} />} />
          <Route
            path="/location/select"
            element={<PlaceholderScreen title="위치 선택" description="지역 선택 화면은 다음 단계에서 검색 결과와 연결합니다." />}
          />
          <Route
            path="/activity-preferences"
            element={<ActivityPreferencesScreen />}
          />
          <Route path="/settings" element={<PlaceholderScreen title="설정" description="알림, 위치, 계정 설정을 담을 자리입니다." />} />
          <Route path="/mypage" element={<PlaceholderScreen title="마이페이지" description="저장 일정과 사용자 설정을 보여줄 자리입니다." />} />
          <Route path="*" element={<Navigate to="/today" replace />} />
        </Routes>
        <BottomTabBar />
      </div>
      <SidebarDrawer open={drawerOpen} onClose={closeDrawer} />
    </div>
  );
}
