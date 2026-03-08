import React from 'react';
import { ContestEvent, PLATFORM_COLORS } from '../../types';
import { isPast, isFuture, formatDistanceToNowStrict } from 'date-fns';

interface EventBlockProps {
  event: ContestEvent;
  onClick: (event: ContestEvent) => void;
}

const PLATFORM_ICONS: Record<string, string> = {
  leetcode: 'LC',
  codeforces: 'CF',
  atcoder: 'AT',
  codechef: 'CC',
  other: '??',
};

const EventBlock: React.FC<EventBlockProps> = ({ event, onClick }) => {
  const color = PLATFORM_COLORS[event.platform.toLowerCase()] || PLATFORM_COLORS.other;
  const icon = PLATFORM_ICONS[event.platform.toLowerCase()] || '??';

  const startDate = event.start ? new Date(event.start) : null;
  const endDate = event.end ? new Date(event.end) : null;

  // Status: ongoing (started, not ended), upcoming, or past
  const now = new Date();
  let statusLabel = '';
  if (startDate && endDate) {
    if (isPast(startDate) && isFuture(endDate)) {
      statusLabel = '▶ LIVE';
    } else if (isFuture(startDate)) {
      statusLabel = `in ${formatDistanceToNowStrict(startDate)}`;
    }
  }

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick(event);
      }}
      className="
        group relative w-full text-left mb-0.5 px-1 py-0.5
        border-2 border-black/20 hover:border-black hover:z-10
        transition-all text-[8px] md:text-[9px]
        font-bold text-white shadow-[1px_1px_0px_0px_rgba(0,0,0,0.3)]
        flex flex-col gap-0
      "
      style={{ backgroundColor: color }}
      title={`${event.platform.toUpperCase()}: ${event.title}${statusLabel ? ' · ' + statusLabel : ''}`}
    >
      <span className="flex items-center gap-1 truncate">
        <span className="opacity-80 shrink-0 text-[7px]">[{icon}]</span>
        <span className="truncate">{event.title}</span>
      </span>
      {statusLabel && (
        <span className={`text-[7px] opacity-90 font-normal tracking-tight
          ${statusLabel.startsWith('▶') ? 'animate-pulse' : ''}
        `}>
          {statusLabel}
        </span>
      )}
    </button>
  );
};

export default EventBlock;