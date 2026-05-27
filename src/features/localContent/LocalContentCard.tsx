import { Bookmark } from "lucide-react";
import { SignalBadge } from "../../components/common/SignalBadge";
import { contentSourceLabels, contentTypeLabels, getLocalContentSubtitle } from "./localContentUtils";
import type { LocalContent } from "./localContentTypes";

interface LocalContentCardProps {
  content: LocalContent;
  compact?: boolean;
  basisLabel?: string;
  onClick?: (content: LocalContent) => void;
  onSave?: (content: LocalContent) => void;
}

export function LocalContentCard({ content, compact = false, basisLabel, onClick, onSave }: LocalContentCardProps) {
  const sourceLabel = contentSourceLabels[content.contentSource];
  const typeLabel = contentTypeLabels[content.contentType];
  const badges = content.verifiedBadges
    .filter((badge) => badge !== sourceLabel)
    .slice(0, compact ? 3 : 4);

  return (
    <article className="localContentCard" data-kind={content.contentKind} data-compact={compact}>
      <button
        className="localContentCardMain"
        type="button"
        onClick={() => onClick?.(content)}
      >
        <span className="localContentThumbnail" data-type={content.contentType} aria-hidden="true">
          {content.imageUrl ? (
            <img src={content.imageUrl} alt="" />
          ) : (
            <span>{typeLabel.slice(0, 1)}</span>
          )}
        </span>
        <span className="localContentCopy">
          <strong>{content.title}</strong>
          <span className="localContentSubtitle">{getLocalContentSubtitle(content)}</span>
          <SignalBadge grade={content.grade} basisLabel={basisLabel ?? content.basisLabel} compact />
          <span className="verifiedBadgeRow">
            <span className="verifiedBadge contentSourceBadgeInline">{sourceLabel}</span>
            {badges.map((badge) => (
              <span className="verifiedBadge" key={badge}>
                {badge}
              </span>
            ))}
          </span>
        </span>
      </button>
      {onSave ? (
        <button
          className="localContentSaveButton"
          type="button"
          aria-label={`${content.title} 저장`}
          onClick={() => onSave(content)}
        >
          <Bookmark aria-hidden="true" size={17} strokeWidth={2.4} />
        </button>
      ) : null}
    </article>
  );
}
