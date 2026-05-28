import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { BottomTabBar } from "../components/layout/BottomTabBar";
import { ActivityPreferencesScreen } from "../features/activityPreferences/ActivityPreferencesScreen";
import { handleAuthCallbackFromUrl } from "../features/auth/authState";
import { ContentDetailScreen } from "../features/contentDetail/ContentDetailScreen";
import { SavedScreen } from "../features/savedContents/SavedScreen";
import { DiscoverScreen } from "../features/discover/DiscoverScreen";
import {
  LocationSelectScreen,
  MyPageScreen,
  NotificationsScreen,
  SettingsScreen,
} from "../features/settings/UtilityScreens";
import { TodayScreen } from "../features/today/TodayScreen";

export function App() {
  const openMyPage = () => undefined;

  useEffect(() => {
    handleAuthCallbackFromUrl();
  }, []);

  return (
    <div className="appViewport">
      <div className="mobileShell">
        <Routes>
          <Route path="/" element={<Navigate to="/today" replace />} />
          <Route path="/today" element={<TodayScreen onMenuClick={openMyPage} />} />
          <Route path="/discover" element={<DiscoverScreen onMenuClick={openMyPage} />} />
          <Route path="/dday" element={<SavedScreen onMenuClick={openMyPage} />} />
          <Route path="/content/:contentId" element={<ContentDetailScreen onMenuClick={openMyPage} />} />
          <Route
            path="/location/select"
            element={<LocationSelectScreen onMenuClick={openMyPage} />}
          />
          <Route
            path="/activity-preferences"
            element={<ActivityPreferencesScreen />}
          />
          <Route path="/settings" element={<SettingsScreen onMenuClick={openMyPage} />} />
          <Route path="/mypage" element={<MyPageScreen onMenuClick={openMyPage} />} />
          <Route path="/notifications" element={<NotificationsScreen onMenuClick={openMyPage} />} />
          <Route path="*" element={<Navigate to="/today" replace />} />
        </Routes>
        <BottomTabBar />
      </div>
    </div>
  );
}
