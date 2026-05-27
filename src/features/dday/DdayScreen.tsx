import { SavedScreen } from "../savedContents/SavedScreen";

export function DdayScreen({ onMenuClick }: { onMenuClick: () => void }) {
  return <SavedScreen onMenuClick={onMenuClick} />;
}
