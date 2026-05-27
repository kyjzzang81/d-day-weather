import { useMemo, useState } from "react";
import { ArrowLeft, CloudRain, ExternalLink, MapPin, Thermometer, Wind } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { BottomSheet } from "../../components/common/BottomSheet";
import { PrimaryButton } from "../../components/common/PrimaryButton";
import { SignalBadge } from "../../components/common/SignalBadge";
import { SignalDot } from "../../components/common/SignalDot";
import { AppHeader } from "../../components/layout/AppHeader";
import { getGradeVisual } from "../../design/grade";
import { DateSelectSheet } from "../dateSignal/DateSelectSheet";
import { dateContextLabel, getTodayDateContext } from "../dateSignal/dateSignalUtils";
import type { DateContext } from "../dateSignal/dateSignalTypes";
import { mockLocalContents } from "../localContent/mockLocalContents";
import {
  contentSourceLabels,
  contentTypeLabels,
  getContentDateLabel,
  getKakaoMapUrl,
  getLocalContentById,
  getLocalContentMapQuery,
  getLocalContentSummary,
  getNaverMapUrl,
} from "../localContent/localContentUtils";
import type { LocalContent } from "../localContent/localContentTypes";
import { SaveReminderSheet } from "../savedContents/SaveReminderSheet";
import { mockTodayPayload, type HourlyWeather } from "../today/todayPayload";
import { WeatherCheckGraphic } from "../weatherCheck/WeatherCheckGraphic";
import { getWeatherCheckItems } from "../weatherCheck/weatherCheckUtils";

