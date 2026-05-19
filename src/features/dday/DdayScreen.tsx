import { Link } from "react-router-dom";
import { EmptyState } from "../../components/common/EmptyState";
import { PrimaryButton } from "../../components/common/PrimaryButton";
import { SecondaryButton } from "../../components/common/SecondaryButton";
import { AppHeader } from "../../components/layout/AppHeader";

export function DdayScreen({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <>
      <AppHeader title="D-DAY" onMenuClick={onMenuClick} />
      <main className="screenStack">
        <EmptyState
          title="아직 저장된 일정이 없어요."
          description="좋은 날짜와 장소를 찾아볼까요?"
          action={
            <div className="buttonStack">
              <Link to="/discover">
                <PrimaryButton>DISCOVER로 이동</PrimaryButton>
              </Link>
              <Link to="/dday/create">
                <SecondaryButton>직접 일정 만들기</SecondaryButton>
              </Link>
            </div>
          }
        />
      </main>
    </>
  );
}
