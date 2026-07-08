import { useEffect, useRef } from 'react';
import type { ReplayMove } from '../hooks/useGameReplay';

interface MoveTickerProps {
  moves: ReplayMove[];
  ply: number;
}

export function MoveTicker({ moves, ply }: MoveTickerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const activeRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (activeRef.current && containerRef.current) {
      const container = containerRef.current;
      const activeElement = activeRef.current;

      // Calculate the exact center position for the active move
      const scrollPosition =
        activeElement.offsetLeft -
        (container.clientWidth / 2) +
        (activeElement.clientWidth / 2);

      // Scroll ONLY the container horizontally, leaving the vertical window alone
      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  }, [ply]);

  const currentMove = ply > 0 ? moves[ply - 1] : null;

  return (
    <div className="w-full">
      <div
        ref={containerRef} // Attach the new container ref here
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