function DetailHourlyRows({ rows }: { rows: HourlyWeather[] }) {
  return (
    <section className="hourlyWeatherList">
      {rows.map((item) => (
        <div className="hourlyWeatherRow" key={item.time}>
          <div className="hourlyWeatherTime">
            <SignalDot grade={item.grade} size={8} className="hourlyWeatherDot" />
            <strong>{item.time}</strong>
          </div>
          <div className="hourlyWeatherBody">
            <div className="hourlyWeatherMain">
              <span>{item.summary}</span>
              <SignalBadge grade={item.grade} compact />
            </div>
            <div className="hourlyWeatherMeta">
              <span><Thermometer size={13} aria-hidden="true" />{item.temperature}</span>
              <span><CloudRain size={13} aria-hidden="true" />{item.rainProbability}</span>
              <span><Wind size={13} aria-hidden="true" />{item.wind}</span>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

function WeatherCheckGrid() {
  const weatherCheckItems = getWeatherCheckItems(mockTodayPayload);

  return (
    <div className="weatherCheckScroller" aria-label="날씨 체크">
      {weatherCheckItems.map((item) => {
        const visual = getGradeVisual(item.grade);
        return (
          <article className="weatherCheckCard" key={item.label}>
            <span className="weatherCheckIcon">
              <WeatherCheckGraphic iconKey={item.iconKey} label={`${item.label} ${item.status}`} />
            </span>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            <em style={{ color: visual.color }}>{item.status}</em>
          </article>
        );
      })}
    </div>
  );
}

export function ContentDetailScreen({ onMenuClick }: { onMenuClick: () => void }) {
  const navigate = useNavigate();
  const { contentId } = useParams();
  const content = useMemo<LocalContent>(
    () => getLocalContentById(contentId) ?? mockLocalContents[0],
    [contentId],
  );
  const [dateContext, setDateContext] = useState<DateContext>(() => getTodayDateContext());
  const [dateSheetOpen, setDateSheetOpen] = useState(false);
  const [timeSheetOpen, setTimeSheetOpen] = useState(false);
  const [mapSheetOpen, setMapSheetOpen] = useState(false);
  const [saveSheetOpen, setSaveSheetOpen] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const dateLabel = getContentDateLabel(content);
  const sourceLabel = contentSourceLabels[content.contentSource];
  const typeLabel = contentTypeLabels[content.contentType];
  const summary = getLocalContentSummary(content);
  const mapQuery = getLocalContentMapQuery(content);

  return (
    <>
      <AppHeader
        locationLabel="경기 파주시 금촌동"
        updatedAtLabel="10:00 기준"
        menuPlacement="right"
        onMenuClick={onMenuClick}
      />
      <main className="screenStack">
        <button className="backTextButton" type="button" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} aria-hidden="true" /> 뒤로
        </button>

        <section className="contentDetailHero">
          <div className="contentDetailImage" data-type={content.contentType} aria-hidden="true">
            {content.imageUrl ? <img src={content.imageUrl} alt="" /> : <span>{typeLabel}</span>}
          </div>
          <div className="contentDetailTitleBlock">
            <span className="contentSourceBadge">{sourceLabel}</span>
            <h1>{content.title}</h1>
            <h2>콘텐츠 정보</h2>
            <p className="contentSummaryText">{summary}</p>
          </div>
        </section>

        <button className="dateSignalButton" type="button" onClick={() => setDateSheetOpen(true)}>
          <span>{dateContextLabel(dateContext)}</span>
          <strong>날짜 바꾸기</strong>
        </button>

        <section className="contentSignalCard">
          <span className="eyebrowText">{dateContext.label}의 신호</span>
          <SignalBadge grade={content.grade} basisLabel={dateContext.basisLabel} />
          <h2>{content.reason ?? "이 날짜에 무난하게 보기 좋아요."}</h2>
        </section>

        <section className="sectionBlock">
          <div className="sectionTitleRow">
            <h2>날씨 체크</h2>
          </div>
          <WeatherCheckGrid />
        </section>

        <section className="sectionBlock">
          <div className="sectionTitleRow">
            <h2>오늘 흐름</h2>
            <button className="textButton" type="button" onClick={() => setTimeSheetOpen(true)}>
              더보기 &gt;
            </button>
          </div>
          <article className="timeSignalCard">
            <div className="timeSignalSummary">
              <span>콘텐츠 흐름</span>
              <strong>오후까지는 편하게 볼 수 있어요</strong>
              <p>방문할 시간대의 신호를 가볍게 확인해요.</p>
            </div>
            <div className="timeSignalLine">
              {mockTodayPayload.dayFlow.filter((item) => !["일출", "일몰"].includes(item.label)).slice(0, 3).map((item) => (
                <span className="timeSignalPoint" key={item.label}>
                  <SignalDot grade={item.grade} size={10} />
                  <strong>{item.label}</strong>
                  <em>{item.value}</em>
                </span>
              ))}
            </div>
          </article>
        </section>

        <section className="contentInfoCard">
          <dl>
            <div>
              <dt>운영 주체</dt>
              <dd>{content.organizerName ?? "ggg 추천"}</dd>
            </div>
            <div>
              <dt>기간</dt>
              <dd>{dateLabel ?? "상시"}</dd>
            </div>
            <div>
              <dt>운영시간</dt>
              <dd>{content.operatingHours ?? "시간 확인 필요"}</dd>
            </div>
            <div>
              <dt>장소</dt>
              <dd>{content.placeName ?? content.regionLabel}</dd>
            </div>
            <div>
              <dt>주소</dt>
              <dd>{mapQuery}</dd>
            </div>
            <div>
              <dt>구분</dt>
              <dd>{content.indoorOutdoor}</dd>
            </div>
          </dl>
          <div className="verifiedBadgeRow">
            {content.verifiedBadges.map((badge) => (
              <span className="verifiedBadge" key={badge}>{badge}</span>
            ))}
          </div>
        </section>

        <section className="contentDetailCtaRow">
          <button type="button" onClick={() => setMapSheetOpen(true)}>
            <MapPin size={16} aria-hidden="true" /> 길찾기
          </button>
          <a href={content.officialUrl ?? "#"} target="_blank" rel="noreferrer" aria-disabled={!content.officialUrl}>
            <ExternalLink size={16} aria-hidden="true" /> 공식 페이지
          </a>
          <PrimaryButton onClick={() => setSaveSheetOpen(true)}>날짜 저장</PrimaryButton>
        </section>
        {savedMessage ? <p className="inlineStatusMessage">{savedMessage}</p> : null}
      </main>

      <DateSelectSheet
        open={dateSheetOpen}
        selected={dateContext}
        onSelect={setDateContext}
        onClose={() => setDateSheetOpen(false)}
      />

      <BottomSheet open={timeSheetOpen} title="시간별 날씨" onClose={() => setTimeSheetOpen(false)}>
        <DetailHourlyRows rows={mockTodayPayload.hourlyWeather} />
      </BottomSheet>

      <BottomSheet open={mapSheetOpen} title="길찾기" onClose={() => setMapSheetOpen(false)}>
        <div className="mapChoiceSheet">
          <p>{mapQuery}</p>
          <a href={getNaverMapUrl(content)} target="_blank" rel="noreferrer">
            네이버맵으로 길찾기
          </a>
          <a href={getKakaoMapUrl(content)} target="_blank" rel="noreferrer">
            카카오맵으로 길찾기
          </a>
        </div>
      </BottomSheet>

      <SaveReminderSheet
        open={saveSheetOpen}
        content={content}
        dateContext={dateContext}
        onClose={() => setSaveSheetOpen(false)}
        onSaved={() => setSavedMessage("저장했어요. 저장 탭에서 다시 볼 수 있어요.")}
      />
    </>
  );
}
