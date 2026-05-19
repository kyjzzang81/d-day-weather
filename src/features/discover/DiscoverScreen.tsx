import { useState } from "react";
import { BottomSheet } from "../../components/common/BottomSheet";
import { CategoryChip } from "../../components/common/CategoryChip";
import { GradeBadge } from "../../components/common/GradeBadge";
import { PrimaryButton } from "../../components/common/PrimaryButton";
import { SearchBar } from "../../components/common/SearchBar";
import { AppHeader } from "../../components/layout/AppHeader";
import { colors, spacing, typography } from "../../design/tokens";
import discoverFlowP0Image from "../../../assets/discover-flow/optimized/discover-flow-p0.webp";
import discoverFlowP1Image from "../../../assets/discover-flow/optimized/discover-flow-p1.webp";
import discoverFlowP2Image from "../../../assets/discover-flow/optimized/discover-flow-p2.webp";
import discoverFlowP3Image from "../../../assets/discover-flow/optimized/discover-flow-p3.webp";

type DiscoverFlow = "p0" | "p1" | "p2" | "p3";

const flowImageByCode: Record<DiscoverFlow, string> = {
  p0: discoverFlowP0Image,
  p1: discoverFlowP1Image,
  p2: discoverFlowP2Image,
  p3: discoverFlowP3Image
};

const flows: Array<{ code: DiscoverFlow; title: string; description: string; tag: string; image: string }> = [
  { code: "p0", title: "요즘 어디가 좋아?", description: "요즘 가기 좋은 인기 여행지를 추천받아요", tag: "#Best Picks", image: flowImageByCode.p0 },
  { code: "p1", title: "어디로 떠날까?", description: "내가 원하는 시기를 추천받아요", tag: "#시기 추천", image: flowImageByCode.p1 },
  { code: "p2", title: "어디로 가지?", description: "내가 원하는 시기에 추천 지역을 찾아요", tag: "#지역 추천", image: flowImageByCode.p2 },
  { code: "p3", title: "뭘 하고, 어디를 가지?", description: "날짜와 지역에서 추천 활동을 찾죠", tag: "#활동/장소 추천", image: flowImageByCode.p3 }
];

const chips = ["피크닉/도시산책", "카페/맛집", "사진/뷰", "해변"];

export function DiscoverScreen({ onMenuClick }: { onMenuClick: () => void }) {
  const [flow, setFlow] = useState<DiscoverFlow | null>(null);
  const [query, setQuery] = useState("");
  const selectedFlow = flows.find((item) => item.code === flow) ?? null;
  const openFlow = (nextFlow: DiscoverFlow) => {
    setFlow(nextFlow);
    setQuery("");
  };
  const closeFlow = () => setFlow(null);

  return (
    <>
      <AppHeader title="DISCOVER" onMenuClick={onMenuClick} />
      <main className="screenStack">
        <section className="discoverIntroBlock">
          <h1 style={{ color: colors.textPrimary, margin: `${spacing.sm}px 0`, ...typography.title1 }}>
            어떤 탐색을 원하시나요?
          </h1>
          <p style={{ color: colors.textSecondary, margin: 0, ...typography.body2 }}>
            원하는 방식을 선택해 여행을 계획해보세요.
          </p>
        </section>

        <div className="flowGrid">
          {flows.map((item) => (
            <button
              className="flowCardButton"
              key={item.code}
              type="button"
              data-active={item.code === flow}
              onClick={() => openFlow(item.code)}
            >
              <span className="flowCardCopy">
                <strong>{item.title}</strong>
                <span>{item.description}</span>
                <em>{item.tag}</em>
              </span>
              <img className="flowImageSlot" src={item.image} alt="" aria-hidden="true" />
            </button>
          ))}
        </div>

      </main>

      <BottomSheet open={selectedFlow !== null} title={selectedFlow?.title ?? ""} onClose={closeFlow}>
        <section className="discoverSheetContent">
          <div className="sectionTitleRow">
            <h2>{selectedFlow?.description}</h2>
            <GradeBadge grade="great" context="discover" />
          </div>
          <SearchBar value={query} onChange={(event) => setQuery(event.target.value)} placeholder="지역이나 장소 검색" />
          <div className="chipGrid">
            {chips.map((chip, index) => (
              <CategoryChip key={chip} label={chip} selected={index < 2} />
            ))}
          </div>
          <PrimaryButton>추천 결과 보기</PrimaryButton>
        </section>
      </BottomSheet>
    </>
  );
}
