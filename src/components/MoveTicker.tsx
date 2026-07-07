import { useEffect, useRef } from 'react';
import type { ReplayMove } from '../hooks/useGameReplay';

interface MoveTickerProps {
  moves: ReplayMove[];
  ply: number;
}

export function MoveTicker({ moves, ply }: MoveTickerProps) {
  const activeRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }, [ply]);

  const currentMove = ply > 0 ? moves[ply - 1] : null;

  return (
    <div className="w-full">
      <div
        className="scrollbar-none flex gap-x-2 overflow-x-auto whitespace-nowrap font-mono text-[13px] text-parchment-dim/70"
        aria-hidden="true"
      >
        {moves.map((m, i) => {
          const isActive = i === ply - 1;
          return (
            <span
              key={i}
              ref={isActive ? activeRef : undefined}
              className={
                isActive
                  ? 'rounded-[3px] bg-accent/20 px-1.5 py-0.5 text-accent-soft'
                  : 'px-0.5 py-0.5'
              }
            >
              {m.color === 'w' ? `${m.moveNumber}.` : ''}
              {m.san}
            </span>
          );
        })}
      </div>
      <p className="sr-only" aria-live="polite">
        {currentMove
          ? `Move ${currentMove.moveNumber}${currentMove.color === 'b' ? ', black' : ', white'}: ${currentMove.san}`
          : 'Starting position'}
      </p>
    </div>
  );
}
